"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { LearningTimelinePoint } from "@/types/learning"

interface ActivityTimelineChartProps {
  data: LearningTimelinePoint[]
  title: string
  description: string
}

export function ActivityTimelineChart({
  data,
  title,
  description,
}: ActivityTimelineChartProps) {
  return (
    <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-sm">
      <div>
        <div className="text-sm font-bold">{title}</div>
        <div className="mt-1 text-xs text-muted-foreground">{description}</div>
      </div>

      {data.length === 0 ? (
        <div className="mt-5 rounded-[1.5rem] bg-slate-50 px-4 py-8 text-center text-sm text-muted-foreground">
          Chưa có đủ sự kiện học tập để vẽ timeline.
        </div>
      ) : (
        <div className="mt-5 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={10}>
              <CartesianGrid stroke="var(--border)" vertical={false} strokeOpacity={0.45} />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              />
              <Tooltip
                cursor={{ fill: "rgba(15, 23, 42, 0.04)" }}
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="chatTurns"
                name="Lượt hỏi đáp"
                fill="var(--primary)"
                radius={[10, 10, 0, 0]}
              />
              <Bar
                dataKey="evaluations"
                name="Lần đánh giá"
                fill="#14b8a6"
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
