"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Chat, useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { motion, AnimatePresence } from "framer-motion"
import { Send, PanelLeft, GraduationCap, AlertCircle, MessageCircleQuestion, History, MoreVertical, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ThinkingIndicator } from "./ThinkingIndicator"
import { MessageBubble } from "./MessageBubble"
import { Sidebar } from "@/components/layout/Sidebar"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { toast } from "sonner"

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
  const [showEvalBanner, setShowEvalBanner] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

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
  const lastMsg = messages.at(-1)
  const triggerEval =
    lastMsg?.role === "assistant" &&
    !!(lastMsg.metadata as { triggerEvaluation?: boolean } | undefined)?.triggerEvaluation

  // Show eval banner — only re-run when count or triggerEval flag actually changes
  useEffect(() => {
    if (messageCount >= 4 || triggerEval) {
      setShowEvalBanner(true)
    }
  }, [messageCount, triggerEval])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, status])

  const isStreaming = status === "streaming" || status === "submitted"
  const canSend = input.trim().length > 0 && !isStreaming

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
    <div className="flex h-screen overflow-hidden bg-[#f7f9fb]">
      <Sidebar
        courseId={courseId}
        courseName={courseName}
        studentName={studentName}
        sessionId={sessionId}
        activeSessionId={activeSessionId}
        messageCount={messageCount}
        viewerRole={viewerRole}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        pastSessions={pastSessions}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="glass-panel flex shrink-0 items-center justify-between border-b border-white/60 px-4 py-4 shadow-sm sm:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="font-heading text-base font-bold leading-none">{courseName}</div>
              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {studentName} · Chế độ học thuật
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="hidden h-9 w-9 text-muted-foreground xl:inline-flex">
              <History className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden h-9 w-9 text-muted-foreground xl:inline-flex">
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

        <div className="flex-1 overflow-y-auto py-6">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                <GraduationCap className="h-7 w-7" />
              </div>
              <div>
                <div className="font-heading text-xl font-bold">
                  Xin chào, {studentName}!
                </div>
                <div className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Hỏi bất kỳ câu nào về <strong>{courseName}</strong>. Trợ lý sẽ trả lời
                  dựa trên tài liệu môn học và trả kèm trích dẫn.
                </div>
              </div>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {[
                  "Mảng là gì?",
                  "Độ phức tạp thuật toán?",
                  "Tóm tắt chương này cho mình",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="rounded-full border border-primary/10 bg-white px-4 py-2 text-xs font-semibold text-primary shadow-sm transition-colors hover:bg-primary hover:text-white"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          <ThinkingIndicator isVisible={status === "submitted"} />

          <div ref={bottomRef} />
        </div>

        {!isReadOnly && (
          <AnimatePresence>
            {showEvalBanner && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mx-4 mb-3 flex items-center justify-between gap-3 rounded-[1.5rem] bg-gradient-to-r from-primary to-[#0066ff] p-4 text-white shadow-lg shadow-primary/20 sm:mx-8"
              >
                <div className="text-sm">
                  <span className="font-semibold">Đã đặt 4 câu hỏi!</span>
                  <span className="ml-1 text-blue-50/80">
                    Xem đánh giá năng lực của bạn →
                  </span>
                </div>
                <a href="/evaluation">
                  <Button size="sm" className="shrink-0 bg-white text-primary hover:bg-blue-50">
                    Xem ngay
                  </Button>
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {error && (
          <div className="mx-4 mb-2 flex items-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive sm:mx-8">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error.message}
          </div>
        )}

        {isReadOnly ? (
          <div className="shrink-0 border-t border-white/60 px-4 pb-4 pt-3 sm:px-8">
            <div className="flex items-center justify-between gap-3 rounded-[1.4rem] border border-white/70 bg-white/80 p-4">
              <div className="text-xs text-muted-foreground">
                Đây là phiên chat cũ — chỉ xem, không thể gửi thêm tin nhắn.
              </div>
              <a href="/portal">
                <Button size="sm" variant="outline" className="h-8 shrink-0 rounded-full text-xs">
                  Phiên mới
                </Button>
              </a>
            </div>
          </div>
        ) : (
          <div className="glass-panel shrink-0 border-t border-white/60 px-4 pb-5 pt-4 sm:px-8">
            <div className="mb-3 flex flex-wrap justify-center gap-2 xl:hidden">
              {[
                "Làm bài tập trắc nghiệm",
                "Tóm tắt chương này",
                "Giải thích ví dụ thực tế",
              ].map((label) => (
                <button
                  key={label}
                  onClick={() => setInput(label)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary/10 bg-white px-4 py-2 text-xs font-semibold text-primary shadow-sm transition-colors hover:bg-primary hover:text-white"
                >
                  <Lightbulb className="h-3 w-3" />
                  {label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mx-auto flex max-w-4xl items-end gap-3 rounded-[1.75rem] border border-white/70 bg-[#eef2f6] p-2 shadow-inner">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Hỏi bất kỳ điều gì về tài liệu..."
                className="min-h-[52px] max-h-32 resize-none border-0 bg-transparent px-3 py-3 text-sm shadow-none focus-visible:ring-0"
                disabled={isStreaming}
                rows={1}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!canSend}
                className="h-11 w-11 shrink-0 rounded-2xl shadow-lg shadow-primary/25"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <div className="mx-auto mt-2 flex max-w-4xl items-center justify-between">
              <div className="text-[10px] text-muted-foreground">
                AI trả lời dựa trên tài liệu môn học · Shift+Enter xuống dòng
              </div>
              <button
                type="button"
                onClick={() => {
                  const lastUserPart = messages.filter(m => m.role === "user").at(-1)
                    ?.parts.find((p: { type: string }) => p.type === "text") as { type: "text"; text: string } | undefined
                  const question = input.trim() || lastUserPart?.text || "câu hỏi của bạn"
                  const toastId = toast.loading("Đang gửi đến giảng viên...", {
                    description: question.length > 60 ? question.slice(0, 60) + "..." : question,
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
