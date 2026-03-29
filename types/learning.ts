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

export interface ClassroomConceptInsight {
  conceptName: string
  averageMasteryScore: number
  studentCount: number
}

export interface ClassroomStudentSnapshot {
  studentId: string
  studentName: string
  totalSessions: number
  totalChatTurns: number
  totalEvaluations: number
  conceptCount: number
  averageMasteryScore: number | null
  focusConceptCount: number
  latestActivityAt: number | null
  needsAttention: boolean
}

export interface ClassroomOverview {
  totalStudents: number
  activeStudents: number
  totalSessions: number
  totalChatTurns: number
  totalEvaluations: number
  latestActivityAt: number | null
  strugglingConcepts: ClassroomConceptInsight[]
  strongestConcepts: ClassroomConceptInsight[]
  studentsNeedingAttention: ClassroomStudentSnapshot[]
  studentSnapshots: ClassroomStudentSnapshot[]
}
