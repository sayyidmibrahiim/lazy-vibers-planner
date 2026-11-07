# Gap-lint checklist (/lvp-handoff)

The operational bundle lint. Run every check literally, groups A–H in order, before any emission. One line per check; the check id (A1, B4, …) goes into the `gap_found` journal payload. The embedded required-headings lists and the `blueprint.json` schema (group H) mirror the S9 skeletons in `lvp-init-new-idea/references/bundle/templates.md` — embedded here so the lint works with no other skill installed. When that skill IS installed, its templates are the richer source for fix instructions.

Two finding kinds:

- **Bundle gap** — owner is a Section/skill (owner table at the bottom). Collected for the fix-now/abort offer.
- **Self-fix** — owner is the handoff itself (H1, H2). Journaled `gap_found`, then fixed automatically at the Emit step; never user-facing.

Reporting rule: a file that already failed a presence check (group A) is not re-checked in later groups — one finding per missing file, not two. Every finding is plain language: what is wrong, where, and who fixes it.

## A. Presence — 18 content files exist and are non-empty

- A1 `AGENTS.md` — exists, non-empty
- A2 `OVERVIEW.md` — exists, non-empty
- A3 `DECISIONS.md` — exists, non-empty
- A4 `SPEC/prd.md` — exists, non-empty
- A5 `SPEC/requirements.md` — exists, non-empty
- A6 `SPEC/data-model.md` — exists, non-empty
- A7 `SPEC/api.md` — exists, non-empty
- A8 `SPEC/architecture.md` — exists, non-empty
- A9 `USER_FLOWS.md` — exists, non-empty
- A10 `CODE_STYLE.md` — exists, non-empty
- A11 `SECURITY.md` — exists, non-empty
- A12 `RESEARCH.md` — exists, non-empty
- A13 `SCOPE.md` — exists, non-empty
- A14 `MILESTONES.md` — exists, non-empty
- A15 `VERIFICATION.md` — exists, non-empty
- A16 `ASSUMPTIONS.md` — exists, non-empty
- A17 `HANDOVER.md` — exists, non-empty
- A18 `CAPABILITIES.md` — exists, non-empty

`blueprint.json`, `CLAUDE.md`, `GEMINI.md` (rows 19–20 of the conventions §8 list) are handoff outputs: missing is never a gap — see groups G and H. A whole missing bundle (A1–A18 all fail) means S9 never ran: one plain report line saying so, owned by S9.

## B. Structure — each file carries its template's required headings, in order

