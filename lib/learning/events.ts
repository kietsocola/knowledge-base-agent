export interface CreateLearningEventInput {
  studentId: string
  courseId: string
  sessionId: string
  eventType: string
  payload: Record<string, unknown>
  createdAt: number
}

export function createLearningEvent(input: CreateLearningEventInput) {
  return {
    id: crypto.randomUUID(),
    studentId: input.studentId,
    courseId: input.courseId,
    sessionId: input.sessionId,
    eventType: input.eventType,
    eventPayload: JSON.stringify(input.payload),
    createdAt: input.createdAt,
  }
}
