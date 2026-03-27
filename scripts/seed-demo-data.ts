/**
 * Seed demo courses and students into Supabase.
 * Run after `pnpm db:push` to set up initial data.
 *
 * Usage: npx tsx scripts/seed-demo-data.ts
 *
 * Required env vars: DATABASE_URL
 */

import { loadEnvConfig } from "@next/env";
import postgres from "postgres";

loadEnvConfig(process.cwd());

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("Missing DATABASE_URL");
  process.exit(1);
}

const sql = postgres(databaseUrl, { max: 1 });

async function main() {
  console.log("Seeding demo courses...");
  await sql`
    INSERT INTO courses (id, title, lti_iss) VALUES
      ('course-ctdl-001', 'Cấu Trúc Dữ Liệu & Giải Thuật', 'https://mock-moodle.demo.edu.vn'),
      ('course-oop-001', 'Lập Trình Hướng Đối Tượng', 'https://mock-moodle.demo.edu.vn'),
      ('course-db-001', 'Cơ Sở Dữ Liệu', 'https://mock-moodle.demo.edu.vn')
    ON CONFLICT (id) DO NOTHING
  `;

  console.log("Seeding demo students...");
  await sql`
    INSERT INTO students (id, lti_iss, display_name, email) VALUES
      ('student-001', 'https://mock-moodle.demo.edu.vn', 'Nguyễn Văn An', 'an.nguyen@demo.edu.vn'),
      ('student-002', 'https://mock-moodle.demo.edu.vn', 'Trần Thị Bình', 'binh.tran@demo.edu.vn'),
      ('student-003', 'https://mock-moodle.demo.edu.vn', 'Lê Minh Cường', 'cuong.le@demo.edu.vn')
    ON CONFLICT (id) DO NOTHING
  `;

  console.log("✅ Seed complete!");
  await sql.end();
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
