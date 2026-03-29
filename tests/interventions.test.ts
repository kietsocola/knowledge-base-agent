import test from "node:test"
import assert from "node:assert/strict"
import {
  buildClassroomInterventionAlerts,
  buildLearnerInterventionAlerts,
} from "@/lib/learning/interventions"
import type { ClassroomOverview, LearningOverview } from "@/types/learning"

function makeLearningOverview(overrides: Partial<LearningOverview> = {}): LearningOverview {
  return {
    totalConcepts: 3,
    totalLearningEvents: 5,
    totalChatTurns: 4,
    totalEvaluations: 0,
    latestActivityAt: 123456,
    activityTimeline: [
      { dateKey: "2026-03-29", label: "29/03", totalEvents: 4, chatTurns: 4, evaluations: 0 },
    ],
    interventionAlerts: [],
    focusConcepts: [
      { conceptName: "Đệ quy", masteryScore: 0.3, confidenceScore: 0.8, updatedAt: 123450 },
      { conceptName: "Heap", masteryScore: 0.42, confidenceScore: 0.7, updatedAt: 123451 },
    ],
    improvingConcepts: [],
    masteredConcepts: [],
    ...overrides,
  }
}

function makeClassroomOverview(overrides: Partial<ClassroomOverview> = {}): ClassroomOverview {
  return {
    totalStudents: 5,
    activeStudents: 3,
    totalSessions: 6,
    totalChatTurns: 12,
    totalEvaluations: 2,
    latestActivityAt: 123456,
    activityTimeline: [],
    interventionAlerts: [],
    strugglingConcepts: [
      { conceptName: "Đồ thị", averageMasteryScore: 0.4, studentCount: 3 },
    ],
    strongestConcepts: [],
    studentsNeedingAttention: [
      {
        studentId: "student-001",
        studentName: "An",
        totalSessions: 2,
        totalChatTurns: 4,
        totalEvaluations: 0,
        conceptCount: 2,
        averageMasteryScore: 0.45,
        focusConceptCount: 1,
        latestActivityAt: 123450,
        needsAttention: true,
      },
      {
        studentId: "student-002",
        studentName: "Bình",
        totalSessions: 1,
        totalChatTurns: 2,
        totalEvaluations: 0,
        conceptCount: 1,
        averageMasteryScore: 0.38,
        focusConceptCount: 1,
        latestActivityAt: 123451,
        needsAttention: true,
      },
    ],
    studentSnapshots: [],
    ...overrides,
  }
}

test("buildLearnerInterventionAlerts surfaces high-priority gaps and missing evaluation", () => {
  const alerts = buildLearnerInterventionAlerts(makeLearningOverview())

  assert.equal(alerts[0]?.severity, "high")
  assert.equal(alerts[0]?.id, "missing-evaluation")
  assert.equal(alerts[1]?.id, "critical-concept-gap")
})

test("buildLearnerInterventionAlerts falls back to stable progress when there is no risk", () => {
  const alerts = buildLearnerInterventionAlerts(
    makeLearningOverview({
      totalChatTurns: 2,
      totalEvaluations: 1,
      activityTimeline: [
        { dateKey: "2026-03-29", label: "29/03", totalEvents: 3, chatTurns: 2, evaluations: 1 },
      ],
      focusConcepts: [],
      improvingConcepts: [
        { conceptName: "Cây AVL", masteryScore: 0.64, confidenceScore: 0.8, updatedAt: 123450 },
      ],
      masteredConcepts: [
        { conceptName: "Mảng", masteryScore: 0.82, confidenceScore: 0.8, updatedAt: 123451 },
      ],
    })
  )

  assert.equal(alerts.length, 1)
  assert.equal(alerts[0]?.severity, "low")
  assert.equal(alerts[0]?.id, "stable-progress")
})

test("buildClassroomInterventionAlerts detects class-wide support pressure", () => {
  const alerts = buildClassroomInterventionAlerts(makeClassroomOverview())

  assert.equal(alerts[0]?.severity, "high")
  assert.equal(alerts[0]?.id, "class-high-attention-ratio")
  assert.equal(alerts[1]?.id, "class-bottleneck-concept")
})

test("buildClassroomInterventionAlerts falls back to stable classroom state", () => {
  const alerts = buildClassroomInterventionAlerts(
    makeClassroomOverview({
      totalStudents: 4,
      activeStudents: 4,
      studentsNeedingAttention: [],
      strugglingConcepts: [
        { conceptName: "Mảng", averageMasteryScore: 0.78, studentCount: 2 },
      ],
    })
  )

  assert.equal(alerts.length, 1)
  assert.equal(alerts[0]?.id, "class-stable")
})
