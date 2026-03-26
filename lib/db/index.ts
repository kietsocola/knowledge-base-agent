import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// In Cloudflare Workers, we use the D1 binding via getCloudflareContext().
// For local `next dev`, we use a local SQLite file via libsql.
// The Drizzle schema is identical in both cases.

let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (_db) return _db;

  // Local dev fallback using libsql (file-based SQLite)
  const { createClient } = require("@libsql/client");
  const client = createClient({
    url: "file:./local.db",
  });
  _db = drizzle(client, { schema });
  return _db;
}

// For Cloudflare Workers runtime — pass the D1 binding directly
export function getCloudflareDb(d1: D1Database) {
  const { drizzle: drizzleD1 } = require("drizzle-orm/d1");
  return drizzleD1(d1, { schema });
}

export type DB = ReturnType<typeof getCloudflareDb>;
