import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { parsePdf } from "@/lib/rag/pdf"

test("parsePdf extracts text and page count from a sample PDF", async () => {
  const buffer = readFileSync("public/sample-docs/SGK-tin12-bai1-2.pdf")
  const result = await parsePdf(buffer)

  assert.ok(result.numpages >= 1)
  assert.ok(result.text.length > 100)
  assert.match(result.text, /Bài|Học|máy/i)
})
