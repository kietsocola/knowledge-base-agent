import test from "node:test"
import assert from "node:assert/strict"
import { createLearningEvent } from "@/lib/learning/events"

test("createLearningEvent serializes payload into the DB shape", () => {
  const record = createLearningEvent({
    studentId: "student-001",
    courseId: "course-001",
    sessionId: "session-001",
    eventType: "evaluation_generated",
    payload: { overallScore: 7.5, conceptCount: 2 },
    createdAt: 1234567890,
  })

  assert.equal(record.studentId, "student-001")
  assert.equal(record.courseId, "course-001")
  assert.equal(record.sessionId, "session-001")
  assert.equal(record.eventType, "evaluation_generated")
  assert.equal(record.createdAt, 1234567890)
  assert.equal(record.eventPayload, JSON.stringify({ overallScore: 7.5, conceptCount: 2 }))
  assert.ok(record.id)
})
