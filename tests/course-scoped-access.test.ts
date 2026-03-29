import test from "node:test"
import assert from "node:assert/strict"
import { authorizeCourseScopedRequest } from "@/lib/security/course-scoped-access"

test("authorizeCourseScopedRequest returns 401 when viewer is not logged in", () => {
  const result = authorizeCourseScopedRequest(
    { studentId: "", courseId: "course-001" },
    "course-001"
  )

  assert.equal(result.ok, false)
  if (!result.ok) {
    assert.equal(result.status, 401)
  }
})

test("authorizeCourseScopedRequest returns 400 when session has no course context", () => {
  const result = authorizeCourseScopedRequest(
    { studentId: "student-001", courseId: "" },
    undefined
  )

  assert.equal(result.ok, false)
  if (!result.ok) {
    assert.equal(result.status, 400)
  }
})

test("authorizeCourseScopedRequest falls back to the current session course", () => {
  const result = authorizeCourseScopedRequest(
    { studentId: "student-001", courseId: "course-001" },
    undefined
  )

  assert.deepEqual(result, {
    ok: true,
    value: "course-001",
  })
})

test("authorizeCourseScopedRequest accepts a matching course", () => {
  const result = authorizeCourseScopedRequest(
    { studentId: "student-001", courseId: "course-001" },
    "course-001"
  )

  assert.deepEqual(result, {
    ok: true,
    value: "course-001",
  })
})

test("authorizeCourseScopedRequest rejects requests for a different course", () => {
  const result = authorizeCourseScopedRequest(
    { studentId: "student-001", courseId: "course-001" },
    "course-002"
  )

  assert.equal(result.ok, false)
  if (!result.ok) {
    assert.equal(result.status, 403)
    assert.match(result.error, /course/i)
  }
})
