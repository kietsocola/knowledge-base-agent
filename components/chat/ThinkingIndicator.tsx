"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
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
  const shouldReduceMotion = useReducedMotion()

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

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          className="flex items-start gap-4 px-4 py-2 sm:px-8"
        >
          <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm shadow-primary/20">
            <span className="text-[11px] font-bold">AI</span>
          </div>

          <div className="max-w-sm rounded-[1.6rem] rounded-tl-md border border-border/70 bg-card/90 px-5 py-4 shadow-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={stepIndex}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -6 }}
                animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 6 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Icon className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span>{step.text}</span>
              </motion.div>
            </AnimatePresence>

            <div className="flex gap-1 mt-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-primary/40"
                  animate={shouldReduceMotion ? { opacity: 0.8 } : { opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 1.2,
                    repeat: shouldReduceMotion ? 0 : Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
