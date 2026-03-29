import type { TextUIPart, UIMessage } from "ai"

const STREAM_TEXT_SEGMENTER = new Intl.Segmenter("vi", {
  granularity: "word",
})

function getTextParts(message: UIMessage): TextUIPart[] {
  return message.parts.filter((part): part is TextUIPart => part.type === "text")
}

export function getUIMessageText(message: UIMessage): string {
  return getTextParts(message)
    .map((part) => part.text)
    .join("")
}

export function hasStreamingText(message: UIMessage): boolean {
  return getTextParts(message).some((part) => part.state === "streaming")
}

export function splitStreamTextUnits(text: string): string[] {
  return Array.from(STREAM_TEXT_SEGMENTER.segment(text), (part) => part.segment)
}

export function getRevealableStreamText(text: string, isStreaming: boolean): string {
  const segments = Array.from(STREAM_TEXT_SEGMENTER.segment(text))

  if (!isStreaming || segments.length === 0) {
    return segments.map((part) => part.segment).join("")
  }

  const lastSegment = segments[segments.length - 1]
  const canHoldTail = lastSegment.isWordLike && !/[\s\p{P}\p{S}]$/u.test(text)
  const safeSegments = canHoldTail ? segments.slice(0, -1) : segments

  return safeSegments.map((part) => part.segment).join("")
}
