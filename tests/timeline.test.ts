import test from "node:test"
import assert from "node:assert/strict"
import { buildActivityTimeline } from "@/lib/learning/timeline"

test("buildActivityTimeline groups events by UTC day and counts activity types", () => {
  const timeline = buildActivityTimeline([
    { eventType: "chat_turn_recorded", createdAt: 1711670400 }, // 2024-03-29
    { eventType: "chat_turn_recorded", createdAt: 1711674000 }, // 2024-03-29
    { eventType: "evaluation_generated", createdAt: 1711756800 }, // 2024-03-30
    { eventType: "chat_turn_recorded", createdAt: 1711756801 }, // 2024-03-30
  ])

  assert.deepEqual(timeline, [
    {
      dateKey: "2024-03-29",
      label: "29/03",
      totalEvents: 2,
      chatTurns: 2,
      evaluations: 0,
    },
    {
      dateKey: "2024-03-30",
      label: "30/03",
      totalEvents: 2,
      chatTurns: 1,
      evaluations: 1,
    },
  ])
})

test("buildActivityTimeline keeps only the latest buckets when limit is provided", () => {
  const timeline = buildActivityTimeline(
    [
      { eventType: "chat_turn_recorded", createdAt: 1711497600 }, // 27/03
      { eventType: "chat_turn_recorded", createdAt: 1711584000 }, // 28/03
      { eventType: "chat_turn_recorded", createdAt: 1711670400 }, // 29/03
    ],
    { limit: 2 }
  )

  assert.deepEqual(
    timeline.map((point) => point.dateKey),
    ["2024-03-28", "2024-03-29"]
  )
})
