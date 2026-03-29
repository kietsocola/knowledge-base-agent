import test from "node:test"
import assert from "node:assert/strict"
import { resolveSessionRole } from "@/lib/lti/roles"

test("resolveSessionRole defaults to learner when roles are missing", () => {
  assert.equal(resolveSessionRole(), "learner")
})

test("resolveSessionRole maps instructor roles from LTI claims", () => {
  assert.equal(
    resolveSessionRole([
      "http://purl.imsglobal.org/vocab/lis/v2/membership#Instructor",
    ]),
    "instructor"
  )
})

test("resolveSessionRole maps administrator roles from LTI claims", () => {
  assert.equal(
    resolveSessionRole([
      "http://purl.imsglobal.org/vocab/lis/v2/membership#Administrator",
    ]),
    "admin"
  )
})
