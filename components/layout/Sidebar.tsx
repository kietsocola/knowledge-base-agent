"use client"

import { useEffect, useState } from "react"
import { BookOpen, FileText, BarChart3, X, History, MessageSquare, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { SessionSummary } from "@/components/chat/ChatInterface"

interface Document {
  id: string
  name: string
  pageCount: number | null
}

interface SidebarProps {
  courseId: string
  courseName: string
  studentName: string
  /** Session ID being viewed (URL param) */
  sessionId: string
  /** Session ID in cookie — the "active" (current) session */
  activeSessionId: string
  messageCount: number
  isOpen: boolean
  onClose: () => void
  pastSessions?: SessionSummary[]
}

function formatDate(ts: number | null): string {
  if (!ts) return "—"
  const d = new Date(ts * 1000)
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })
}

export function Sidebar({
  courseId,
  courseName,
  studentName,
  sessionId,
  activeSessionId,
  messageCount,
  isOpen,
  onClose,
  pastSessions = [],
}: SidebarProps) {
  const [docs, setDocs] = useState<Document[]>([])
  const [loadingDocs, setLoadingDocs] = useState(true)

  useEffect(() => {
    if (!courseId) return
    fetch(`/api/documents?courseId=${courseId}`)
      .then((r) => r.json())
      .then((d: unknown) => {
        const data = d as { documents?: Document[] }
        setDocs(data.documents ?? [])
        setLoadingDocs(false)
      })
      .catch(() => setLoadingDocs(false))
  }, [courseId])

  const EVAL_THRESHOLD = 4
  const evalUnlocked = messageCount >= EVAL_THRESHOLD
  const evalProgress = Math.min(messageCount, EVAL_THRESHOLD)
  const nextEvalAt = EVAL_THRESHOLD - evalProgress

  return (
    <>
      {/* Overlay on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          "fixed top-0 right-0 h-full w-72 bg-background border-l border-border z-50 flex flex-col transition-transform duration-300",
          "lg:static lg:translate-x-0 lg:z-auto",
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="font-semibold text-sm">Thông tin</span>
          <Button variant="ghost" size="icon" className="h-7 w-7 lg:hidden" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Course info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Môn học
              </span>
            </div>
            <div className="text-sm font-medium leading-snug">{courseName}</div>
            <div className="text-xs text-muted-foreground mt-1">Sinh viên: {studentName}</div>
          </div>

          <Separator />

          {/* Chat history */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <History className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Lịch sử chat
              </span>
            </div>

            {pastSessions.length === 0 ? (
              <div className="text-[11px] text-muted-foreground italic px-1">Chưa có phiên nào.</div>
            ) : (
              <ul className="space-y-1">
                {pastSessions.map((s, i) => {
                  const isViewed = s.id === sessionId
                  const isActive = s.id === activeSessionId
                  const label = isActive ? "Phiên hiện tại" : `Phiên ${pastSessions.length - i}`

                  return (
                    <li key={s.id}>
                      <div
                        className={cn(
                          "rounded-lg px-3 py-2 transition-colors",
                          isViewed
                            ? "bg-primary/10 border border-primary/25"
                            : "hover:bg-muted border border-transparent"
                        )}
                      >
                        {/* Session link (title row) */}
                        <a
                          href={`/chat/${s.id}`}
                          className="flex items-center gap-1 group"
                        >
                          <MessageSquare className={cn("w-3 h-3 shrink-0", isViewed ? "text-primary" : "text-muted-foreground")} />
                          <span className={cn(
                            "text-xs font-medium truncate",
                            isViewed ? "text-primary" : "group-hover:text-primary transition-colors"
                          )}>
                            {label}
                          </span>
                          {isActive && !isViewed && (
                            <span className="ml-1 text-[9px] bg-primary/15 text-primary px-1 rounded shrink-0">mới nhất</span>
                          )}
                        </a>

                        {/* Meta row */}
                        <div className="text-[10px] text-muted-foreground mt-0.5 pl-4">
                          {formatDate(s.createdAt)} · {s.msgCount} tin
                        </div>

                        {/* Evaluation link (separate, not nested) */}
                        {s.msgCount >= 4 && (
                          <a
                            href={`/evaluation?sessionId=${s.id}`}
                            className="inline-flex items-center gap-0.5 text-[10px] text-primary hover:underline mt-0.5 pl-4"
                          >
                            <BarChart2 className="w-2.5 h-2.5" />
                            Xem đánh giá
                          </a>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <Separator />

          {/* Documents */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Tài liệu
              </span>
            </div>
            {loadingDocs ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
              </div>
            ) : docs.length === 0 ? (
              <div className="text-xs text-muted-foreground italic">Chưa có tài liệu nào được ingest.</div>
            ) : (
              <ul className="space-y-1.5">
                {docs.map((doc) => (
                  <li key={doc.id} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-medium leading-snug">{doc.name}</div>
                      {doc.pageCount && (
                        <div className="text-[10px] text-muted-foreground">{doc.pageCount} trang</div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Separator />

          {/* Evaluation progress (only for active session) */}
          {sessionId === activeSessionId && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Tiến độ đánh giá
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${(evalProgress / EVAL_THRESHOLD) * 100}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-1.5">
                {evalUnlocked
                  ? "Sẵn sàng đánh giá! Xem kết quả →"
                  : messageCount === 0
                  ? "Hỏi 4 câu để nhận đánh giá năng lực"
                  : `Còn ${nextEvalAt} câu nữa để được đánh giá`}
              </div>
              {evalUnlocked && (
                <a href="/evaluation" className="mt-2 text-xs font-medium text-primary hover:underline block">
                  Xem đánh giá năng lực →
                </a>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border">
          <a
            href="/api/health"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-muted-foreground hover:underline flex items-center gap-1"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Infrastructure live
          </a>
        </div>
      </aside>
    </>
  )
}
