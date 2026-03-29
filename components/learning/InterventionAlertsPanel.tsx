"use client"

import { AlertTriangle, BellRing, CheckCircle2 } from "lucide-react"
import type { InterventionAlert } from "@/types/learning"

interface InterventionAlertsPanelProps {
  alerts: InterventionAlert[]
  title: string
  description: string
}

const alertTone = {
  high: {
    container: "border-rose-200/70 bg-rose-50/80 dark:border-rose-400/20 dark:bg-rose-950/20",
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-200",
    icon: AlertTriangle,
  },
  medium: {
    container: "border-amber-200/70 bg-amber-50/80 dark:border-amber-400/20 dark:bg-amber-950/20",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-200",
    icon: BellRing,
  },
  low: {
    container: "border-emerald-200/70 bg-emerald-50/80 dark:border-emerald-400/20 dark:bg-emerald-950/20",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200",
    icon: CheckCircle2,
  },
} satisfies Record<InterventionAlert["severity"], {
  container: string
  badge: string
  icon: typeof AlertTriangle
}>

export function InterventionAlertsPanel({
  alerts,
  title,
  description,
}: InterventionAlertsPanelProps) {
  return (
    <div className="paper-surface rounded-[2rem] p-6">
      <div>
        <div className="section-label">Intervention</div>
        <div className="mt-3 text-sm font-bold">{title}</div>
        <div className="mt-1 text-xs text-muted-foreground">{description}</div>
      </div>

      <div className="mt-5 space-y-4">
        {alerts.map((alert) => {
          const tone = alertTone[alert.severity]
          const Icon = tone.icon

          return (
            <div key={alert.id} className={`rounded-[1.5rem] border p-5 ${tone.container}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-2xl border border-border/50 bg-card/80 p-2">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold">{alert.title}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{alert.summary}</div>
                  </div>
                </div>
                <div className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${tone.badge}`}>
                  {alert.severity === "high" ? "Cảnh báo cao" : alert.severity === "medium" ? "Cần lưu ý" : "Ổn định"}
                </div>
              </div>

              <div className="mt-4 rounded-[1.1rem] border border-border/50 bg-card/80 px-4 py-3 text-sm">
                <span className="font-semibold">Hành động đề xuất:</span> {alert.recommendedAction}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
