type PdfResult = {
  text: string
  numpages: number
}

type PdfTextItem = {
  str?: string
  hasEOL?: boolean
}

type PdfParseTextResult = {
  text?: string
  total?: number
}

type PdfParseInstance = {
  getText: () => Promise<PdfParseTextResult>
  destroy?: () => Promise<void>
}

type PdfParseModule = {
  PDFParse: new (options: { data: Buffer | Uint8Array }) => PdfParseInstance
}

let pdfParseModulePromise: Promise<PdfParseModule> | null = null

async function loadPdfParseModule(): Promise<PdfParseModule> {
  if (!pdfParseModulePromise) {
    pdfParseModulePromise = (async () => {
      const runtimeRequire = eval("require") as NodeRequire
      return runtimeRequire("pdf-parse") as PdfParseModule
    })()
  }

  return pdfParseModulePromise
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
  const { PDFParse } = await loadPdfParseModule()
  const parser = new PDFParse({ data: buffer })

  try {
    const result = await parser.getText()
    const text = result.text?.trim() ?? ""

    return {
      text,
      numpages: result.total ?? 0,
    }
  } finally {
    await parser.destroy?.()
  }
}
