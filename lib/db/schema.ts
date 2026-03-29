import { sql } from "drizzle-orm";
import { integer, pgTable, text, real, customType, uniqueIndex } from "drizzle-orm/pg-core";

// pgvector custom type: stores float[] as PostgreSQL vector
const vector = (name: string, dimensions: number) =>
  customType<{ data: number[]; driverData: string }>({
    dataType() {
      return `vector(${dimensions})`;
    },
    toDriver(value: number[]): string {
      return `[${value.join(",")}]`;
    },
    fromDriver(value: string): number[] {
      return value.slice(1, -1).split(",").map(Number);
    },
  })(name);

export const students = pgTable("students", {
  id: text("id").primaryKey(), // from LTI sub claim
  ltiIss: text("lti_iss").notNull(),
  displayName: text("display_name"),
  email: text("email"),
  createdAt: integer("created_at").default(sql`extract(epoch from now())::int`),
  updatedAt: integer("updated_at").default(sql`extract(epoch from now())::int`),
});

export const courses = pgTable("courses", {
  id: text("id").primaryKey(), // from LTI context.id
  title: text("title").notNull(),
  ltiIss: text("lti_iss"),
  createdAt: integer("created_at").default(sql`extract(epoch from now())::int`),
});

export const documents = pgTable("documents", {
  id: text("id").primaryKey(),
  courseId: text("course_id").references(() => courses.id),
  name: text("name").notNull(),
  sourceUrl: text("source_url"),
  pageCount: integer("page_count"),
  createdAt: integer("created_at").default(sql`extract(epoch from now())::int`),
});

export const documentChunks = pgTable("document_chunks", {
  id: text("id").primaryKey(), // UUID = used as vector ID
  documentId: text("document_id").references(() => documents.id),
  chunkIndex: integer("chunk_index"),
  chunkText: text("chunk_text").notNull(),
  pageNumber: integer("page_number"),
  embedding: vector("embedding", 768), // pgvector: cosine similarity search
  createdAt: integer("created_at").default(sql`extract(epoch from now())::int`),
});

export const chatSessions = pgTable("chat_sessions", {
  id: text("id").primaryKey(),
  studentId: text("student_id").references(() => students.id),
  courseId: text("course_id").references(() => courses.id),
  ltiLaunchId: text("lti_launch_id"),
  status: text("status").default("active"), // active | completed | archived
  createdAt: integer("created_at").default(sql`extract(epoch from now())::int`),
  updatedAt: integer("updated_at").default(sql`extract(epoch from now())::int`),
});

export const messages = pgTable("messages", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").references(() => chatSessions.id),
  role: text("role").notNull(), // 'user' | 'assistant'
  content: text("content").notNull(),
  citations: text("citations"), // JSON: Citation[]
  createdAt: integer("created_at").default(sql`extract(epoch from now())::int`),
});

export const evaluations = pgTable("evaluations", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").references(() => chatSessions.id),
  triggeredAtMsg: integer("triggered_at_msg"),
  radarScores: text("radar_scores"), // JSON object
  strengths: text("strengths"), // JSON array
  gaps: text("gaps"), // JSON array
  overallScore: real("overall_score"),
  resultJson: text("result_json"), // full EvaluationResult JSON
  createdAt: integer("created_at").default(sql`extract(epoch from now())::int`),
});

export const courseConcepts = pgTable(
  "course_concepts",
  {
    id: text("id").primaryKey(),
    courseId: text("course_id").references(() => courses.id).notNull(),
    name: text("name").notNull(),
    nameKey: text("name_key").notNull(),
    source: text("source").default("evaluation"),
    createdAt: integer("created_at").default(sql`extract(epoch from now())::int`),
    updatedAt: integer("updated_at").default(sql`extract(epoch from now())::int`),
  },
  (table) => ({
    courseConceptUnique: uniqueIndex("course_concepts_course_name_key_idx").on(table.courseId, table.nameKey),
  })
);

export const studentConceptMastery = pgTable(
  "student_concept_mastery",
  {
    id: text("id").primaryKey(),
    studentId: text("student_id").references(() => students.id).notNull(),
    courseId: text("course_id").references(() => courses.id).notNull(),
    conceptId: text("concept_id").references(() => courseConcepts.id).notNull(),
    masteryScore: real("mastery_score"),
    confidenceScore: real("confidence_score"),
    evidenceCount: integer("evidence_count").default(1),
    source: text("source").default("evaluation"),
    lastEvaluatedAt: integer("last_evaluated_at"),
    updatedAt: integer("updated_at").default(sql`extract(epoch from now())::int`),
  },
  (table) => ({
    studentConceptUnique: uniqueIndex("student_concept_mastery_student_course_concept_idx").on(
      table.studentId,
      table.courseId,
      table.conceptId
    ),
  })
);

// Type exports for use in queries
export type Student = typeof students.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type DocumentChunk = typeof documentChunks.$inferSelect;
export type ChatSession = typeof chatSessions.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Evaluation = typeof evaluations.$inferSelect;
export type CourseConcept = typeof courseConcepts.$inferSelect;
export type StudentConceptMastery = typeof studentConceptMastery.$inferSelect;
