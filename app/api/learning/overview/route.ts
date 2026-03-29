import { cookies } from "next/headers"
import { getIronSession } from "iron-session"
import { and, asc, eq } from "drizzle-orm"
import { getDb } from "@/lib/db/index"
import { chatSessions, courseConcepts, learningEvents, studentConceptMastery } from "@/lib/db/schema"
import { buildLearningOverview } from "@/lib/learning/overview"
import { SESSION_OPTIONS } from "@/lib/session"
import { authorizeOwnedSession } from "@/lib/security/session-authorization"
import type { SessionData } from "@/types/lti"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const sessionId = url.searchParams.get("sessionId")

  if (!sessionId) {
    return Response.json({ error: "sessionId required" }, { status: 400 })
  }

  const db = getDb()
  const cookieStore = await cookies()
  const viewerSession = await getIronSession<SessionData>(cookieStore, SESSION_OPTIONS)

  const [session] = await db
    .select({ studentId: chatSessions.studentId, courseId: chatSessions.courseId })
    .from(chatSessions)
    .where(eq(chatSessions.id, sessionId))
    .limit(1)

  const access = authorizeOwnedSession(viewerSession, session ?? null)
  if (!access.ok) {
    return Response.json({ error: access.error }, { status: access.status })
  }

  const trustedStudentId = viewerSession.studentId!
  const trustedCourseId = access.value.courseId!

  const concepts = await db
    .select({
      conceptName: courseConcepts.name,
      masteryScore: studentConceptMastery.masteryScore,
      confidenceScore: studentConceptMastery.confidenceScore,
      updatedAt: studentConceptMastery.updatedAt,
    })
    .from(studentConceptMastery)
    .innerJoin(courseConcepts, eq(courseConcepts.id, studentConceptMastery.conceptId))
    .where(
      and(
        eq(studentConceptMastery.studentId, trustedStudentId),
        eq(studentConceptMastery.courseId, trustedCourseId)
      )
    )

  const events = await db
    .select({
      eventType: learningEvents.eventType,
      createdAt: learningEvents.createdAt,
    })
    .from(learningEvents)
    .where(
      and(
        eq(learningEvents.studentId, trustedStudentId),
        eq(learningEvents.courseId, trustedCourseId),
        eq(learningEvents.sessionId, sessionId)
      )
    )
    .orderBy(asc(learningEvents.createdAt))

  const overview = buildLearningOverview({
    concepts: concepts.map((concept) => ({
      conceptName: concept.conceptName,
      masteryScore: concept.masteryScore ?? 0,
      confidenceScore: concept.confidenceScore ?? 0,
      updatedAt: concept.updatedAt,
    })),
    events,
  })

  return Response.json(overview)
}
