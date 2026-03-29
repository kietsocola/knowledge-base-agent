"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { BarChart3, Loader2, AlertCircle } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { EvaluationCard } from "./EvaluationCard"
import type { EvaluationResult } from "@/types/evaluation"
import type { LearningOverview } from "@/types/learning"

interface EvaluationLoaderProps {
  sessionId: string
  studentName: string
  courseName: string
  viewerRole?: "learner" | "instructor" | "admin"
}

export function EvaluationLoader({
  sessionId,
  studentName,
  courseName,
  viewerRole,
}: EvaluationLoaderProps) {
  const [result, setResult] = useState<EvaluationResult | null>(null)
  const [overview, setOverview] = useState<LearningOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  const LOADING_STEPS = [
    "Đang phân tích hội thoại…",
    "Đánh giá năng lực nhận thức…",
    "Tính toán điểm số…",
    "Tạo báo cáo chi tiết…",
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined

    async function fetchEvaluation() {
      if (!shouldReduceMotion) {
        interval = setInterval(() => {
          setStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1))
        }, 800)
      }

      try {
        const [evaluationRes, overviewRes] = await Promise.all([
          fetch("/api/evaluation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId }),
          }),
          fetch(`/api/learning/overview?sessionId=${sessionId}`),
        ])

        if (!evaluationRes.ok) {
          const err = await evaluationRes.json() as { error?: string }
          throw new Error(err.error ?? "Evaluation failed")
        }

        if (!overviewRes.ok) {
          const err = await overviewRes.json() as { error?: string }
          throw new Error(err.error ?? "Learning overview failed")
        }

        const [evaluationData, overviewData] = await Promise.all([
          evaluationRes.json() as Promise<EvaluationResult>,
          overviewRes.json() as Promise<LearningOverview>,
        ])

        setResult(evaluationData)
        setOverview(overviewData)
      } catch (err) {
        setError(String(err))
      } finally {
        if (interval) clearInterval(interval)
        setLoading(false)
      }
    }

    fetchEvaluation()
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [sessionId, shouldReduceMotion])

  if (loading) {
    return (
      <div id="main-content" className="soft-grid flex min-h-screen items-center justify-center px-4 py-12">
        <div className="paper-surface w-full max-w-xl rounded-[2rem] p-6 text-center sm:p-8">
          <motion.div
            animate={shouldReduceMotion ? { opacity: 1 } : { rotate: 360 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 2, repeat: Infinity, ease: "linear" }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"
          >
            <BarChart3 className="h-8 w-8" />
          </motion.div>
          <div className="mt-6 space-y-2 text-center">
            <div className="font-heading text-2xl font-black">Đang phân tích năng lực học tập</div>
            <div className="mx-auto max-w-sm text-sm text-muted-foreground">
              AI đang tổng hợp lịch sử hỏi đáp, chấm điểm các kỹ năng và tạo báo cáo cá nhân hóa.
            </div>
          </div>
          <motion.div
            key={step}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 4 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="mt-4 text-sm text-primary"
          >
            {LOADING_STEPS[step]}
          </motion.div>
          <div className="mt-6 flex justify-center gap-1">
            {LOADING_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i <= step ? "w-8 bg-primary" : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div id="main-content" className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <div className="space-y-1 text-center">
          <div className="font-semibold">Không thể tạo đánh giá</div>
          <div className="max-w-sm text-sm text-muted-foreground">{error}</div>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/chat/${sessionId}`}
            className={buttonVariants({ variant: "outline" })}
          >
            ← Quay lại chat
          </Link>
          <Button onClick={() => window.location.reload()}>Thử lại</Button>
        </div>
      </div>
    )
  }

  if (!result || !overview) return null

  return (
    <EvaluationCard
      result={result}
      overview={overview}
      sessionId={sessionId}
      studentName={studentName}
      courseName={courseName}
      viewerRole={viewerRole}
    />
  )
}
