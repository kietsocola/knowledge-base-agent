import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Single DB client for both local dev and Vercel production.
// Set DATABASE_URL in .env.local (local) or Vercel environment variables (production).

let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (_db) return _db;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const client = postgres(connectionString, {
    // Vercel serverless: disable connection pooling (each invocation is short-lived)
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  _db = drizzle(client, { schema });
  return _db;
}

export type DB = ReturnType<typeof getDb>;
