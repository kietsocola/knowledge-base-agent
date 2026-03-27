export interface Env {
  OPENAI_API_KEY: string;
  LTI_MOCK_SECRET: string;
  LTI_MODE: "mock" | "production";
  SESSION_SECRET: string;
  DATABASE_URL: string;
}

export function getEnvVar(key: keyof Env): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing env var: ${key}`);
  return val;
}
