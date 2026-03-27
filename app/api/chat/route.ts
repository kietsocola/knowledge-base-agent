import {
  streamText,
  createUIMessageStream,
  createUIMessageStreamResponse,
  convertToModelMessages,
} from "ai"
import { eq, asc } from "drizzle-orm"
import { getDb } from "@/lib/db/index"
import { messages, chatSessions } from "@/lib/db/schema"
import { getOpenAI, CHAT_MODEL } from "@/lib/llm/client"
import { buildChatSystemPrompt } from "@/lib/llm/prompts"
import { parseCitations, formatContextForPrompt } from "@/lib/llm/citations"
import { embedText } from "@/lib/rag/embedder"
import { retrieveRelevantChunks } from "@/lib/rag/retriever"
import type { RetrievedChunk } from "@/lib/rag/retriever"

export async function POST(request: Request) {
  const body = await request.json() as {
    messages: unknown[]
    sessionId: string
    courseId: string
    courseName: string
  }

  const { sessionId, courseId, courseName } = body
  const apiKey = process.env.OPENAI_API_KEY!
  const openai = getOpenAI()

  // Convert UI messages to model messages
  const modelMessages = await convertToModelMessages(
    body.messages as Parameters<typeof convertToModelMessages>[0]
  )

  // Last user message text (for embedding)
  const lastUserMsg = [...modelMessages].reverse().find((m) => m.role === "user")
  const lastUserText =
    typeof lastUserMsg?.content === "string"
      ? lastUserMsg.content
      : (lastUserMsg?.content as Array<{ type: string; text?: string }>)
          ?.find((p) => p.type === "text")?.text ?? ""

  const db = getDb()

  // RAG: embed query and retrieve relevant chunks from Supabase pgvector
  let contextChunks: RetrievedChunk[] = []
  try {
    const vector = await embedText(lastUserText, apiKey)
    contextChunks = await retrieveRelevantChunks(vector, courseId, db)
  } catch (err) {
    console.warn("RAG retrieval failed, continuing without context:", err)
  }

  const contextStr = formatContextForPrompt(contextChunks)
  const systemPrompt =
    buildChatSystemPrompt(courseName ?? "môn học") +
    (contextStr
      ? `\n\n## Tài liệu tham khảo:\n\n${contextStr}`
      : "\n\n## Lưu ý: Không tìm thấy tài liệu liên quan trong kho kiến thức.")

  // ─── Stream response with citation metadata ────────────────────────────────
  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const result = streamText({
        model: openai(CHAT_MODEL),
        system: systemPrompt,
        messages: modelMessages,
      })

      writer.merge(result.toUIMessageStream())

      const fullText = await result.text

      // Write citations as message metadata
      const citations = parseCitations(fullText, contextChunks)
      if (citations.length > 0) {
        writer.write({
          type: "message-metadata",
          messageMetadata: { citations },
        })
      }

      // ─── Persist to DB ────────────────────────────────────────────────────
      if (sessionId) {
        const now = Math.floor(Date.now() / 1000)
        const persist = (async () => {
          await db.insert(messages).values({
            id: crypto.randomUUID(),
            sessionId,
            role: "user",
            content: lastUserText,
            createdAt: now,
          })
          await db.insert(messages).values({
            id: crypto.randomUUID(),
            sessionId,
            role: "assistant",
            content: fullText,
            citations: citations.length > 0 ? JSON.stringify(citations) : null,
            createdAt: now + 1,
          })
          await db
            .update(chatSessions)
            .set({ updatedAt: now + 1 })
            .where(eq(chatSessions.id, sessionId))

          const allMsgs = await db
            .select({ role: messages.role })
            .from(messages)
            .where(eq(messages.sessionId, sessionId))
            .orderBy(asc(messages.createdAt))

          const userCount = allMsgs.filter((m: { role: string }) => m.role === "user").length
          if (userCount > 0 && userCount % 4 === 0) {
            writer.write({
              type: "message-metadata",
              messageMetadata: { triggerEvaluation: true, messageCount: userCount },
            })
          }
        })()
        persist.catch(console.error)
      }
    },
  })

  return createUIMessageStreamResponse({ stream })
}
