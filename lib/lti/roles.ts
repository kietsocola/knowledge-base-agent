export type SessionRole = "learner" | "instructor" | "admin"

export function resolveSessionRole(roles?: string[]): SessionRole {
  if (!roles || roles.length === 0) {
    return "learner"
  }

  const normalizedRoles = roles.map((role) => role.toLowerCase())

  if (normalizedRoles.some((role) => role.includes("administrator") || role.includes("#admin"))) {
    return "admin"
  }

  if (normalizedRoles.some((role) => role.includes("instructor") || role.includes("teacher"))) {
    return "instructor"
  }

  return "learner"
}

export function canAccessClassroomDashboard(role?: SessionRole): boolean {
  return role === "instructor" || role === "admin"
}
