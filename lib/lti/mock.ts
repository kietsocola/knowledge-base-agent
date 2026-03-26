import { SignJWT } from "jose";
import type { LTILaunchClaims } from "@/types/lti";

export interface MockStudent {
  id: string;
  name: string;
  email: string;
}

export interface MockCourse {
  id: string;
  title: string;
}

export const MOCK_STUDENTS: MockStudent[] = [
  { id: "student-001", name: "Nguyễn Văn An", email: "an.nguyen@demo.edu.vn" },
  { id: "student-002", name: "Trần Thị Bình", email: "binh.tran@demo.edu.vn" },
  { id: "student-003", name: "Lê Minh Cường", email: "cuong.le@demo.edu.vn" },
];

export const MOCK_COURSES: MockCourse[] = [
  { id: "course-ctdl-001", title: "Cấu Trúc Dữ Liệu & Giải Thuật" },
  { id: "course-oop-001", title: "Lập Trình Hướng Đối Tượng" },
  { id: "course-db-001", title: "Cơ Sở Dữ Liệu" },
];

/**
 * Build a signed mock LTI 1.3 JWT for demo purposes.
 * In production, this JWT comes from the real Moodle platform.
 */
export async function buildMockLTIToken(
  student: MockStudent,
  course: MockCourse,
  secret: string
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const nonce = crypto.randomUUID();

  const claims: LTILaunchClaims = {
    iss: "https://mock-moodle.demo.edu.vn",
    sub: student.id,
    aud: "kb-agent-client-id",
    nonce,
    iat: now,
    exp: now + 300, // 5 minutes
    name: student.name,
    email: student.email,
    ltiMessageType: "LtiResourceLinkRequest",
    ltiVersion: "1.3.0",
    deploymentId: "demo-deployment-001",
    context: {
      id: course.id,
      title: course.title,
      type: ["CourseSection"],
    },
    roles: [
      "http://purl.imsglobal.org/vocab/lis/v2/membership#Learner",
    ],
    resourceLink: {
      id: `${course.id}-resource`,
      title: "AI Knowledge Base",
    },
  };

  const secretBytes = new TextEncoder().encode(secret);
  const token = await new SignJWT({ ...claims })
    .setProtectedHeader({ alg: "HS256" })
    .sign(secretBytes);

  return token;
}
