"use client"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { BookOpen, FileText } from "lucide-react"
import type { Citation } from "@/types/chat"

interface CitationBadgeProps {
  citation: Citation
  index: number
}

export function CitationBadge({ citation, index }: CitationBadgeProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/15 hover:bg-primary/25 text-primary text-[10px] font-bold mx-0.5 cursor-pointer transition-colors border border-primary/30 align-middle"
        title={`Xem nguồn [${index}]`}
      >
        {index}
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="center"
        className="w-72 p-0 shadow-lg"
      >
        <div className="p-3 space-y-2">
          {/* Header */}
          <div className="flex items-start gap-2">
            <FileText className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <div className="font-semibold text-sm leading-tight truncate">
                {citation.documentName}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <BookOpen className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Trang {citation.pageNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Quote */}
          <div className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground leading-relaxed border-l-2 border-primary/40">
            &ldquo;{citation.quote}&rdquo;
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface CitationRowProps {
  citations: Citation[]
}

export function CitationRow({ citations }: CitationRowProps) {
  if (citations.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-1.5 mt-2 pt-2 border-t border-border/50">
      <span className="text-xs text-muted-foreground">Nguồn:</span>
      {citations.map((citation) => (
        <CitationBadge
          key={citation.chunkId}
          citation={citation}
          index={citation.sourceIndex}
        />
      ))}
    </div>
  )
}
