import test from "node:test"
import assert from "node:assert/strict"
import { buildConceptMasterySignals, toConceptKey } from "@/lib/learning/concepts"
import type { EvaluationResult } from "@/types/evaluation"

function makeEvaluation(overrides: Partial<EvaluationResult> = {}): EvaluationResult {
  return {
    overallScore: 6.5,
    strengths: ["Hiểu khá rõ về vòng lặp"],
    gaps: ["Còn yếu phần cấu trúc dữ liệu cây"],
    radarScores: {
      "Hiểu khái niệm": 6,
      "Giải quyết vấn đề": 6,
      "Ghi nhớ kiến thức": 7,
      "Vận dụng thực tế": 6,
      "Tư duy phản biện": 6,
    },
    recommendedTopics: ["Cây nhị phân", "Đệ quy"],
    nextStepMessage: "Ôn lại phần cây nhị phân",
    ...overrides,
  }
}

test("toConceptKey normalizes accents, punctuation, and spacing", () => {
  assert.equal(toConceptKey("  Cây nhị   phân! "), "cay-nhi-phan")
})

test("buildConceptMasterySignals creates low-mastery signals from recommended topics", () => {
  const signals = buildConceptMasterySignals(makeEvaluation())

  assert.equal(signals.length, 2)
  assert.deepEqual(
    signals.map((signal) => signal.conceptName),
    ["Cây nhị phân", "Đệ quy"]
  )
  assert.ok(signals.every((signal) => signal.masteryScore <= 0.5))
  assert.ok(signals.every((signal) => signal.confidenceScore > 0))
})

test("buildConceptMasterySignals deduplicates repeated concepts by key", () => {
  const signals = buildConceptMasterySignals(
    makeEvaluation({
      recommendedTopics: ["Đệ quy", "de quy", "Đệ   quy"],
    })
  )

  assert.equal(signals.length, 1)
  assert.equal(signals[0].conceptKey, "de-quy")
})

test("buildConceptMasterySignals falls back to gap text when recommendations are missing", () => {
  const signals = buildConceptMasterySignals(
    makeEvaluation({
      recommendedTopics: [],
      gaps: ["Đồ thị có trọng số", "Tìm đường đi ngắn nhất"],
    })
  )

  assert.deepEqual(
    signals.map((signal) => signal.conceptName),
    ["Đồ thị có trọng số", "Tìm đường đi ngắn nhất"]
  )
})
