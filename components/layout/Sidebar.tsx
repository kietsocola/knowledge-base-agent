"use client"

import { useEffect, useState } from "react"
import { BookOpen, FileText, BarChart3, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface Document {
  id: string
  name: string
  pageCount: number | null
}

interface SidebarProps {
  courseId: string
  courseName: string
  studentName: string
  sessionId: string
  messageCount: number
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({
  courseId,
  courseName,
  studentName,
  sessionId,
  messageCount,
  isOpen,
  onClose,
}: SidebarProps) {
  const [docs, setDocs] = useState<Document[]>([])
  const [loadingDocs, setLoadingDocs] = useState(true)

  useEffect(() => {
    if (!courseId) return
    fetch(`/api/documents?courseId=${courseId}`)
      .then((r) => r.json())
      .then((d: unknown) => {
        const data = d as { documents?: Document[] }
        setDocs(data.documents ?? [])
        setLoadingDocs(false)
      })
      .catch(() => setLoadingDocs(false))
  }, [courseId])

  const nextEvalAt = 4 - (messageCount % 4)
  const evalProgress = messageCount % 4

  return (
    <>
      {/* Overlay on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          "fixed top-0 right-0 h-full w-72 bg-background border-l border-border z-50 flex flex-col transition-transform duration-300",
          "lg:static lg:translate-x-0 lg:z-auto",
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="font-semibold text-sm">Thông tin</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 lg:hidden"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Course info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Môn học
              </span>
            </div>
            <div className="text-sm font-medium leading-snug">{courseName}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Sinh viên: {studentName}
            </div>
          </div>

          <Separator />

          {/* Documents */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Tài liệu
              </span>
            </div>
            {loadingDocs ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
              </div>
            ) : docs.length === 0 ? (
              <div className="text-xs text-muted-foreground italic">
                Chưa có tài liệu nào được ingest.
              </div>
            ) : (
              <ul className="space-y-1.5">
                {docs.map((doc) => (
                  <li key={doc.id} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-medium leading-snug">
                        {doc.name}
                      </div>
                      {doc.pageCount && (
                        <div className="text-[10px] text-muted-foreground">
                          {doc.pageCount} trang
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Separator />

          {/* Evaluation progress */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Tiến độ đánh giá
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${(evalProgress / 4) * 100}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground mt-1.5">
              {messageCount === 0 ? (
                "Hỏi 4 câu để nhận đánh giá năng lực"
              ) : evalProgress === 0 ? (
                "Sẵn sàng đánh giá! Xem kết quả →"
              ) : (
                `Còn ${nextEvalAt} câu nữa để được đánh giá`
              )}
            </div>

            {evalProgress === 0 && messageCount > 0 && (
              <a
                href="/evaluation"
                className="mt-2 text-xs font-medium text-primary hover:underline block"
              >
                Xem đánh giá năng lực →
              </a>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border">
          <a
            href="/api/health"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-muted-foreground hover:underline flex items-center gap-1"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Infrastructure live
          </a>
        </div>
      </aside>
    </>
  )
}
