import { cookies } from "next/headers"
import { getIronSession } from "iron-session"
import { and, asc, eq } from "drizzle-orm"
import { getDb } from "@/lib/db/index"
import {
  chatSessions,
  courseConcepts,
  learningEvents,
  studentConceptMastery,
  students,
} from "@/lib/db/schema"
import { buildClassroomOverview } from "@/lib/learning/classroom-overview"
import { authorizeClassroomAccess } from "@/lib/security/classroom-authorization"
import { SESSION_OPTIONS } from "@/lib/session"
import type { SessionData } from "@/types/lti"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const requestedCourseId = url.searchParams.get("courseId") ?? undefined

  const cookieStore = await cookies()
  const viewerSession = await getIronSession<SessionData>(cookieStore, SESSION_OPTIONS)
  const access = authorizeClassroomAccess(viewerSession, requestedCourseId)

  if (!access.ok) {
    return Response.json({ error: access.error }, { status: access.status })
  }

  const db = getDb()
  const trustedCourseId = access.value

  const [sessions, events, masteries] = await Promise.all([
    db
      .select({
        studentId: chatSessions.studentId,
        studentName: students.displayName,
        sessionId: chatSessions.id,
        createdAt: chatSessions.createdAt,
      })
      .from(chatSessions)
      .innerJoin(students, eq(students.id, chatSessions.studentId))
      .where(eq(chatSessions.courseId, trustedCourseId))
      .orderBy(asc(chatSessions.createdAt)),
    db
      .select({
        studentId: learningEvents.studentId,
        studentName: students.displayName,
        eventType: learningEvents.eventType,
        createdAt: learningEvents.createdAt,
      })
      .from(learningEvents)
      .innerJoin(students, eq(students.id, learningEvents.studentId))
      .where(eq(learningEvents.courseId, trustedCourseId))
      .orderBy(asc(learningEvents.createdAt)),
    db
      .select({
        studentId: studentConceptMastery.studentId,
        studentName: students.displayName,
        conceptName: courseConcepts.name,
        masteryScore: studentConceptMastery.masteryScore,
        updatedAt: studentConceptMastery.updatedAt,
      })
      .from(studentConceptMastery)
      .innerJoin(students, eq(students.id, studentConceptMastery.studentId))
      .innerJoin(courseConcepts, eq(courseConcepts.id, studentConceptMastery.conceptId))
      .where(
        and(
          eq(studentConceptMastery.courseId, trustedCourseId),
          eq(courseConcepts.courseId, trustedCourseId)
        )
      ),
  ])

  const overview = buildClassroomOverview({
    sessions: sessions
      .filter((session) => !!session.studentId)
      .map((session) => ({
        studentId: session.studentId!,
        studentName: session.studentName ?? session.studentId!,
        sessionId: session.sessionId,
        createdAt: session.createdAt,
      })),
    events: events
      .filter((event) => !!event.studentId)
      .map((event) => ({
        studentId: event.studentId!,
        studentName: event.studentName ?? event.studentId!,
        eventType: event.eventType,
        createdAt: event.createdAt,
      })),
    masteries: masteries
      .filter((mastery) => !!mastery.studentId)
      .map((mastery) => ({
        studentId: mastery.studentId!,
        studentName: mastery.studentName ?? mastery.studentId!,
        conceptName: mastery.conceptName,
        masteryScore: mastery.masteryScore ?? 0,
        updatedAt: mastery.updatedAt,
      })),
  })

  return Response.json(overview)
}
