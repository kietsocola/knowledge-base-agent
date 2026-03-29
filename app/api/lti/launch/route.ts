import { cookies } from "next/headers"
import { getIronSession } from "iron-session"
import { and, desc, eq } from "drizzle-orm"
import { getDb } from "@/lib/db/index"
import { students, courses, chatSessions } from "@/lib/db/schema"
import { MOCK_STUDENTS, MOCK_COURSES } from "@/lib/lti/mock"
import { resolveSessionRole } from "@/lib/lti/roles"
import { validateLTIToken } from "@/lib/lti/validator"
import { SESSION_OPTIONS } from "@/lib/session"
import type { SessionData } from "@/types/lti"

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      studentId?: string
      courseId?: string
      id_token?: string
      forceNew?: boolean
    }
    const ltiMode = process.env.LTI_MODE ?? "mock"
    const ltiSecret = process.env.LTI_MOCK_SECRET ?? ""

    // ─── Resolve student + course claims ────────────────────────────────────
    let studentId: string
    let studentName: string
    let studentEmail: string
    let courseId: string
    let courseTitle: string
    let ltiIss: string
    let role: SessionData["role"]

    if (ltiMode === "mock" && body.studentId && body.courseId) {
      // Portal sends { studentId, courseId } — build mock session server-side
      const student = MOCK_STUDENTS.find((s) => s.id === body.studentId)
      const course = MOCK_COURSES.find((c) => c.id === body.courseId)
      if (!student || !course) {
        return Response.json({ error: "Invalid mock studentId or courseId" }, { status: 400 })
      }
      studentId = student.id
      studentName = student.name
      studentEmail = student.email
      courseId = course.id
      courseTitle = course.title
      ltiIss = "https://mock-moodle.demo.edu.vn"
      role = "learner"
    } else if (body.id_token) {
      // Standard LTI 1.3 JWT flow
      const claims = await validateLTIToken(body.id_token, ltiMode, ltiSecret)
      studentId = claims.sub
      studentName = claims.name
      studentEmail = claims.email ?? ""
      courseId = claims.context.id
      courseTitle = claims.context.title
      ltiIss = claims.iss
      role = resolveSessionRole(claims.roles)
    } else {
      return Response.json({ error: "Missing id_token or mock params" }, { status: 400 })
    }

    const db = getDb()

    // ─── Upsert student ──────────────────────────────────────────────────────
    const now = Math.floor(Date.now() / 1000)
    await db
      .insert(students)
      .values({
        id: studentId,
        ltiIss,
        displayName: studentName,
        email: studentEmail,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: students.id,
        set: { displayName: studentName, email: studentEmail, updatedAt: now },
      })

    // ─── Upsert course ───────────────────────────────────────────────────────
    await db
      .insert(courses)
      .values({
        id: courseId,
        title: courseTitle,
        ltiIss,
        createdAt: now,
      })
      .onConflictDoNothing()

    // ─── Reuse existing session or create new ────────────────────────────────
    // forceNew=true: always create a fresh session (explicit "new session" action)
    // default: reuse the most recent active session so repeated launches don't spam new sessions
    let sessionId: string
    if (!body.forceNew) {
      const [existing] = await db
        .select({ id: chatSessions.id })
        .from(chatSessions)
        .where(and(
          eq(chatSessions.studentId, studentId),
          eq(chatSessions.courseId, courseId),
          eq(chatSessions.status, "active"),
        ))
        .orderBy(desc(chatSessions.createdAt))
        .limit(1)
      if (existing) {
        sessionId = existing.id
      } else {
        sessionId = crypto.randomUUID()
        await db.insert(chatSessions).values({
          id: sessionId,
          studentId,
          courseId,
          ltiLaunchId: crypto.randomUUID(),
          status: "active",
          createdAt: now,
          updatedAt: now,
        })
      }
    } else {
      sessionId = crypto.randomUUID()
      await db.insert(chatSessions).values({
        id: sessionId,
        studentId,
        courseId,
        ltiLaunchId: crypto.randomUUID(),
        status: "active",
        createdAt: now,
        updatedAt: now,
      })
    }

    // ─── Set iron-session cookie ─────────────────────────────────────────────
    const cookieStore = await cookies()
    const ironSession = await getIronSession<SessionData>(cookieStore, SESSION_OPTIONS)
    ironSession.studentId = studentId
    ironSession.courseId = courseId
    ironSession.courseName = courseTitle
    ironSession.sessionId = sessionId
    ironSession.displayName = studentName
    ironSession.role = role
    await ironSession.save()

    return Response.json({
      redirectUrl: `/chat/${sessionId}`,
      sessionId,
      courseId,
      courseName: courseTitle,
      studentName,
    })
  } catch (error) {
    console.error("LTI launch error:", error)
    return Response.json(
      { error: "Launch failed", detail: String(error) },
      { status: 500 }
    )
  }
}
