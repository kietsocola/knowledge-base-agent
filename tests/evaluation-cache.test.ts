import test from "node:test"
import assert from "node:assert/strict"
import { shouldReuseCachedEvaluation } from "@/lib/evaluation/cache"

test("shouldReuseCachedEvaluation returns false when there is no cached snapshot", () => {
  assert.equal(shouldReuseCachedEvaluation(undefined, 8), false)
  assert.equal(shouldReuseCachedEvaluation(null, 8), false)
})

test("shouldReuseCachedEvaluation returns true when cached snapshot matches the current message count", () => {
  assert.equal(shouldReuseCachedEvaluation(8, 8), true)
})

test("shouldReuseCachedEvaluation returns false when new messages were added after the cached snapshot", () => {
  assert.equal(shouldReuseCachedEvaluation(8, 10), false)
})

test("shouldReuseCachedEvaluation returns false when cached snapshot is ahead of the current history", () => {
  assert.equal(shouldReuseCachedEvaluation(10, 8), false)
})
