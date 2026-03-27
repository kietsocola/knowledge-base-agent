import { createRequire } from "module"
import { pathToFileURL } from "url"

type PdfResult = {
  text: string
  numpages: number
}

type PdfParseModule =
  | ((buffer: Buffer) => Promise<PdfResult>)
  | {
      default?: unknown
      PDFParse?: new (opts: { data: Uint8Array }) => {
        getText: () => Promise<{ text: string; total: number }>
        destroy?: () => Promise<void>
      }
    }

type PdfParserCtor = new (opts: { data: Uint8Array }) => {
  getText: () => Promise<{ text: string; total: number }>
  destroy?: () => Promise<void>
}

const requireForPdf = createRequire(import.meta.url)

function resolveWorkerSrc(): string | undefined {
  const candidates = [
    "pdf-parse/dist/worker/pdf.worker.mjs",
    "pdf-parse/dist/pdf-parse/esm/pdf.worker.mjs",
    "pdfjs-dist/legacy/build/pdf.worker.mjs",
    "pdfjs-dist/build/pdf.worker.mjs",
  ]

  for (const candidate of candidates) {
    try {
      const abs = requireForPdf.resolve(candidate)
      return pathToFileURL(abs).toString()
    } catch {
      continue
    }
  }

  return undefined
}

export async function parsePdf(buffer: Buffer | Uint8Array): Promise<PdfResult> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mod = requireForPdf("pdf-parse") as PdfParseModule
  const input = buffer instanceof Uint8Array ? Buffer.from(buffer) : buffer

  if (typeof mod === "function") {
    return mod(input)
  }

  const PDFParseCtor =
    (mod as { PDFParse?: unknown }).PDFParse ??
    (mod as { default?: { PDFParse?: unknown } }).default?.PDFParse

  if (typeof PDFParseCtor === "function") {
    const parserCtor = PDFParseCtor as PdfParserCtor
    const ctorWithWorker = PDFParseCtor as PdfParserCtor & {
      setWorker?: (workerSrc?: string) => string
    }

    const workerSrc = resolveWorkerSrc()
    if (typeof ctorWithWorker.setWorker === "function") {
      ctorWithWorker.setWorker(workerSrc)
    }

    const parser = new parserCtor({ data: new Uint8Array(input) })

    try {
      const textResult = await parser.getText()
      return { text: textResult.text, numpages: textResult.total }
    } finally {
      if (typeof parser.destroy === "function") {
        await parser.destroy().catch(() => undefined)
      }
    }
  }

  throw new Error("Unsupported pdf-parse export shape")
}
