import { getCloudflareContext } from "@opennextjs/cloudflare"
import { eq, asc } from "drizzle-orm"
import { getCloudflareDb, getDb } from "@/lib/db/index"
import { messages, chatSessions, courses, evaluations } from "@/lib/db/schema"
import { generateEvaluation } from "@/lib/llm/evaluator"

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
