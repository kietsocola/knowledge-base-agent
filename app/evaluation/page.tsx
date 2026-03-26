// Placeholder — sẽ implement đầy đủ trong Ngày 3
// RadarChart, EvaluationCard sẽ được thêm vào đây

import { cookies } from "next/headers"
import { getIronSession } from "iron-session"
import { redirect } from "next/navigation"
import { SESSION_OPTIONS } from "@/lib/session"
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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Đánh Giá Năng Lực</h1>
        <p className="text-muted-foreground text-sm">
          Sinh viên: <strong>{session.displayName}</strong>
        </p>
        <p className="text-xs text-muted-foreground mt-4">
          ⏳ Radar Chart UI sẽ hoàn thiện trong Ngày 3
        </p>
        <a
          href={`/chat/${session.sessionId}`}
          className="text-sm underline text-primary"
        >
          ← Quay lại chat
        </a>
      </div>
    </div>
  )
}
