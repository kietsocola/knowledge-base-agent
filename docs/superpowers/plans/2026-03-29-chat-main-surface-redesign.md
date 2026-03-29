# Chat Main Surface Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the main chat surface into a sharper SaaS-style learning workspace without changing chat behavior or full-screen immersion.

**Architecture:** Keep the behavioral logic in the existing chat components, but extract a small content/config helper so the empty-state copy, quick actions, and participant labels can be regression-tested. Apply the visual redesign primarily in `components/chat/ChatInterface.tsx` and `components/chat/MessageBubble.tsx`.

**Tech Stack:** Next.js App Router, React 19 client components, TypeScript, Tailwind CSS 4, `lucide-react`, `framer-motion`, Node test runner via `tsx --test`

---

## File Structure

- Create: `lib/chat/chat-surface.ts`
  Store the redesigned quick prompts and participant marker labels in plain TypeScript for testability.
- Create: `tests/chat-surface.test.ts`
  Lock in the main chat surface contract before changing the UI.
- Modify: `components/chat/ChatInterface.tsx`
  Redesign the header, empty state, quick actions, composer, and top-level chat surface.
- Modify: `components/chat/MessageBubble.tsx`
  Replace the current bubble/avatar language with sharper SaaS-style participant panels.

### Task 1: Add failing regression coverage for the redesigned chat surface

**Files:**
- Create: `tests/chat-surface.test.ts`
- Create: `lib/chat/chat-surface.ts`

- [ ] **Step 1: Write the failing test**

```ts
import test from "node:test"
import assert from "node:assert/strict"

import {
  chatEmptyState,
  chatParticipantLabels,
  chatQuickActions,
} from "@/lib/chat/chat-surface"

test("chat surface uses a concise command-style empty state", () => {
  assert.equal(chatEmptyState.kicker, "Session ready")
  assert.equal(chatEmptyState.title, "Bắt đầu phiên học")
})

test("chat surface exposes three quick actions", () => {
  assert.equal(chatQuickActions.length, 3)
})

test("chat participant labels move away from generic AI markers", () => {
  assert.equal(chatParticipantLabels.user, "Bạn")
  assert.equal(chatParticipantLabels.assistant, "Tutor")
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/chat-surface.test.ts`
Expected: FAIL because `lib/chat/chat-surface.ts` does not exist yet.

- [ ] **Step 3: Write minimal implementation**

```ts
export const chatEmptyState = {
  kicker: "Session ready",
  title: "Bắt đầu phiên học",
}

export const chatQuickActions = [
  "Mảng là gì?",
  "Độ phức tạp thuật toán?",
  "Tóm tắt chương này cho mình",
]

export const chatParticipantLabels = {
  user: "Bạn",
  assistant: "Tutor",
}
```

Then expand the helper to include the final redesigned quick-action set and any small marker text needed by the UI.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/chat-surface.test.ts`
Expected: PASS with `3 passed`.

- [ ] **Step 5: Commit**

```bash
git add tests/chat-surface.test.ts lib/chat/chat-surface.ts
git commit -m "test: add chat surface content coverage"
```

### Task 2: Redesign the main chat workspace surface

**Files:**
- Modify: `components/chat/ChatInterface.tsx`
- Modify: `components/chat/MessageBubble.tsx`
- Modify: `lib/chat/chat-surface.ts`

- [ ] **Step 1: Write the failing test**

Extend the content contract for the SaaS-style quick actions:

```ts
test("chat quick actions match the new operational prompts", () => {
  assert.deepEqual(chatQuickActions, [
    "Giải thích khái niệm cốt lõi",
    "Cho mình lộ trình học phần này",
    "Tóm tắt nhanh nội dung chính",
  ])
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/chat-surface.test.ts`
Expected: FAIL because the quick actions still reflect the old wording.

- [ ] **Step 3: Write minimal implementation**

Update `lib/chat/chat-surface.ts` with the new quick-action copy, then redesign the UI:

- `components/chat/ChatInterface.tsx`
  - tighten the header into a SaaS-like session bar
  - replace the large soft empty-state card with a cleaner command canvas
  - rebuild prompt suggestions as tighter action chips
  - restyle the composer as a sharper control bar
- `components/chat/MessageBubble.tsx`
  - replace the current avatar chips and rounded bubble feel
  - render participant markers as cleaner labels
  - preserve citations and markdown behavior

Use this visual direction:

```tsx
<header className="border-b border-border/60 bg-background/90 backdrop-blur-xl">
  {/* tighter session bar */}
</header>

<div className="flex-1 overflow-y-auto">
  {/* command-style empty state or redesigned message panels */}
</div>

<form className="border-t border-border/60 bg-background/92">
  {/* sharper composer */}
</form>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/chat-surface.test.ts`
Expected: PASS with `4 passed`.

- [ ] **Step 5: Commit**

```bash
git add components/chat/ChatInterface.tsx components/chat/MessageBubble.tsx lib/chat/chat-surface.ts tests/chat-surface.test.ts
git commit -m "feat: redesign chat main surface"
```

### Task 3: Verify the redesigned chat surface

**Files:**
- Modify: `components/chat/ChatInterface.tsx` if verification finds a regression
- Modify: `components/chat/MessageBubble.tsx` if verification finds a regression

- [ ] **Step 1: Run focused regression checks**

Run: `pnpm test tests/chat-surface.test.ts`
Expected: PASS with `4 passed`.

- [ ] **Step 2: Run full automated tests**

Run: `pnpm test`
Expected: PASS with all existing tests green.

- [ ] **Step 3: Run type verification**

Run: `pnpm typecheck`
Expected: PASS with exit code `0`.

- [ ] **Step 4: Manual review checklist**

Confirm in the browser or by code inspection:

- chat remains full-screen
- header reads as a tighter session bar
- empty state no longer feels like a generic AI welcome card
- composer looks like a sharper command surface
- user and assistant markers no longer read as `SV` / `AI`

- [ ] **Step 5: Commit**

```bash
git add components/chat/ChatInterface.tsx components/chat/MessageBubble.tsx lib/chat/chat-surface.ts tests/chat-surface.test.ts
git commit -m "chore: verify chat surface redesign"
```
