import test from "node:test"
import assert from "node:assert/strict"
import { buildClassroomOverview } from "@/lib/learning/classroom-overview"

test("buildClassroomOverview summarizes classroom activity and student risk", () => {
  const overview = buildClassroomOverview({
    sessions: [
      { studentId: "student-001", studentName: "An", sessionId: "s1", createdAt: 100 },
      { studentId: "student-002", studentName: "Bình", sessionId: "s2", createdAt: 110 },
      { studentId: "student-003", studentName: "Cường", sessionId: "s3", createdAt: 120 },
    ],
    events: [
      { studentId: "student-001", studentName: "An", eventType: "chat_turn_recorded", createdAt: 101 },
      { studentId: "student-001", studentName: "An", eventType: "evaluation_generated", createdAt: 102 },
      { studentId: "student-002", studentName: "Bình", eventType: "chat_turn_recorded", createdAt: 111 },
      { studentId: "student-002", studentName: "Bình", eventType: "chat_turn_recorded", createdAt: 112 },
    ],
    masteries: [
      { studentId: "student-001", studentName: "An", conceptName: "Đệ quy", masteryScore: 0.85, updatedAt: 130 },
      { studentId: "student-001", studentName: "An", conceptName: "Heap", masteryScore: 0.72, updatedAt: 131 },
      { studentId: "student-002", studentName: "Bình", conceptName: "Đệ quy", masteryScore: 0.42, updatedAt: 125 },
      { studentId: "student-002", studentName: "Bình", conceptName: "Heap", masteryScore: 0.38, updatedAt: 126 },
    ],
  })

  assert.equal(overview.totalStudents, 3)
  assert.equal(overview.activeStudents, 2)
  assert.equal(overview.totalSessions, 3)
  assert.equal(overview.totalChatTurns, 3)
  assert.equal(overview.totalEvaluations, 1)
  assert.equal(overview.latestActivityAt, 131)

  assert.equal(overview.strugglingConcepts[0]?.conceptName, "Heap")
  assert.equal(overview.strongestConcepts[0]?.conceptName, "Đệ quy")

  assert.deepEqual(
    overview.studentsNeedingAttention.map((student) => student.studentName),
    ["Cường", "Bình"]
  )

  assert.equal(overview.studentSnapshots[0]?.studentName, "Cường")
  assert.equal(overview.studentSnapshots[1]?.studentName, "Bình")
  assert.equal(overview.studentSnapshots[2]?.studentName, "An")
})

test("buildClassroomOverview handles empty classroom data", () => {
  const overview = buildClassroomOverview({
    sessions: [],
    events: [],
    masteries: [],
  })

  assert.equal(overview.totalStudents, 0)
  assert.equal(overview.activeStudents, 0)
  assert.equal(overview.totalSessions, 0)
  assert.equal(overview.totalChatTurns, 0)
  assert.equal(overview.totalEvaluations, 0)
  assert.equal(overview.latestActivityAt, null)
  assert.deepEqual(overview.strugglingConcepts, [])
  assert.deepEqual(overview.studentsNeedingAttention, [])
})
