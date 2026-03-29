"use client"

import { useEffect, useState } from "react"
import { BookOpen, FileText, BarChart3, X, History, MessageSquare, BarChart2, UploadCloud, FileStack, BrainCircuit, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { UploadModal } from "@/components/chat/UploadModal"
import type { SessionSummary } from "@/components/chat/ChatInterface"
import type { LearningOverview } from "@/types/learning"
import { buildSidebarLearningSummary } from "@/lib/learning/sidebar-summary"

interface Document {
  id: string
  name: string
  pageCount: number | null
}

interface SidebarProps {
  courseId: string
  courseName: string
  studentName: string
  viewerRole?: "learner" | "instructor" | "admin"
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
  viewerRole,
  sessionId,
  activeSessionId,
  messageCount,
  isOpen,
  onClose,
  pastSessions = [],
}: SidebarProps) {
  const [docs, setDocs] = useState<Document[]>([])
  const [loadingDocs, setLoadingDocs] = useState(true)
  const [docsVersion, setDocsVersion] = useState(0)
  const [showUpload, setShowUpload] = useState(false)
  const [overview, setOverview] = useState<LearningOverview | null>(null)
  const [loadingOverview, setLoadingOverview] = useState(true)

  useEffect(() => {
    if (!courseId) return
    setLoadingDocs(true)
    fetch(`/api/documents?courseId=${courseId}`)
      .then((r) => r.json())
      .then((d: unknown) => {
        const data = d as { documents?: Document[] }
        setDocs(data.documents ?? [])
        setLoadingDocs(false)
      })
      .catch(() => setLoadingDocs(false))
  }, [courseId, docsVersion])

  useEffect(() => {
    if (!sessionId) return
    setLoadingOverview(true)
    fetch(`/api/learning/overview?sessionId=${sessionId}`)
      .then((r) => r.json())
      .then((data: LearningOverview) => {
        setOverview(data)
        setLoadingOverview(false)
      })
      .catch(() => setLoadingOverview(false))
  }, [sessionId, messageCount])

  const EVAL_THRESHOLD = 4
  const evalUnlocked = messageCount >= EVAL_THRESHOLD
  const evalProgress = Math.min(messageCount, EVAL_THRESHOLD)
  const nextEvalAt = EVAL_THRESHOLD - evalProgress
  const learningSummary = overview ? buildSidebarLearningSummary(overview) : null

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-full w-80 flex-col border-r border-white/70 bg-[#f2f4f6]/95 p-6 transition-transform duration-300",
          "lg:static lg:translate-x-0 lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="font-heading text-lg font-bold text-primary">Kho Tri Thức</div>
            <div className="text-xs text-muted-foreground">Tài liệu đồng bộ từ Moodle</div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 lg:hidden" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 pr-1">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                Môn học
              </span>
            </div>
            <div className="rounded-[1.5rem] border border-white/80 bg-white/90 p-4 shadow-sm">
              <div className="text-sm font-semibold leading-snug">{courseName}</div>
              <div className="mt-1 text-xs text-muted-foreground">Sinh viên: {studentName}</div>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <History className="h-4 w-4 text-primary" />
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                Lịch sử chat
              </span>
            </div>

            {pastSessions.length === 0 ? (
              <div className="rounded-2xl bg-white/80 px-4 py-3 text-[11px] italic text-muted-foreground shadow-sm">
                Chưa có phiên nào.
              </div>
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
                          "rounded-[1.25rem] border px-3 py-3 transition-colors",
                          isViewed
                            ? "border-primary/20 bg-white text-primary shadow-sm"
                            : "border-transparent bg-white/75 hover:bg-white hover:shadow-sm"
                        )}
                      >
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

                        <div className="text-[10px] text-muted-foreground mt-0.5 pl-4">
                          {formatDate(s.createdAt)} · {s.msgCount} tin
                        </div>

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

          <div>
            <div className="mb-2 flex items-center gap-2">
              <FileStack className="h-4 w-4 text-primary" />
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                Tài liệu
              </span>
            </div>
            {loadingDocs ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
              </div>
            ) : docs.length === 0 ? (
              <div className="rounded-2xl bg-white/80 px-4 py-3 text-xs italic text-muted-foreground shadow-sm">
                Chưa có tài liệu nào được ingest.
              </div>
            ) : (
              <ul className="space-y-1.5">
                {docs.map((doc) => (
                  <li key={doc.id} className="flex items-start gap-3 rounded-2xl bg-white/80 p-3 shadow-sm">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-xs font-semibold leading-snug">{doc.name}</div>
                      {doc.pageCount && (
                        <div className="text-[10px] text-muted-foreground">{doc.pageCount} trang · PDF</div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <BrainCircuit className="h-4 w-4 text-primary" />
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                Tracking học tập
              </span>
            </div>

            {loadingOverview ? (
              <div className="space-y-2">
                <Skeleton className="h-16 w-full rounded-2xl" />
                <Skeleton className="h-24 w-full rounded-2xl" />
              </div>
            ) : !overview ? (
              <div className="rounded-2xl bg-white/80 px-4 py-3 text-xs italic text-muted-foreground shadow-sm">
                Chưa tải được dữ liệu tracking.
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-[1.25rem] border border-white/80 bg-white/90 p-3 shadow-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.18em]">Concept</span>
                    </div>
                    <div className="mt-2 text-2xl font-black text-primary">{overview.totalConcepts}</div>
                  </div>
                  <div className="rounded-[1.25rem] border border-white/80 bg-white/90 p-3 shadow-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Activity className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.18em]">Sự kiện</span>
                    </div>
                    <div className="mt-2 text-2xl font-black text-primary">{overview.totalLearningEvents}</div>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-white/80 bg-white/90 p-4 shadow-sm">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    {learningSummary?.primaryLabel ?? "Theo dõi"}
                  </div>
                  <div className="mt-2 text-sm font-semibold leading-snug">
                    {learningSummary?.primaryConcept ?? "Bắt đầu học để tạo dữ liệu tracking"}
                  </div>
                  <div className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                    {learningSummary?.secondaryLabel ?? "Hệ thống sẽ cập nhật tiến trình ngay trong lúc học."}
                  </div>
                </div>

                <div className="rounded-[1.5rem] bg-slate-900 px-4 py-4 text-white shadow-sm">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">
                    Phiên hiện tại
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-xl font-black">{overview.totalChatTurns}</div>
                      <div className="text-[11px] text-white/60">lượt hỏi đáp</div>
                    </div>
                    <div>
                      <div className="text-xl font-black">{overview.totalEvaluations}</div>
                      <div className="text-[11px] text-white/60">lần đánh giá</div>
                    </div>
                  </div>
                </div>

                {viewerRole && viewerRole !== "learner" && (
                  <a
                    href="/classroom"
                    className="flex items-center justify-between rounded-[1.25rem] border border-primary/10 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                  >
                    <span>Xem dashboard lớp học</span>
                    <BarChart3 className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          {sessionId === activeSessionId && (
            <div className="rounded-[1.75rem] bg-gradient-to-br from-primary to-[#0066ff] p-5 text-white shadow-lg shadow-primary/20">
              <div className="mb-2 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/70">
                  Tiến độ đánh giá
                </span>
              </div>
              <div className="mt-3 text-3xl font-black">{Math.round((evalProgress / EVAL_THRESHOLD) * 100)}%</div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-white transition-all duration-500"
                  style={{ width: `${(evalProgress / EVAL_THRESHOLD) * 100}%` }}
                />
              </div>
              <div className="mt-3 text-xs leading-relaxed text-blue-50/85">
                {evalUnlocked
                  ? "Sẵn sàng đánh giá! Xem kết quả ngay."
                  : messageCount === 0
                  ? "Hỏi 4 câu để nhận đánh giá năng lực"
                  : `Còn ${nextEvalAt} câu nữa để được đánh giá`}
              </div>
              {evalUnlocked && (
                <a href="/evaluation" className="mt-3 inline-block text-xs font-semibold text-white underline-offset-4 hover:underline">
                  Xem đánh giá năng lực →
                </a>
              )}
            </div>
          )}
        </div>

        <button
          onClick={() => setShowUpload(true)}
          className="mt-6 flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-transform hover:scale-[1.01]"
        >
          <UploadCloud className="h-4 w-4" />
          Tải lên tài liệu mới
        </button>

        <UploadModal
          open={showUpload}
          onClose={() => setShowUpload(false)}
          courseId={courseId}
          courseName={courseName}
          onSuccess={() => setDocsVersion((v) => v + 1)}
        />

        <div className="mt-4 pt-4">
          <a
            href="/api/health"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] text-muted-foreground hover:underline"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Infrastructure live
          </a>
        </div>
      </aside>
    </>
  )
}
