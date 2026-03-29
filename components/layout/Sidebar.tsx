"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Activity,
  ArrowRight,
  BarChart2,
  BarChart3,
  BookOpen,
  BrainCircuit,
  Clock3,
  FileStack,
  FileText,
  GripVertical,
  History,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
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
  sessionId: string
  activeSessionId: string
  messageCount: number
  isOpen: boolean
  isDesktopExpanded: boolean
  onClose: () => void
  onDesktopToggle: () => void
  onDesktopExpand: () => void
  onDesktopCollapse: () => void
  pastSessions?: SessionSummary[]
}

function formatDate(ts: number | null): string {
  if (!ts) return "—"
  const d = new Date(ts * 1000)
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
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
  isDesktopExpanded,
  onClose,
  onDesktopToggle,
  onDesktopExpand,
  onDesktopCollapse,
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
  const desktopCollapsed = !isDesktopExpanded

  const compactCards = useMemo(
    () => [
      { label: "Concept", shortLabel: "CP", value: overview?.totalConcepts ?? 0, Icon: BookOpen },
      { label: "Sự kiện", shortLabel: "EV", value: overview?.totalLearningEvents ?? 0, Icon: Activity },
      { label: "Chat", shortLabel: "CH", value: overview?.totalChatTurns ?? 0, Icon: MessageSquare },
      { label: "Đánh giá", shortLabel: "DG", value: overview?.totalEvaluations ?? 0, Icon: BarChart3 },
    ],
    [overview]
  )
  const dossierStats = [
    { label: "Phiên", value: pastSessions.length || 1 },
    { label: "Chat", value: messageCount },
    { label: "Concept", value: overview?.totalConcepts ?? 0 },
  ]

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-full w-80 flex-col border-r border-border/70 bg-sidebar/92 transition-transform duration-300 backdrop-blur-xl",
          "lg:static lg:z-auto lg:h-screen lg:shrink-0 lg:translate-x-0 lg:overflow-hidden lg:transition-[width]",
          desktopCollapsed ? "lg:w-[5.75rem]" : "lg:w-[22rem]",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="relative flex h-full flex-col p-6 lg:p-5">
          <div
            className="absolute -right-3 top-24 z-20 hidden h-24 w-6 cursor-ew-resize items-center justify-center rounded-full border border-border/70 bg-card/92 text-muted-foreground shadow-lg backdrop-blur-lg lg:flex"
            role="separator"
            aria-orientation="vertical"
            aria-label={desktopCollapsed ? "Kéo để mở thanh bên" : "Kéo để thu thanh bên"}
            onPointerDown={(event) => {
              const startX = event.clientX
              const pointerId = event.pointerId
              const target = event.currentTarget
              target.setPointerCapture(pointerId)

              const finalize = (upEvent: PointerEvent) => {
                const delta = upEvent.clientX - startX
                if (delta <= -36) {
                  onDesktopCollapse()
                } else if (delta >= 36) {
                  onDesktopExpand()
                } else {
                  onDesktopToggle()
                }
                target.releasePointerCapture(pointerId)
                target.removeEventListener("pointerup", finalize)
                target.removeEventListener("pointercancel", finalize)
              }

              target.addEventListener("pointerup", finalize)
              target.addEventListener("pointercancel", finalize)
            }}
          >
            <GripVertical className="h-3.5 w-3.5" />
          </div>

          <div className={cn("rule-divider mb-6 flex items-center justify-between pb-5", desktopCollapsed && "lg:justify-center")}>
            {desktopCollapsed ? (
              <button
                type="button"
                onClick={onDesktopExpand}
                className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-card/85 text-primary shadow-sm transition-colors hover:bg-card lg:flex"
                aria-label="Mở thanh tri thức"
              >
                <PanelLeftOpen className="h-5 w-5" />
              </button>
            ) : (
              <>
                <div>
                  <div className="section-label">Knowledge rail</div>
                  <div className="mt-2 font-heading text-lg font-bold text-primary">Kho tri thức</div>
                  <div className="text-xs text-muted-foreground">Tài liệu đồng bộ từ Moodle</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="hidden h-8 w-8 text-muted-foreground lg:inline-flex"
                    onClick={onDesktopCollapse}
                    aria-label="Thu gọn thanh bên"
                  >
                    <PanelLeftClose className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 lg:hidden"
                    onClick={onClose}
                    aria-label="Đóng thanh bên"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>

          {desktopCollapsed ? (
            <div className="hidden flex-1 flex-col items-center gap-4 lg:flex">
              <div className="flex w-full flex-col gap-2">
                {compactCards.map(({ label, shortLabel, value, Icon }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={onDesktopExpand}
                    title={`${label}: ${value}`}
                    className="group relative flex w-full flex-col items-center gap-2 overflow-hidden rounded-[1.15rem] border border-border/50 bg-card/45 px-2 py-3 text-center transition-[background-color,border-color,transform] hover:-translate-y-0.5 hover:border-primary/20 hover:bg-card/80"
                    aria-label={`Mở thanh bên, ${label} ${value}`}
                  >
                    <div className="absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <Icon className="h-4 w-4 text-primary" />
                    <div className="text-sm font-black leading-none text-primary">{value}</div>
                    <div className="rounded-full border border-border/60 bg-background/75 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                      {shortLabel}
                    </div>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={onDesktopExpand}
                title="Mở thanh tri thức"
                className="mt-2 flex w-full flex-col items-center gap-2 rounded-[1.15rem] border border-primary/15 bg-primary/8 px-2 py-4 text-center text-primary transition-colors hover:bg-primary/12"
              >
                <UploadCloud className="h-4 w-4" />
                <span className="rounded-full border border-primary/10 bg-background/70 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.18em]">
                  Open
                </span>
              </button>
            </div>
          ) : (
            <>
              <div className="app-scrollbar flex-1 overflow-y-auto pr-1">
                <section className="pb-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="section-label">Session dossier</div>
                      <div className="mt-2 text-base font-black leading-tight text-primary">{courseName}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{studentName}</div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border/60 pt-4">
                    {dossierStats.map((item) => (
                      <div key={item.label} className="relative text-center">
                        <div className="text-xl font-black text-primary">{item.value}</div>
                        <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                          {item.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="border-t border-border/60 py-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="section-label">Session pulse</div>
                      <div className="mt-2 text-base font-black text-foreground">
                        {evalUnlocked ? "Đủ dữ liệu để đánh giá" : `Còn ${nextEvalAt} câu để mở báo cáo`}
                      </div>
                    </div>
                    <div className="rounded-full border border-primary/10 bg-primary/6 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                      checkpoint
                    </div>
                  </div>

                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-border/60">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${(evalProgress / EVAL_THRESHOLD) * 100}%` }}
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-0 overflow-hidden rounded-[1.15rem] border border-border/60 text-sm">
                    <div className="border-r border-border/60 px-3 py-3">
                      <div className="text-2xl font-black text-primary">{messageCount}</div>
                      <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">câu hỏi</div>
                    </div>
                    <div className="border-r border-border/60 px-3 py-3">
                      <div className="text-2xl font-black text-primary">{overview?.totalEvaluations ?? 0}</div>
                      <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">đánh giá</div>
                    </div>
                    <div className="px-3 py-3">
                      <div className="text-2xl font-black text-primary">{overview?.totalLearningEvents ?? 0}</div>
                      <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">events</div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="text-xs leading-relaxed text-muted-foreground">
                      {evalUnlocked
                        ? "Có thể chuyển sang báo cáo để xem điểm mạnh, khoảng trống và lộ trình tiếp theo."
                        : "Tiếp tục hỏi đáp để hệ thống có đủ tín hiệu cho diagnosis và planner flow."}
                    </div>
                    {evalUnlocked ? (
                      <a
                        href="/evaluation"
                        className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary px-3 py-2 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        Xem ngay
                        <ArrowRight className="h-3 w-3" />
                      </a>
                    ) : (
                      <Sparkles className="h-4 w-4 shrink-0 text-secondary" />
                    )}
                  </div>
                </section>

                <section className="border-t border-border/60 py-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="section-label">Learning focus</div>
                      <div className="mt-2 text-sm font-bold text-foreground">
                        {learningSummary?.primaryConcept ?? "Bắt đầu hỏi để tạo learning signal"}
                      </div>
                    </div>
                    <Clock3 className="h-4 w-4 shrink-0 text-primary" />
                  </div>

                  <div className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    {learningSummary?.secondaryLabel ?? "Rail bên trái sẽ cập nhật concept, nhịp học và checkpoint ngay trong lúc chat."}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-0 overflow-hidden rounded-[1.15rem] border border-border/60">
                    <div className="px-3 py-3">
                      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Concept</div>
                      <div className="mt-2 text-2xl font-black text-primary">{overview?.totalConcepts ?? 0}</div>
                    </div>
                    <div className="border-l border-border/60 px-3 py-3">
                      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Hoạt động</div>
                      <div className="mt-2 text-2xl font-black text-primary">{overview?.totalLearningEvents ?? 0}</div>
                    </div>
                  </div>
                </section>

                <section className="border-t border-border/60 py-5">
                  <div className="mb-2 flex items-center gap-2">
                    <History className="h-4 w-4 text-primary" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                      Lịch sử chat
                    </span>
                  </div>

                  {pastSessions.length === 0 ? (
                    <div className="paper-surface rounded-2xl px-4 py-3 text-[11px] italic text-muted-foreground">
                      Chưa có phiên nào.
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {pastSessions.map((s, i) => {
                        const isViewed = s.id === sessionId
                        const isActive = s.id === activeSessionId
                        const label = isActive ? "Phiên hiện tại" : `Phiên ${pastSessions.length - i}`

                        return (
                          <li key={s.id}>
                            <div
                              className={cn(
                                "border-l pl-4 transition-[border-color,color,transform]",
                                isViewed
                                  ? "border-primary text-primary"
                                  : "border-border/60 text-foreground hover:border-primary/40 hover:translate-x-0.5"
                              )}
                            >
                              <div className="flex items-start gap-3">
                                <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border", isViewed ? "border-primary/10 bg-primary text-primary-foreground" : "border-border/50 bg-card/60 text-muted-foreground")}>
                                  <MessageSquare className="h-3.5 w-3.5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <a href={`/chat/${s.id}`} className="group flex items-center gap-1">
                                    <span
                                      className={cn(
                                        "truncate text-xs font-medium",
                                        isViewed ? "text-primary" : "transition-colors group-hover:text-primary"
                                      )}
                                    >
                                      {label}
                                    </span>
                                    {isActive && !isViewed && (
                                      <span className="ml-1 shrink-0 rounded bg-primary/15 px-1 text-[9px] text-primary">mới nhất</span>
                                    )}
                                  </a>

                                  <div className="mt-1 text-[10px] text-muted-foreground">
                                    {formatDate(s.createdAt)} · {s.msgCount} tin
                                  </div>

                                  {s.msgCount >= 4 && (
                                    <a
                                      href={`/evaluation?sessionId=${s.id}`}
                                      className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-primary hover:underline"
                                    >
                                      <BarChart2 className="h-2.5 w-2.5" />
                                      Xem đánh giá
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </section>

                <section className="border-t border-border/60 py-5">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <FileStack className="h-4 w-4 text-primary" />
                      <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                        Tài liệu
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowUpload(true)}
                      className="inline-flex items-center gap-1 rounded-full border border-primary/10 bg-card px-3 py-1.5 text-[11px] font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                      <UploadCloud className="h-3 w-3" />
                      Tải lên
                    </button>
                  </div>
                  {loadingDocs ? (
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-3/4" />
                    </div>
                  ) : docs.length === 0 ? (
                    <div className="paper-surface rounded-2xl px-4 py-3 text-xs italic text-muted-foreground">
                      Chưa có tài liệu nào được ingest.
                    </div>
                  ) : (
                    <ul className="space-y-1.5">
                      {docs.map((doc) => (
                        <li key={doc.id} className="grid grid-cols-[40px_1fr] gap-3 rounded-[0.9rem] border-b border-border/40 py-3 last:border-b-0">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
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
                </section>

                {viewerRole && viewerRole !== "learner" && (
                  <a
                    href="/classroom"
                    className="mt-1 inline-flex items-center justify-between rounded-full border border-primary/15 bg-primary/6 px-4 py-3 text-sm font-semibold text-primary transition-[background-color,color,transform] hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground"
                  >
                    <span>Dashboard lớp học</span>
                    <BarChart3 className="h-4 w-4" />
                  </a>
                )}
              </div>

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
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Infrastructure live
                </a>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  )
}
