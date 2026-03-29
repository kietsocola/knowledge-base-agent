import type {
  ClassroomConceptInsight,
  ClassroomOverview,
  ClassroomStudentSnapshot,
} from "@/types/learning"
import { buildClassroomInterventionAlerts } from "@/lib/learning/interventions"
import { buildActivityTimeline } from "@/lib/learning/timeline"

interface ClassroomSessionSnapshot {
  studentId: string
  studentName: string
  sessionId: string
  createdAt: number | null
}

interface ClassroomEventSnapshot {
  studentId: string
  studentName: string
  eventType: string
  createdAt: number | null
}

interface ClassroomMasterySnapshot {
  studentId: string
  studentName: string
  conceptName: string
  masteryScore: number
  updatedAt: number | null
}

interface BuildClassroomOverviewInput {
  sessions: ClassroomSessionSnapshot[]
  events: ClassroomEventSnapshot[]
  masteries: ClassroomMasterySnapshot[]
}

interface StudentAccumulator {
  studentId: string
  studentName: string
  sessionIds: Set<string>
  totalChatTurns: number
  totalEvaluations: number
  conceptCount: number
  focusConceptCount: number
  masteryScores: number[]
  latestActivityAt: number | null
}

function computeAverage(values: number[]): number | null {
  if (values.length === 0) return null
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function byRecentActivity(a: ClassroomStudentSnapshot, b: ClassroomStudentSnapshot): number {
  return (b.latestActivityAt ?? 0) - (a.latestActivityAt ?? 0)
}

export function buildClassroomOverview({
  sessions,
  events,
  masteries,
}: BuildClassroomOverviewInput): ClassroomOverview {
  const studentMap = new Map<string, StudentAccumulator>()

  function ensureStudent(studentId: string, studentName: string): StudentAccumulator {
    const existing = studentMap.get(studentId)
    if (existing) return existing

    const created: StudentAccumulator = {
      studentId,
      studentName,
      sessionIds: new Set(),
      totalChatTurns: 0,
      totalEvaluations: 0,
      conceptCount: 0,
      focusConceptCount: 0,
      masteryScores: [],
      latestActivityAt: null,
    }
    studentMap.set(studentId, created)
    return created
  }

  for (const session of sessions) {
    const student = ensureStudent(session.studentId, session.studentName)
    student.sessionIds.add(session.sessionId)
    if ((session.createdAt ?? 0) > (student.latestActivityAt ?? 0)) {
      student.latestActivityAt = session.createdAt
    }
  }

  for (const event of events) {
    const student = ensureStudent(event.studentId, event.studentName)
    if (event.eventType === "chat_turn_recorded") {
      student.totalChatTurns += 1
    }
    if (event.eventType === "evaluation_generated") {
      student.totalEvaluations += 1
    }
    if ((event.createdAt ?? 0) > (student.latestActivityAt ?? 0)) {
      student.latestActivityAt = event.createdAt
    }
  }

  const conceptMap = new Map<string, { conceptName: string; scores: number[]; students: Set<string> }>()

  for (const mastery of masteries) {
    const student = ensureStudent(mastery.studentId, mastery.studentName)
    student.conceptCount += 1
    student.masteryScores.push(mastery.masteryScore)
    if (mastery.masteryScore < 0.5) {
      student.focusConceptCount += 1
    }
    if ((mastery.updatedAt ?? 0) > (student.latestActivityAt ?? 0)) {
      student.latestActivityAt = mastery.updatedAt
    }

    const concept = conceptMap.get(mastery.conceptName) ?? {
      conceptName: mastery.conceptName,
      scores: [],
      students: new Set<string>(),
    }
    concept.scores.push(mastery.masteryScore)
    concept.students.add(mastery.studentId)
    conceptMap.set(mastery.conceptName, concept)
  }

  const studentSnapshots: ClassroomStudentSnapshot[] = Array.from(studentMap.values())
    .map((student) => {
      const averageMasteryScore = computeAverage(student.masteryScores)
      const needsAttention =
        student.totalEvaluations === 0 ||
        student.focusConceptCount > 0 ||
        (averageMasteryScore !== null && averageMasteryScore < 0.6)

      return {
        studentId: student.studentId,
        studentName: student.studentName,
        totalSessions: student.sessionIds.size,
        totalChatTurns: student.totalChatTurns,
        totalEvaluations: student.totalEvaluations,
        conceptCount: student.conceptCount,
        averageMasteryScore,
        focusConceptCount: student.focusConceptCount,
        latestActivityAt: student.latestActivityAt,
        needsAttention,
      }
    })
    .sort((a, b) => {
      if (a.needsAttention !== b.needsAttention) {
        return a.needsAttention ? -1 : 1
      }
      const avgA = a.averageMasteryScore ?? -1
      const avgB = b.averageMasteryScore ?? -1
      if (avgA !== avgB) {
        return avgA - avgB
      }
      return byRecentActivity(a, b)
    })

  const conceptInsights: ClassroomConceptInsight[] = Array.from(conceptMap.values()).map((concept) => ({
    conceptName: concept.conceptName,
    averageMasteryScore: computeAverage(concept.scores) ?? 0,
    studentCount: concept.students.size,
  }))

  const latestActivityAt = studentSnapshots.length > 0
    ? Math.max(...studentSnapshots.map((student) => student.latestActivityAt ?? 0))
    : null

  const overview: ClassroomOverview = {
    totalStudents: studentSnapshots.length,
    activeStudents: studentSnapshots.filter((student) => student.totalChatTurns > 0 || student.totalEvaluations > 0).length,
    totalSessions: sessions.length,
    totalChatTurns: events.filter((event) => event.eventType === "chat_turn_recorded").length,
    totalEvaluations: events.filter((event) => event.eventType === "evaluation_generated").length,
    latestActivityAt: latestActivityAt && latestActivityAt > 0 ? latestActivityAt : null,
    activityTimeline: buildActivityTimeline(events),
    interventionAlerts: [],
    strugglingConcepts: [...conceptInsights]
      .sort((a, b) => a.averageMasteryScore - b.averageMasteryScore || b.studentCount - a.studentCount)
      .slice(0, 5),
    strongestConcepts: [...conceptInsights]
      .sort((a, b) => b.averageMasteryScore - a.averageMasteryScore || b.studentCount - a.studentCount)
      .slice(0, 5),
    studentsNeedingAttention: studentSnapshots.filter((student) => student.needsAttention).slice(0, 6),
    studentSnapshots,
  }

  overview.interventionAlerts = buildClassroomInterventionAlerts(overview)

  return overview
}
