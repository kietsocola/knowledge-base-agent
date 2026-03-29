# Portal Student Brief Redesign

## Goal

Redesign the portal entry screen so a learner can identify the active user context, choose the correct course, and enter the right learning session within a few seconds.

This screen is a workspace entry point, not a product landing page. Information on the page must support action-taking, not explain internal AI architecture.

## Product Intent

- The primary job of the page is `select course -> launch study session`.
- The secondary job is `confirm user context`.
- Workspace or product branding should remain visible but subdued.
- Demo-specific account switching should be quick and obvious.
- System status should be reduced to a few calm signals only.

## In Scope

- Restructure the visual hierarchy of the portal page.
- Reposition user selection so it is part of the main content flow.
- Simplify the course cards to essential information and explicit CTAs.
- Reduce supporting content that competes with the course list.
- Preserve the current color system and overall brand tone already defined in `app/globals.css`.

## Out of Scope

- Changing launch behavior or API contracts for `/api/lti/launch`.
- Introducing new course metadata from the backend.
- Explaining AI, multi-agent, or pipeline internals on this screen.
- Redesigning downstream chat, evaluation, or classroom screens.

## Recommended Direction

Use a `single-column command deck` layout.

Why this direction:

- It matches the intended user journey: `I am who -> I am here -> I enter this course`.
- It keeps the course list as the dominant surface after user selection.
- It feels like an operational workspace entry rather than a marketing homepage.
- It scales cleanly from desktop to mobile without inventing separate mental models.

## Information Hierarchy

### 1. Brand Rail

A thin top rail keeps workspace identity visible without dominating the page.

- Show product/workspace name clearly.
- Keep supporting label compact, such as `workspace` or `demo portal`.
- Remove large hero-brand treatment and any decorative promo feel.

### 2. Student Brief

This becomes the first major block in the main content area and owns the `student-brief` anchor.

- Short directive headline, e.g. `Chọn môn học để bắt đầu`.
- A quiet status line with 2-3 short signals only:
  - number of ready courses
  - demo mode
  - active user count
- Active user panel must show:
  - name
  - role
  - active status
- Include a fast-switch control for demo accounts directly in this section.

This block should make the user immediately understand:

- who they are
- where they are
- what they do next

### 3. Course List

This is the primary area of emphasis on the page.

- Position it immediately after the student brief with minimal competing content.
- Render courses as spacious rows or low-noise surfaces rather than promotional feature cards.
- Each course shows only:
  - course name
  - short code
  - ready status
- Each course exposes two actions:
  - primary: `Vào phiên học`
  - secondary: `Tạo phiên mới`

The visual weight must favor the primary CTA while keeping the secondary action discoverable.

## Interaction Model

### Demo User Switching

- The active learner is visible at all times inside the student brief.
- The account switcher opens inline from that area, not from the header.
- Switching accounts updates the visible learner context before launch.

### Course Launch

- Launch interactions continue to use the existing async launch flow.
- While a course is launching, only the relevant course action enters loading state.
- Copy remains direct and operational, not celebratory or promotional.

## Layout

### Desktop

- Use one dominant centered content column with generous whitespace.
- Student brief sits above the course list.
- Avoid a split hero with a secondary panel that competes for attention.

### Mobile

- Preserve the same top-to-bottom reading order.
- Keep tap targets large and separated.
- Maintain fast access to user switching and course launch without hidden dependencies.

## Visual Direction

Keep the current palette and material language:

- warm paper-like backgrounds
- deep blue primary emphasis
- restrained amber secondary highlights
- soft borders and glass/paper surfaces already present in the system

Adjust the expression:

- fewer cards
- stronger typography
- larger spacing
- calmer status indicators
- less decorative contrast between sections

The page should feel decisive, quiet, and operational.

## Content Rules

- Headline must be short and action-oriented.
- Do not include long marketing copy.
- Do not describe AI architecture or pipeline mechanics.
- Do not add explanatory side panels unless they directly support launch decisions.
- Supporting labels should be terse and scannable.

## Accessibility and UX Constraints

- Preserve visible focus styles and keyboard access for course actions and account switching.
- Ensure the active user state is conveyed by both text and visual treatment, not color alone.
- Keep primary actions at comfortable touch sizes on mobile.
- Maintain clear loading and disabled states during launch.

## Implementation Notes

- The main changes should stay inside `components/portal/WellStudyPortal.tsx`.
- `app/portal/page.tsx` likely remains a thin wrapper unless metadata text needs adjustment.
- Reuse existing tokens and utility classes from `app/globals.css` where possible instead of inventing a separate page theme.

## Testing Expectations

- Verify desktop and mobile hierarchy visually.
- Verify demo account switching still changes the selected student before launch.
- Verify both launch paths still work:
  - existing session entry
  - forced new session creation
- Verify loading state is isolated to the clicked course.

## Open Decisions Resolved

- Student switching moves out of the header and into the main content flow.
- The page should prioritize course selection over any workspace storytelling.
- Status information stays minimal and calm rather than dashboard-like.
