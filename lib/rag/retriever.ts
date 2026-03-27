import type { DB } from "@/lib/db/index";
import { sql } from "drizzle-orm";

export interface RetrievedChunk {
  chunkId: string;
  documentName: string;
  pageNumber: number;
  chunkText: string;
  score: number;
}

const MIN_SCORE = 0.5; // cosine similarity threshold

/**
 * Query Supabase pgvector for relevant chunks using cosine similarity.
 * Uses the <=> operator (cosine distance); score = 1 - distance.
 */
export async function retrieveRelevantChunks(
  queryVector: number[],
  courseId: string,
  db: DB,
  topK = 5
): Promise<RetrievedChunk[]> {
  const vectorLiteral = `[${queryVector.join(",")}]`;

  const rows = await db.execute(sql`
    SELECT
      dc.id         AS "chunkId",
      dc.chunk_text AS "chunkText",
      dc.page_number AS "pageNumber",
      d.name        AS "documentName",
      1 - (dc.embedding <=> ${sql.raw(`'${vectorLiteral}'::vector`)}::vector) AS score
    FROM document_chunks dc
    LEFT JOIN documents d ON dc.document_id = d.id
    WHERE d.course_id = ${courseId}
      AND dc.embedding IS NOT NULL
      AND 1 - (dc.embedding <=> ${sql.raw(`'${vectorLiteral}'::vector`)}::vector) >= ${MIN_SCORE}
    ORDER BY dc.embedding <=> ${sql.raw(`'${vectorLiteral}'::vector`)}::vector
    LIMIT ${topK}
  `);

  return (rows as unknown as Array<{
    chunkId: string;
    chunkText: string;
    pageNumber: number | null;
    documentName: string | null;
    score: number | string;
  }>).map((row) => ({
    chunkId: row.chunkId,
    chunkText: row.chunkText,
    pageNumber: row.pageNumber ?? 0,
    documentName: row.documentName ?? "Unknown",
    score: typeof row.score === "string" ? parseFloat(row.score) : row.score,
  }));
}
