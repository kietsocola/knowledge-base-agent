import { jwtVerify } from "jose";
import type { LTILaunchClaims } from "@/types/lti";

/**
 * Single entry point for LTI token validation.
 * mock mode  → verify HS256 with LTI_MOCK_SECRET
 * production → verify RS256 with platform JWKS (not yet implemented)
 *
 * To upgrade to real Moodle LTI 1.3: set LTI_MODE=production + add JWKS logic below.
 */
export async function validateLTIToken(
  token: string,
  ltiMode: string,
  secret: string
): Promise<LTILaunchClaims> {
  if (ltiMode === "mock") {
    const secretBytes = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretBytes, {
      algorithms: ["HS256"],
    });
    return payload as unknown as LTILaunchClaims;
  }

  // TODO V1.1: production mode
  // 1. Fetch JWKS from process.env.LTI_PLATFORM_JWKS_URL
  // 2. Verify RS256 signature with createRemoteJWKSet
  // 3. Validate nonce has not been seen before (store in D1)
  throw new Error("Production LTI mode not yet implemented");
}
