export interface LTILaunchClaims {
  iss: string;
  sub: string;
  aud: string;
  nonce: string;
  iat: number;
  exp: number;
  name: string;
  email?: string;
  ltiMessageType: "LtiResourceLinkRequest";
  ltiVersion: "1.3.0";
  deploymentId: string;
  context: {
    id: string;
    title: string;
    type: string[];
  };
  roles: string[];
  resourceLink: {
    id: string;
    title: string;
  };
}

export interface SessionData {
  studentId: string;
  courseId: string;
  courseName: string;
  sessionId: string;
  displayName: string;
  role?: "learner" | "instructor" | "admin";
}
