import test from "node:test"
import assert from "node:assert/strict"
import { buildSupportPlan } from "@/lib/evaluation/support-plan"
import type { EvaluationResult } from "@/types/evaluation"

function makeResult(overrides: Partial<EvaluationResult> = {}): EvaluationResult {
  return {
    overallScore: 7,
    strengths: ["Nắm được khái niệm cơ bản"],
    gaps: ["Chưa chắc phần tối ưu"],
    radarScores: {
      "Hiểu khái niệm": 7,
      "Giải quyết vấn đề": 7,
      "Ghi nhớ kiến thức": 7,
      "Vận dụng thực tế": 7,
      "Tư duy phản biện": 7,
    },
    recommendedTopics: ["Quy hoạch động", "Độ phức tạp"],
    nextStepMessage: "Tiếp tục ôn tập",
    ...overrides,
  }
}

test("buildSupportPlan marks low-score learners for high-priority support", () => {
  const plan = buildSupportPlan(
    makeResult({
      overallScore: 4.5,
      gaps: ["Thiếu nền tảng", "Chưa hiểu ví dụ", "Lúng túng khi áp dụng"],
    })
  )

  assert.equal(plan.level, "high")
  assert.equal(plan.shouldEscalateToInstructor, true)
  assert.ok(plan.actions.some((action) => /giảng viên/i.test(action)))
})

test("buildSupportPlan creates a guided self-study plan for medium-priority learners", () => {
  const plan = buildSupportPlan(
    makeResult({
      overallScore: 6.8,
      gaps: ["Cần luyện thêm bài tập"],
    })
  )

  assert.equal(plan.level, "medium")
  assert.equal(plan.shouldEscalateToInstructor, false)
  assert.ok(plan.actions.some((action) => /ôn lại/i.test(action)))
})

test("buildSupportPlan encourages extension work for strong learners", () => {
  const plan = buildSupportPlan(
    makeResult({
      overallScore: 8.8,
      gaps: [],
      recommendedTopics: ["Thiết kế bài tập nâng cao"],
    })
  )

  assert.equal(plan.level, "low")
  assert.equal(plan.shouldEscalateToInstructor, false)
  assert.ok(plan.actions.some((action) => /nâng cao|mở rộng/i.test(action)))
})
