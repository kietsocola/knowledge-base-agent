import type { Citation } from "@/types/chat";

/**
 * Parse [SOURCE_X] markers from LLM response text and map them
 * to the actual chunk metadata from the context window.
 */
export function parseCitations(
  text: string,
  contextChunks: Array<{
    chunkId: string;
    documentName: string;
    pageNumber: number;
    chunkText: string;
  }>
): Citation[] {
  const regex = /\[SOURCE_(\d+)\]/g;
  const foundIndices = new Set<number>();
  let match;

  while ((match = regex.exec(text)) !== null) {
    const idx = parseInt(match[1]) - 1; // [SOURCE_1] → index 0
    if (idx >= 0 && idx < contextChunks.length) {
      foundIndices.add(idx);
    }
  }

  return Array.from(foundIndices)
    .sort((a, b) => a - b)
    .map((idx) => {
      const chunk = contextChunks[idx];
      return {
        sourceIndex: idx + 1,
        chunkId: chunk.chunkId,
        documentName: chunk.documentName,
        pageNumber: chunk.pageNumber,
        quote: chunk.chunkText.slice(0, 200).trim() + (chunk.chunkText.length > 200 ? "..." : ""),
      };
    });
}

/**
 * Format retrieved chunks into context string with [SOURCE_X] markers
 * for the LLM system prompt.
 */
export function formatContextForPrompt(
  chunks: Array<{
    documentName: string;
    pageNumber: number;
    chunkText: string;
  }>
): string {
  if (chunks.length === 0) return "";

  return chunks
    .map(
      (chunk, i) =>
        `[SOURCE_${i + 1}] ${chunk.documentName} - Trang ${chunk.pageNumber}:\n${chunk.chunkText}`
    )
    .join("\n\n---\n\n");
}
