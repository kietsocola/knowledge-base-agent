import { cookies } from "next/headers"
import { getIronSession } from "iron-session"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { SESSION_OPTIONS } from "@/lib/session"
import { EvaluationLoader } from "@/components/evaluation/EvaluationLoader"
import { getDb } from "@/lib/db/index"
import { chatSessions, courses } from "@/lib/db/schema"
import type { SessionData } from "@/types/lti"

export const metadata = {
  title: "Đánh Giá Năng Lực — KB Agent",
}

interface Props {
  searchParams: Promise<{ sessionId?: string }>
}

export default async function EvaluationPage({ searchParams }: Props) {
  const { sessionId: querySessionId } = await searchParams

  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, SESSION_OPTIONS)

  if (!session.studentId) {
    redirect("/portal")
  }

  const db = getDb()

  // Use query param sessionId if provided, otherwise fall back to cookie's session
  const targetSessionId = querySessionId ?? session.sessionId

  if (!targetSessionId) {
    redirect("/portal")
  }

  const [targetSession] = await db
    .select({
      studentId: chatSessions.studentId,
      courseId: chatSessions.courseId,
      courseTitle: courses.title,
    })
    .from(chatSessions)
    .leftJoin(courses, eq(courses.id, chatSessions.courseId))
    .where(eq(chatSessions.id, targetSessionId))
    .limit(1)

  if (!targetSession || targetSession.studentId !== session.studentId) {
    redirect("/portal")
  }

  return (
    <EvaluationLoader
      sessionId={targetSessionId}
      studentName={session.displayName}
      courseName={targetSession.courseTitle ?? targetSession.courseId ?? session.courseName ?? session.courseId}
      viewerRole={session.role}
    />
  )
}
