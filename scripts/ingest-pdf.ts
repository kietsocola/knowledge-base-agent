/**
 * Offline PDF ingestion script - Supabase + pgvector version.
 * Run ONCE before the demo to populate Supabase with document chunks and embeddings.
 *
 * Usage:
 *   npx tsx scripts/ingest-pdf.ts \
 *     --pdf ./public/sample-docs/giao-trinh-ctdl.pdf \
 *     --course course-ctdl-001 \
 *     --course-title "Cau Truc Du Lieu" \
 *     --doc-name "Giao trinh CTDL" \
 *     --doc-id doc-ctdl-001
 *
 * Required env vars (in .env.local):
 *   OPENAI_API_KEY
 *   DATABASE_URL (Supabase PostgreSQL connection string)
 */

import fs from "fs";
import { randomUUID } from "crypto";
import { loadEnvConfig } from "@next/env";
import postgres from "postgres";
import { parsePdf } from "../lib/rag/pdf";

function cleanText(text: string): string {
  return text
    .replace(/\x00/g, "")
    .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, " ")
    .replace(/\uFFFD/g, "")
    .replace(/ {3,}/g, "  ")
    .trim();
}

function chunkText(text: string, chunkSize = 2000, overlap = 200): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const chunk = text.slice(start, end).trim();
    if (chunk.length > 50) chunks.push(chunk);
    if (end >= text.length) break;
    start += chunkSize - overlap;
  }

  return chunks;
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
  });

  if (!res.ok) {
    throw new Error(`Embed error: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as { data: Array<{ embedding: number[] }> };
  return data.data[0].embedding;
}

async function main() {
  loadEnvConfig(process.cwd());

  const args = process.argv.slice(2);
  const get = (flag: string) => {
    const i = args.indexOf(flag);
    return i !== -1 ? args[i + 1] : undefined;
  };

  const pdfPath = get("--pdf");
  const courseId = get("--course") ?? "course-ctdl-001";
  const courseTitle = get("--course-title") ?? courseId;
  const courseIss = get("--course-iss") ?? "https://mock-moodle.demo.edu.vn";
  const docName = get("--doc-name") ?? "Tai lieu";
  const docId = get("--doc-id") ?? randomUUID();

  if (!pdfPath) {
    console.error("Usage: npx tsx scripts/ingest-pdf.ts --pdf <path> --course <id> --doc-name <name> --doc-id <id>");
    process.exit(1);
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  const databaseUrl = process.env.DATABASE_URL;

  if (!openaiKey || !databaseUrl) {
    console.error("Missing required env vars: OPENAI_API_KEY, DATABASE_URL");
    process.exit(1);
  }

  const sql = postgres(databaseUrl, { max: 1 });

  try {
    console.log(`\nLoading PDF: ${pdfPath}`);
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfData = await parsePdf(pdfBuffer);
    console.log(`Pages: ${pdfData.numpages}, Text length: ${pdfData.text.length} chars`);

    await sql`
      INSERT INTO courses (id, title, lti_iss)
      VALUES (${courseId}, ${courseTitle}, ${courseIss})
      ON CONFLICT (id) DO NOTHING
    `;

    console.log("\nInserting document record...");
    await sql`
      INSERT INTO documents (id, course_id, name, page_count)
      VALUES (${docId}, ${courseId}, ${docName}, ${pdfData.numpages})
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, page_count = EXCLUDED.page_count
    `;

    const rawChunks = chunkText(cleanText(pdfData.text), 2000, 200);
    console.log(`\nChunked into ${rawChunks.length} chunks`);

    const BATCH_SIZE = 10;
    let processed = 0;

    for (let i = 0; i < rawChunks.length; i += BATCH_SIZE) {
      const batch = rawChunks.slice(i, i + BATCH_SIZE);
      const approxPageFactor = pdfData.numpages / rawChunks.length;

      await Promise.all(
        batch.map(async (chunkText, batchIdx) => {
          const globalIdx = i + batchIdx;
          const chunkId = randomUUID();
          const approxPage = Math.ceil((globalIdx + 1) * approxPageFactor) || 1;
          const cleanedChunk = cleanText(chunkText);
          const embedding = await embedText(cleanedChunk, openaiKey);
          const vectorLiteral = `[${embedding.join(",")}]`;

          await sql`
            INSERT INTO document_chunks (id, document_id, chunk_index, chunk_text, page_number, embedding)
            VALUES (
              ${chunkId},
              ${docId},
              ${globalIdx},
              ${cleanedChunk},
              ${approxPage},
              ${vectorLiteral}::vector
            )
            ON CONFLICT (id) DO UPDATE
              SET chunk_text = EXCLUDED.chunk_text,
                  embedding = EXCLUDED.embedding
          `;
        })
      );

      processed += batch.length;
      console.log(`OK ${processed}/${rawChunks.length} chunks processed`);
    }

    console.log(`\nDone! Ingested ${rawChunks.length} chunks for "${docName}" (${docId})`);
    console.log(`Course: ${courseId}`);
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error("\nError:", err.message);
  process.exit(1);
});
