---
name: hackathon-submission-refresh
description: Refresh hackathon submission materials for this repo whenever features, docs, or product positioning change. Use when the user asks to update submission content, rewrite judging criteria answers, regenerate the latest product summary, or prepare current demo/pitch artifacts from the codebase state.
---

# Hackathon Submission Refresh

Use this skill when the repo has changed and the user wants the newest, strongest, but still accurate hackathon submission content.

## Goal

Produce updated submission-ready materials that match the current source code, current product scope, and current demo story without overstating unfinished capabilities.

Primary outputs usually live in:

- `docs/noi-dung-nop-hackathon.md`
- `docs/bao-cao-trang-thai-hien-tai.md`
- `docs/bao-cao-hackathon.md`

If the user asks for a shorter deliverable, generate a concise derivative from those files instead of inventing a disconnected version.

## Required workflow

1. Read the latest product state before writing anything.
2. Read these files first:
   - `docs/bao-cao-trang-thai-hien-tai.md`
   - `docs/bao-cao-hackathon.md`
   - `docs/noi-dung-nop-hackathon.md` if it exists
3. Read feature delta docs when present:
   - `docs/feature-*.md`
4. Inspect recent code changes:
   - `git log --oneline --decorate -n 20`
   - if needed, inspect the newest commits touching `app/`, `components/`, `lib/`, `types/`
5. Verify current positioning against source:
   - what is actually implemented
   - what is demo-level
   - what is still roadmap only
6. Update the target submission docs.

## Non-negotiable writing rules

- Never claim production LTI if it is still mock/demo.
- Never claim runtime multi-agent orchestration if the repo only has workflow-level agent roles.
- Never describe a feature as complete if it is only partially visualized or only exists in docs.
- Prefer precise product positioning:
  - `AI learning copilot`
  - `learning analytics`
  - `intervention workflow`
  - `planner flow`
- Distinguish clearly between:
  - implemented now
  - demo-ready now
  - roadmap next

## What to update in the content

Always refresh these parts:

- one-line product definition
- current maturity level
- strongest differentiators
- implemented technical capabilities
- value for students
- value for teachers
- value for schools / market
- remaining gaps and honest limits
- recommended pitch wording

When asked for judging-criteria answers, structure around:

- `Tinh sang tao, doi moi va cong nghe`
- `Tinh ung dung`
- `Tinh hieu qua`
- `Tiem nang phat trien`
- `Tinh cong dong`

## Preferred repo-specific framing

At the current stage, default framing should be:

`Nen tang AI learning copilot cho LMS, co RAG, tracking, intervention va planner flow, san sang mo rong thanh he thong multi-agent learning analytics.`

Only upgrade this framing if the source truly supports a stronger claim.

## Fast checklist before finalizing

- Are the newest features reflected?
- Are old warnings/issues that have been fixed removed from the docs?
- Are unfinished claims downgraded to roadmap?
- Does the text help hackathon judging, not just describe code?
- Is the wording strong but still defensible?

## Typical user asks this skill should handle

- “cap nhat noi dung nop hackathon”
- “viet lai 5 tieu chi theo source moi nhat”
- “tom tat san pham de pitch 3 phut”
- “sua tai lieu de khop voi feature vua them”
- “tao ban nop moi nhat cho BGK”
