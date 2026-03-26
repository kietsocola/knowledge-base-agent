"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { BarChart3, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EvaluationCard } from "./EvaluationCard"
import type { EvaluationResult } from "@/types/evaluation"

interface EvaluationLoaderProps {
  sessionId: string
  studentName: string
  courseName: string
}

export function EvaluationLoader({
  sessionId,
  studentName,
  courseName,
}: EvaluationLoaderProps) {
  const [result, setResult] = useState<EvaluationResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(0)

  const LOADING_STEPS = [
    "Đang phân tích hội thoại...",
    "Đánh giá năng lực nhận thức...",
    "Tính toán điểm số...",
    "Tạo báo cáo chi tiết...",
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout

    async function fetchEvaluation() {
      interval = setInterval(() => {
        setStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1))
      }, 800)

      try {
        const res = await fetch("/api/evaluation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        })

        if (!res.ok) {
          const err = await res.json() as { error?: string }
          throw new Error(err.error ?? "Evaluation failed")
        }

        const data = await res.json() as EvaluationResult
        setResult(data)
      } catch (err) {
        setError(String(err))
      } finally {
        clearInterval(interval)
        setLoading(false)
      }
    }

    fetchEvaluation()
    return () => clearInterval(interval)
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <BarChart3 className="w-10 h-10 text-primary" />
        </motion.div>
        <div className="text-center space-y-2">
          <div className="font-semibold">Đang phân tích năng lực học tập</div>
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-muted-foreground"
          >
            {LOADING_STEPS[step]}
          </motion.div>
        </div>
        <div className="flex gap-1">
          {LOADING_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i <= step ? "w-6 bg-primary" : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-10 h-10 text-destructive" />
        <div className="text-center space-y-1">
          <div className="font-semibold">Không thể tạo đánh giá</div>
          <div className="text-sm text-muted-foreground max-w-sm">{error}</div>
        </div>
        <div className="flex gap-3">
          <a href={`/chat/${sessionId}`}>
            <Button variant="outline">← Quay lại chat</Button>
          </a>
          <Button onClick={() => window.location.reload()}>Thử lại</Button>
        </div>
      </div>
    )
  }

  if (!result) return null

  return (
    <EvaluationCard
      result={result}
      sessionId={sessionId}
      studentName={studentName}
      courseName={courseName}
    />
  )
}
