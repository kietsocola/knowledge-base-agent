-- Seed demo data for KB Agent demo
-- Run via: wrangler d1 execute kb-agent-db --remote --file=scripts/seed-demo-data.sql

-- Demo courses
INSERT OR REPLACE INTO courses (id, title, lti_iss) VALUES
  ('course-ctdl-001', 'Cấu Trúc Dữ Liệu & Giải Thuật', 'https://mock-moodle.demo.edu.vn'),
  ('course-oop-001', 'Lập Trình Hướng Đối Tượng', 'https://mock-moodle.demo.edu.vn'),
  ('course-db-001', 'Cơ Sở Dữ Liệu', 'https://mock-moodle.demo.edu.vn');

-- Demo students
INSERT OR REPLACE INTO students (id, lti_iss, display_name, email) VALUES
  ('student-001', 'https://mock-moodle.demo.edu.vn', 'Nguyễn Văn An', 'an.nguyen@demo.edu.vn'),
  ('student-002', 'https://mock-moodle.demo.edu.vn', 'Trần Thị Bình', 'binh.tran@demo.edu.vn'),
  ('student-003', 'https://mock-moodle.demo.edu.vn', 'Lê Minh Cường', 'cuong.le@demo.edu.vn');
