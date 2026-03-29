import test from "node:test"
import assert from "node:assert/strict"

import { MOCK_COURSES, MOCK_STUDENTS } from "@/lib/lti/mock"

test("mock portal students expose short learner context", () => {
  assert.ok(MOCK_STUDENTS.length > 0)
  assert.equal(MOCK_STUDENTS[0]?.roleLabel, "Learner")
  assert.equal(MOCK_STUDENTS[0]?.statusLabel, "Active")
})

test("mock portal courses expose short course metadata", () => {
  assert.ok(MOCK_COURSES.length > 0)
  assert.match(MOCK_COURSES[0]?.shortCode ?? "", /^[A-Z]{2,5}$/)
  assert.equal(MOCK_COURSES[0]?.readinessLabel, "Sẵn sàng")
})

test("portal status summary can stay short and calm", () => {
  const summary = [
    `${MOCK_COURSES.length} course sẵn sàng`,
    "Demo mode",
    "1 user active",
  ]

  assert.deepEqual(summary, [
    "3 course sẵn sàng",
    "Demo mode",
    "1 user active",
  ])
})
