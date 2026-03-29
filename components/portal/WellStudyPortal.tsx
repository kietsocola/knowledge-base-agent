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
    iconBg: "bg-primary/10 text-primary",
    button: "hover:bg-primary hover:text-primary-foreground",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200",
  },
  {
    iconBg: "bg-primary/10 text-primary",
    button: "hover:bg-primary hover:text-primary-foreground",
    badge: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground",
  },
  {
    iconBg: "bg-secondary/15 text-secondary",
    button: "hover:bg-primary hover:text-primary-foreground",
    badge: "bg-secondary/15 text-secondary dark:bg-secondary/20 dark:text-secondary",
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
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="font-heading text-lg font-black tracking-tight text-primary">
                  WellStudy AI
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  LMS demo
                </div>
              </div>
            </div>
            <nav className="hidden items-center gap-6 md:flex">
              <a className="border-b-2 border-primary px-1 text-sm font-semibold text-primary" href="#course-list">
                Khóa học
              </a>
              <a className="text-sm text-muted-foreground transition-colors hover:text-primary" href="#student-profile">
                Chat
              </a>
              <a className="text-sm text-muted-foreground transition-colors hover:text-primary" href="#demo-flow">
                Phân tích
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
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
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6">
        <section className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Đồng bộ từ Moodle LMS
          </div>
          <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 id="student-profile" className="max-w-3xl text-4xl font-black tracking-tight text-foreground sm:text-5xl">
                Khóa học của bạn
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
                Chọn một môn học để bắt đầu phiên học với trợ lý AI. Giao diện được
                thiết kế theo phong cách demo LMS để phù hợp luồng Moodle + LTI.
              </p>
            </div>
            <div className="glass-panel rounded-3xl border border-border/70 px-5 py-4 shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-muted-foreground">
                Hồ sơ hiện tại
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">{selectedStudent.name}</div>
                  <div className="text-xs text-muted-foreground">{selectedStudent.email}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div id="course-list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2">
            {MOCK_COURSES.map((course, index) => {
              const accent = COURSE_ACCENTS[index % COURSE_ACCENTS.length]
              const isLoading = loadingCourseId === course.id
              // Odd-count: last card spans full row on sm (2-col) and lg (2-col), but not md (3-col)
              const isOddLast = MOCK_COURSES.length % 2 !== 0 && index === MOCK_COURSES.length - 1

              return (
                <article
                  key={course.id}
                  className={`group rounded-[2rem] border border-border/70 bg-card/85 p-8 shadow-[0_18px_60px_rgba(25,69,99,0.08)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(25,69,99,0.14)]${isOddLast ? " sm:col-span-2 md:col-span-1 lg:col-span-2" : ""}`}
                >
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${accent.iconBg}`}>
                      <BookOpen className="h-7 w-7" />
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${accent.badge}`}>
                      Đang học
                    </span>
                  </div>

                  <h2 className="font-heading text-2xl font-bold leading-snug transition-colors group-hover:text-primary">
                    {course.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Agent AI sẽ dựa trên tài liệu của môn học để hỗ trợ hỏi đáp,
                    gợi ý nội dung ôn luyện và tạo đánh giá năng lực.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {["Hỏi đáp RAG", "Đánh giá năng lực", "Lịch sử chat"].map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-muted px-3 py-1 text-[11px] font-medium text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-muted-foreground">Sẵn sàng cho demo</span>
                      <span className="text-primary">100%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full w-full rounded-full bg-gradient-to-r from-primary to-secondary" />
                    </div>
                  </div>

                  <button
                    onClick={() => handleLaunch(course.id)}
                    disabled={loadingCourseId !== null}
                    className={`mt-8 flex w-full items-center justify-center gap-2 rounded-2xl border border-transparent bg-muted px-5 py-4 text-sm font-bold text-foreground transition-[transform,background-color,color,box-shadow] duration-200 ${accent.button} disabled:cursor-not-allowed disabled:opacity-70`}
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
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleLaunch(course.id, true)}
                    disabled={loadingCourseId !== null}
                    className="mt-2 w-full rounded-xl px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted/60 hover:text-primary disabled:opacity-50"
                  >
                    + Tạo phiên học mới
                  </button>
                </article>
              )
            })}
          </div>

          <aside id="demo-flow" className="space-y-6">
            <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-secondary p-8 text-white shadow-[0_24px_70px_rgba(25,69,99,0.22)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="mt-6 font-heading text-3xl font-black leading-tight">
                Trợ lý học tập đã sẵn sàng
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-blue-50/85">
                Mỗi phiên học sẽ tạo một session riêng, lưu lịch sử hỏi đáp và cho
                phép xem đánh giá sau mỗi 4 câu hỏi.
              </p>
              <a
                href="#course-list"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-card px-6 py-3 text-sm font-bold text-primary transition-transform hover:scale-[1.02]"
              >
                Xem luồng demo
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="grid gap-4 grid-cols-1">
              {[
                {
                  icon: FileText,
                  title: "Tài liệu từ LMS",
                  desc: "Đồng bộ file môn học và slide bài giảng.",
                },
                {
                  icon: MessageSquare,
                  title: "Phản hồi tức thì",
                  desc: "Chat streaming theo ngữ cảnh tài liệu.",
                },
                {
                  icon: GraduationCap,
                  title: "Đánh giá cá nhân",
                  desc: "Radar chart và gợi ý nội dung cần ôn.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.75rem] border border-border/70 bg-card/80 p-5 shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="mt-4 text-sm font-bold">{item.title}</div>
                  <div className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.desc}</div>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </main>
    </div>
  )
}
