import type { SessionData } from "@/types/lti"

type ViewerSession = Pick<SessionData, "studentId">

type OwnedSessionRecord = {
  studentId: string | null
  courseId: string | null
}

type AccessSuccess<T> = {
  ok: true
  value: T
}

type AccessFailure = {
  ok: false
  status: number
  error: string
}

type AccessResult<T> = AccessSuccess<T> | AccessFailure

export function authorizeOwnedSession(
  viewer: ViewerSession | null | undefined,
  target: OwnedSessionRecord | null | undefined
): AccessResult<OwnedSessionRecord> {
  if (!viewer?.studentId) {
    return { ok: false, status: 401, error: "Unauthorized" }
  }

  if (!target) {
    return { ok: false, status: 404, error: "Session not found" }
  }

  if (target.studentId !== viewer.studentId) {
    return { ok: false, status: 403, error: "Forbidden: session does not belong to the current student" }
  }

  return { ok: true, value: target }
}

export function validateRequestedCourse(
  requestedCourseId: string | undefined,
  trustedCourseId: string | null | undefined
): AccessResult<string> {
  if (!trustedCourseId) {
    return { ok: false, status: 400, error: "Session is missing course context" }
  }

  if (requestedCourseId && requestedCourseId !== trustedCourseId) {
    return { ok: false, status: 403, error: "Forbidden: requested course does not match the session course" }
  }

  return { ok: true, value: trustedCourseId }
}
