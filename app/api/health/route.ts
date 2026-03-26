import { getCloudflareContext } from "@opennextjs/cloudflare"
import { getCloudflareDb, getDb } from "@/lib/db/index"
import { courses } from "@/lib/db/schema"

export async function GET() {
  const status: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
  }

  // Check D1
  try {
    let db
    try {
      const { env } = getCloudflareContext()
      db = getCloudflareDb(env.DB)
      status.runtime = "cloudflare-workers"
      status.vectorize = env.VECTORIZE ? "bound ✓" : "missing ✗"
    } catch {
      db = getDb()
      status.runtime = "local-dev (libsql)"
      status.vectorize = "n/a (local)"
    }

    const rows = await db.select({ id: courses.id }).from(courses).limit(3)
    status.d1 = { status: "connected ✓", courses_sample: rows.length }
  } catch (error) {
    status.d1 = { status: "error ✗", detail: String(error) }
  }

  const healthy = (status.d1 as Record<string, string>)?.status?.startsWith("connected")

  return Response.json(
    { overall: healthy ? "healthy" : "degraded", ...status },
    { status: healthy ? 200 : 503 }
  )
}
