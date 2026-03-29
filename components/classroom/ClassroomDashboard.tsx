"use client"

import { Activity, AlertTriangle, BookOpen, CalendarClock, GraduationCap, TrendingUp } from "lucide-react"
import { ActivityTimelineChart } from "@/components/learning/ActivityTimelineChart"
import { InterventionAlertsPanel } from "@/components/learning/InterventionAlertsPanel"
import type { ClassroomOverview } from "@/types/learning"
import { pageWidthPresets } from "@/lib/layout/page-widths"

interface ClassroomDashboardProps {
  overview: ClassroomOverview
  courseName: string
}

function formatDate(ts: number | null): string {
  if (!ts) return "Chưa có hoạt động"
  return new Date(ts * 1000).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatPercent(score: number | null): string {
  if (score === null) return "Chưa có"
  return `${Math.round(score * 100)}%`
}

export function ClassroomDashboard({ overview, courseName }: ClassroomDashboardProps) {
  const stats = [
    { label: "Sinh viên đã ghi nhận", value: overview.totalStudents, Icon: GraduationCap },
    { label: "Sinh viên đang hoạt động", value: overview.activeStudents, Icon: Activity },
    { label: "Phiên học đã tạo", value: overview.totalSessions, Icon: CalendarClock },
    { label: "Lần đánh giá", value: overview.totalEvaluations, Icon: TrendingUp },
  ]
  const shellStyle = { maxWidth: `${pageWidthPresets.classroom.maxWidth}px` }

  return (
    <div className={`min-h-screen pb-12 pt-8 ${pageWidthPresets.classroom.shellClassName}`}>
      <div className="mx-auto space-y-8" style={shellStyle}>
        <div className="paper-surface flex flex-col gap-4 rounded-[2.4rem] px-6 py-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="section-label">Instructor command</div>
            <h1 className="mt-3 font-heading text-4xl font-black tracking-tight">
              Toàn cảnh lớp học
            </h1>
            <div className="mt-2 text-sm text-muted-foreground">
              {courseName} · Tóm tắt mức độ tham gia, concept yếu chung và sinh viên cần hỗ trợ.
            </div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-4 py-2 text-xs font-semibold text-primary">
            <CalendarClock className="h-3.5 w-3.5" />
            Hoạt động gần nhất: {formatDate(overview.latestActivityAt)}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, Icon }) => (
            <div key={label} className="metric-tile rounded-[1.5rem] p-5">
              <div className="flex items-center gap-2 text-primary">
                <Icon className="h-4 w-4" />
                <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  {label}
                </div>
              </div>
              <div className="mt-3 text-3xl font-black">{value}</div>
            </div>
          ))}
        </div>

        <InterventionAlertsPanel
          alerts={overview.interventionAlerts}
          title="Cảnh báo sớm ở cấp lớp"
          description="Ưu tiên các tín hiệu cần can thiệp sớm để giảng viên biết nên hỗ trợ ở mức cá nhân hay theo nhóm."
        />

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <ActivityTimelineChart
              data={overview.activityTimeline}
              title="Timeline hoạt động của lớp"
              description="Thể hiện mức độ hỏi đáp và các mốc đánh giá theo từng ngày có hoạt động."
            />

            <section className="paper-surface rounded-[2rem] p-6">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-200">
                <AlertTriangle className="h-4 w-4" />
                <div className="text-sm font-bold">Concept yếu chung của lớp</div>
              </div>
              <div className="mt-4 space-y-4">
                {overview.strugglingConcepts.length === 0 ? (
                  <div className="text-sm text-muted-foreground">Chưa có đủ dữ liệu concept để phân tích.</div>
                ) : (
                  overview.strugglingConcepts.map((concept) => (
                    <div key={concept.conceptName}>
                      <div className="flex items-center justify-between gap-4 text-sm">
                        <span>{concept.conceptName}</span>
                        <span className="font-semibold text-rose-700 dark:text-rose-200">
                          {formatPercent(concept.averageMasteryScore)} · {concept.studentCount} SV
                        </span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-rose-100 dark:bg-rose-400/15">
                        <div
                          className="h-full rounded-full bg-rose-500 dark:bg-rose-300"
                          style={{ width: `${concept.averageMasteryScore * 100}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="paper-surface rounded-[2rem] p-6">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-200">
                <BookOpen className="h-4 w-4" />
                <div className="text-sm font-bold">Concept nắm tốt nhất</div>
              </div>
              <div className="mt-4 space-y-4">
                {overview.strongestConcepts.length === 0 ? (
                  <div className="text-sm text-muted-foreground">Chưa có concept nào đạt mức nổi bật.</div>
                ) : (
                  overview.strongestConcepts.map((concept) => (
                    <div key={concept.conceptName}>
                      <div className="flex items-center justify-between gap-4 text-sm">
                        <span>{concept.conceptName}</span>
                        <span className="font-semibold text-emerald-700 dark:text-emerald-200">
                          {formatPercent(concept.averageMasteryScore)} · {concept.studentCount} SV
                        </span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-emerald-100 dark:bg-emerald-400/15">
                        <div
                          className="h-full rounded-full bg-emerald-500 dark:bg-emerald-300"
                          style={{ width: `${concept.averageMasteryScore * 100}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          <section className="paper-surface rounded-[2rem] p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-sm font-bold">Sinh viên cần chú ý</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Ưu tiên những trường hợp chưa có đánh giá hoặc có nhiều concept dưới ngưỡng.
                </div>
              </div>
              <div className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-400/15 dark:text-amber-200">
                {overview.studentsNeedingAttention.length} trường hợp
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {overview.studentsNeedingAttention.length === 0 ? (
                <div className="rounded-[1.25rem] bg-emerald-50 px-4 py-4 text-sm text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-200">
                  Chưa có sinh viên nào ở nhóm cần can thiệp ngay.
                </div>
              ) : (
                overview.studentsNeedingAttention.map((student) => (
                  <div
                    key={student.studentId}
                    className="rounded-[1.5rem] border border-amber-200/70 bg-amber-50/75 p-4 dark:border-amber-400/20 dark:bg-amber-950/20"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-semibold">{student.studentName}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {student.totalChatTurns} lượt hỏi · {student.totalEvaluations} lần đánh giá · {student.totalSessions} phiên
                        </div>
                      </div>
                      <div className="rounded-full bg-card px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-200">
                        {formatPercent(student.averageMasteryScore)}
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">
                      {student.focusConceptCount > 0
                        ? `${student.focusConceptCount} concept đang ở vùng cần tập trung`
                        : "Chưa có đủ dữ liệu đánh giá, nên khuyến khích hoàn thành thêm lượt học"}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

          <section className="paper-surface rounded-[2rem] p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-sm font-bold">Bảng tiến độ từng sinh viên</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Tóm tắt mức độ tham gia và mastery trung bình ở quy mô lớp học.
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {overview.totalChatTurns} lượt hỏi đáp toàn lớp
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-border/70 text-left text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  <th className="pb-3 pr-4 font-semibold">Sinh viên</th>
                  <th className="pb-3 pr-4 font-semibold">Phiên</th>
                  <th className="pb-3 pr-4 font-semibold">Hỏi đáp</th>
                  <th className="pb-3 pr-4 font-semibold">Đánh giá</th>
                  <th className="pb-3 pr-4 font-semibold">Concept</th>
                  <th className="pb-3 pr-4 font-semibold">Mastery TB</th>
                  <th className="pb-3 font-semibold">Hoạt động gần nhất</th>
                </tr>
              </thead>
              <tbody>
                {overview.studentSnapshots.map((student) => (
                  <tr key={student.studentId} className="border-b border-border/40 last:border-0">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-2.5 w-2.5 rounded-full ${student.needsAttention ? "bg-amber-500" : "bg-emerald-500"}`} />
                        <div>
                          <div className="font-medium">{student.studentName}</div>
                          <div className="text-xs text-muted-foreground">
                            {student.needsAttention ? "Cần theo dõi" : "Ổn định"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4">{student.totalSessions}</td>
                    <td className="py-4 pr-4">{student.totalChatTurns}</td>
                    <td className="py-4 pr-4">{student.totalEvaluations}</td>
                    <td className="py-4 pr-4">{student.conceptCount}</td>
                    <td className="py-4 pr-4">{formatPercent(student.averageMasteryScore)}</td>
                    <td className="py-4">{formatDate(student.latestActivityAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
