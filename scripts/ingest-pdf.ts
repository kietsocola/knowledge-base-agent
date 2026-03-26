/**
 * Offline PDF ingestion script.
 * Run ONCE before the demo to populate Vectorize + D1.
 *
 * Usage:
 *   npx tsx scripts/ingest-pdf.ts \
 *     --pdf ./public/sample-docs/giao-trinh-ctdl.pdf \
 *     --course course-ctdl-001 \
 *     --doc-name "Giáo trình CTDL" \
 *     --doc-id doc-ctdl-001
 *
 * Required env vars (in .env.local or shell):
 *   OPENAI_API_KEY
 *   CLOUDFLARE_ACCOUNT_ID
 *   CLOUDFLARE_VECTORIZE_INDEX=kb-embeddings
 *   CLOUDFLARE_API_TOKEN       (needs Workers AI + Vectorize + D1 permissions)
 *   CLOUDFLARE_D1_DATABASE_ID
 */

import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

// Lazy import — pdf-parse has mixed CJS/ESM, require works reliably
async function loadDeps() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require("pdf-parse") as (buffer: Buffer) => Promise<{ text: string; numpages: number }>;
  return { pdfParse };
}

interface ChunkResult {
  id: string;
  text: string;
  pageNumber: number;
  chunkIndex: number;
}

/**
 * Simple character-based chunking with overlap.
 * chunkSize ~512 tokens ≈ 2048 chars; overlap ~64 tokens ≈ 256 chars
 */
function chunkText(
  text: string,
  pageNumber: number,
  chunkSize = 2000,
  overlap = 200
): Array<{ text: string; pageNumber: number }> {
  const chunks: Array<{ text: string; pageNumber: number }> = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const chunk = text.slice(start, end).trim();
    if (chunk.length > 50) {
      chunks.push({ text: chunk, pageNumber });
    }
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
      input: text.slice(0, 8000), // max input length safeguard
      dimensions: 768,
    }),
  });

  if (!res.ok) throw new Error(`Embed error: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { data: Array<{ embedding: number[] }> };
  return data.data[0].embedding;
}

async function upsertVectorize(
  accountId: string,
  indexName: string,
  apiToken: string,
  vectors: Array<{ id: string; values: number[]; metadata: Record<string, unknown> }>
): Promise<void> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/vectorize/v2/indexes/${indexName}/upsert`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-ndjson",
      Authorization: `Bearer ${apiToken}`,
    },
    body: vectors.map((v) => JSON.stringify(v)).join("\n"),
  });
  if (!res.ok) throw new Error(`Vectorize upsert error: ${res.status} ${await res.text()}`);
}

async function insertD1Chunk(
  accountId: string,
  dbId: string,
  apiToken: string,
  chunk: {
    id: string;
    documentId: string;
    chunkIndex: number;
    chunkText: string;
    pageNumber: number;
  }
): Promise<void> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${dbId}/query`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify({
      sql: `INSERT OR REPLACE INTO document_chunks (id, document_id, chunk_index, chunk_text, page_number)
            VALUES (?, ?, ?, ?, ?)`,
      params: [chunk.id, chunk.documentId, chunk.chunkIndex, chunk.chunkText, chunk.pageNumber],
    }),
  });
  if (!res.ok) throw new Error(`D1 insert error: ${res.status} ${await res.text()}`);
}

async function insertD1Document(
  accountId: string,
  dbId: string,
  apiToken: string,
  doc: { id: string; courseId: string; name: string; pageCount: number }
): Promise<void> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${dbId}/query`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify({
      sql: `INSERT OR REPLACE INTO documents (id, course_id, name, page_count)
            VALUES (?, ?, ?, ?)`,
      params: [doc.id, doc.courseId, doc.name, doc.pageCount],
    }),
  });
  if (!res.ok) throw new Error(`D1 doc insert error: ${res.status} ${await res.text()}`);
}

