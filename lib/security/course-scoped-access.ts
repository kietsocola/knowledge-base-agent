import type { SessionData } from "@/types/lti"

type ViewerSession = Pick<SessionData, "studentId" | "courseId">

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

export function authorizeCourseScopedRequest(
  viewer: ViewerSession | null | undefined,
  requestedCourseId: string | undefined
): AccessResult<string> {
  if (!viewer?.studentId) {
    return { ok: false, status: 401, error: "Unauthorized" }
  }

  if (!viewer.courseId) {
    return { ok: false, status: 400, error: "Session is missing course context" }
  }

  if (requestedCourseId && requestedCourseId !== viewer.courseId) {
    return { ok: false, status: 403, error: "Forbidden: requested course does not match the current course" }
  }

  return { ok: true, value: viewer.courseId }
}
