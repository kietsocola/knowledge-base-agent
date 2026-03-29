"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { Chat, useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Send, PanelLeft, PanelLeftOpen, Sparkles, AlertCircle, MessageCircleQuestion, History, MoreVertical, Compass, BookOpenText, Workflow, Command, ArrowUpRight } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ThinkingIndicator } from "./ThinkingIndicator"
import { MessageBubble } from "./MessageBubble"
import { Sidebar } from "@/components/layout/Sidebar"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { toast } from "sonner"
import { chatEmptyState, chatEmptyStateToneClasses, chatParticipantLabels, chatQuickActions } from "@/lib/chat/chat-surface"
import { getUIMessageText } from "@/lib/chat/message-text"

interface InitialMessage {
  id: string
  role: "user" | "assistant"
  content: string
  citations?: string | null
}

export interface SessionSummary {
  id: string
  createdAt: number | null
  msgCount: number
}

interface ChatInterfaceProps {
  sessionId: string
  activeSessionId: string
  courseId: string
  courseName: string
  studentName: string
  viewerRole?: "learner" | "instructor" | "admin"
  initialMessages?: InitialMessage[]
  pastSessions?: SessionSummary[]
  isReadOnly?: boolean
}

export function ChatInterface({
  sessionId,
  activeSessionId,
  courseId,
  courseName,
  studentName,
  viewerRole,
  initialMessages = [],
  pastSessions = [],
  isReadOnly = false,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [desktopSidebarExpanded, setDesktopSidebarExpanded] = useState(true)
  const [animatedAssistantId, setAnimatedAssistantId] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const hasHydratedAssistantHistory = useRef(false)

  // Create a stable Chat instance seeded with DB history — only once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const chat = useMemo(() => new Chat({
    messages: initialMessages.map((m) => ({
      id: m.id,
      role: m.role,
      parts: [{ type: "text" as const, text: m.content }],
      ...(m.citations ? { metadata: { citations: JSON.parse(m.citations) } } : {}),
    })),
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { sessionId, courseId, courseName },
    }),
    onError: (err: Error) => toast.error("Lỗi kết nối", { description: err.message }),
  }), []) // stable — sessionId/courseId/courseName don't change within a page load

  // Stable options object — prevent useChat from re-subscribing every render
  const chatOptions = useMemo(() => ({ chat }), [chat])
  const { messages, sendMessage, status, error } = useChat(chatOptions)

  // Derived primitives — stable values, not array references
  const messageCount = messages.filter((m) => m.role === "user").length
  const isStreaming = status === "streaming" || status === "submitted"
  const canSend = input.trim().length > 0 && !isStreaming
  const lastAssistantMessage = [...messages].reverse().find((message) => message.role === "assistant")
  const hasVisibleAssistantText = Boolean(lastAssistantMessage && getUIMessageText(lastAssistantMessage).trim())
  const showThinkingIndicator = status === "submitted" || (status === "streaming" && !hasVisibleAssistantText)

  useEffect(() => {
    const lastAssistantId = lastAssistantMessage?.id ?? null

    if (!hasHydratedAssistantHistory.current) {
      hasHydratedAssistantHistory.current = true
      return
    }

    if (lastAssistantId && lastAssistantId !== animatedAssistantId) {
      setAnimatedAssistantId(lastAssistantId)
    }
  }, [animatedAssistantId, lastAssistantMessage?.id])

  // Auto-scroll to bottom on new messages. Avoid "smooth" during token streaming
  // because it fights with the incoming chunks and creates a jerky feel.
  useEffect(() => {
    const behavior: ScrollBehavior = isStreaming ? "auto" : "smooth"
    const frame = window.requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior, block: "end" })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [messages, status, isStreaming])

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    if (!canSend) return
    sendMessage({ text: input })
    setInput("")
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div id="main-content" className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        courseId={courseId}
        courseName={courseName}
        studentName={studentName}
        sessionId={sessionId}
        activeSessionId={activeSessionId}
        messageCount={messageCount}
        viewerRole={viewerRole}
        isOpen={sidebarOpen}
        isDesktopExpanded={desktopSidebarExpanded}
        onClose={() => setSidebarOpen(false)}
        onDesktopToggle={() => setDesktopSidebarExpanded((value) => !value)}
        onDesktopExpand={() => setDesktopSidebarExpanded(true)}
        onDesktopCollapse={() => setDesktopSidebarExpanded(false)}
        pastSessions={pastSessions}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {!desktopSidebarExpanded && (
          <button
            type="button"
            onClick={() => setDesktopSidebarExpanded(true)}
            className="fixed left-[4.5rem] top-18 z-30 hidden items-center gap-2 rounded-full border border-border/70 bg-card/92 px-3 py-1.5 text-xs font-semibold text-primary shadow-lg backdrop-blur-lg transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-card lg:flex"
            aria-label="Mở thanh tri thức"
          >
            <PanelLeftOpen className="h-3.5 w-3.5" />
            Mở rail
          </button>
        )}

        <header className="glass-panel rule-divider flex shrink-0 items-center justify-between px-4 py-2 shadow-sm sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-primary/10 bg-primary text-primary-foreground shadow-[0_10px_24px_-18px_rgba(25,69,99,0.58)]">
              <Command className="h-3.5 w-3.5" />
            </div>
            <div>
              <div className="font-heading text-[15px] font-black leading-none tracking-tight sm:text-base">{courseName}</div>
              <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="truncate">{studentName} · {chatParticipantLabels.assistant}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="hidden h-9 w-9 text-muted-foreground xl:inline-flex"
              aria-label="Lịch sử phiên học"
            >
              <History className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden h-9 w-9 text-muted-foreground xl:inline-flex"
              aria-label="Tùy chọn phiên học"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 xl:hidden"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Toggle sidebar"
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <div className="app-scrollbar flex-1 overflow-y-auto py-2.5 sm:py-3">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
              <div className={`w-full max-w-3xl rounded-[1.8rem] border p-6 shadow-[0_20px_60px_-28px_rgba(15,23,32,0.18)] dark:shadow-[0_24px_72px_-30px_rgba(0,0,0,0.55)] sm:p-8 ${chatEmptyStateToneClasses.shell}`}>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-5 text-left">
                  <div>
                    <div className={`text-[11px] font-bold uppercase tracking-[0.24em] ${chatEmptyStateToneClasses.kicker}`}>
                      {chatEmptyState.kicker}
                    </div>
                    <div className={`mt-2 font-heading text-3xl font-black tracking-tight ${chatEmptyStateToneClasses.title}`}>
                      {chatEmptyState.title}
                    </div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/10 bg-primary text-primary-foreground shadow-[0_14px_32px_-18px_rgba(25,69,99,0.55)]">
                    <Workflow className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-6 grid gap-4 text-left lg:grid-cols-[0.78fr_0.22fr]">
                  <div>
                    <div className="text-base font-semibold text-foreground">
                      {studentName}, bạn đang ở phiên <strong>{courseName}</strong>.
                    </div>
                    <div className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      {chatEmptyState.description}
                    </div>
                  </div>
                  <div className={`rounded-[1.2rem] border p-4 ${chatEmptyStateToneClasses.modeCard}`}>
                    <div className={`text-[10px] font-bold uppercase tracking-[0.2em] ${chatEmptyStateToneClasses.modeLabel}`}>
                      mode
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-primary">
                      <Sparkles className="h-4 w-4" />
                      Academic session
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {chatQuickActions.map((q, index) => {
                    const Icon = [Compass, BookOpenText, ArrowUpRight][index] ?? Compass

                    return (
                    <button
                      key={q}
                      onClick={() => setInput(q)}
                      className="group rounded-[1.1rem] border border-border/70 bg-background/84 px-4 py-4 text-left transition-[border-color,background-color,transform] hover:-translate-y-0.5 hover:border-primary/24 hover:bg-card"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/10 bg-primary/6 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                          Action
                        </span>
                      </div>
                      <div className="mt-4 text-sm font-semibold leading-snug text-foreground">
                        {q}
                      </div>
                    </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              shouldAnimateReveal={message.id === animatedAssistantId}
            />
          ))}

          <ThinkingIndicator isVisible={showThinkingIndicator} />

          <div ref={bottomRef} />
        </div>

        {error && (
            <div className="mx-4 mb-2 flex items-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive sm:mx-6">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error.message}
            </div>
          )}

        {isReadOnly ? (
          <div className="shrink-0 border-t border-border/60 px-4 pb-4 pt-3 sm:px-8">
            <div className="flex items-center justify-between gap-3 rounded-[1.4rem] border border-border/70 bg-card/80 p-4">
              <div className="text-xs text-muted-foreground">
                Đây là phiên chat cũ — chỉ xem, không thể gửi thêm tin nhắn.
              </div>
              <Link
                href="/portal"
                className={buttonVariants({
                  size: "sm",
                  variant: "outline",
                  className: "h-8 shrink-0 rounded-full text-xs",
                })}
              >
                Phiên mới
              </Link>
            </div>
          </div>
        ) : (
          <div className="glass-panel shrink-0 border-t border-border/60 px-4 pb-2.5 pt-2 sm:px-5 sm:pb-3">
            <div className="mb-2 flex flex-wrap justify-center gap-2 xl:hidden">
              {chatQuickActions.map((label) => (
                <button
                  key={label}
                  onClick={() => setInput(label)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary/10 bg-card px-3 py-1.5 text-[11px] font-semibold text-primary shadow-sm transition-[border-color,background-color,color] hover:border-primary/20 hover:bg-primary hover:text-primary-foreground"
                >
                  <ArrowUpRight className="h-3 w-3" />
                  {label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mx-auto flex max-w-4xl items-end gap-2 rounded-[1.5rem] border border-border/70 bg-card/95 p-1.5 shadow-[0_18px_48px_-24px_rgba(15,23,32,0.16)] backdrop-blur-xl sm:gap-2">
              <label htmlFor="chat-input" className="sr-only">
                Câu hỏi gửi cho trợ lý học tập
              </label>
              <Textarea
                id="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="Nhập câu hỏi về tài liệu môn học"
                placeholder="Nhập yêu cầu học tập, câu hỏi, hoặc nhiệm vụ bạn muốn xử lý…"
                className="min-h-[42px] max-h-32 resize-none border-0 bg-transparent px-3 py-2 text-sm shadow-none focus-visible:ring-0"
                disabled={isStreaming}
                rows={1}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!canSend}
                aria-label="Gửi câu hỏi"
                className="h-9 w-9 shrink-0 rounded-full shadow-[0_12px_24px_-14px_rgba(25,69,99,0.55)]"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <div className="mx-auto mt-1 flex max-w-4xl items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  const lastUserPart = messages.filter(m => m.role === "user").at(-1)
                    ?.parts.find((p: { type: string }) => p.type === "text") as { type: "text"; text: string } | undefined
                  const question = input.trim() || lastUserPart?.text || "câu hỏi của bạn"
                  const toastId = toast.loading("Đang gửi đến giảng viên…", {
                    description: question.length > 60 ? question.slice(0, 60) + "…" : question,
                  })
                  setTimeout(() => {
                    toast.success("Đã gửi!", {
                      id: toastId,
                      description: "Giảng viên sẽ phản hồi trong giờ học tiếp theo.",
                      duration: 4000,
                    })
                  }, 1500)
                }}
                className="flex items-center gap-1 text-[10px] text-muted-foreground transition-colors hover:text-primary"
              >
                <MessageCircleQuestion className="w-3 h-3" />
                Hỏi giảng viên
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
