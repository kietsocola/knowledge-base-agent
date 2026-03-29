"use client"

import ReactMarkdown from "react-markdown"
import { cn } from "@/lib/utils"

interface MarkdownMessageProps {
  text: string
  isUser: boolean
}

export function MarkdownMessage({ text, isUser }: MarkdownMessageProps) {
  return (
    <div
      className={cn(
        "prose prose-sm max-w-none",
        isUser ? "prose-invert" : "dark:prose-invert",
        "prose-p:my-1 prose-headings:my-1 prose-ul:my-1 prose-ol:my-1 prose-pre:rounded-xl prose-pre:bg-foreground prose-pre:text-background",
        "prose-code:text-xs prose-code:bg-background/60 prose-code:px-1 prose-code:rounded prose-strong:text-current"
      )}
    >
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  )
}
