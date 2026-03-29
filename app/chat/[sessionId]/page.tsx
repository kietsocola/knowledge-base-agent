import { cookies } from "next/headers"
import { getIronSession } from "iron-session"
import { redirect } from "next/navigation"
import { eq, asc, desc, and, sql } from "drizzle-orm"
import { SESSION_OPTIONS } from "@/lib/session"
import { ChatInterface } from "@/components/chat/ChatInterface"
import { getDb } from "@/lib/db/index"
import { messages, chatSessions } from "@/lib/db/schema"
import type { SessionData } from "@/types/lti"

interface Props {
  params: Promise<{ sessionId: string }>
}

export default async function ChatPage({ params }: Props) {
  const { sessionId } = await params

  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, SESSION_OPTIONS)

  // Must be logged in
  if (!session.studentId) {
    redirect("/portal")
  }

  const db = getDb()

  // Verify this session belongs to the current student
  const [targetSession] = await db
    .select({ studentId: chatSessions.studentId, courseId: chatSessions.courseId })
    .from(chatSessions)
    .where(eq(chatSessions.id, sessionId))
    .limit(1)

  if (!targetSession || targetSession.studentId !== session.studentId) {
    redirect("/portal")
  }

  // Load messages for the requested session (may be an old one)
  let initialMessages: Array<{ id: string; role: "user" | "assistant"; content: string; citations?: string | null }> = []
  try {
    initialMessages = await db
      .select({ id: messages.id, role: messages.role, content: messages.content, citations: messages.citations })
      .from(messages)
      .where(eq(messages.sessionId, sessionId))
      .orderBy(asc(messages.createdAt)) as typeof initialMessages
  } catch { /* start with empty history */ }

  // Load all sessions for this student+course (for history panel)
  type SessionSummary = { id: string; createdAt: number | null; msgCount: number }
  let pastSessions: SessionSummary[] = []
  try {
    const rows = await db
      .select({
        id: chatSessions.id,
        createdAt: chatSessions.createdAt,
        msgCount: sql<number>`(SELECT COUNT(*) FROM messages WHERE session_id = chat_sessions.id)`,
      })
      .from(chatSessions)
      .where(
        and(
          eq(chatSessions.studentId, session.studentId),
          eq(chatSessions.courseId, targetSession.courseId!),
        )
      )
      .orderBy(desc(chatSessions.createdAt))
      .limit(20)
    pastSessions = rows as SessionSummary[]
  } catch { /* skip */ }

  // Read-only if viewing an old session (not the current active one)
  const isReadOnly = sessionId !== session.sessionId

  return (
    <ChatInterface
      sessionId={sessionId}
      activeSessionId={session.sessionId}
      courseId={targetSession.courseId ?? session.courseId}
      courseName={session.courseName ?? session.courseId}
      studentName={session.displayName}
      viewerRole={session.role}
      initialMessages={initialMessages}
      pastSessions={pastSessions}
      isReadOnly={isReadOnly}
    />
  )
}
