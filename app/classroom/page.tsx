import { cookies } from "next/headers"
import { getIronSession } from "iron-session"
import { redirect } from "next/navigation"
import { ClassroomDashboardLoader } from "@/components/classroom/ClassroomDashboardLoader"
import { canAccessClassroomDashboard } from "@/lib/lti/roles"
import { SESSION_OPTIONS } from "@/lib/session"
import type { SessionData } from "@/types/lti"

export const metadata = {
  title: "Dashboard Lớp Học — KB Agent",
}

export default async function ClassroomPage() {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, SESSION_OPTIONS)

  if (!session.studentId || !session.courseId || !canAccessClassroomDashboard(session.role)) {
    redirect("/portal")
  }

  return (
    <ClassroomDashboardLoader
      courseId={session.courseId}
      courseName={session.courseName ?? session.courseId}
    />
  )
}
