import type { LearningEventSnapshot, LearningTimelinePoint } from "@/types/learning"

interface BuildActivityTimelineOptions {
  limit?: number
}

function toDateKey(timestamp: number): string {
  return new Date(timestamp * 1000).toISOString().slice(0, 10)
}

function toLabel(dateKey: string): string {
  const [year, month, day] = dateKey.split("-")
  return `${day}/${month}`
}

export function buildActivityTimeline(
  events: LearningEventSnapshot[],
  options: BuildActivityTimelineOptions = {}
): LearningTimelinePoint[] {
  const limit = options.limit ?? 7
  const buckets = new Map<string, LearningTimelinePoint>()

  for (const event of events) {
    if (!event.createdAt) continue

    const dateKey = toDateKey(event.createdAt)
    const bucket = buckets.get(dateKey) ?? {
      dateKey,
      label: toLabel(dateKey),
      totalEvents: 0,
      chatTurns: 0,
      evaluations: 0,
    }

    bucket.totalEvents += 1
    if (event.eventType === "chat_turn_recorded") {
      bucket.chatTurns += 1
    }
    if (event.eventType === "evaluation_generated") {
      bucket.evaluations += 1
    }

    buckets.set(dateKey, bucket)
  }

  return Array.from(buckets.values())
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
    .slice(-limit)
}
