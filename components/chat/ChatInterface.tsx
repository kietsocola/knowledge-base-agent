"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Chat, useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { motion, AnimatePresence } from "framer-motion"
import { Send, PanelRight, GraduationCap, AlertCircle, MessageCircleQuestion } from "lucide-react"
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

  const { messages, sendMessage, status, error } = useChat({ chat })

  // Derived from live messages (includes DB history + new messages)
  const messageCount = messages.filter((m) => m.role === "user").length

  // Show eval banner when ≥4 user messages (counting history too)
  useEffect(() => {
    if (messageCount >= 4) {
      setShowEvalBanner(true)
      return
    }
    const lastMsg = messages.at(-1)
    if (lastMsg?.role === "assistant") {
      const meta = lastMsg.metadata as { triggerEvaluation?: boolean } | undefined
      if (meta?.triggerEvaluation) setShowEvalBanner(true)
    }
  }, [messages, messageCount])

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
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-background/80 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="font-semibold text-sm leading-none">{courseName}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{studentName}</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Toggle sidebar"
            >
              <PanelRight className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-2">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-base">
                  Xin chào, {studentName}!
                </div>
                <div className="text-sm text-muted-foreground mt-1 max-w-xs">
                  Hỏi bất kỳ câu nào về <strong>{courseName}</strong>. Tôi sẽ trả lời dựa trên tài liệu môn học.
                </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {[
                  "Mảng là gì?",
                  "Độ phức tạp thuật toán?",
                  "Cấu trúc dữ liệu nào nhanh nhất?",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
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

        {/* Evaluation banner (active session only) */}
        {!isReadOnly && (
          <AnimatePresence>
            {showEvalBanner && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mx-4 mb-2 p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between gap-3"
              >
                <div className="text-sm">
                  <span className="font-medium">Đã đạt 4 câu hỏi!</span>
                  <span className="text-muted-foreground ml-1">
                    Xem đánh giá năng lực của bạn →
                  </span>
                </div>
                <a href="/evaluation">
                  <Button size="sm" className="shrink-0">
                    Xem ngay
                  </Button>
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Error banner */}
        {error && (
          <div className="mx-4 mb-2 p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error.message}
          </div>
        )}

        {/* Read-only banner */}
        {isReadOnly ? (
          <div className="px-4 pb-4 pt-2 border-t border-border shrink-0">
            <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/60 border border-border">
              <div className="text-xs text-muted-foreground">
                Đây là phiên chat cũ — chỉ xem, không thể gửi thêm tin nhắn.
              </div>
              <a href="/portal">
                <Button size="sm" variant="outline" className="shrink-0 text-xs h-7">
                  Phiên mới
                </Button>
              </a>
            </div>
          </div>
        ) : (
          /* Active session input */
          <div className="px-4 pb-4 pt-2 border-t border-border shrink-0">
            <form onSubmit={handleSubmit} className="flex gap-2 items-end">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Đặt câu hỏi về môn học... (Enter để gửi)"
                className="min-h-[48px] max-h-32 resize-none text-sm"
                disabled={isStreaming}
                rows={1}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!canSend}
                className="h-10 w-10 shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <div className="flex items-center justify-between mt-1.5">
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
                className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors"
              >
                <MessageCircleQuestion className="w-3 h-3" />
                Hỏi giảng viên
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar — fixed on mobile, static on desktop */}
      <Sidebar
        courseId={courseId}
        courseName={courseName}
        studentName={studentName}
        sessionId={sessionId}
        activeSessionId={activeSessionId}
        messageCount={messageCount}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        pastSessions={pastSessions}
      />
    </div>
  )
}
