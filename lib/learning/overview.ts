import type {
  LearningConceptSnapshot,
  LearningEventSnapshot,
  LearningOverview,
} from "@/types/learning"

interface BuildLearningOverviewInput {
  concepts: LearningConceptSnapshot[]
  events: LearningEventSnapshot[]
}

export function buildLearningOverview({
  concepts,
  events,
}: BuildLearningOverviewInput): LearningOverview {
  const sortedByWeakest = [...concepts].sort((a, b) => a.masteryScore - b.masteryScore)
  const focusConcepts = sortedByWeakest.filter((concept) => concept.masteryScore < 0.5).slice(0, 5)
  const improvingConcepts = sortedByWeakest
    .filter((concept) => concept.masteryScore >= 0.5 && concept.masteryScore < 0.75)
    .sort((a, b) => b.updatedAt! - a.updatedAt!)
    .slice(0, 5)
  const masteredConcepts = [...concepts]
    .filter((concept) => concept.masteryScore >= 0.75)
    .sort((a, b) => b.masteryScore - a.masteryScore)
    .slice(0, 5)

  const latestActivityAt =
    events.length > 0
      ? Math.max(...events.map((event) => event.createdAt ?? 0))
      : null

  return {
    totalConcepts: concepts.length,
    totalLearningEvents: events.length,
    totalChatTurns: events.filter((event) => event.eventType === "chat_turn_recorded").length,
    totalEvaluations: events.filter((event) => event.eventType === "evaluation_generated").length,
    latestActivityAt: latestActivityAt && latestActivityAt > 0 ? latestActivityAt : null,
    focusConcepts,
    improvingConcepts,
    masteredConcepts,
  }
}