- B1 `AGENTS.md` — `# <Display name>` · `## What this is` · `## How to load context` · `## Working rules` · `## File map`
- B2 `OVERVIEW.md` — `# <Display name> — plain-language overview` · `## What this is` · `## What was decided` · `## What it costs` · `## How you will use it` · `## What is parked` · `## Limitations`
- B3 `DECISIONS.md` — starts with `# Decisions`; decision table with the exact header row `| ID | Decision | Rationale | Alternatives considered | Date | Status |`
- B4 `SPEC/prd.md` — `# PRD — <Display name>` · `## Problem` · `## Context` · `## Target users` · `## Value proposition` · `## Goals` · `## Non-goals` · `## Success metrics`
- B5 `SPEC/requirements.md` — `# Requirements` · one `## F-<NN> — <name>` block per feature
- B6 `SPEC/data-model.md` — `# Data model` · `## Entities` · `## Relations` · `## Indexes` · `## Validation rules` · `## Sample JSON`
- B7 `SPEC/api.md` — `# API` · `## Conventions` · `## Endpoints` · `## Critical endpoints` · `## Status codes` · `## Error format`
- B8 `SPEC/architecture.md` — `# Architecture` · `## Stack` · `## Components` · `## Data flow` · `## Folder structure` · `## Local run` · `## Failure points`
- B9 `USER_FLOWS.md` — `# User flows` · one `## F-<NN> — <name>` section per feature
- B10 `CODE_STYLE.md` — `# Code style` · `## Language and framework conventions` · `## Error handling` · `## Testing expectations` · `## Simplicity rules`
- B11 `SECURITY.md` — `# Security` · `## Auth model` · `## PII inventory and protection` · `## Secrets handling` · `## Dependencies policy` · `## Compliance notes`
- B12 `RESEARCH.md` — `# Research` · `## Competitor scan` · `## Comparable products` · `## Stack comparison and trade-offs` · `## Cost table` · `## Risks (from S6)`
- B13 `SCOPE.md` — `# Scope` · `## In MVP` · `## Parking Lot (recorded, never deleted)`
- B14 `MILESTONES.md` — `# Milestones` · one `## M<n> — <name>` block per milestone, M0 first
- B15 `VERIFICATION.md` — `# Verification` · one `## M<n> — <name>` section per milestone · `## Global smoke test` · `## Definition of verified`
- B16 `ASSUMPTIONS.md` — `# Assumptions` · one `## D-<NNN> — <summary> (assumed | designer_filled)` block per non-confirmed decision
- B17 `HANDOVER.md` — `# Handover (owner guide)` · `## How to run it` · `## How to deploy and update` · `## How to back up` · `## Where secrets and API keys live` · `## Who to ask what`
- B18 `CAPABILITIES.md` — `# Capabilities` · booster table with the exact header row `| Name | Kind | License | Install | Notes |`
- B19 all bundle files — GitHub-flavored Markdown, English, no Mermaid fences (ASCII diagrams only)
- B20 no unfilled template placeholder (`<…>`) survives as literal text in any bundle file — a violation is an UNFILLED `<...>` token outside code fences; URLs/parameters inside fenced blocks and documented runtime parameters in emitted content (verification-time values like `<date>`, `<APP>` as defined in-file, the error envelope `{"error": "<message>"}`) are content, not placeholders

## C. Decision completeness — bundle mirrors `state.json → decisions[]`

- C1 every decision in `decisions[]` has a DECISIONS.md row — same id, same status
- C2 every DECISIONS.md row exists in `decisions[]` — exact mirror, nothing extra on either side
- C3 every DECISIONS.md row carries a non-empty rationale, a non-empty alternatives cell, and a date
- C4 every decision with status `assumed` or `designer_filled` has an ASSUMPTIONS.md block with **Why** and a confirm-instruction line filled — the label is semantic, not exact-match: any explicit confirm-instruction label (`**How to replace or confirm:**`, `**How to confirm:**`, `**How to replace:**`) satisfies it; the content must be filled and specific
- C5 no `user_confirmed` decision appears in ASSUMPTIONS.md

## D. Milestone completeness — machine-checkable, never "looks good"

- D1 `state.milestones[]` and MILESTONES.md agree (same ids, same order, M0 first); every in-MVP F-NN lands in exactly one milestone
- D2 every milestone has a goal, deliverables, and at least one acceptance criterion
- D3 every acceptance criterion is machine-checkable — a command with expected output, a scripted step, or an observable visual fact; never "looks good", "works well", or vague
- D4 every milestone has a verification procedure in VERIFICATION.md — exact commands + expected outputs; visual checks as observable facts plus how to look
- D5 every acceptance criterion's procedure appears in VERIFICATION.md — no criterion without a procedure
- D6 `## Global smoke test` gives one scripted end-to-end pass; `## Definition of verified` states when a milestone counts as verified

## E. Costs — present and consistent

- E1 OVERVIEW.md `## What it costs` holds a table (item · price · when) with monthly and one-time totals
- E2 RESEARCH.md `## Cost table` holds a table (item · price · type · source)
- E3 the two tables agree — same items, same numbers, no contradiction
- E4 every price cites source + access date, or carries an explicit `unverified` flag (principle 1)

## F. Scope — SCOPE.md matches the recorded state

- F1 every F-NN from the S4 record/state is classified in SCOPE.md — `## In MVP` or `## Parking Lot`; none missing, none invented
- F2 every parked F-NN carries its one-line reason
- F3 SCOPE.md cites the scope-lock decision id under the title
- F4 every in-MVP F-NN has a SPEC/requirements.md block (Status: in-MVP) and a USER_FLOWS.md section; every parked F-NN has a requirements block marked parked

