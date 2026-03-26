import { cookies } from "next/headers"
import { getIronSession } from "iron-session"
import { redirect } from "next/navigation"
import { SESSION_OPTIONS } from "@/lib/session"
import { EvaluationLoader } from "@/components/evaluation/EvaluationLoader"
import type { SessionData } from "@/types/lti"

export const metadata = {
  title: "Đánh Giá Năng Lực — KB Agent",
}

export default async function EvaluationPage() {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, SESSION_OPTIONS)

  if (!session.sessionId) {
    redirect("/portal")
  }

  return (
    <EvaluationLoader
      sessionId={session.sessionId}
      studentName={session.displayName}
      courseName={session.courseName ?? session.courseId}
    />
  )
}
