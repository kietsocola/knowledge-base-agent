import { cookies } from "next/headers"
import { getIronSession } from "iron-session"
import { randomUUID } from "crypto"
import { sql } from "drizzle-orm"
import { getDb } from "@/lib/db/index"
import { documents } from "@/lib/db/schema"
import { parsePdf } from "@/lib/rag/pdf"
import { SESSION_OPTIONS } from "@/lib/session"
import type { SessionData } from "@/types/lti"

export const runtime = "nodejs"
export const maxDuration = 60

function cleanText(text: string): string {
  return text
    .replace(/\x00/g, "")
    .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, " ")
    .replace(/\uFFFD/g, "")
    .replace(/ {3,}/g, "  ")
    .trim()
}

function chunkText(text: string, chunkSize = 2000, overlap = 200): string[] {
  const chunks: string[] = []
  let start = 0
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length)
    const chunk = text.slice(start, end).trim()
    if (chunk.length > 50) chunks.push(chunk)
    if (end >= text.length) break
    start += chunkSize - overlap
  }
  return chunks
}

async function embedText(text: string, apiKey: string): Promise<number[]> {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: text.slice(0, 8000),
      dimensions: 768,
    }),
  })

  if (!res.ok) {
    throw new Error(`Embedding error: ${res.status} ${await res.text()}`)
  }

  const data = (await res.json()) as { data: Array<{ embedding: number[] }> }
  return data.data[0].embedding
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, SESSION_OPTIONS)
  if (!session.studentId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const openaiKey = process.env.OPENAI_API_KEY
  if (!openaiKey) {
    return Response.json({ error: "OPENAI_API_KEY not configured" }, { status: 500 })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return Response.json({ error: "Invalid form data" }, { status: 400 })
  }

  const file = formData.get("file") as File | null
  const docName = ((formData.get("docName") as string | null) ?? "").trim() || "Tài liệu"
  const courseId = (formData.get("courseId") as string | null) ?? session.courseId

  if (!file) return Response.json({ error: "Chưa có file" }, { status: 400 })
  if (!courseId) return Response.json({ error: "Thiếu courseId" }, { status: 400 })
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    return Response.json({ error: "Chỉ hỗ trợ file PDF" }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  let pdfData: Awaited<ReturnType<typeof parsePdf>>
  try {
    pdfData = await parsePdf(buffer)
  } catch (err) {
    return Response.json({ error: `Không đọc được PDF: ${String(err)}` }, { status: 422 })
  }

  const cleaned = cleanText(pdfData.text)
  const chunks = chunkText(cleaned)

  if (chunks.length === 0) {
    return Response.json(
      {
        error: "Không trích xuất được text từ PDF này. File có thể là ảnh scan - cần OCR trước.",
      },
      { status: 422 }
    )
  }

  const db = getDb()
  const now = Math.floor(Date.now() / 1000)
  const docId = randomUUID()

  await db.insert(documents).values({
    id: docId,
    courseId,
    name: docName,
    pageCount: pdfData.numpages,
    createdAt: now,
  })

  const BATCH = 5
  const approxPageFactor = pdfData.numpages / chunks.length

  for (let i = 0; i < chunks.length; i += BATCH) {
    const batch = chunks.slice(i, i + BATCH)
    await Promise.all(
      batch.map(async (chunkText, batchIdx) => {
        const globalIdx = i + batchIdx
        const chunkId = randomUUID()
        const approxPage = Math.ceil((globalIdx + 1) * approxPageFactor) || 1
        const embedding = await embedText(chunkText, openaiKey)
        const vectorLiteral = `[${embedding.join(",")}]`

        await db.execute(sql`
          INSERT INTO document_chunks (id, document_id, chunk_index, chunk_text, page_number, embedding, created_at)
          VALUES (
            ${chunkId},
            ${docId},
            ${globalIdx},
            ${chunkText},
            ${approxPage},
            ${sql.raw(`'${vectorLiteral}'`)}::vector,
            ${now}
          )
        `)
      })
    )
  }

  return Response.json({
    success: true,
    docId,
    docName,
    pageCount: pdfData.numpages,
    chunkCount: chunks.length,
  })
}
