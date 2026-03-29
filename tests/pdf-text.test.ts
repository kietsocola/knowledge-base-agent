import test from "node:test"
import assert from "node:assert/strict"
import { joinPdfTextItems } from "@/lib/rag/pdf"

test("joinPdfTextItems preserves line breaks and spacing between PDF text items", () => {
  const text = joinPdfTextItems([
    { str: "Cấu trúc" },
    { str: "dữ liệu", hasEOL: true },
    { str: "Heap" },
    { str: "và" },
    { str: "priority queue", hasEOL: true },
    { str: "Độ phức tạp" },
  ])

  assert.equal(
    text,
    "Cấu trúc dữ liệu\nHeap và priority queue\nĐộ phức tạp"
  )
})

test("joinPdfTextItems ignores empty fragments and trims excessive blank lines", () => {
  const text = joinPdfTextItems([
    { str: "  " },
    { str: "BFS", hasEOL: true },
    { str: "" },
    { str: "DFS", hasEOL: true },
    { str: " " },
  ])

  assert.equal(text, "BFS\nDFS")
})
