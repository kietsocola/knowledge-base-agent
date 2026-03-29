import test from "node:test"
import assert from "node:assert/strict"
import { buildLearningOverview } from "@/lib/learning/overview"

test("buildLearningOverview groups concepts by mastery bands and counts events", () => {
  const overview = buildLearningOverview({
    concepts: [
      { conceptName: "Cây nhị phân", masteryScore: 0.32, confidenceScore: 0.7, updatedAt: 100 },
      { conceptName: "Đệ quy", masteryScore: 0.58, confidenceScore: 0.8, updatedAt: 110 },
      { conceptName: "Đồ thị", masteryScore: 0.82, confidenceScore: 0.9, updatedAt: 120 },
    ],
    events: [
      { eventType: "chat_turn_recorded", createdAt: 100 },
      { eventType: "chat_turn_recorded", createdAt: 101 },
      { eventType: "evaluation_generated", createdAt: 102 },
    ],
  })

  assert.equal(overview.totalConcepts, 3)
  assert.equal(overview.totalLearningEvents, 3)
  assert.equal(overview.totalChatTurns, 2)
  assert.equal(overview.totalEvaluations, 1)
  assert.equal(overview.masteredConcepts.length, 1)
  assert.equal(overview.focusConcepts.length, 1)
  assert.equal(overview.improvingConcepts.length, 1)
  assert.equal(overview.latestActivityAt, 102)
  assert.equal(overview.activityTimeline.length, 1)
  assert.equal(overview.activityTimeline[0]?.totalEvents, 3)
})

test("buildLearningOverview sorts focus concepts by weakest mastery first", () => {
  const overview = buildLearningOverview({
    concepts: [
      { conceptName: "Heap", masteryScore: 0.49, confidenceScore: 0.8, updatedAt: 100 },
      { conceptName: "Cây AVL", masteryScore: 0.25, confidenceScore: 0.8, updatedAt: 100 },
      { conceptName: "BFS", masteryScore: 0.35, confidenceScore: 0.8, updatedAt: 100 },
    ],
    events: [],
  })

  assert.deepEqual(
    overview.focusConcepts.map((concept) => concept.conceptName),
    ["Cây AVL", "BFS", "Heap"]
  )
})
