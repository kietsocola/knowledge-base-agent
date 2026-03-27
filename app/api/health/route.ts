import { getDb } from "@/lib/db/index"
import { courses } from "@/lib/db/schema"

export async function GET() {
  const status: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    runtime: "vercel",
  }

  try {
    const db = getDb()
    const rows = await db.select({ id: courses.id }).from(courses).limit(3)
    status.db = { status: "connected ✓", provider: "supabase-postgresql", courses_sample: rows.length }
  } catch (error) {
    status.db = { status: "error ✗", detail: String(error) }
  }

  const healthy = (status.db as Record<string, string>)?.status?.startsWith("connected")

  return Response.json(
    { overall: healthy ? "healthy" : "degraded", ...status },
    { status: healthy ? 200 : 503 }
  )
}
