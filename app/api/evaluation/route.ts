import { getCloudflareContext } from "@opennextjs/cloudflare"
import { eq, asc, desc } from "drizzle-orm"
import { getCloudflareDb, getDb } from "@/lib/db/index"
import { messages, chatSessions, courses, evaluations } from "@/lib/db/schema"
import { generateEvaluation } from "@/lib/llm/evaluator"
import type { EvaluationResult } from "@/types/evaluation"

export async function POST(request: Request) {
  try {
    const body = await request.json() as { sessionId: string }
    const { sessionId } = body

    if (!sessionId) {
      return Response.json({ error: "sessionId required" }, { status: 400 })
    }

    let db
    try {
      const { env } = getCloudflareContext()
      db = getCloudflareDb(env.DB)
    } catch {
      db = getDb()
    }

    // ─── Fetch session + course info ─────────────────────────────────────────
    const [session] = await db
      .select({ courseId: chatSessions.courseId })
      .from(chatSessions)
      .where(eq(chatSessions.id, sessionId))
      .limit(1)

    if (!session) {
      return Response.json({ error: "Session not found" }, { status: 404 })
    }

    const [course] = await db
      .select({ title: courses.title })
      .from(courses)
      .where(eq(courses.id, session.courseId!))
      .limit(1)

    // ─── Check cached evaluation ─────────────────────────────────────────────
    const [cached] = await db
      .select()
      .from(evaluations)
      .where(eq(evaluations.sessionId, sessionId))
      .orderBy(desc(evaluations.createdAt))
      .limit(1)

    if (cached) {
      // If full result was stored, return it directly
      if (cached.resultJson) {
        return Response.json(JSON.parse(cached.resultJson) as EvaluationResult)
      }
      // Fallback for old rows that only have individual columns
      const cachedResult: EvaluationResult = {
        radarScores: JSON.parse(cached.radarScores ?? "{}"),
        strengths: JSON.parse(cached.strengths ?? "[]"),
        gaps: JSON.parse(cached.gaps ?? "[]"),
        overallScore: cached.overallScore ?? 0,
        recommendedTopics: [],
        nextStepMessage: "Tiếp tục ôn luyện để cải thiện kết quả.",
      }
      return Response.json(cachedResult)
    }

    // ─── Fetch messages ──────────────────────────────────────────────────────
    const sessionMessages = await db
      .select({ role: messages.role, content: messages.content })
      .from(messages)
      .where(eq(messages.sessionId, sessionId))
      .orderBy(asc(messages.createdAt))

    if (sessionMessages.length < 2) {
      return Response.json(
        { error: "Not enough messages to evaluate" },
        { status: 400 }
      )
    }

    // ─── Generate evaluation ─────────────────────────────────────────────────
    const result = await generateEvaluation(
      sessionMessages as Array<{ role: "user" | "assistant"; content: string }>,
      course?.title ?? "môn học"
    )

    // ─── Persist to D1 ───────────────────────────────────────────────────────
    const evalId = crypto.randomUUID()
    const now = Math.floor(Date.now() / 1000)

    await db.insert(evaluations).values({
      id: evalId,
      sessionId,
      triggeredAtMsg: sessionMessages.length,
      radarScores: JSON.stringify(result.radarScores),
      strengths: JSON.stringify(result.strengths),
      gaps: JSON.stringify(result.gaps),
      overallScore: result.overallScore,
      resultJson: JSON.stringify(result),
      createdAt: now,
    })

    return Response.json(result)
  } catch (error) {
    console.error("Evaluation error:", error)
    return Response.json(
      { error: "Evaluation failed", detail: String(error) },
      { status: 500 }
    )
  }
}
