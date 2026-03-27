import { NextRequest } from "next/server"
import { cookies } from "next/headers"
import { getIronSession } from "iron-session"
import { getDb } from "@/lib/db/index"
import { documents } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { SESSION_OPTIONS } from "@/lib/session"
import { authorizeCourseScopedRequest } from "@/lib/security/course-scoped-access"
import type { SessionData } from "@/types/lti"

export async function GET(request: NextRequest) {
  const requestedCourseId = request.nextUrl.searchParams.get("courseId") ?? undefined
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, SESSION_OPTIONS)

  const access = authorizeCourseScopedRequest(session, requestedCourseId)
  if (!access.ok) {
    return Response.json({ error: access.error }, { status: access.status })
  }

  const db = getDb()
  const docs = await db
    .select({
      id: documents.id,
      name: documents.name,
      pageCount: documents.pageCount,
      createdAt: documents.createdAt,
    })
    .from(documents)
    .where(eq(documents.courseId, access.value))

  return Response.json({ documents: docs })
}
