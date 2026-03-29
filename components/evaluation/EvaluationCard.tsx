"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, AlertCircle, BookOpen, ArrowRight, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { EvaluationRadarChart } from "./RadarChart"
import { LearningTrackingDashboard } from "./LearningTrackingDashboard"
import { buildSupportPlan } from "@/lib/evaluation/support-plan"
import type { EvaluationResult } from "@/types/evaluation"
import type { LearningOverview } from "@/types/learning"

interface EvaluationCardProps {
  result: EvaluationResult
  overview: LearningOverview
  sessionId: string
  studentName: string
  courseName: string
}

function CountUpScore({ target }: { target: number }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const duration = 1200
    const steps = 40
    const increment = target / steps
    let step = 0
    const timer = setInterval(() => {
      step++
      setCurrent(Math.min(Math.round(increment * step * 10) / 10, target))
      if (step >= steps) clearInterval(timer)
    }, duration / steps)
    return () => clearInterval(timer)
  }, [target])

  return <>{current.toFixed(1)}</>
}

export function EvaluationCard({
  result,
  overview,
  sessionId,
  studentName,
  courseName,
}: EvaluationCardProps) {
  const supportPlan = buildSupportPlan(result)
  const supportTone = {
    high: {
      badge: "bg-rose-100 text-rose-700",
      dot: "bg-rose-500",
      border: "border-rose-100",
    },
    medium: {
      badge: "bg-amber-100 text-amber-700",
      dot: "bg-amber-500",
      border: "border-amber-100",
    },
    low: {
      badge: "bg-emerald-100 text-emerald-700",
      dot: "bg-emerald-500",
      border: "border-emerald-100",
    },
  }[supportPlan.level]

  return (
    <div className="min-h-screen px-4 pb-12 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-muted-foreground">
              Kết quả học tập
            </div>
            <h1 className="mt-2 font-heading text-4xl font-black tracking-tight">
              Báo cáo đánh giá
            </h1>
            <div className="mt-2 text-sm text-muted-foreground">
              {studentName} · {courseName}
            </div>
          </div>
          <div className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold text-emerald-700">
            Hoàn thành phân tích
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-[#0066ff] p-8 text-white shadow-[0_24px_70px_rgba(0,80,203,0.24)]"
        >
          <div className="grid gap-8 lg:grid-cols-[0.72fr_0.28fr] lg:items-center">
            <div className="flex items-start gap-5">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-3xl bg-white/20">
                <BookOpen className="h-8 w-8" />
              </div>
              <div>
                <div className="text-sm font-semibold text-blue-50/80">Gợi ý từ AI</div>
                <div className="mt-2 max-w-3xl text-lg font-medium leading-relaxed text-blue-50">
                  "{result.nextStepMessage}"
                </div>
              </div>
            </div>
            <div className="rounded-[1.75rem] bg-white/12 p-6 backdrop-blur-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
                Điểm tổng thể
              </div>
              <div className="mt-3 text-6xl font-black tabular-nums">
                <CountUpScore target={result.overallScore} />
              </div>
              <div className="mt-1 text-xs text-white/70">/ 10 đánh giá tổng quan</div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-8 rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-sm"
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <div className="font-heading text-2xl font-black">Biểu đồ năng lực</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Tổng hợp mức độ nắm vững theo từng kỹ năng.
                </div>
              </div>
              <div className="rounded-full bg-muted px-4 py-2 text-xs font-bold text-primary">
                Session hiện tại
              </div>
            </div>
            <EvaluationRadarChart scores={result.radarScores} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="lg:col-span-4 space-y-4"
          >
            <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <div className="text-sm font-bold">Điểm mạnh</div>
              </div>
              <ul className="space-y-3">
                {result.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
                    <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <div className="text-sm font-bold">Cần cải thiện</div>
              </div>
              <ul className="space-y-3">
                {result.gaps.map((g, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
                    <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {result.recommendedTopics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-sm"
          >
            <div className="mb-4 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <div className="text-sm font-bold">Chủ đề nên ôn luyện</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.recommendedTopics.map((topic, i) => (
                <Badge key={i} variant="secondary" className="rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                  {topic}
                </Badge>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.33 }}
        >
          <LearningTrackingDashboard overview={overview} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className={`rounded-[2rem] border ${supportTone.border} bg-white/85 p-6 shadow-sm`}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <div className="text-sm font-bold">Phương án hỗ trợ đề xuất</div>
              </div>
              <div className="text-sm text-muted-foreground">
                {supportPlan.summary}
              </div>
            </div>
            <div className={`rounded-full px-4 py-2 text-xs font-bold ${supportTone.badge}`}>
              {supportPlan.title}
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {supportPlan.actions.map((action, index) => (
              <div key={index} className="flex items-start gap-3 text-sm leading-relaxed">
                <div className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${supportTone.dot}`} />
                <div>{action}</div>
              </div>
            ))}
          </div>

          {supportPlan.shouldEscalateToInstructor && (
            <div className="mt-5 rounded-[1.25rem] bg-rose-50 px-4 py-3 text-sm text-rose-700">
              Nên chuẩn bị câu hỏi cụ thể và trao đổi thêm với giảng viên để được hỗ trợ trực tiếp.
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3"
        >
          <a href={`/chat/${sessionId}`}>
            <Button variant="outline" className="gap-2 rounded-full bg-white px-6">
              <MessageSquare className="w-4 h-4" />
              Tiếp tục hỏi đáp
            </Button>
          </a>
          <a href="/portal">
            <Button className="gap-2 rounded-full px-6">
              Bắt đầu phiên mới
              <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
        </motion.div>

        <div className="pb-4 text-center text-[10px] text-muted-foreground">
          Đánh giá bởi GPT-4o-mini · WellStudy AI Demo
        </div>
      </div>
    </div>
  )
}
