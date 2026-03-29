import test from "node:test"
import assert from "node:assert/strict"

import {
  landingAgents,
  landingFooterColumns,
  landingHero,
  landingLayout,
  landingNavItems,
  landingPalette,
  landingPrimaryCtas,
  landingTeacherSupportItems,
} from "@/lib/landing-page-content"

test("landing hero preserves the imported headline", () => {
  assert.equal(
    landingHero.title,
    "Personalized Intelligence for Every Learner in Vietnam. Meet Your AI Twin."
  )
})

test("landing architecture preserves the three imported agents", () => {
  assert.equal(landingAgents.length, 3)
})

test("landing teacher support section preserves key support items", () => {
  assert.equal(landingTeacherSupportItems.length, 2)
})

test("landing footer preserves three navigation columns", () => {
  assert.equal(landingFooterColumns.length, 3)
})

test("landing content preserves portal entry CTA", () => {
  assert.equal(landingPrimaryCtas[0]?.href, "/portal")
  assert.equal(landingPrimaryCtas[0]?.label, "Get Started")
})

test("landing palette uses deep blue with warm amber accents", () => {
  assert.equal(landingPalette.primarySurface, "#16354c")
  assert.equal(landingPalette.accent, "#d78b49")
})

test("landing navigation targets real homepage sections", () => {
  assert.deepEqual(
    landingNavItems.map((item) => item.sectionId),
    ["hero", "architecture", "partners", "cta"]
  )
})

test("landing layout uses the wider shell as the spacing baseline", () => {
  assert.equal(landingLayout.shellMaxWidth, 1680)
})
