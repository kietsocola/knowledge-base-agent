import type { EvaluationResult } from "@/types/evaluation"

export interface ConceptMasterySignal {
  conceptName: string
  conceptKey: string
  masteryScore: number
  confidenceScore: number
  source: "recommended_topic" | "gap"
}

export function toConceptKey(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function buildConceptMasterySignals(
  evaluation: EvaluationResult
): ConceptMasterySignal[] {
  const baseScore = clamp(evaluation.overallScore / 10, 0.2, 0.8)
  const rawConcepts =
    evaluation.recommendedTopics.length > 0
      ? evaluation.recommendedTopics.map((topic) => ({
          conceptName: topic,
          source: "recommended_topic" as const,
        }))
      : evaluation.gaps.map((gap) => ({
          conceptName: gap,
          source: "gap" as const,
        }))

  const deduped = new Map<string, ConceptMasterySignal>()

  for (const item of rawConcepts) {
    const conceptName = item.conceptName.trim()
    if (!conceptName) continue

    const conceptKey = toConceptKey(conceptName)
    if (!conceptKey || deduped.has(conceptKey)) continue

    deduped.set(conceptKey, {
      conceptName,
      conceptKey,
      masteryScore: clamp(baseScore - 0.2, 0.15, 0.5),
      confidenceScore: item.source === "recommended_topic" ? 0.75 : 0.6,
      source: item.source,
    })
  }

  return Array.from(deduped.values())
}
