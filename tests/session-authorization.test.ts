import test from "node:test"
import assert from "node:assert/strict"
import {
  authorizeOwnedSession,
  validateRequestedCourse,
} from "@/lib/security/session-authorization"

test("authorizeOwnedSession returns 401 when viewer is not logged in", () => {
  const result = authorizeOwnedSession(
    { studentId: "" },
    { studentId: "student-001", courseId: "course-001" }
  )

  assert.equal(result.ok, false)
  if (!result.ok) {
    assert.equal(result.status, 401)
    assert.match(result.error, /unauthorized/i)
  }
})

test("authorizeOwnedSession returns 404 when target session is missing", () => {
  const result = authorizeOwnedSession({ studentId: "student-001" }, null)

  assert.equal(result.ok, false)
  if (!result.ok) {
    assert.equal(result.status, 404)
    assert.match(result.error, /not found/i)
  }
})

test("authorizeOwnedSession returns 403 when session belongs to a different student", () => {
  const result = authorizeOwnedSession(
    { studentId: "student-001" },
    { studentId: "student-002", courseId: "course-001" }
  )

  assert.equal(result.ok, false)
  if (!result.ok) {
    assert.equal(result.status, 403)
    assert.match(result.error, /forbidden/i)
  }
})

test("authorizeOwnedSession returns trusted session data for the owning student", () => {
  const result = authorizeOwnedSession(
    { studentId: "student-001" },
    { studentId: "student-001", courseId: "course-001" }
  )

  assert.equal(result.ok, true)
  if (result.ok) {
    assert.equal(result.value.courseId, "course-001")
    assert.equal(result.value.studentId, "student-001")
  }
})

test("validateRequestedCourse falls back to the trusted course when request omits courseId", () => {
  const result = validateRequestedCourse(undefined, "course-001")

  assert.deepEqual(result, {
    ok: true,
    value: "course-001",
  })
})

test("validateRequestedCourse accepts matching courseId", () => {
  const result = validateRequestedCourse("course-001", "course-001")

  assert.deepEqual(result, {
    ok: true,
    value: "course-001",
  })
})

test("validateRequestedCourse rejects tampered courseId", () => {
  const result = validateRequestedCourse("course-002", "course-001")

  assert.equal(result.ok, false)
  if (!result.ok) {
    assert.equal(result.status, 403)
    assert.match(result.error, /course/i)
  }
})
