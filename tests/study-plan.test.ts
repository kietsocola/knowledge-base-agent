import test from "node:test"
import assert from "node:assert/strict"
import { buildStudyPlan } from "@/lib/planner/study-plan"
import type { EvaluationResult } from "@/types/evaluation"
import type { LearningOverview } from "@/types/learning"

function makeEvaluationResult(overrides: Partial<EvaluationResult> = {}): EvaluationResult {
  return {
    overallScore: 4.8,
    strengths: ["Biết mô tả khái niệm cơ bản"],
    gaps: ["Chưa chắc về đệ quy", "Thiếu tự tin khi áp dụng"],
    radarScores: {
      "Hiểu khái niệm": 5,
      "Giải quyết vấn đề": 4,
      "Ghi nhớ kiến thức": 5,
      "Vận dụng thực tế": 4,
      "Tư duy phản biện": 5,
    },
    recommendedTopics: ["Đệ quy", "Heap"],
    nextStepMessage: "Ôn lại đệ quy trước khi làm bài tập nâng cao.",
    ...overrides,
  }
}

function makeOverview(overrides: Partial<LearningOverview> = {}): LearningOverview {
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
    ],
    improvingConcepts: [],
    masteredConcepts: [],
    ...overrides,
  }
}

test("buildStudyPlan creates a remediation-first plan for weak learners", () => {
  const plan = buildStudyPlan(makeEvaluationResult(), makeOverview())

  assert.equal(plan.horizonLabel, "Kế hoạch 24-48 giờ")
  assert.equal(plan.steps.length, 3)
  assert.equal(plan.steps[0]?.agent, "Diagnosis Agent")
  assert.match(plan.summary, /Đệ quy/)
  assert.equal(plan.suggestedPrompts.length, 3)
})

test("buildStudyPlan creates an expansion plan for strong learners", () => {
  const plan = buildStudyPlan(
    makeEvaluationResult({
      overallScore: 8.6,
      gaps: [],
      recommendedTopics: ["Đồ thị", "DFS"],
    }),
    makeOverview({
      totalEvaluations: 2,
      focusConcepts: [],
      masteredConcepts: [
        { conceptName: "Mảng", masteryScore: 0.82, confidenceScore: 0.8, updatedAt: 123451 },
      ],
    })
  )

  assert.equal(plan.horizonLabel, "Kế hoạch mở rộng 2-3 phiên")
  assert.match(plan.summary, /Đồ thị/)
  assert.match(plan.successSignal, /mastered/)
})
