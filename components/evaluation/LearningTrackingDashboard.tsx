"use client"

import { Activity, BarChart3, BookMarked, BrainCircuit, Clock3 } from "lucide-react"
import { ActivityTimelineChart } from "@/components/learning/ActivityTimelineChart"
import { InterventionAlertsPanel } from "@/components/learning/InterventionAlertsPanel"
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
    <div className="paper-surface rounded-[2rem] p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="section-label">Learning tracking</div>
          <div className="mt-3 font-heading text-2xl font-black">Dashboard tracking học tập</div>
          <div className="mt-1 text-xs text-muted-foreground">
            Tóm tắt các concept đã ghi nhận, mức độ nắm vững và hoạt động gần nhất trong phiên học.
          </div>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-4 py-2 text-xs font-semibold text-primary">
          <Clock3 className="h-3.5 w-3.5" />
          Hoạt động gần nhất: {formatDate(overview.latestActivityAt)}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, Icon }) => (
          <div key={label} className="metric-tile rounded-[1.5rem] p-4">
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
        <div className="rounded-[1.5rem] border border-rose-200/70 bg-rose-50/80 p-5 dark:border-rose-400/20 dark:bg-rose-950/20">
          <div className="text-sm font-bold text-rose-700 dark:text-rose-200">Concept cần tập trung</div>
          <div className="mt-3 space-y-3">
            {overview.focusConcepts.length === 0 ? (
              <div className="text-sm text-rose-700/80 dark:text-rose-200/75">Chưa có concept nào ở mức cần tập trung cao.</div>
            ) : (
              overview.focusConcepts.map((concept) => (
                <div key={concept.conceptName}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{concept.conceptName}</span>
                    <span className="font-semibold">{formatMastery(concept.masteryScore)}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-rose-100 dark:bg-rose-400/15">
                    <div className="h-full rounded-full bg-rose-500 dark:bg-rose-300" style={{ width: `${concept.masteryScore * 100}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-amber-200/70 bg-amber-50/80 p-5 dark:border-amber-400/20 dark:bg-amber-950/20">
          <div className="text-sm font-bold text-amber-700 dark:text-amber-200">Concept đang cải thiện</div>
          <div className="mt-3 space-y-3">
            {overview.improvingConcepts.length === 0 ? (
              <div className="text-sm text-amber-700/80 dark:text-amber-200/75">Chưa có concept nào ở vùng trung gian.</div>
            ) : (
              overview.improvingConcepts.map((concept) => (
                <div key={concept.conceptName}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{concept.conceptName}</span>
                    <span className="font-semibold">{formatMastery(concept.masteryScore)}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-amber-100 dark:bg-amber-400/15">
                    <div className="h-full rounded-full bg-amber-500 dark:bg-amber-300" style={{ width: `${concept.masteryScore * 100}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-emerald-200/70 bg-emerald-50/80 p-5 dark:border-emerald-400/20 dark:bg-emerald-950/20">
          <div className="text-sm font-bold text-emerald-700 dark:text-emerald-200">Concept đã nắm tốt</div>
          <div className="mt-3 space-y-3">
            {overview.masteredConcepts.length === 0 ? (
              <div className="text-sm text-emerald-700/80 dark:text-emerald-200/75">Chưa có concept nào đạt vùng nắm vững.</div>
            ) : (
              overview.masteredConcepts.map((concept) => (
                <div key={concept.conceptName}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{concept.conceptName}</span>
                    <span className="font-semibold">{formatMastery(concept.masteryScore)}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-emerald-100 dark:bg-emerald-400/15">
                    <div className="h-full rounded-full bg-emerald-500 dark:bg-emerald-300" style={{ width: `${concept.masteryScore * 100}%` }} />
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

      <div className="mt-6">
        <InterventionAlertsPanel
          alerts={overview.interventionAlerts}
          title="Cảnh báo sớm và phương án can thiệp"
          description="Các tín hiệu cần chú ý được suy ra từ nhịp học gần đây, concept yếu và checkpoint đánh giá."
        />
      </div>
    </div>
  )
}
