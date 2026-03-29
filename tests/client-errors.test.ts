import test from "node:test"
import assert from "node:assert/strict"

import { isAbortLikeError, toErrorMessage } from "@/lib/http/client-errors"

test("isAbortLikeError detects AbortError instances", () => {
  assert.equal(isAbortLikeError(new DOMException("The user aborted a request.", "AbortError")), true)
})

test("isAbortLikeError ignores regular errors", () => {
  assert.equal(isAbortLikeError(new Error("Network failed")), false)
})

test("toErrorMessage unwraps Error messages without Error prefix noise", () => {
  assert.equal(toErrorMessage(new Error("Không tải được dữ liệu"), "fallback"), "Không tải được dữ liệu")
})
