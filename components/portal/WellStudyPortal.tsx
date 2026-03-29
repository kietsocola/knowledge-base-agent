"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  FileText,
  GraduationCap,
  Loader2,
  MessageSquare,
  Sparkles,
  Zap,
} from "lucide-react"
import { MOCK_STUDENTS, MOCK_COURSES } from "@/lib/lti/mock"

const COURSE_ACCENTS = [
  {
    code: "DSA",
    marker: "bg-secondary text-secondary-foreground",
  },
  {
    code: "OOP",
    marker: "bg-primary text-primary-foreground",
  },
  {
    code: "DB",
    marker: "bg-foreground text-background",
  },
]

export function WellStudyPortal() {
  const router = useRouter()
  const [studentId, setStudentId] = useState(MOCK_STUDENTS[0].id)
  const [loadingCourseId, setLoadingCourseId] = useState<string | null>(null)
  const [showStudentPicker, setShowStudentPicker] = useState(false)

  const selectedStudent = MOCK_STUDENTS.find((student) => student.id === studentId)!

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
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="font-heading text-lg font-black tracking-tight text-primary">
                WellStudy AI
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                portal dossier
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <a className="text-sm font-semibold text-primary transition-colors hover:text-secondary" href="#course-index">
              Course index
            </a>
            <a className="text-sm text-muted-foreground transition-colors hover:text-primary" href="#student-brief">
              Student brief
            </a>
            <a className="text-sm text-muted-foreground transition-colors hover:text-primary" href="#launch-guide">
              Launch guide
            </a>
          </nav>

          <div className="relative">
            <button
              onClick={() => setShowStudentPicker((value) => !value)}
              aria-expanded={showStudentPicker}
              aria-haspopup="listbox"
              aria-label="Chọn sinh viên demo"
              className="flex items-center gap-3 rounded-full border border-border/70 bg-card/90 px-3 py-2 shadow-sm transition-[border-color,background-color,box-shadow] hover:border-primary/20 hover:bg-card"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {selectedStudent.name.charAt(0)}
              </div>
              <div className="hidden text-left sm:block">
                <div className="text-xs font-semibold leading-none">{selectedStudent.name}</div>
                <div className="mt-1 text-[10px] leading-none text-muted-foreground">Sinh viên demo</div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>

            {showStudentPicker && (
              <div
                role="listbox"
                aria-label="Danh sách sinh viên demo"
                className="absolute right-0 top-full z-40 mt-3 w-72 overflow-hidden rounded-3xl border border-border/70 bg-card/95 p-2 shadow-2xl"
              >
                <div className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.28em] text-muted-foreground">
                  Chọn sinh viên demo
                </div>
                {MOCK_STUDENTS.map((student) => {
                  const active = student.id === studentId
                  return (
                    <button
                      key={student.id}
                      role="option"
                      aria-selected={active}
                      onClick={() => {
                        setStudentId(student.id)
                        setShowStudentPicker(false)
                      }}
                      className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors ${
                        active ? "bg-accent" : "hover:bg-muted/70"
                      }`}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {student.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">{student.name}</div>
                        <div className="truncate text-xs text-muted-foreground">{student.email}</div>
                      </div>
                      {active && <div className="ml-auto h-2 w-2 rounded-full bg-primary" />}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6">
        <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="paper-surface rounded-[2.6rem] p-8 md:p-10">
            <div className="section-label">Launch surface</div>
            <div className="rule-divider mt-6 pb-7">
              <h1 id="student-brief" className="max-w-4xl font-heading text-5xl font-black tracking-[-0.04em] sm:text-6xl">
                Khóa học của bạn,
                <span className="mt-2 block text-secondary">được sắp như một learning index.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
                Chọn môn học để mở một session mới hoặc tiếp tục phiên gần nhất.
                Portal này bám đúng flow sản phẩm: launch từ LMS, vào chat, rồi đi tới evaluation và tracking.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-[1.25fr_0.95fr]">
              <div className="metric-tile rounded-[1.9rem] px-5 py-5">
                <div className="section-label">Student profile</div>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-xl font-black">{selectedStudent.name}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{selectedStudent.email}</div>
                  </div>
                </div>
              </div>

              <div className="ink-panel rounded-[1.9rem] px-5 py-5">
                <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/55">
                  current mode
                </div>
                <div className="mt-3 text-2xl font-black">Moodle launch demo</div>
                <div className="mt-2 text-sm leading-relaxed text-white/72">
                  Session được tạo theo môn học đang mở, lưu lịch sử và nối sang analytics.
                </div>
              </div>
            </div>
          </div>

          <aside id="launch-guide" className="space-y-6">
            <div className="ink-panel rounded-[2.4rem] p-7">
              <div className="section-label text-white/60 before:bg-white/20">Launch guide</div>
              <div className="mt-5 space-y-4">
                {[
                  ["01", "Chọn sinh viên demo đang học môn đó."],
                  ["02", "Mở course để hệ thống nhận context môn học."],
                  ["03", "Bắt đầu hỏi đáp và để analytics chạy xuyên suốt phiên."],
                ].map(([step, description]) => (
                  <div key={step} className="grid gap-3 rounded-[1.5rem] border border-white/10 bg-white/6 p-4 md:grid-cols-[48px_1fr]">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 font-black text-secondary">
                      {step}
                    </div>
                    <div className="text-sm leading-relaxed text-white/78">{description}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="paper-surface rounded-[2.2rem] p-6">
              <div className="section-label">Inside the flow</div>
              <div className="mt-5 grid gap-3">
                {[
                  {
                    icon: FileText,
                    title: "Tài liệu từ LMS",
                    description: "Đồng bộ file môn học và slide bài giảng vào một knowledge layer duy nhất.",
                  },
                  {
                    icon: MessageSquare,
                    title: "Phản hồi tức thì",
                    description: "Chat theo ngữ cảnh tài liệu, lưu được lịch sử và citation cho từng phiên học.",
                  },
                  {
                    icon: GraduationCap,
                    title: "Đánh giá cá nhân",
                    description: "Concept mastery, intervention và study planner xuất hiện ngay sau đủ dữ liệu.",
                  },
                ].map((item) => (
                  <div key={item.title} className="metric-tile rounded-[1.5rem] p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-heading text-lg font-bold">{item.title}</div>
                        <div className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section id="course-index" className="mt-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <div className="section-label">Course index</div>
              <h2 className="mt-3 font-heading text-4xl font-black tracking-tight">
                Danh mục phiên học có thể mở ngay
              </h2>
            </div>
            <div className="hidden text-right text-sm text-muted-foreground lg:block">
              {MOCK_COURSES.length} course demo
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {MOCK_COURSES.map((course, index) => {
              const accent = COURSE_ACCENTS[index % COURSE_ACCENTS.length]
              const isLoading = loadingCourseId === course.id

              return (
                <article
                  key={course.id}
                  className="paper-surface rounded-[2.2rem] p-7 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] ${accent.marker}`}>
                          {accent.code}
                        </div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                          Course ready
                        </div>
                      </div>
                      <h3 className="mt-5 max-w-xl font-heading text-3xl font-black leading-tight">
                        {course.title}
                      </h3>
                      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                        Agent AI sẽ dựa trên tài liệu của môn học để hỗ trợ hỏi đáp,
                        gợi ý nội dung ôn luyện và tạo đánh giá năng lực.
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {["RAG chat", "Learning tracking", "Evaluation", "Planner flow"].map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-border/60 bg-card/65 px-3 py-1 text-[11px] font-semibold text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="metric-tile rounded-[1.7rem] px-5 py-5 lg:w-[220px]">
                      <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                        launch status
                      </div>
                      <div className="mt-4 text-4xl font-black text-primary">100%</div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        Dữ liệu demo đã sẵn sàng cho flow portal → chat → evaluation.
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={() => handleLaunch(course.id)}
                      disabled={loadingCourseId !== null}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Đang khởi động…
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4" />
                          Vào phiên học
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleLaunch(course.id, true)}
                      disabled={loadingCourseId !== null}
                      className="inline-flex items-center justify-center rounded-full border border-border/70 bg-card/80 px-6 py-4 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/20 hover:text-primary disabled:opacity-50"
                    >
                      + Tạo phiên học mới
                    </button>
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
