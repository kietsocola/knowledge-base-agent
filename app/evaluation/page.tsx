import { cookies } from "next/headers"
import { getIronSession } from "iron-session"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { SESSION_OPTIONS } from "@/lib/session"
import { EvaluationLoader } from "@/components/evaluation/EvaluationLoader"
import { getCloudflareContext } from "@opennextjs/cloudflare"
import { getCloudflareDb, getDb } from "@/lib/db/index"
import { chatSessions } from "@/lib/db/schema"
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

  let db
  try {
    const { env } = getCloudflareContext()
    db = getCloudflareDb(env.DB)
  } catch {
    db = getDb()
  }

  // Use query param sessionId if provided, otherwise fall back to cookie's session
  let targetSessionId = querySessionId ?? session.sessionId

  if (!targetSessionId) {
    redirect("/portal")
  }

  // If viewing a specific session, verify it belongs to this student
  if (querySessionId && querySessionId !== session.sessionId) {
    const [target] = await db
      .select({ studentId: chatSessions.studentId })
      .from(chatSessions)
      .where(eq(chatSessions.id, querySessionId))
      .limit(1)

    if (!target || target.studentId !== session.studentId) {
      redirect("/portal")
    }
  }

  return (
    <EvaluationLoader
      sessionId={targetSessionId}
      studentName={session.displayName}
      courseName={session.courseName ?? session.courseId}
    />
  )
}
