import { cookies } from "next/headers"
import { getIronSession } from "iron-session"
import { redirect } from "next/navigation"
import { SESSION_OPTIONS } from "@/lib/session"
import { ChatInterface } from "@/components/chat/ChatInterface"
import type { SessionData } from "@/types/lti"

interface Props {
  params: Promise<{ sessionId: string }>
}

export default async function ChatPage({ params }: Props) {
  const { sessionId } = await params

  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, SESSION_OPTIONS)

  if (!session.sessionId || session.sessionId !== sessionId) {
    redirect("/portal")
  }

  return (
    <ChatInterface
      sessionId={session.sessionId}
      courseId={session.courseId}
      courseName={session.courseName ?? session.courseId}
      studentName={session.displayName}
    />
  )
}
