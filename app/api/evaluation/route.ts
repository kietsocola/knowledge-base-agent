import { cookies } from "next/headers"
import { getIronSession } from "iron-session"
import { eq, asc, desc } from "drizzle-orm"
import { getDb } from "@/lib/db/index"
import { messages, chatSessions, courses, evaluations } from "@/lib/db/schema"
import { generateEvaluation } from "@/lib/llm/evaluator"
import { shouldReuseCachedEvaluation } from "@/lib/evaluation/cache"
import { SESSION_OPTIONS } from "@/lib/session"
import { authorizeOwnedSession } from "@/lib/security/session-authorization"
import type { EvaluationResult } from "@/types/evaluation"
import type { SessionData } from "@/types/lti"

export async function POST(request: Request) {
  try {
    const body = await request.json() as { sessionId: string }
    const { sessionId } = body

    if (!sessionId) {
      return Response.json({ error: "sessionId required" }, { status: 400 })
    }

    const db = getDb()
    const cookieStore = await cookies()
    const viewerSession = await getIronSession<SessionData>(cookieStore, SESSION_OPTIONS)

    // ─── Fetch session + course info ─────────────────────────────────────────
    const [session] = await db
      .select({ studentId: chatSessions.studentId, courseId: chatSessions.courseId })
      .from(chatSessions)
      .where(eq(chatSessions.id, sessionId))
      .limit(1)

    const access = authorizeOwnedSession(viewerSession, session ?? null)
    if (!access.ok) {
      return Response.json({ error: access.error }, { status: access.status })
    }

    const [course] = await db
      .select({ title: courses.title })
      .from(courses)
      .where(eq(courses.id, access.value.courseId!))
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

    // ─── Check cached evaluation ─────────────────────────────────────────────
    const [cached] = await db
      .select()
      .from(evaluations)
      .where(eq(evaluations.sessionId, sessionId))
      .orderBy(desc(evaluations.createdAt))
      .limit(1)

    if (cached && shouldReuseCachedEvaluation(cached.triggeredAtMsg, sessionMessages.length)) {
      if (cached.resultJson) {
        return Response.json(JSON.parse(cached.resultJson) as EvaluationResult)
      }
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

    // ─── Generate evaluation ─────────────────────────────────────────────────
    const result = await generateEvaluation(
      sessionMessages as Array<{ role: "user" | "assistant"; content: string }>,
      course?.title ?? "môn học"
    )

    // ─── Persist to Supabase ──────────────────────────────────────────────────
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
