"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  GraduationCap,
  Loader2,
  Plus,
  Sparkles,
  UserRound,
} from "lucide-react"
import { MOCK_STUDENTS, MOCK_COURSES } from "@/lib/lti/mock"
import { pageWidthPresets } from "@/lib/layout/page-widths"

const PORTAL_STATUS = [
  { label: "Courses", value: `${MOCK_COURSES.length} course sẵn sàng` },
  { label: "Mode", value: "Demo mode" },
  { label: "User", value: "1 user active" },
] as const

export function WellStudyPortal() {
  const router = useRouter()
  const [studentId, setStudentId] = useState(MOCK_STUDENTS[0].id)
  const [loadingCourseId, setLoadingCourseId] = useState<string | null>(null)
  const [showStudentPicker, setShowStudentPicker] = useState(false)

  const selectedStudent = MOCK_STUDENTS.find((student) => student.id === studentId)!
  const shellStyle = { maxWidth: `${pageWidthPresets.portal.maxWidth}px` }

  async function handleLaunch(courseId: string, forceNew = false) {
    setLoadingCourseId(courseId)
    try {
      const res = await fetch("/api/lti/launch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, courseId, forceNew }),
      })

      if (!res.ok) {
        const err = (await res.json()) as { detail?: string; error?: string }
        throw new Error(err.detail ?? err.error ?? "Launch failed")
      }

      const data = (await res.json()) as {
        studentName: string
        courseName: string
        redirectUrl: string
      }

      toast.success(`Chào mừng, ${data.studentName}!`, {
        description: `Đang vào: ${data.courseName}`,
      })

      router.push(data.redirectUrl)
    } catch (error) {
      toast.error("Lỗi khởi động", { description: String(error) })
      setLoadingCourseId(null)
    }
  }

  return (
    <div className="min-h-screen text-foreground">
      <header className="glass-panel sticky top-0 z-30 border-b border-border/60 shadow-sm shadow-primary/5">
        <div
          className={`mx-auto flex h-16 w-full items-center justify-between gap-4 ${pageWidthPresets.portal.shellClassName}`}
          style={shellStyle}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/15">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="font-heading text-base font-black tracking-tight text-primary sm:text-lg">
                WellStudy AI
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                demo workspace
              </div>
            </div>
          </div>

          <a
            className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-primary"
            href="#course-index"
          >
            Course list
          </a>
        </div>
      </header>

      <main
        className={`mx-auto flex w-full flex-col gap-8 pb-14 pt-8 lg:gap-10 lg:pt-10 ${pageWidthPresets.portal.shellClassName}`}
        style={shellStyle}
      >
        <section
          id="student-brief"
          className="paper-surface rounded-[2rem] px-6 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-10"
        >
          <div className="section-label">Student brief</div>

          <div className="rule-divider mt-5 pb-6">
            <h1 className="max-w-3xl font-heading text-4xl font-black tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Chọn môn học để bắt đầu.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Xác nhận user active, chọn đúng course, rồi đi thẳng vào phiên học.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-6">
            {PORTAL_STATUS.map((item) => (
              <div
                key={item.label}
                className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/72 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                <span>{item.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)]">
            <div className="rounded-[1.75rem] border border-border/60 bg-card/70 p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-lg shadow-primary/15">
                  <UserRound className="h-6 w-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                    User active
                  </div>
                  <div className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                    {selectedStudent.name}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="rounded-full border border-border/60 bg-background/72 px-3 py-1.5 font-semibold text-foreground">
                      {selectedStudent.roleLabel}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/8 px-3 py-1.5 font-semibold text-emerald-700 dark:text-emerald-300">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      {selectedStudent.statusLabel}
                    </span>
                  </div>

                  <div className="mt-4 text-sm text-muted-foreground">
                    {selectedStudent.email}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative rounded-[1.75rem] border border-border/60 bg-card/45 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                    Demo accounts
                  </div>
                  <div className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                    Đổi nhanh tài khoản mẫu để mở đúng ngữ cảnh học tập trước khi vào chatbot.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowStudentPicker((value) => !value)}
                  aria-expanded={showStudentPicker}
                  aria-haspopup="listbox"
                  aria-label="Đổi tài khoản demo"
                  className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full border border-border/70 bg-background/78 px-4 text-sm font-semibold text-foreground transition-colors hover:border-primary/20 hover:text-primary"
                >
                  Đổi user
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              {showStudentPicker ? (
                <div
                  role="listbox"
                  aria-label="Danh sách sinh viên demo"
                  className="mt-5 space-y-2"
                >
                  {MOCK_STUDENTS.map((student) => {
                    const active = student.id === studentId

                    return (
                      <button
                        key={student.id}
                        type="button"
                        role="option"
                        aria-selected={active}
                        onClick={() => {
                          setStudentId(student.id)
                          setShowStudentPicker(false)
                        }}
                        className={`flex w-full items-center gap-3 rounded-[1.2rem] border px-4 py-3 text-left transition-[border-color,background-color,transform] ${
                          active
                            ? "border-primary/25 bg-primary/8 text-primary"
                            : "border-border/55 bg-background/58 hover:border-primary/20 hover:bg-background/80"
                        }`}
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-xs font-bold text-primary-foreground">
                          {student.name.charAt(0)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-semibold text-foreground">
                            {student.name}
                          </div>
                          <div className="mt-1 truncate text-xs text-muted-foreground">
                            {student.roleLabel} · {student.statusLabel}
                          </div>
                        </div>

                        {active ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                        ) : null}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="mt-5 flex flex-wrap gap-2">
                  {MOCK_STUDENTS.map((student) => {
                    const active = student.id === studentId

                    return (
                      <button
                        key={student.id}
                        type="button"
                        onClick={() => setStudentId(student.id)}
                        className={`rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${
                          active
                            ? "border-primary/20 bg-primary text-primary-foreground"
                            : "border-border/60 bg-background/72 text-muted-foreground hover:border-primary/20 hover:text-primary"
                        }`}
                      >
                        {student.name}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="course-index" className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="section-label">Course list</div>
              <h2 className="mt-3 font-heading text-3xl font-black tracking-tight sm:text-4xl">
                Vào đúng course
              </h2>
            </div>

            <div className="text-sm text-muted-foreground">
              {selectedStudent.name} đang sẵn sàng mở phiên học.
            </div>
          </div>

          <div className="space-y-3">
            {MOCK_COURSES.map((course) => {
              const isLoading = loadingCourseId === course.id

              return (
                <article
                  key={course.id}
                  className="paper-surface rounded-[1.75rem] px-5 py-5 sm:px-6 sm:py-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-primary-foreground">
                          {course.shortCode}
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/72 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          {course.readinessLabel}
                        </div>
                      </div>

                      <h3 className="mt-4 max-w-3xl font-heading text-[1.65rem] font-black leading-tight tracking-tight sm:text-[1.9rem]">
                        {course.title}
                      </h3>
                    </div>

                    <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
                      <button
                        type="button"
                        onClick={() => handleLaunch(course.id)}
                        disabled={loadingCourseId !== null}
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/15 transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-primary/92 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Đang khởi động…
                          </>
                        ) : (
                          <>
                            <GraduationCap className="h-4 w-4" />
                            Vào phiên học
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleLaunch(course.id, true)}
                        disabled={loadingCourseId !== null}
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border/65 bg-background/78 px-5 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/20 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Plus className="h-4 w-4" />
                        Tạo phiên mới
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}
