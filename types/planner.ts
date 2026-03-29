export interface StudyPlanStep {
  id: string
  title: string
  objective: string
  agent: "Diagnosis Agent" | "Planner Agent" | "Tutor Agent"
}

export interface StudyPlan {
  title: string
  summary: string
  horizonLabel: string
  steps: StudyPlanStep[]
  successSignal: string
  suggestedPrompts: string[]
}
