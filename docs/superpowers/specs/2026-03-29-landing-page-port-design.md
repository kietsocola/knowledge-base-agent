# Landing Page Port Design

## Goal

Replace the current homepage in `app/page.tsx` with a React version of `code.html`, preserving the original landing page's layout, section order, and copy as closely as practical inside the existing Next.js app.

## Product Intent

- The homepage should feel like the imported landing page, not a remix of the current homepage.
- The visual hierarchy, section rhythm, and messaging should remain close to `code.html`.
- The result must run inside the existing app without CDN Tailwind or raw HTML document wrappers.

## In Scope

- Rebuild the landing page from `code.html` as JSX in the app.
- Replace the contents of `app/page.tsx`.
- Keep CTA navigation working inside the app, especially entry to `/portal`.
- Adapt external HTML concerns into app-native React/Next patterns.

## Out of Scope

- Redesigning the landing page beyond what is needed for React/Next integration.
- Rewriting the product story or shortening the original copy.
- Reworking the portal, chat, evaluation, or classroom pages.

## Chosen Direction

Use a `one-file port` for the page implementation.

Why:

- It best preserves the original structure and content of `code.html`.
- It minimizes translation drift while porting from static HTML to React.
- It is the fastest path to a faithful landing page replacement.

## Content and Layout Rules

- Preserve the section order from `code.html`.
- Preserve the headline, subheadline, metrics, architecture, and support sections as closely as possible.
- Preserve the overall editorial feel:
  - strong hero
  - institutional trust strip
  - feature architecture grid
  - teacher support narrative
- Keep the homepage focused on the imported landing page rather than mixing old and new homepage copy.

## React/Next Adaptation Rules

- Replace document-level HTML, head, and CDN Tailwind usage with app-compatible JSX.
- Use `next/link` for internal navigation.
- Replace Material Symbols with `lucide-react` icons or equivalent React-friendly icons.
- Use normal React event-safe markup and JSX attribute naming.
- Keep the implementation in `app/page.tsx` unless a very small helper is clearly necessary.

## Styling Direction

- Stay visually close to `code.html`.
- Reuse existing project tokens and utility classes where possible.
- Add only minimal page-local class structure necessary to preserve the imported design.
- Avoid introducing a second unrelated design system.

## Accessibility and UX Constraints

- Maintain semantic sectioning and headings.
- Ensure buttons and links remain keyboard accessible.
- Preserve readable contrast and touch-friendly CTAs.
- Avoid decorative elements that block content understanding on mobile.

## Implementation Notes

- `app/page.tsx` will become the primary landing page file.
- Existing imports and arrays in the current homepage can be removed if no longer needed.
- If `code.html` includes image URLs, they may remain as standard `img` tags unless Next image integration is necessary for stability.

## Testing Expectations

- Homepage renders without runtime errors in Next dev/build.
- Links to `/portal` still work.
- Layout remains readable on desktop and mobile.
- Typecheck must pass after the port.

## Open Decisions Resolved

- The current homepage should be replaced, not merged.
- The imported landing page should stay close to the original HTML in both content and composition.
