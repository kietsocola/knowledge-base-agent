import test from "node:test"
import assert from "node:assert/strict"
import { authorizeClassroomAccess } from "@/lib/security/classroom-authorization"

test("authorizeClassroomAccess returns 401 when viewer is not logged in", () => {
  const result = authorizeClassroomAccess(null, "course-1")

  assert.equal(result.ok, false)
  if (!result.ok) {
    assert.equal(result.status, 401)
  }
})

test("authorizeClassroomAccess rejects learner access to classroom dashboard", () => {
  const result = authorizeClassroomAccess(
    { studentId: "student-001", courseId: "course-1", role: "learner" },
    "course-1"
  )

  assert.equal(result.ok, false)
  if (!result.ok) {
    assert.equal(result.status, 403)
  }
})

test("authorizeClassroomAccess accepts instructor access for the active course", () => {
  const result = authorizeClassroomAccess(
    { studentId: "teacher-001", courseId: "course-1", role: "instructor" },
    "course-1"
  )

  assert.deepEqual(result, { ok: true, value: "course-1" })
})

test("authorizeClassroomAccess accepts admin access without explicit requested course", () => {
  const result = authorizeClassroomAccess(
    { studentId: "admin-001", courseId: "course-1", role: "admin" },
    undefined
  )

  assert.deepEqual(result, { ok: true, value: "course-1" })
})
