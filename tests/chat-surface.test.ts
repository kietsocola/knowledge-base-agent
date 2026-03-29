import test from "node:test"
import assert from "node:assert/strict"

import {
  chatEmptyState,
  chatEmptyStateToneClasses,
  chatParticipantLabels,
  chatQuickActions,
} from "@/lib/chat/chat-surface"

test("chat surface uses a concise command-style empty state", () => {
  assert.equal(chatEmptyState.kicker, "Session ready")
  assert.equal(chatEmptyState.title, "Bắt đầu phiên học")
})

test("chat surface exposes three quick actions", () => {
  assert.equal(chatQuickActions.length, 3)
})

test("chat participant labels move away from generic AI markers", () => {
  assert.equal(chatParticipantLabels.user, "Bạn")
  assert.equal(chatParticipantLabels.assistant, "Tutor")
})

test("chat empty state exposes theme-aware accent classes", () => {
  assert.match(chatEmptyStateToneClasses.shell, /dark:/)
  assert.match(chatEmptyStateToneClasses.kicker, /secondary/)
  assert.match(chatEmptyStateToneClasses.title, /bg-gradient-to-r/)
  assert.match(chatEmptyStateToneClasses.modeCard, /dark:/)
})

test("chat quick actions match the new operational prompts", () => {
  assert.deepEqual(chatQuickActions, [
    "Giải thích khái niệm cốt lõi",
    "Cho mình lộ trình học phần này",
    "Tóm tắt nhanh nội dung chính",
  ])
})
