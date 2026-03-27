"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import type { RadarScores } from "@/types/evaluation"

interface RadarChartProps {
  scores: RadarScores
}

export function EvaluationRadarChart({ scores }: RadarChartProps) {
  const [animated, setAnimated] = useState(false)
  const [displayedScores, setDisplayedScores] = useState<RadarScores>({
    "Hiểu khái niệm": 0,
    "Giải quyết vấn đề": 0,
    "Ghi nhớ kiến thức": 0,
    "Vận dụng thực tế": 0,
    "Tư duy phản biện": 0,
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayedScores(scores)
      setAnimated(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [scores])

  const data = Object.entries(displayedScores).map(([subject, value]) => ({
    subject,
    value: animated ? value : 0,
    fullMark: 10,
  }))

  const primaryColor = "var(--primary)"
  const borderColor = "var(--border)"
  const mutedColor = "var(--muted-foreground)"

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full h-72"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
          <PolarGrid
            stroke={borderColor}
            strokeOpacity={0.6}
          />
          <PolarAngleAxis
            dataKey="subject"
            tick={{
              fill: mutedColor,
              fontSize: 11,
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              fontSize: 12,
            }}
            formatter={(value) => [`${value}/10`, "Diem"]}
          />
          <Radar
            name="Diem"
            dataKey="value"
            stroke={primaryColor}
            fill={primaryColor}
            fillOpacity={0.25}
            strokeWidth={2}
            isAnimationActive={true}
            animationDuration={800}
            animationEasing="ease-out"
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
