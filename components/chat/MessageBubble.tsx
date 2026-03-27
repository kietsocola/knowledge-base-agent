"use client"

import ReactMarkdown from "react-markdown"
import { Avatar } from "@/components/ui/avatar"
import { CitationRow } from "./CitationCard"
import type { UIMessage } from "ai"
import type { Citation } from "@/types/chat"
import { cn } from "@/lib/utils"

interface MessageBubbleProps {
  message: UIMessage
}

/** Replace [SOURCE_X] markers with cleaner [X] for display */
function cleanSourceMarkers(text: string): string {
  return text.replace(/\[SOURCE_(\d+)\]/g, "[$1]")
}

/** Extract text content from UIMessage parts */
function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((p) => p.type === "text")
    .map((p) => (p as { type: "text"; text: string }).text)
    .join("")
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user"
  const text = getMessageText(message)
  const metadata = message.metadata as
    | { citations?: Citation[]; triggerEvaluation?: boolean }
    | undefined
  const citations = metadata?.citations ?? []

  if (!text && citations.length === 0) return null

  return (
    <div
      className={cn(
        "flex items-start gap-4 px-4 py-2 sm:px-8",
        isUser && "flex-row-reverse"
      )}
    >
      <div
        className={cn(
          "mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl text-[11px] font-bold shadow-sm",
          isUser
            ? "bg-slate-200 text-slate-700"
            : "bg-primary text-primary-foreground shadow-primary/20"
        )}
      >
        {isUser ? "SV" : "AI"}
      </div>

      <div
        className={cn(
          "max-w-[86%] rounded-[1.6rem] px-5 py-4 shadow-sm",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-md shadow-lg shadow-primary/20"
            : "rounded-tl-md border border-white/80 bg-white/90 text-foreground"
        )}
      >
        <div
          className={cn(
            "prose prose-sm max-w-none",
            isUser
              ? "prose-invert"
              : "dark:prose-invert",
            "prose-p:my-1 prose-headings:my-1 prose-ul:my-1 prose-ol:my-1 prose-pre:rounded-2xl prose-pre:bg-slate-950 prose-pre:text-slate-100",
            "prose-code:text-xs prose-code:bg-background/60 prose-code:px-1 prose-code:rounded prose-strong:text-current"
          )}
        >
          <ReactMarkdown>
            {isUser ? text : cleanSourceMarkers(text)}
          </ReactMarkdown>
        </div>

        {/* Citation row (assistant only) */}
        {!isUser && citations.length > 0 && (
          <CitationRow citations={citations} />
        )}
      </div>
    </div>
  )
}
