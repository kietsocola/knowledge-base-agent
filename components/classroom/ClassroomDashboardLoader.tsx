"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { AlertCircle, BarChart3 } from "lucide-react"
import { ClassroomDashboard } from "@/components/classroom/ClassroomDashboard"
import { Button, buttonVariants } from "@/components/ui/button"
import type { ClassroomOverview } from "@/types/learning"

interface ClassroomDashboardLoaderProps {
  courseId: string
  courseName: string
}

export function ClassroomDashboardLoader({
  courseId,
  courseName,
}: ClassroomDashboardLoaderProps) {
  const [overview, setOverview] = useState<ClassroomOverview | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOverview() {
      try {
        const response = await fetch(`/api/learning/classroom?courseId=${courseId}`)
        if (!response.ok) {
          const payload = await response.json() as { error?: string }
          throw new Error(payload.error ?? "Không thể tải dashboard lớp học")
        }

        const data = await response.json() as ClassroomOverview
        setOverview(data)
      } catch (err) {
        setError(String(err))
      }
    }

    fetchOverview()
  }, [courseId])

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <div>
          <div className="font-semibold">Không thể tải dashboard lớp học</div>
          <div className="mt-1 max-w-md text-sm text-muted-foreground">{error}</div>
        </div>
        <div className="flex gap-3">
          <Link href="/portal" className={buttonVariants({ variant: "outline" })}>
            Quay lại portal
          </Link>
          <Button onClick={() => window.location.reload()}>Thử lại</Button>
        </div>
      </div>
    )
  }

  if (!overview) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="paper-surface w-full max-w-xl rounded-[2rem] p-6 text-center sm:p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <BarChart3 className="h-8 w-8 animate-pulse" />
          </div>
          <div className="mt-6 font-heading text-2xl font-black">Đang tổng hợp dữ liệu lớp học</div>
          <div className="mt-2 text-sm text-muted-foreground">
            AI đang gom dữ liệu hoạt động, đánh giá và concept mastery để dựng dashboard cho giảng viên.
          </div>
        </div>
      </div>
    )
  }

  return <ClassroomDashboard overview={overview} courseName={courseName} />
}
