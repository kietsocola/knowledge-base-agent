import test from "node:test"
import assert from "node:assert/strict"
import type { UIMessage } from "ai"

import {
  getRevealableStreamText,
  getUIMessageText,
  hasStreamingText,
  splitStreamTextUnits,
} from "@/lib/chat/message-text"

function makeMessage(parts: UIMessage["parts"]): UIMessage {
  return {
    id: "msg-1",
    role: "assistant",
    metadata: undefined,
    parts,
  }
}

test("getUIMessageText joins all text parts including partial streamed content", () => {
  const message = makeMessage([
    { type: "text", text: "Xin chào", state: "streaming" },
    { type: "text", text: " bạn", state: "done" },
  ])

  assert.equal(getUIMessageText(message), "Xin chào bạn")
})

test("hasStreamingText detects active streamed assistant content", () => {
  const message = makeMessage([{ type: "text", text: "Đang trả lời", state: "streaming" }])

  assert.equal(hasStreamingText(message), true)
})

test("hasStreamingText returns false when text is complete", () => {
  const message = makeMessage([{ type: "text", text: "Đã xong", state: "done" }])

  assert.equal(hasStreamingText(message), false)
})

test("splitStreamTextUnits preserves word-by-word realtime reveal order", () => {
  assert.deepEqual(
    splitStreamTextUnits("Cấu trúc chuỗi nút."),
    ["Cấu", " ", "trúc", " ", "chuỗi", " ", "nút", "."]
  )
})

test("getRevealableStreamText hides incomplete trailing Vietnamese word while streaming", () => {
  assert.equal(getRevealableStreamText("Cấu tr", true), "Cấu ")
  assert.equal(getRevealableStreamText("Cấu trúc ", true), "Cấu trúc ")
  assert.equal(getRevealableStreamText("Cấu trúc", false), "Cấu trúc")
})
