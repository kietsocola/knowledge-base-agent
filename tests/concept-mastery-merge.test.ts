import test from "node:test"
import assert from "node:assert/strict"
import { mergeConceptMastery } from "@/lib/learning/mastery"

test("mergeConceptMastery initializes the first mastery record", () => {
  const merged = mergeConceptMastery(null, {
    masteryScore: 0.35,
    confidenceScore: 0.75,
  })

  assert.deepEqual(merged, {
    masteryScore: 0.35,
    confidenceScore: 0.75,
    evidenceCount: 1,
  })
})

test("mergeConceptMastery averages new evidence into the running mastery score", () => {
  const merged = mergeConceptMastery(
    {
      masteryScore: 0.2,
      confidenceScore: 0.6,
      evidenceCount: 2,
    },
    {
      masteryScore: 0.5,
      confidenceScore: 0.75,
    }
  )

  assert.equal(merged.masteryScore, 0.3)
  assert.equal(merged.confidenceScore, 0.75)
  assert.equal(merged.evidenceCount, 3)
})
