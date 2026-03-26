// Edge-safe: only Cloudflare D1 bindings — no Node.js native modules
import { drizzle } from "drizzle-orm/d1"
import * as schema from "./schema"

export function getCloudflareDb(d1: D1Database) {
  return drizzle(d1, { schema })
}

export type CloudflareDB = ReturnType<typeof getCloudflareDb>
