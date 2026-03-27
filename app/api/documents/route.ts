import { NextRequest } from "next/server"
import { getDb } from "@/lib/db/index"
import { documents } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest) {
  const courseId = request.nextUrl.searchParams.get("courseId")
  if (!courseId) {
    return Response.json({ error: "courseId required" }, { status: 400 })
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
    .where(eq(documents.courseId, courseId))

  return Response.json({ documents: docs })
}
