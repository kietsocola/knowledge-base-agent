"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, AlertCircle, BookOpen, ArrowRight, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { EvaluationRadarChart } from "./RadarChart"
import type { EvaluationResult } from "@/types/evaluation"

interface EvaluationCardProps {
  result: EvaluationResult
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
  sessionId,
  studentName,
  courseName,
}: EvaluationCardProps) {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-1"
        >
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            Kết Quả Đánh Giá Năng Lực
          </div>
          <h1 className="text-2xl font-bold">{studentName}</h1>
          <div className="text-sm text-muted-foreground">{courseName}</div>
        </motion.div>

        {/* Overall score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="pt-6 pb-4">
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <div className="text-5xl font-bold tabular-nums text-primary">
                    <CountUpScore target={result.overallScore} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">/ 10 điểm tổng thể</div>
                </div>
                <div
                  className="h-16 w-px bg-border"
                  aria-hidden
                />
                <div className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                  {result.nextStepMessage}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Radar chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-sm font-semibold">Biểu Đồ Năng Lực</CardTitle>
            </CardHeader>
            <CardContent>
              <EvaluationRadarChart scores={result.radarScores} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Strengths + Gaps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Điểm Mạnh
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  Cần Cải Thiện
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.gaps.map((g, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                      {g}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recommended topics */}
        {result.recommendedTopics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  Chủ Đề Nên Ôn Luyện
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {result.recommendedTopics.map((topic, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex gap-3 justify-center"
        >
          <a href={`/chat/${sessionId}`}>
            <Button variant="outline" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Tiếp tục hỏi đáp
            </Button>
          </a>
          <a href="/portal">
            <Button className="gap-2">
              Bắt đầu phiên mới
              <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
        </motion.div>

        {/* Footer */}
        <div className="text-center text-[10px] text-muted-foreground pb-4">
          Đánh giá bởi GPT-4o-mini · KB Agent Demo
        </div>
      </div>
    </div>
  )
}
