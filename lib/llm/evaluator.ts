import { generateObject } from "ai";
import { z } from "zod";
import { getOpenAI, EVAL_MODEL } from "./client";
import { EVALUATION_SYSTEM_PROMPT } from "./prompts";
import type { EvaluationResult } from "@/types/evaluation";

const EvaluationSchema = z.object({
  overallScore: z.number().min(0).max(10),
  strengths: z.array(z.string()),
  gaps: z.array(z.string()),
  radarScores: z.object({
    "Hiểu khái niệm": z.number().min(0).max(10),
    "Giải quyết vấn đề": z.number().min(0).max(10),
    "Ghi nhớ kiến thức": z.number().min(0).max(10),
    "Vận dụng thực tế": z.number().min(0).max(10),
    "Tư duy phản biện": z.number().min(0).max(10),
  }),
  recommendedTopics: z.array(z.string()),
  nextStepMessage: z.string(),
});

export async function generateEvaluation(
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>,
  courseName: string
): Promise<EvaluationResult> {
  const openai = getOpenAI();

  const { object } = await generateObject({
    model: openai(EVAL_MODEL),
    schema: EvaluationSchema,
    system: EVALUATION_SYSTEM_PROMPT,
    prompt: `Đây là lịch sử hội thoại học tập cho môn "${courseName}":

${conversationHistory.map((m) => `${m.role === "user" ? "Sinh viên" : "AI"}: ${m.content}`).join("\n\n")}

Hãy đánh giá năng lực học tập của sinh viên dựa trên hội thoại trên.`,
  });

  return object as EvaluationResult;
}
