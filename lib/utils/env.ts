/**
 * Unified env access for both Cloudflare Workers and Next.js dev server.
 * In CF Workers, env vars are accessed via the request context binding.
 * In local dev (next dev), they come from process.env / .env.local.
 */

export interface Env {
  DB: D1Database;
  VECTORIZE: VectorizeIndex;
  OPENAI_API_KEY: string;
  LTI_MOCK_SECRET: string;
  LTI_MODE: "mock" | "production";
  SESSION_SECRET: string;
  // Future: LTI_PLATFORM_JWKS_URL, LTI_CLIENT_ID
}

// Typed access for process.env (local dev + Vercel)
export function getEnvVar(key: keyof Omit<Env, "DB" | "VECTORIZE">): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing env var: ${key}`);
  return val;
}