## G. Adapters — stubs and the AGENTS.md entry point

- G1 `CLAUDE.md` is exactly this one line and nothing else: `Read [AGENTS.md](AGENTS.md) — the builder entry point for this project.` (missing → written in this run; wrong content → finding)
- G2 `GEMINI.md` is exactly that same one line
- G3 `AGENTS.md` `## What this is` says what the product is, concretely (2–4 lines, no placeholder)
- G4 `AGENTS.md` `## How to load context` gives the read order: `DECISIONS.md` → `SPEC/` (prd, requirements, data-model, api, architecture) → `MILESTONES.md` → `VERIFICATION.md`
- G5 `AGENTS.md` `## Working rules` states the rules: stack/language → `CODE_STYLE.md`, security → `SECURITY.md`, a milestone is done only when its `VERIFICATION.md` procedure passes
- G6 `AGENTS.md` `## File map` points to every one of the other 19 bundle files — none missing

G3–G6 are the "thin AGENTS.md" checks: failing any one is a gap finding, never a silent pass.

## H. State coherence — blueprint.json vs state.json

- H1 `blueprint.json` exists — missing is not a gap: it is emitted in this run (self-fix)
- H2 every field blueprint.json derives matches `state.json` and the bundle — project (slug, name, user_language, status), features (id, name, in_mvp), `decisions_count` (confirmed/assumed/designer_filled), milestones (id, goal, acceptance_count), costs vs the cost tables; any drift → re-emitted in this run (self-fix)
- H3 blueprint.json follows the schema summary below — same keys and shapes, `schema_version` = 1
- H4 no bundle document contradicts `decisions[]` — the stack named in OVERVIEW/SPEC/architecture/RESEARCH and every shaping decision trace to decision ids

`blueprint.json` schema summary (v1, verbatim from the S9 templates — embedded so the H checks need no other skill installed):

```jsonc
{
  "schema_version": 1,
  "generated_at": "2026-11-08T12:00:00Z",
  "project": { "slug": "...", "name": "...", "user_language": "id",
               "idea_summary_en": "...", "status": "bundled" },
  "stack": { "primary": "next-supabase", "components": ["Next.js", "Supabase"],
             "reasons_ref": "DECISIONS.md#D-003" },
  "features": [ { "id": "F-01", "name": "...", "in_mvp": true, "flows_ref": "USER_FLOWS.md#F-01" } ],
  "decisions_count": { "confirmed": 12, "assumed": 3, "designer_filled": 5 },
  "milestones": [ { "id": "M0", "goal": "...", "verified": false,
                    "acceptance_count": 4, "ref": "MILESTONES.md#M0" } ],
  "costs": { "monthly_usd": 0, "one_time_usd": 0, "table_ref": "RESEARCH.md#costs" },
  "capabilities": [ { "name": "...", "kind": "skill|mcp|plugin", "license": "MIT",
                      "nc": false, "install": "npx skills add ..." } ],
  "pointers": { "agents": "AGENTS.md", "overview": "OVERVIEW.md",
                "verification": "VERIFICATION.md", "state": ".lvp/state.json" }
}
```

## Owners

| Group | Owning Section/skill | How it gets fixed |
|---|---|---|
| A, B (bundle files) | S9 Compile | `lvp-init-new-idea` §S9 procedure (or `/lvp-continue` bundle completion) |
| C | S9 cross-check (data from S1–S6 records) | S9 procedure, targeted edits |
| D | S8 Milestone plan | S8 procedure fixes the plan; S9 re-compiles MILESTONES.md/VERIFICATION.md |
| E | S9 (material from S2/S5) | S9 procedure |
| F1–F3 | S7 if the split itself is wrong; S9 if the file drifted from the S7 record | S7 or S9 procedure |
| F4 | S9 cross-check | S9 procedure |
| G3–G6 | S9 (AGENTS.md authored there) | S9 procedure; precise per-file instruction if init skill absent |
| G1–G2, H1–H2 | this skill | Emit step, automatic — never user-facing |
