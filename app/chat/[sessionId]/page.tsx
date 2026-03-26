// Placeholder — sẽ implement đầy đủ trong Ngày 3
// ChatInterface, MessageBubble, CitationCard, ThinkingIndicator sẽ được thêm vào đây

import { cookies } from "next/headers"
import { getIronSession } from "iron-session"
import { redirect } from "next/navigation"
import { SESSION_OPTIONS } from "@/lib/session"
import type { SessionData } from "@/types/lti"

interface Props {
  params: Promise<{ sessionId: string }>
}

export default async function ChatPage({ params }: Props) {
  const { sessionId } = await params

  // Verify session exists
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, SESSION_OPTIONS)

  if (!session.sessionId || session.sessionId !== sessionId) {
    redirect("/portal")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Chat đang được xây dựng</h1>
        <p className="text-muted-foreground text-sm">
          Phiên: <span className="font-mono text-xs">{sessionId}</span>
        </p>
        <p className="text-muted-foreground text-sm">
          Sinh viên: <strong>{session.displayName}</strong>
        </p>
        <p className="text-muted-foreground text-sm">
          Môn học: <strong>{session.courseId}</strong>
        </p>
        <p className="text-xs text-muted-foreground mt-4">
          ⏳ Chat UI sẽ hoàn thiện trong Ngày 3
        </p>
      </div>
    </div>
  )
}
