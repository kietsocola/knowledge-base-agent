export interface LearningConceptSnapshot {
  conceptName: string
  masteryScore: number
  confidenceScore: number
  updatedAt: number | null
}

export interface LearningEventSnapshot {
  eventType: string
  createdAt: number | null
}

export interface LearningOverview {
  totalConcepts: number
  totalLearningEvents: number
  totalChatTurns: number
  totalEvaluations: number
  latestActivityAt: number | null
  focusConcepts: LearningConceptSnapshot[]
  improvingConcepts: LearningConceptSnapshot[]
  masteredConcepts: LearningConceptSnapshot[]
}
