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
        "flex items-start gap-3 px-4 py-3",
        isUser && "flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-primary/10 border border-primary/20 text-primary"
        )}
      >
        {isUser ? "SV" : "AI"}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-muted rounded-tl-sm"
        )}
      >
        <div
          className={cn(
            "prose prose-sm max-w-none",
            isUser
              ? "prose-invert"
              : "dark:prose-invert",
            "prose-p:my-1 prose-headings:my-1 prose-ul:my-1 prose-ol:my-1",
            "prose-code:text-xs prose-code:bg-background/50 prose-code:px-1 prose-code:rounded"
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
