/**
 * Text → float32[768] embedding via OpenAI text-embedding-3-small.
 * Uses dimension reduction to 768 to match Cloudflare Vectorize index.
 * This is a plain fetch() call → does NOT count toward CF Workers CPU time.
 */
export async function embedText(
  text: string,
  apiKey: string
): Promise<number[]> {
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: text,
      dimensions: 768,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI embedding error: ${response.status} ${err}`);
  }

  const data = await response.json() as {
    data: Array<{ embedding: number[] }>;
  };
  return data.data[0].embedding;
}
