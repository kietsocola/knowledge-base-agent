import type { TextUIPart, UIMessage } from "ai"

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
