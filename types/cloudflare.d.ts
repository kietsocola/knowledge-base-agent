// Augment the global CloudflareEnv interface with project-specific bindings
declare global {
  interface CloudflareEnv {
    DB: D1Database
    VECTORIZE: VectorizeIndex
    OPENAI_API_KEY: string
    LTI_MOCK_SECRET: string
    LTI_MODE: string
    SESSION_SECRET: string
  }
}

export {}
