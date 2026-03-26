import type { DB } from "@/lib/db/index";
import { documentChunks, documents } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";

export interface RetrievedChunk {
  chunkId: string;
  documentName: string;
  pageNumber: number;
  chunkText: string;
  score: number;
}

const MIN_SCORE = 0.5; // cosine similarity threshold

/**
 * Query Vectorize for relevant chunks, then join with D1 for metadata.
 * Returns chunks sorted by relevance score (descending).
 */
export async function retrieveRelevantChunks(
  queryVector: number[],
  courseId: string,
  vectorize: VectorizeIndex,
  db: DB,
  topK = 5
): Promise<RetrievedChunk[]> {
  // 1. Query Vectorize
  const results = await vectorize.query(queryVector, {
    topK,
    filter: { courseId },
    returnMetadata: "all",
  });

  // 2. Filter by minimum score
  const relevant = results.matches.filter((m: VectorizeMatch) => m.score >= MIN_SCORE);
  if (relevant.length === 0) return [];

  // 3. Fetch metadata from D1
  const chunkIds = relevant.map((m: VectorizeMatch) => m.id);
  const chunks = await db
    .select({
      id: documentChunks.id,
      chunkText: documentChunks.chunkText,
      pageNumber: documentChunks.pageNumber,
      documentName: documents.name,
    })
    .from(documentChunks)
    .leftJoin(documents, eq(documentChunks.documentId, documents.id))
    .where(inArray(documentChunks.id, chunkIds));

  // 4. Merge scores + sort by score
  const scoreMap = new Map(relevant.map((m: VectorizeMatch) => [m.id, m.score]));
  return chunks
    .map((c: { id: string; chunkText: string; pageNumber: number | null; documentName: string | null }) => ({
      chunkId: c.id,
      documentName: c.documentName ?? "Unknown",
      pageNumber: c.pageNumber ?? 0,
      chunkText: c.chunkText,
      score: scoreMap.get(c.id) ?? 0,
    }))
    .sort((a: RetrievedChunk, b: RetrievedChunk) => b.score - a.score);
}
