"use client"

import { useRef, useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Loader2,
  Upload,
  X,
} from "lucide-react"

interface UploadModalProps {
  open: boolean
  onClose: () => void
  courseId: string
  courseName: string
  onSuccess?: () => void
}

type Status = "idle" | "uploading" | "success" | "error"

export function UploadModal({
  open,
  onClose,
  courseId,
  courseName,
  onSuccess,
}: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [docName, setDocName] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [result, setResult] = useState<{ chunkCount: number; pageCount: number } | null>(null)
  const [errorMsg, setErrorMsg] = useState("")
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function selectFile(f: File) {
    if (!f.name.toLowerCase().endsWith(".pdf")) {
      setErrorMsg("Chỉ hỗ trợ file PDF")
      setStatus("error")
      return
    }
    setFile(f)
    if (!docName) setDocName(f.name.replace(/\.pdf$/i, ""))
    setStatus("idle")
    setErrorMsg("")
  }

  function reset() {
    setFile(null)
    setDocName("")
    setStatus("idle")
    setErrorMsg("")
    setResult(null)
  }

  function handleClose() {
    reset()
    onClose()
  }

  async function handleUpload() {
    if (!file || !docName.trim() || status === "uploading") return
    setStatus("uploading")
    setErrorMsg("")

    const body = new FormData()
    body.append("file", file)
    body.append("docName", docName.trim())
    body.append("courseId", courseId)

    try {
      const res = await fetch("/api/documents/upload", { method: "POST", body })
      const data = (await res.json()) as {
        success?: boolean
        error?: string
        chunkCount?: number
        pageCount?: number
      }
      if (!res.ok) throw new Error(data.error ?? "Upload thất bại")

      setResult({ chunkCount: data.chunkCount ?? 0, pageCount: data.pageCount ?? 0 })
      setStatus("success")
      onSuccess?.()
    } catch (err) {
      setErrorMsg(String(err).replace(/^Error:\s*/, ""))
      setStatus("error")
    }
  }

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) handleClose() }}>
      <SheetContent className="flex w-full flex-col sm:max-w-[480px]">
        <SheetHeader className="shrink-0">
          <SheetTitle>Tải lên tài liệu</SheetTitle>
          <p className="text-sm text-muted-foreground">
            Môn học: <strong>{courseName}</strong>
          </p>
        </SheetHeader>

        <div className="mt-6 flex flex-1 flex-col gap-5 overflow-y-auto px-4 pb-4">
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragOver(false)
              const f = e.dataTransfer.files[0]
              if (f) selectFile(f)
            }}
            onClick={() => inputRef.current?.click()}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
              dragOver
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/40 hover:bg-muted/30"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) selectFile(f)
              }}
            />
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="h-8 w-8 shrink-0 text-primary" />
                <div className="min-w-0 text-left">
                  <div className="truncate text-sm font-semibold">{file.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(0)} KB · PDF
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); reset() }}
                  className="ml-auto shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="mx-auto h-10 w-10 text-muted-foreground/40" />
                <div className="mt-3 text-sm font-semibold">Kéo thả hoặc nhấn để chọn file PDF</div>
                <div className="mt-1 text-xs text-muted-foreground">Tối đa ~10MB</div>
              </>
            )}
          </div>

          {/* Doc name */}
          <div className="space-y-1.5">
            <label htmlFor="upload-doc-name" className="text-sm font-semibold">
              Tên tài liệu
            </label>
            <Input
              id="upload-doc-name"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="VD: Giáo trình CTDL Chương 1"
              className="rounded-xl"
            />
          </div>

          {/* Status banners */}
          {status === "uploading" && (
            <div className="flex items-start gap-3 rounded-2xl bg-primary/5 p-4 text-sm">
              <Loader2 className="mt-0.5 h-5 w-5 shrink-0 animate-spin text-primary" />
              <div>
                  <div className="font-semibold text-primary">Đang xử lý…</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  Đọc PDF → Chia nhỏ → Tạo embedding → Lưu vào Supabase
                </div>
              </div>
            </div>
          )}

          {status === "success" && result && (
            <div className="flex items-start gap-3 rounded-2xl bg-emerald-50 p-4 text-sm dark:bg-emerald-950/30">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <div>
                <div className="font-semibold text-emerald-700 dark:text-emerald-400">
                  Ingest thành công!
                </div>
                <div className="mt-0.5 text-xs text-emerald-600/80 dark:text-emerald-500/80">
                  {result.pageCount} trang · {result.chunkCount} chunks đã lưu vào vector DB
                </div>
              </div>
            </div>
          )}

          {status === "error" && errorMsg && (
            <div className="flex items-start gap-3 rounded-2xl bg-destructive/10 p-4 text-sm">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
              <div>
                <div className="font-semibold text-destructive">Upload thất bại</div>
                <div className="mt-0.5 text-xs text-destructive/80">{errorMsg}</div>
              </div>
            </div>
          )}

          <div className="mt-auto space-y-2">
            <Button
              onClick={handleUpload}
              disabled={!file || !docName.trim() || status === "uploading"}
              className="w-full rounded-2xl"
            >
              {status === "uploading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý…
                </>
              ) : (
                "Bắt đầu ingest"
              )}
            </Button>

            {status === "success" && (
              <Button variant="outline" onClick={handleClose} className="w-full rounded-2xl">
                Đóng
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
