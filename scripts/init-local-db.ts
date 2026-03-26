/**
 * Initialize local SQLite DB for `pnpm dev`.
 * Run once: npx tsx scripts/init-local-db.ts
 */
import { createClient } from "@libsql/client"
import { readFileSync } from "fs"
import { join } from "path"

const client = createClient({ url: "file:./local.db" })

async function run() {
  const migrationSql = readFileSync(
    join(process.cwd(), "drizzle/migrations/0000_cloudy_doctor_spectrum.sql"),
    "utf8"
  )

  // Split on drizzle statement-breakpoint marker
  const statements = migrationSql
    .split("--> statement-breakpoint")
    .map((s) => s.trim())
    .filter(Boolean)

  console.log(`Applying ${statements.length} migration statements...`)
  for (const sql of statements) {
    await client.execute(sql)
  }

  // Seed demo data
  const seedStatements = [
    `INSERT OR REPLACE INTO courses (id, title, lti_iss) VALUES
      ('course-ctdl-001', 'Cấu Trúc Dữ Liệu & Giải Thuật', 'https://mock-moodle.demo.edu.vn'),
      ('course-oop-001', 'Lập Trình Hướng Đối Tượng', 'https://mock-moodle.demo.edu.vn'),
      ('course-db-001', 'Cơ Sở Dữ Liệu', 'https://mock-moodle.demo.edu.vn')`,
    `INSERT OR REPLACE INTO students (id, lti_iss, display_name, email) VALUES
      ('student-001', 'https://mock-moodle.demo.edu.vn', 'Nguyễn Văn An', 'an.nguyen@demo.edu.vn'),
      ('student-002', 'https://mock-moodle.demo.edu.vn', 'Trần Thị Bình', 'binh.tran@demo.edu.vn'),
      ('student-003', 'https://mock-moodle.demo.edu.vn', 'Lê Minh Cường', 'cuong.le@demo.edu.vn')`,
  ]

  console.log("Seeding demo data...")
  for (const sql of seedStatements) {
    await client.execute(sql)
  }

  console.log("✅ local.db initialized successfully!")
  client.close()
}

run().catch((err) => {
  console.error("❌ Error:", err.message)
  process.exit(1)
})
