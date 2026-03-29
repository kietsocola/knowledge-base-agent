"use client"

import { useEffect, useState } from "react"
import { Brain, Search, FileText, Pen } from "lucide-react"

const STEPS = [
  { icon: Brain, text: "Đang phân tích câu hỏi…" },
  { icon: Search, text: "Tìm kiếm trong tài liệu môn học…" },
  { icon: FileText, text: "Đọc các đoạn liên quan…" },
  { icon: Pen, text: "Đang soạn câu trả lời…" },
]

interface ThinkingIndicatorProps {
  isVisible: boolean
}

export function ThinkingIndicator({ isVisible }: ThinkingIndicatorProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setShouldReduceMotion(mediaQuery.matches)

    update()
    mediaQuery.addEventListener("change", update)

    return () => mediaQuery.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    if (!isVisible) {
      setStepIndex(0)
      return
    }
    if (shouldReduceMotion) {
      setStepIndex(0)
      return
    }
    const interval = setInterval(() => {
      setStepIndex((i) => (i < STEPS.length - 1 ? i + 1 : i))
    }, 900)
    return () => clearInterval(interval)
  }, [isVisible, shouldReduceMotion])

  const step = STEPS[stepIndex]
  const Icon = step.icon

  if (!isVisible) return null

  return (
    <div
      className="chat-fade-in flex items-start gap-3 px-4 py-2 sm:px-6"
      style={shouldReduceMotion ? undefined : { animationDuration: "160ms" }}
    >
      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/70 bg-card text-primary">
        <Brain className="h-4 w-4" />
      </div>

      <div className="max-w-sm rounded-[1.25rem] border border-border/60 bg-background/92 px-4 py-3 dark:bg-card/88">
        <div
          key={stepIndex}
          className="chat-fade-in flex items-center gap-2 text-sm text-muted-foreground"
          style={shouldReduceMotion ? undefined : { animationDuration: "140ms" }}
        >
          <Icon className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span>{step.text}</span>
        </div>

        <div className="mt-2 flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="chat-dot-pulse h-1.5 w-1.5 rounded-full bg-primary/45"
              style={shouldReduceMotion ? undefined : { animationDelay: `${i * 120}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
