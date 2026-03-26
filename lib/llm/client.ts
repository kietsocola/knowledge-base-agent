import { createOpenAI } from "@ai-sdk/openai";

// Singleton — lazy-initialized so API key is read at request time
let _openai: ReturnType<typeof createOpenAI> | null = null;

export function getOpenAI() {
  if (!_openai) {
    _openai = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });
  }
  return _openai;
}

export const CHAT_MODEL = "gpt-4o-mini";
export const EVAL_MODEL = "gpt-4o-mini";
