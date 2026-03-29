import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs"

type PdfResult = {
  text: string
  numpages: number
}

type PdfTextItem = {
  str?: string
  hasEOL?: boolean
}

export function joinPdfTextItems(items: PdfTextItem[]): string {
  const parts: string[] = []

  for (const item of items) {
    const value = item.str?.trim()
    if (!value) continue

    if (parts.length > 0 && !parts.at(-1)?.endsWith("\n")) {
      parts.push(" ")
    }

    parts.push(value)

    if (item.hasEOL) {
      parts.push("\n")
    }
  }

  return parts
    .join("")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

export async function parsePdf(buffer: Buffer | Uint8Array): Promise<PdfResult> {
  const input =
    buffer instanceof Buffer
      ? new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength)
      : buffer instanceof Uint8Array
        ? new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength)
        : new Uint8Array(buffer)
  const loadingTask = getDocument({
    data: input,
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: false,
  })

  const pdf = await loadingTask.promise

  try {
    const pageTexts: string[] = []

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber)
      try {
        const textContent = await page.getTextContent()
        const items: PdfTextItem[] = []
        for (const item of textContent.items) {
          if ("str" in item) {
            items.push({ str: item.str, hasEOL: item.hasEOL })
          }
        }
        const pageText = joinPdfTextItems(items)
        if (pageText) {
          pageTexts.push(pageText)
        }
      } finally {
        page.cleanup()
      }
    }

    return {
      text: pageTexts.join("\n\n").trim(),
      numpages: pdf.numPages,
    }
  } finally {
    await loadingTask.destroy()
  }
}
