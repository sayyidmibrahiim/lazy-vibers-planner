# Futsal Court Booking

## What this is

A booking web app for a small futsal venue with 2 courts. Players open a link on their phone, see which slots are free in real time, and book one by entering a name and phone number — no account. After booking they see the 30% down payment (DP) amount, pay it by bank transfer, and upload the proof; the owner confirms it from a laptop. The owner ran everything in a paper notebook and WhatsApp chats before; the app replaces that notebook and makes double-booked slots impossible.

## How to load context

Read in this order:

1. `DECISIONS.md` — the 21 decisions (D-001…D-021) that constrain every build choice. Read it first; do not relitigate a locked decision.
2. `SPEC/` — the five spec files (prd, requirements, data-model, api, architecture). They define what to build and the exact names to use.
3. `MILESTONES.md` — the build order M0→M3 and what each milestone must deliver.
4. `VERIFICATION.md` — the exact commands and checks that prove each milestone done. A milestone is done only when its procedure passes at the deployed URL.

## Working rules

- Stack is fixed: Next.js on Vercel (Hobby) + Supabase free tier (Postgres, Auth, Storage) — reasons in `CODE_STYLE.md` and `SPEC/architecture.md`, decision D-019.
- Follow the code style for this stack: `CODE_STYLE.md`.
- Security rules are binding: `SECURITY.md` (admin-only login, no card data ever, PII list in it).
- A milestone is done only when its `VERIFICATION.md` procedure passes at the deployed URL — never "looks good".
- Two players tapping the same slot must not both succeed: the database enforces it (D-004), never the UI alone.
- v1 has no online payment: manual bank transfer + admin confirmation only (D-011). The payment gateway is parked; see `SCOPE.md`.
- Product UI language is casual Bahasa Indonesia (S1.q7); code and this bundle are English.

## File map

| File | What it holds |
|---|---|
| `OVERVIEW.md` | Owner-facing plain-language overview: decisions, costs, daily use, parked items, limitations |
| `DECISIONS.md` | Append-only decision log D-001…D-021 with rationale and status |
| `SPEC/prd.md` | Problem, context, target users, goals, non-goals, success metrics |
| `SPEC/requirements.md` | F-01…F-04: behavior, priority, acceptance criteria |
| `SPEC/data-model.md` | Entities (courts, slots_config, bookings, admin_profiles), relations, indexes, validation, sample JSON |
| `SPEC/api.md` | API conventions, endpoint table, request/response examples, status codes, error format |
| `SPEC/architecture.md` | Stack + reasons, components, ASCII data flow, folder structure, local run, failure points |
| `USER_FLOWS.md` | Click-by-click flow per feature, ASCII diagrams, alternatives |
| `CODE_STYLE.md` | Next.js + TypeScript + Supabase conventions, error handling, testing, simplicity rules |
| `SECURITY.md` | Auth model, PII inventory and protection, secrets, dependencies, compliance notes |
| `RESEARCH.md` | Competitor scan, stack comparison, cost table, risks R-1…R-4 (unverified claims flagged) |
| `SCOPE.md` | In-MVP list (F-01…F-04) and the Parking Lot, frozen by D-020 |
| `MILESTONES.md` | M0…M3: goal, deliverables, acceptance criteria, estimate |
| `VERIFICATION.md` | Per-milestone verification procedures, global smoke test, definition of verified |
| `ASSUMPTIONS.md` | The 13 designer_filled decisions, each with why + how to confirm it |
| `HANDOVER.md` | Owner guide: run, deploy, update, back up, secrets, who to ask what |
| `CAPABILITIES.md` | Recommended boosters for this stack, license-tagged, with install lines |
| `blueprint.json` | Machine snapshot for UI and harnesses; derived from `.lvp/state.json` — regenerate, never hand-edit |
| `CLAUDE.md`, `GEMINI.md` | One-line stubs pointing back to this file |
