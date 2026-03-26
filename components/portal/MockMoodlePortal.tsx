"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { BookOpen, GraduationCap, LogIn, Loader2, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MOCK_STUDENTS, MOCK_COURSES } from "@/lib/lti/mock"

export function MockMoodlePortal() {
  const router = useRouter()
  const [studentId, setStudentId] = useState(MOCK_STUDENTS[0].id)
  const [courseId, setCourseId] = useState(MOCK_COURSES[0].id)
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState("")

  async function handleLaunch() {
    setLoading(true)
    setLoadingStep("Đang xác thực LTI 1.3...")

    try {
      const res = await fetch("/api/lti/launch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, courseId }),
      })

      if (!res.ok) {
        const err = await res.json() as { detail?: string; error?: string }
        throw new Error(err.detail ?? err.error ?? "Launch failed")
      }

      const data = await res.json() as {
        studentName: string
        courseName: string
        redirectUrl: string
      }
      setLoadingStep("Đang khởi tạo phiên học...")

      toast.success(`Chào mừng, ${data.studentName}!`, {
        description: `Đang vào môn: ${data.courseName}`,
      })

      router.push(data.redirectUrl)
    } catch (error) {
      toast.error("Lỗi khởi động", {
        description: String(error),
      })
      setLoading(false)
      setLoadingStep("")
    }
  }

  const selectedStudent = MOCK_STUDENTS.find((s) => s.id === studentId)!
  const selectedCourse = MOCK_COURSES.find((c) => c.id === courseId)!

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-950">
      {/* Moodle-style header */}
      <header className="bg-[#0f6fc6] text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-0">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-7 h-7" />
              <div>
                <div className="font-bold text-lg leading-tight">Moodle</div>
                <div className="text-xs text-blue-200 leading-tight">Demo University LMS</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-7 h-7 rounded-full bg-blue-400 flex items-center justify-center font-bold text-xs">
                {selectedStudent.name.charAt(0)}
              </div>
              <span className="hidden sm:block">{selectedStudent.name}</span>
            </div>
          </div>
        </div>
        {/* Breadcrumb bar */}
        <div className="bg-[#0a5ba3] px-4 py-1">
          <div className="max-w-6xl mx-auto text-xs text-blue-200 flex gap-1">
            <span>Dashboard</span>
            <span>›</span>
            <span>{selectedCourse.title}</span>
            <span>›</span>
            <span className="text-white">AI Knowledge Base</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course block (Moodle style) */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-2 border-blue-200 dark:border-blue-900 bg-white dark:bg-zinc-900">
              <CardHeader className="pb-2 bg-[#0f6fc6]/10 rounded-t-xl border-b border-blue-100 dark:border-blue-900">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#0f6fc6]" />
                  <CardTitle className="text-base font-semibold">
                    {selectedCourse.title}
                  </CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Học kỳ 2 · 2025-2026 · Khoa CNTT
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {/* Mock course content list */}
                {["Bài giảng tuần 1-4", "Bài tập thực hành", "Tài liệu tham khảo", "Đề thi mẫu"].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer text-sm text-muted-foreground border border-transparent hover:border-gray-200 dark:hover:border-zinc-700"
                    >
                      <div className="w-4 h-4 rounded-sm bg-orange-400 flex-shrink-0" />
                      {item}
                    </div>
                  )
                )}

                {/* KB Agent launch block */}
                <div className="mt-4 p-4 rounded-lg border-2 border-dashed border-[#0f6fc6]/40 bg-[#0f6fc6]/5 dark:bg-[#0f6fc6]/10">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#0f6fc6] flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">AI Knowledge Base Agent</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Hỏi đáp kiến thức môn học · Trích dẫn từ tài liệu · Đánh giá năng lực
                      </div>
                      <Button
                        onClick={handleLaunch}
                        disabled={loading}
                        size="sm"
                        className="mt-3 bg-[#0f6fc6] hover:bg-[#0a5ba3] text-white"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {loadingStep}
                          </>
                        ) : (
                          <>
                            <LogIn className="w-4 h-4 mr-2" />
                            Launch AI Knowledge Base
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar: student + course selector */}
          <div className="space-y-4">
            <Card className="bg-white dark:bg-zinc-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Demo Controls
                </CardTitle>
                <CardDescription className="text-xs">
                  Chọn sinh viên và môn học để demo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    Sinh viên
                  </label>
                  <select
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    disabled={loading}
                    className="w-full text-sm rounded-md border border-input bg-background px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                  >
                    {MOCK_STUDENTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    Môn học
                  </label>
                  <select
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    disabled={loading}
                    className="w-full text-sm rounded-md border border-input bg-background px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                  >
                    {MOCK_COURSES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-1 border-t border-border">
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>Student ID:</span>
                      <span className="font-mono">{selectedStudent.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Course ID:</span>
                      <span className="font-mono text-right max-w-[120px] truncate">{selectedCourse.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>LTI Mode:</span>
                      <span className="font-medium text-green-500">mock ✓</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mini health indicator */}
            <Card className="bg-white dark:bg-zinc-900">
              <CardContent className="pt-4">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Infrastructure
                </div>
                <div className="space-y-1.5">
                  {[
                    { label: "D1 Database", id: "d1" },
                    { label: "Vectorize", id: "vec" },
                    { label: "GPT-4o-mini", id: "llm" },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="text-green-500 font-medium">● live</span>
                    </div>
                  ))}
                </div>
                <a
                  href="/api/health"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-muted-foreground hover:underline mt-2 block"
                >
                  View health endpoint →
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
