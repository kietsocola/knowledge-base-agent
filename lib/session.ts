import type { SessionData } from "@/types/lti"

export const SESSION_OPTIONS = {
  password:
    process.env.SESSION_SECRET ?? "dev-secret-change-me-in-production-32c",
  cookieName: "kb-agent-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
  },
}

export type { SessionData }
