import test from "node:test"
import assert from "node:assert/strict"

import { pageWidthPresets } from "@/lib/layout/page-widths"

test("page width presets cover only non-immersive pages", () => {
  assert.deepEqual(Object.keys(pageWidthPresets).sort(), [
    "classroom",
    "evaluation",
    "landing",
    "portal",
  ])
})

test("landing remains the widest baseline preset", () => {
  assert.equal(pageWidthPresets.landing.maxWidth, 1680)
  assert.ok(pageWidthPresets.classroom.maxWidth < pageWidthPresets.landing.maxWidth)
})

test("chat is intentionally excluded from width presets", () => {
  assert.equal("chat" in pageWidthPresets, false)
})
