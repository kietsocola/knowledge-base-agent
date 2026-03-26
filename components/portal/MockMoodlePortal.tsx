"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  BookOpen,
  GraduationCap,
  Loader2,
  Sparkles,
  ChevronDown,
  Zap,
  FileText,
  ArrowRight,
  BarChart3,
  MessageSquare,
} from "lucide-react"
import { MOCK_STUDENTS, MOCK_COURSES } from "@/lib/lti/mock"

const COURSE_ACCENTS = [
  { bar: "from-indigo-500 to-blue-500", glow: "group-hover:shadow-indigo-500/20" },
  { bar: "from-violet-500 to-indigo-500", glow: "group-hover:shadow-violet-500/20" },
  { bar: "from-blue-500 to-cyan-500", glow: "group-hover:shadow-blue-500/20" },
  { bar: "from-sky-500 to-indigo-500", glow: "group-hover:shadow-sky-500/20" },
]

export function MockMoodlePortal() {
  const router = useRouter()
  const [studentId, setStudentId] = useState(MOCK_STUDENTS[0].id)
  const [loadingCourseId, setLoadingCourseId] = useState<string | null>(null)
  const [showStudentPicker, setShowStudentPicker] = useState(false)

  const selectedStudent = MOCK_STUDENTS.find((s) => s.id === studentId)!

  async function handleLaunch(courseId: string) {
    setLoadingCourseId(courseId)
    try {
      const res = await fetch("/api/lti/launch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, courseId }),
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

  const isLoading = loadingCourseId !== null

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ── Demo mode banner ──────────────────────────── */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-center">
        <p className="text-xs text-amber-300/90">
          <span className="font-semibold">Chế độ demo</span> — Mô phỏng giao diện sinh viên sau khi đăng nhập LTI từ LMS
        </p>
      </div>

      {/* ── Header ───────────────────────────────────── */}
      <header className="bg-gradient-to-r from-indigo-900/80 to-blue-900/80 border-b border-indigo-800/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-md shadow-indigo-500/40">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-bold text-sm leading-tight">KB Agent</div>
              <div className="text-[10px] text-indigo-300 leading-tight">AI Knowledge Base</div>
            </div>
          </div>

          {/* Student selector */}
          <div className="relative">
            <button
              onClick={() => setShowStudentPicker((v) => !v)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg px-3 py-2 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {selectedStudent.name.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-medium text-slate-200 leading-tight">{selectedStudent.name}</div>
                <div className="text-[10px] text-slate-400 leading-tight">Sinh viên demo</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {showStudentPicker && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="px-3 py-2 border-b border-slate-700">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">
                    Chọn sinh viên demo
                  </p>
                </div>
                {MOCK_STUDENTS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setStudentId(s.id)
                      setShowStudentPicker(false)
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-slate-700 transition-colors ${
                      s.id === studentId ? "bg-indigo-500/10" : ""
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-200">{s.name}</div>
                      <div className="text-[10px] text-slate-500">{s.email}</div>
                    </div>
                    {s.id === studentId && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Main ─────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Page title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <h1 className="text-xl font-bold text-white">Khóa học của bạn</h1>
            <span className="ml-2 text-xs bg-slate-800 border border-slate-700 text-slate-400 px-2.5 py-0.5 rounded-full">
              {MOCK_COURSES.length} môn học
            </span>
          </div>
          <p className="text-slate-400 text-sm">
            Chọn một môn học để bắt đầu hoặc tiếp tục phiên học với AI Agent.
          </p>
        </div>

        {/* Course grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MOCK_COURSES.map((course, i) => {
            const accent = COURSE_ACCENTS[i % COURSE_ACCENTS.length]
            const isThisLoading = loadingCourseId === course.id

            return (
              <div
                key={course.id}
                className={`group bg-slate-800/60 rounded-2xl border border-slate-700/60 hover:border-indigo-500/50 hover:bg-slate-800 transition-all duration-200 flex flex-col overflow-hidden shadow-lg ${accent.glow} hover:shadow-xl`}
              >
                {/* Accent bar */}
                <div className={`h-1 w-full bg-gradient-to-r ${accent.bar}`} />

                <div className="p-5 flex flex-col flex-1">
                  {/* Course info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <BookOpen className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <h2 className="text-sm font-semibold text-white leading-snug line-clamp-2">
                          {course.title}
                        </h2>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-full font-medium">
                            Đang học
                          </span>
                          <span className="text-[10px] text-slate-500">HK2 · 2025-2026</span>
                        </div>
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-4 px-1 mb-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Tài liệu môn học</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Hỗ trợ AI 24/7</span>
                      </div>
                    </div>

                    {/* Feature pills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {["Hỏi đáp RAG", "Đánh giá năng lực", "Lịch sử chat"].map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] bg-slate-700/60 text-slate-400 border border-slate-600/50 px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => handleLaunch(course.id)}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors shadow-md shadow-indigo-500/20"
                  >
                    {isThisLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang khởi động...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Khởi động AI Agent
                        <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Stats row */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: BarChart3, label: "Đánh giá năng lực", desc: "Sau mỗi 4 câu hỏi, AI phân tích điểm mạnh và khoảng trống kiến thức." },
            { icon: MessageSquare, label: "Lịch sử học tập", desc: "Mọi phiên học được lưu lại, xem lại bất cứ lúc nào." },
            { icon: FileText, label: "Nguồn từ tài liệu", desc: "Mọi câu trả lời đều có trích dẫn rõ ràng từ tài liệu môn học." },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center shrink-0">
                <item.icon className="w-4.5 h-4.5 text-indigo-400" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-300 mb-0.5">{item.label}</div>
                <div className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
