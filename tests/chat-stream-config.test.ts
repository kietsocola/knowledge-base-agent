import test from "node:test"
import assert from "node:assert/strict"

import { CHAT_STREAM_CHUNKING, CHAT_STREAM_DELAY_MS } from "@/lib/chat/stream-config"

test("chat stream delay stays in a fast realtime range", () => {
  assert.ok(CHAT_STREAM_DELAY_MS > 0)
  assert.ok(CHAT_STREAM_DELAY_MS <= 10)
})

test("chat stream chunking preserves words and punctuation in short chunks", () => {
  const chunks = Array.from("Xin chào, bạn nhé!".match(CHAT_STREAM_CHUNKING) ?? [])

  assert.deepEqual(chunks, ["Xin ", "chào", ",", "bạn ", "nhé", "!"])
})
