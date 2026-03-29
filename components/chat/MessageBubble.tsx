"use client"

import dynamic from "next/dynamic"
import { useEffect, useMemo, useState } from "react"
import { Command, UserRound } from "lucide-react"
import { CitationRow } from "./CitationCard"
import type { UIMessage } from "ai"
import type { Citation } from "@/types/chat"
import { cn } from "@/lib/utils"
import { chatParticipantLabels } from "@/lib/chat/chat-surface"
import {
  getRevealableStreamText,
  getUIMessageText,
  hasStreamingText,
  splitStreamTextUnits,
} from "@/lib/chat/message-text"

const MarkdownMessage = dynamic(
  () => import("./MarkdownMessage").then((mod) => mod.MarkdownMessage),
  {
    loading: () => <div className="text-[15px] leading-7 text-foreground/92 dark:text-foreground/92" />,
  }
)

interface MessageBubbleProps {
  message: UIMessage
  shouldAnimateReveal?: boolean
}

/** Replace [SOURCE_X] markers with cleaner [X] for display */
function cleanSourceMarkers(text: string): string {
  return text.replace(/\[SOURCE_(\d+)\]/g, "[$1]")
}

export function MessageBubble({ message, shouldAnimateReveal = false }: MessageBubbleProps) {
  const isUser = message.role === "user"
  const text = getUIMessageText(message)
  const isStreaming = hasStreamingText(message)
  const cleanedText = isUser ? text : cleanSourceMarkers(text)
  const metadata = message.metadata as
    | { citations?: Citation[]; triggerEvaluation?: boolean }
    | undefined
  const citations = metadata?.citations ?? []
  const shouldUseStreamingGuard = !isUser && (isStreaming || shouldAnimateReveal)
  const revealTargetText = useMemo(
    () => getRevealableStreamText(cleanedText, shouldUseStreamingGuard),
    [cleanedText, shouldUseStreamingGuard]
  )
  const revealUnits = useMemo(() => splitStreamTextUnits(revealTargetText), [revealTargetText])
  const [revealedUnitCount, setRevealedUnitCount] = useState(
    shouldUseStreamingGuard ? 0 : revealUnits.length
  )

  useEffect(() => {
    if (!shouldUseStreamingGuard) {
      setRevealedUnitCount(revealUnits.length)
      return
    }

    setRevealedUnitCount((current) => {
      if (current > revealUnits.length) return 0
      return current
    })
  }, [message.id, revealUnits.length, shouldUseStreamingGuard])

  useEffect(() => {
    if (!shouldUseStreamingGuard) return
    if (revealedUnitCount >= revealUnits.length) return

    const timeout = window.setTimeout(() => {
      setRevealedUnitCount((current) => Math.min(current + 1, revealUnits.length))
    }, 22)

    return () => window.clearTimeout(timeout)
  }, [revealUnits.length, revealedUnitCount, shouldUseStreamingGuard])

  const streamedText = useMemo(
    () => revealUnits.slice(0, revealedUnitCount).join(""),
    [revealUnits, revealedUnitCount]
  )
  const isRevealInProgress = shouldUseStreamingGuard && revealedUnitCount < revealUnits.length

  if (!text && citations.length === 0) return null

  return (
    <div
      className={cn(
        "px-4 py-1 sm:px-6",
        isUser ? "flex justify-end" : "flex justify-start"
      )}
    >
      <div className={cn("flex max-w-[min(90%,820px)] items-end gap-2", isUser && "flex-row-reverse")}>
        <div
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[10px]",
            isUser
              ? "border-primary/18 bg-primary/10 text-primary"
              : "border-border/70 bg-card text-primary"
          )}
        >
          {isUser ? <UserRound className="h-4 w-4" /> : <Command className="h-4 w-4" />}
        </div>

        <div className="min-w-0">
          {!isUser && (
            <div className="mb-1 px-1 text-[10px] font-medium text-muted-foreground">
              {chatParticipantLabels.assistant}
            </div>
          )}

          <div
            className={cn(
              "overflow-hidden border",
              isUser
                ? "rounded-[1.4rem] border-primary/12 bg-[linear-gradient(180deg,rgba(25,69,99,0.96),rgba(18,33,47,0.92))] text-primary-foreground shadow-[0_12px_30px_-24px_rgba(15,23,32,0.26)]"
                : "rounded-[1.25rem] border-border/55 bg-background/92 text-foreground dark:bg-card/88"
            )}
          >
            <div
              className={cn(
                "px-4 py-2.5 sm:px-4.5 sm:py-3"
              )}
            >
              {isRevealInProgress ? (
                <div className="streaming-text text-[15px] leading-7 text-foreground/92 dark:text-foreground/92">
                  {streamedText}
                </div>
              ) : (
                <MarkdownMessage text={cleanedText} isUser={isUser} />
              )}

              {!isUser && isRevealInProgress && (
                <span className="stream-caret ml-1 inline-block h-4 w-1.5 rounded-full bg-primary/55 align-middle" aria-hidden="true" />
              )}
            </div>

            {!isUser && citations.length > 0 && (
              <CitationRow citations={citations} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
