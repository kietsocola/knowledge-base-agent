export function isAbortLikeError(error: unknown): boolean {
  if (error instanceof DOMException) {
    return error.name === "AbortError"
  }

  if (error instanceof Error) {
    return error.name === "AbortError" || /aborted|aborterror/i.test(error.message)
  }

  return false
}

export function toErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message || fallback
  }

  if (typeof error === "string" && error.trim()) {
    return error
  }

  return fallback
}