async function main() {
  // Parse CLI args
  const args = process.argv.slice(2);
  const get = (flag: string) => {
    const i = args.indexOf(flag);
    return i !== -1 ? args[i + 1] : undefined;
  };

  const pdfPath = get("--pdf");
  const courseId = get("--course") ?? "course-ctdl-001";
  const docName = get("--doc-name") ?? "Tài liệu";
  const docId = get("--doc-id") ?? randomUUID();

  if (!pdfPath) {
    console.error("Usage: npx tsx scripts/ingest-pdf.ts --pdf <path> --course <id> --doc-name <name> --doc-id <id>");
    process.exit(1);
  }

  // Load env
  const openaiKey = process.env.OPENAI_API_KEY;
  const cfAccount = process.env.CLOUDFLARE_ACCOUNT_ID;
  const cfVectorizeIndex = process.env.CLOUDFLARE_VECTORIZE_INDEX ?? "kb-embeddings";
  const cfApiToken = process.env.CLOUDFLARE_API_TOKEN;
  const cfD1Id = process.env.CLOUDFLARE_D1_DATABASE_ID;

  if (!openaiKey || !cfAccount || !cfApiToken || !cfD1Id) {
    console.error("Missing required env vars: OPENAI_API_KEY, CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN, CLOUDFLARE_D1_DATABASE_ID");
    process.exit(1);
  }

  console.log(`\n📄 Loading PDF: ${pdfPath}`);
  const { pdfParse } = await loadDeps();
  const pdfBuffer = fs.readFileSync(pdfPath);
  const pdfData = await pdfParse(pdfBuffer);

  console.log(`   Pages: ${pdfData.numpages}, Text length: ${pdfData.text.length} chars`);

  // Insert document record in D1
  console.log(`\n💾 Inserting document record in D1...`);
  await insertD1Document(cfAccount, cfD1Id, cfApiToken, {
    id: docId,
    courseId,
    name: docName,
    pageCount: pdfData.numpages,
  });

  // Chunk text per page
  const allChunks: ChunkResult[] = [];
  // pdf-parse gives us full text; we'll chunk the whole text with page approximation
  const rawChunks = chunkText(pdfData.text, 1, 2000, 200);

  // Approximate page numbers (simple distribution)
  const totalChunks = rawChunks.length;
  rawChunks.forEach((c, i) => {
    const approxPage = Math.ceil((i / totalChunks) * pdfData.numpages) || 1;
    allChunks.push({
      id: randomUUID(),
      text: c.text,
      pageNumber: approxPage,
      chunkIndex: i,
    });
  });

  console.log(`\n🔪 Chunked into ${allChunks.length} chunks`);

  // Process in batches of 10 (rate limit friendly)
  const BATCH_SIZE = 10;
  let processed = 0;

  for (let i = 0; i < allChunks.length; i += BATCH_SIZE) {
    const batch = allChunks.slice(i, i + BATCH_SIZE);

    // Embed
    const vectors = await Promise.all(
      batch.map(async (chunk) => {
        const embedding = await embedText(chunk.text, openaiKey);
        return {
          id: chunk.id,
          values: embedding,
          metadata: {
            courseId,
            documentId: docId,
            pageNumber: chunk.pageNumber,
            chunkIndex: chunk.chunkIndex,
          },
        };
      })
    );

    // Upsert Vectorize
    await upsertVectorize(cfAccount, cfVectorizeIndex, cfApiToken, vectors);

    // Insert D1
    await Promise.all(
      batch.map((chunk) =>
        insertD1Chunk(cfAccount, cfD1Id, cfApiToken, {
          id: chunk.id,
          documentId: docId,
          chunkIndex: chunk.chunkIndex,
          chunkText: chunk.text,
          pageNumber: chunk.pageNumber,
        })
      )
    );

    processed += batch.length;
    console.log(`   ✓ ${processed}/${allChunks.length} chunks processed`);
  }

  console.log(`\n✅ Done! Ingested ${allChunks.length} chunks for "${docName}" (${docId})`);
  console.log(`   Course: ${courseId}`);
}

main().catch((err) => {
  console.error("\n❌ Error:", err.message);
  process.exit(1);
});
