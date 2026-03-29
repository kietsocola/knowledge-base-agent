# Portal Student Brief Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the portal entry page into a focused workspace entry flow that foregrounds user context and course launch actions.

**Architecture:** Keep the launch behavior intact and redesign the portal entirely inside the existing portal component. Introduce a small presentation layer for demo-only learner and course metadata so the UI can show role, active state, short course code, and calm status labels without changing API contracts.

**Tech Stack:** Next.js App Router, React 19 client component, TypeScript, Tailwind CSS 4, Node test runner via `tsx --test`

---

## File Structure

- Modify: `components/portal/WellStudyPortal.tsx`  
  Rebuild the portal layout, move the demo learner switcher into the main content flow, simplify the course surfaces, and keep launch interactions intact.
- Modify: `lib/lti/mock.ts`  
  Add minimal demo metadata for learner role and course short code/readiness labels used only by the portal UI.
- Create: `tests/portal-metadata.test.ts`  
  Lock in the derived demo metadata used by the redesigned portal so the new UI rules are covered by tests without needing a React test harness.

### Task 1: Add portal metadata coverage

**Files:**
- Modify: `lib/lti/mock.ts`
- Test: `tests/portal-metadata.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import test from "node:test"
import assert from "node:assert/strict"

import { MOCK_COURSES, MOCK_STUDENTS } from "@/lib/lti/mock"

test("mock portal students expose short learner context", () => {
  assert.ok(MOCK_STUDENTS.length > 0)
  assert.equal(MOCK_STUDENTS[0]?.roleLabel, "Learner")
  assert.equal(MOCK_STUDENTS[0]?.statusLabel, "Active")
})

test("mock portal courses expose short course metadata", () => {
  assert.ok(MOCK_COURSES.length > 0)
  assert.match(MOCK_COURSES[0]?.shortCode ?? "", /^[A-Z]{2,5}$/)
  assert.equal(MOCK_COURSES[0]?.readinessLabel, "Sẵn sàng")
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/portal-metadata.test.ts`  
Expected: FAIL because `roleLabel`, `statusLabel`, `shortCode`, and `readinessLabel` do not exist yet.

- [ ] **Step 3: Write minimal implementation**

```ts
export interface MockStudent {
  id: string;
  name: string;
  email: string;
  roleLabel: string;
  statusLabel: string;
}

export interface MockCourse {
  id: string;
  title: string;
  shortCode: string;
  readinessLabel: string;
}

export const MOCK_STUDENTS: MockStudent[] = [
  {
    id: "student-001",
    name: "Nguyễn Văn An",
    email: "an.nguyen@demo.edu.vn",
    roleLabel: "Learner",
    statusLabel: "Active",
  },
]
```

Also apply the same shape to the remaining mock students and courses with stable short codes and readiness labels.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/portal-metadata.test.ts`  
Expected: PASS with `2 passed`.

- [ ] **Step 5: Commit**

```bash
git add tests/portal-metadata.test.ts lib/lti/mock.ts
git commit -m "test: add portal metadata coverage"
```

### Task 2: Redesign the portal entry hierarchy

**Files:**
- Modify: `components/portal/WellStudyPortal.tsx`
- Test: `tests/portal-metadata.test.ts`

- [ ] **Step 1: Write the failing test**

Extend the existing metadata test so the presentation contract is explicit:

```ts
test("portal status summary can stay short and calm", () => {
  const summary = [
    `${MOCK_COURSES.length} course sẵn sàng`,
    "Demo mode",
    "1 user active",
  ]

  assert.deepEqual(summary, [
    "3 course sẵn sàng",
    "Demo mode",
    "1 user active",
  ])
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/portal-metadata.test.ts`  
Expected: FAIL until the copied status wording and count strategy are aligned with the new design.

- [ ] **Step 3: Write minimal implementation**

Update `components/portal/WellStudyPortal.tsx` to:

```tsx
const PORTAL_STATUS = [
  { label: "Courses", value: `${MOCK_COURSES.length} course sẵn sàng` },
  { label: "Mode", value: "Demo mode" },
  { label: "User", value: "1 user active" },
] as const
```

Then replace the current split hero with a single-column structure:

```tsx
<main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-14 pt-8 sm:px-6 lg:px-8 lg:pt-10">
  <section id="student-brief" className="paper-surface rounded-[2rem] p-6 sm:p-8 lg:p-10">
    {/* short heading */}
    {/* calm status line */}
    {/* active user block with inline demo switcher */}
  </section>

  <section id="course-index" className="space-y-4">
    {/* low-noise course rows with primary and secondary actions */}
  </section>
</main>
```

Required UI outcomes:

- Header becomes a thin brand rail.
- Demo learner switcher is inside the `student-brief` section, not the header.
- Student brief shows `name`, `roleLabel`, and `statusLabel`.
- Supporting copy removes route, pipeline, and workspace storytelling.
- Course list becomes the dominant block after the student brief.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/portal-metadata.test.ts`  
Expected: PASS with `3 passed`.

- [ ] **Step 5: Commit**

```bash
git add components/portal/WellStudyPortal.tsx tests/portal-metadata.test.ts
git commit -m "feat: redesign portal student brief"
```

### Task 3: Verify the redesigned portal end-to-end

**Files:**
- Modify: `components/portal/WellStudyPortal.tsx` if needed after verification

- [ ] **Step 1: Run focused automated verification**

Run: `pnpm test tests/portal-metadata.test.ts`  
Expected: PASS with `3 passed`.

- [ ] **Step 2: Run broader regression checks**

Run: `pnpm test`  
Expected: PASS with all existing tests green.

- [ ] **Step 3: Run type verification**

Run: `pnpm typecheck`  
Expected: PASS with exit code `0`.

- [ ] **Step 4: Manual review checklist**

Confirm in the browser or by code inspection:

- active learner context is above the course list
- header branding is visible but subdued
- each course shows title, short code, readiness label
- each course exposes `Vào phiên học` and `Tạo phiên mới`
- only the clicked course enters loading state

- [ ] **Step 5: Commit**

```bash
git add components/portal/WellStudyPortal.tsx lib/lti/mock.ts tests/portal-metadata.test.ts
git commit -m "chore: verify portal entry redesign"
```
