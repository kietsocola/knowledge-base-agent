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
    container: "border-rose-100 bg-rose-50/70",
    badge: "bg-rose-100 text-rose-700",
    icon: AlertTriangle,
  },
  medium: {
    container: "border-amber-100 bg-amber-50/70",
    badge: "bg-amber-100 text-amber-700",
    icon: BellRing,
  },
  low: {
    container: "border-emerald-100 bg-emerald-50/70",
    badge: "bg-emerald-100 text-emerald-700",
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
    <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-sm">
      <div>
        <div className="text-sm font-bold">{title}</div>
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
                  <div className="mt-0.5 rounded-2xl bg-white/80 p-2">
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

              <div className="mt-4 rounded-[1.1rem] bg-white/80 px-4 py-3 text-sm">
                <span className="font-semibold">Hành động đề xuất:</span> {alert.recommendedAction}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
