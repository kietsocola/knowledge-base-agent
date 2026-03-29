"use client"

import { Activity, BarChart3, BookMarked, BrainCircuit, Clock3 } from "lucide-react"
import { ActivityTimelineChart } from "@/components/learning/ActivityTimelineChart"
import type { LearningOverview } from "@/types/learning"

interface LearningTrackingDashboardProps {
  overview: LearningOverview
}

function formatMastery(score: number): string {
  return `${Math.round(score * 100)}%`
}

function formatDate(ts: number | null): string {
  if (!ts) return "Chưa có"
  return new Date(ts * 1000).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function LearningTrackingDashboard({ overview }: LearningTrackingDashboardProps) {
  const stats = [
    { label: "Concept đã ghi nhận", value: overview.totalConcepts, Icon: BookMarked },
    { label: "Lượt học tập", value: overview.totalLearningEvents, Icon: Activity },
    { label: "Lượt hỏi đáp", value: overview.totalChatTurns, Icon: BrainCircuit },
    { label: "Lần đánh giá", value: overview.totalEvaluations, Icon: BarChart3 },
  ]

  return (
    <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="font-heading text-2xl font-black">Dashboard tracking học tập</div>
          <div className="mt-1 text-xs text-muted-foreground">
            Tóm tắt các concept đã ghi nhận, mức độ nắm vững và hoạt động gần nhất trong phiên học.
          </div>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-2 text-xs font-semibold text-primary">
          <Clock3 className="h-3.5 w-3.5" />
          Hoạt động gần nhất: {formatDate(overview.latestActivityAt)}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, Icon }) => (
          <div key={label} className="rounded-[1.5rem] border border-white/80 bg-slate-50/80 p-4">
            <div className="flex items-center gap-2 text-primary">
              <Icon className="h-4 w-4" />
              <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                {label}
              </div>
            </div>
            <div className="mt-3 text-3xl font-black">{value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-[1.5rem] border border-rose-100 bg-rose-50/70 p-5">
          <div className="text-sm font-bold text-rose-700">Concept cần tập trung</div>
          <div className="mt-3 space-y-3">
            {overview.focusConcepts.length === 0 ? (
              <div className="text-sm text-rose-700/80">Chưa có concept nào ở mức cần tập trung cao.</div>
            ) : (
              overview.focusConcepts.map((concept) => (
                <div key={concept.conceptName}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{concept.conceptName}</span>
                    <span className="font-semibold">{formatMastery(concept.masteryScore)}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-rose-100">
                    <div className="h-full rounded-full bg-rose-500" style={{ width: `${concept.masteryScore * 100}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-amber-100 bg-amber-50/70 p-5">
          <div className="text-sm font-bold text-amber-700">Concept đang cải thiện</div>
          <div className="mt-3 space-y-3">
            {overview.improvingConcepts.length === 0 ? (
              <div className="text-sm text-amber-700/80">Chưa có concept nào ở vùng trung gian.</div>
            ) : (
              overview.improvingConcepts.map((concept) => (
                <div key={concept.conceptName}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{concept.conceptName}</span>
                    <span className="font-semibold">{formatMastery(concept.masteryScore)}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-amber-100">
                    <div className="h-full rounded-full bg-amber-500" style={{ width: `${concept.masteryScore * 100}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-emerald-100 bg-emerald-50/70 p-5">
          <div className="text-sm font-bold text-emerald-700">Concept đã nắm tốt</div>
          <div className="mt-3 space-y-3">
            {overview.masteredConcepts.length === 0 ? (
              <div className="text-sm text-emerald-700/80">Chưa có concept nào đạt vùng nắm vững.</div>
            ) : (
              overview.masteredConcepts.map((concept) => (
                <div key={concept.conceptName}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{concept.conceptName}</span>
                    <span className="font-semibold">{formatMastery(concept.masteryScore)}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-emerald-100">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${concept.masteryScore * 100}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <ActivityTimelineChart
          data={overview.activityTimeline}
          title="Timeline học tập gần đây"
          description="Theo dõi số lượt hỏi đáp và số lần đánh giá theo từng ngày hoạt động."
        />
      </div>
    </div>
  )
}
