# Landing Page Port Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current homepage with a React/Next version of `code.html` while preserving its content and layout as closely as practical.

**Architecture:** Keep the main landing page implementation in `app/page.tsx`, but extract a very small data helper so the imported content can be regression-tested without a React test harness. Use existing project tokens and Lucide icons to recreate the page inside the current app shell.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS 4, `lucide-react`, Node test runner via `tsx --test`

---

## File Structure

- Create: `lib/landing-page-content.ts`
  Store the imported landing page copy and structured section data in plain TypeScript for testability.
- Create: `tests/landing-page-content.test.ts`
  Lock in critical homepage copy and section counts before replacing the homepage.
- Modify: `app/page.tsx`
  Replace the current homepage with the React port of `code.html`.

### Task 1: Add a failing regression test for imported landing content

**Files:**
- Create: `tests/landing-page-content.test.ts`
- Create: `lib/landing-page-content.ts`

- [ ] **Step 1: Write the failing test**

```ts
import test from "node:test"
import assert from "node:assert/strict"

import {
  landingHero,
  landingAgents,
  landingTeacherSupportItems,
  landingFooterColumns,
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/landing-page-content.test.ts`
Expected: FAIL because `lib/landing-page-content.ts` does not exist yet.

- [ ] **Step 3: Write minimal implementation**

```ts
export const landingHero = {
  title: "Personalized Intelligence for Every Learner in Vietnam. Meet Your AI Twin.",
}

export const landingAgents = [{ title: "Diagnosis Agent" }, { title: "Planner Agent" }, { title: "Tutor Agent" }]

export const landingTeacherSupportItems = [
  { title: "Bottleneck Concepts" },
  { title: "Manual Support Offloading" },
]

export const landingFooterColumns = [
  { title: "Foundation" },
  { title: "Support" },
  { title: "Legal" },
]
```

Then expand the helper to include the actual imported copy needed by the final page.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/landing-page-content.test.ts`
Expected: PASS with `4 passed`.

- [ ] **Step 5: Commit**

```bash
git add tests/landing-page-content.test.ts lib/landing-page-content.ts
git commit -m "test: add landing page content coverage"
```

### Task 2: Replace the homepage with the React port

**Files:**
- Modify: `app/page.tsx`
- Modify: `lib/landing-page-content.ts`

- [ ] **Step 1: Write the failing test**

Extend the content regression with the CTA contract used by the page:

```ts
import { landingPrimaryCtas } from "@/lib/landing-page-content"

test("landing content preserves portal entry CTA", () => {
  assert.equal(landingPrimaryCtas[0]?.href, "/portal")
  assert.equal(landingPrimaryCtas[0]?.label, "Get Started")
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/landing-page-content.test.ts`
Expected: FAIL because `landingPrimaryCtas` does not exist yet.

- [ ] **Step 3: Write minimal implementation**

Add the CTA data in `lib/landing-page-content.ts`, then replace `app/page.tsx` with a JSX port that:

- preserves the imported section order from `code.html`
- uses `Link` for internal navigation
- maps Material Symbols to Lucide icons
- keeps external image URLs as `img`
- keeps the imported editorial layout and copy close to the source HTML

Use this page-level structure:

```tsx
export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav>{/* imported landing nav */}</nav>
      <main>{/* hero, trust strip, architecture, teacher support, accessibility, CTA */}</main>
      <footer>{/* imported landing footer */}</footer>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/landing-page-content.test.ts`
Expected: PASS with `5 passed`.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx lib/landing-page-content.ts tests/landing-page-content.test.ts
git commit -m "feat: port landing page from html"
```

### Task 3: Verify the homepage port

**Files:**
- Modify: `app/page.tsx` if verification reveals a regression

- [ ] **Step 1: Run focused regression checks**

Run: `pnpm test tests/landing-page-content.test.ts`
Expected: PASS with `5 passed`.

- [ ] **Step 2: Run full automated tests**

Run: `pnpm test`
Expected: PASS with all existing tests green.

- [ ] **Step 3: Run type verification**

Run: `pnpm typecheck`
Expected: PASS with exit code `0`.

- [ ] **Step 4: Run production build verification**

Run: `pnpm build`
Expected: PASS with homepage and `/portal` both building successfully.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx lib/landing-page-content.ts tests/landing-page-content.test.ts
git commit -m "chore: verify landing page port"
```
