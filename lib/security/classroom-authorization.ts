import { canAccessClassroomDashboard, type SessionRole } from "@/lib/lti/roles"
import type { SessionData } from "@/types/lti"

type ViewerSession = Pick<SessionData, "studentId" | "courseId" | "role">

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

export function authorizeClassroomAccess(
  viewer: ViewerSession | null | undefined,
  requestedCourseId: string | undefined
): AccessResult<string> {
  if (!viewer?.studentId) {
    return { ok: false, status: 401, error: "Unauthorized" }
  }

  if (!viewer.courseId) {
    return { ok: false, status: 400, error: "Session is missing course context" }
  }

  if (!canAccessClassroomDashboard(viewer.role as SessionRole | undefined)) {
    return { ok: false, status: 403, error: "Forbidden: classroom dashboard is restricted to instructors" }
  }

  if (requestedCourseId && requestedCourseId !== viewer.courseId) {
    return { ok: false, status: 403, error: "Forbidden: requested course does not match the current course" }
  }

  return { ok: true, value: viewer.courseId }
}
