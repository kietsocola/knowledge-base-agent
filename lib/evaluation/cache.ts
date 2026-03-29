export function shouldReuseCachedEvaluation(
  cachedTriggeredAtMsg: number | null | undefined,
  currentMessageCount: number
): boolean {
  if (cachedTriggeredAtMsg == null) {
    return false
  }

  if (cachedTriggeredAtMsg !== currentMessageCount) {
    return false
  }

  return true
}
