"use client"

import { ArrowRight, BrainCircuit, ClipboardList, Route, Sparkles } from "lucide-react"
import type { StudyPlan } from "@/types/planner"

interface StudyPlanPanelProps {
  plan: StudyPlan
}

const agentTone = {
  "Diagnosis Agent": "bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-200",
  "Planner Agent": "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground",
  "Tutor Agent": "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200",
} as const

export function StudyPlanPanel({ plan }: StudyPlanPanelProps) {
  return (
    <div className="rounded-[2rem] border border-border/70 bg-card/90 p-6 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <Route className="h-4 w-4" />
            <div className="text-sm font-bold">{plan.title}</div>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">{plan.summary}</div>
        </div>
        <div className="rounded-full bg-primary/5 px-4 py-2 text-xs font-bold text-primary">
          {plan.horizonLabel}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {plan.steps.map((step, index) => (
          <div key={step.id} className="rounded-[1.5rem] border border-border/70 bg-accent/40 p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Bước {index + 1}
              </div>
              <div className={`rounded-full px-3 py-1 text-[11px] font-bold ${agentTone[step.agent]}`}>
                {step.agent}
              </div>
            </div>
            <div className="mt-3 text-base font-semibold">{step.title}</div>
            <div className="mt-2 text-sm text-muted-foreground">{step.objective}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.58fr_0.42fr]">
        <div className="rounded-[1.5rem] border border-border/70 bg-accent/40 p-5">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-primary" />
            <div className="text-sm font-bold">Prompt gợi ý cho phiên tiếp theo</div>
          </div>
          <div className="mt-4 space-y-3">
            {plan.suggestedPrompts.map((prompt, index) => (
              <div key={index} className="rounded-[1.2rem] bg-card px-4 py-3 text-sm shadow-sm">
                {prompt}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-border/70 bg-accent/40 p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <div className="text-sm font-bold">Tín hiệu thành công</div>
          </div>
          <div className="mt-4 rounded-[1.2rem] bg-card px-4 py-4 text-sm leading-relaxed shadow-sm">
            {plan.successSignal}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-primary">
            <BrainCircuit className="h-3.5 w-3.5" />
            Planner flow giúp AI chuyển từ trả lời từng câu sang dẫn dắt cả chuỗi học tập.
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
        <ArrowRight className="h-3.5 w-3.5" />
        {"Flow hiện tại: Diagnosis Agent → Planner Agent → Tutor Agent"}
      </div>
    </div>
  )
}
