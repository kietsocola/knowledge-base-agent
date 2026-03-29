import test from "node:test"
import assert from "node:assert/strict"
import { buildSidebarLearningSummary } from "@/lib/learning/sidebar-summary"
import type { LearningOverview } from "@/types/learning"

function makeOverview(overrides: Partial<LearningOverview> = {}): LearningOverview {
  return {
    totalConcepts: 4,
    totalLearningEvents: 6,
    totalChatTurns: 5,
    totalEvaluations: 1,
    latestActivityAt: 123456,
    activityTimeline: [],
    interventionAlerts: [],
    focusConcepts: [
      { conceptName: "Cây AVL", masteryScore: 0.25, confidenceScore: 0.8, updatedAt: 120 },
    ],
    improvingConcepts: [
      { conceptName: "Đệ quy", masteryScore: 0.62, confidenceScore: 0.8, updatedAt: 121 },
    ],
    masteredConcepts: [
      { conceptName: "Mảng", masteryScore: 0.82, confidenceScore: 0.9, updatedAt: 122 },
    ],
    ...overrides,
  }
}

test("buildSidebarLearningSummary prioritizes focus concepts when present", () => {
  const summary = buildSidebarLearningSummary(makeOverview())

  assert.equal(summary.primaryLabel, "Cần tập trung")
  assert.equal(summary.primaryConcept, "Cây AVL")
  assert.equal(summary.secondaryLabel, "Đang cải thiện")
})

test("buildSidebarLearningSummary falls back to improving concepts", () => {
  const summary = buildSidebarLearningSummary(
    makeOverview({
      focusConcepts: [],
    })
  )

  assert.equal(summary.primaryLabel, "Đang cải thiện")
  assert.equal(summary.primaryConcept, "Đệ quy")
})

test("buildSidebarLearningSummary falls back to mastered concepts when there is no weaker concept", () => {
  const summary = buildSidebarLearningSummary(
    makeOverview({
      focusConcepts: [],
      improvingConcepts: [],
    })
  )

  assert.equal(summary.primaryLabel, "Đã nắm tốt")
  assert.equal(summary.primaryConcept, "Mảng")
})
