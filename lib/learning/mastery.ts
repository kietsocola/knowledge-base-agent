export interface ExistingConceptMastery {
  masteryScore: number | null
  confidenceScore: number | null
  evidenceCount: number | null
}

export interface IncomingConceptMastery {
  masteryScore: number
  confidenceScore: number
}

export interface MergedConceptMastery {
  masteryScore: number
  confidenceScore: number
  evidenceCount: number
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000
}

export function mergeConceptMastery(
  existing: ExistingConceptMastery | null,
  incoming: IncomingConceptMastery
): MergedConceptMastery {
  if (!existing) {
    return {
      masteryScore: round(incoming.masteryScore),
      confidenceScore: round(incoming.confidenceScore),
      evidenceCount: 1,
    }
  }

  const evidenceCount = Math.max(existing.evidenceCount ?? 0, 0)
  const currentScore = existing.masteryScore ?? incoming.masteryScore
  const mergedEvidenceCount = evidenceCount + 1
  const weightedScore =
    (currentScore * evidenceCount + incoming.masteryScore) / mergedEvidenceCount

  return {
    masteryScore: round(weightedScore),
    confidenceScore: round(Math.max(existing.confidenceScore ?? 0, incoming.confidenceScore)),
    evidenceCount: mergedEvidenceCount,
  }
}
