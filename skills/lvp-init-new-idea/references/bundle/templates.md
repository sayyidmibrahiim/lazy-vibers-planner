# Blueprint Bundle templates (S9)

Per-file skeletons for the 20-file Blueprint Bundle — same file names, same order as conventions §8. Companion to the S9 procedure block in SKILL.md; load both at S9.

The template carries the structure; the content comes from the Section Records, `decisions[]`, and `milestones[]` — never invented. "Headings, in order" lists the file's required headings: every one of them is required, in that order. `<placeholders>` are fill instructions, never literal text. A required section the records cannot fill is written from an `assumed` decision (listed in ASSUMPTIONS.md) or a one-line `unresolved — see OVERVIEW.md → Limitations` note: never an omission, never a fabrication. ASCII diagrams go in fenced `text` blocks.

Format rules for every file: GitHub-flavored Markdown · English · no Mermaid (ASCII diagrams only) · SimpleEnglish document rules (strictest in OVERVIEW.md) · identical stack, entity, and feature names everywhere.

## 1. AGENTS.md — builder entry point (agents.md spec)
Headings, in order: `# <Display name>` · `## What this is` · `## How to load context` · `## Working rules` · `## File map`

Fill: What this is — 2-4 lines from S0/S1. How to load context — the numbered read order: `DECISIONS.md` → `SPEC/` (prd, requirements, data-model, api, architecture) → `MILESTONES.md` → `VERIFICATION.md`, each with a one-line why. Working rules — one line per rule (stack/language → CODE_STYLE.md, security → SECURITY.md, a milestone is done only when its VERIFICATION.md procedure passes). File map — one row per each of the other 19 bundle files, none missing.

## 2. OVERVIEW.md — owner document (strictest plain language)
Headings, in order: `# <Display name> — plain-language overview` · `## What this is` · `## What was decided` · `## What it costs` · `## How you will use it` · `## What is parked` · `## Limitations`

Fill: written for the non-technical owner — the shortest sentences of the bundle, no step that assumes reading code. What was decided — the shaping decisions, each with a one-line why. What it costs — total table (item · price · when) with monthly and one-time totals; every number cites its S2 fact-sheet row (source + access date, or `unverified`). How you will use it — the day-one task, walk-through style, from the S1 success picture and F-01. What is parked — the Parking Lot from SCOPE.md, one line each. Limitations — one line per degraded booster, per blocked-then-resolved Section, and per known gap; never silent.

## 3. DECISIONS.md — append-only decision log
Headings, in order: `# Decisions` · one table row per decision:

```markdown
| ID | Decision | Rationale | Alternatives considered | Date | Status |
|---|---|---|---|---|---|
| D-001 | <summary> | <why> | <what else was weighed> | <YYYY-MM-DD> | user_confirmed |
```

Fill: mirrors `decisions[]` in `.lvp/state.json` — same ids, same statuses, nothing missing on either side. Alternatives considered is optional — record it when a real alternative was rejected; `None recorded` is a valid cell. Append-only: new decisions add rows; existing rows are never rewritten.

## 4. SPEC/prd.md
Headings, in order: `# PRD — <Display name>` · `## Problem` · `## Context` · `## Target users` · `## Value proposition` · `## Goals` · `## Non-goals` · `## Success metrics`

Fill: every section traces to an S1/S4 answer or a decision id; Problem keeps the user's own words (plus the English summary); Target users names kinds of people, never "everyone"; Non-goals includes the Parking Lot headline; Success metrics come from the S1 answers.

## 5. SPEC/requirements.md
Headings, in order: `# Requirements` · one block per F-NN:

```markdown
## F-01 — <name>
- **User:** <named kind of user> · **Priority:** must | should | could · **Status:** in-MVP | parked (see SCOPE.md)
- **Behavior:** <what it does, from the S4 script>
- **Acceptance criteria:**
  - **Given** <state> **when** <action> **then** <result>
```

Fill: one block per F-NN from the S4 record — every captured feature gets a block; parked features keep the same block with Status `parked` and a one-line behavior. Criteria in Gherkin where natural.

## 6. SPEC/data-model.md
Headings, in order: `# Data model` · `## Entities` (one `### <Entity>` subsection per entity, each with a fields table: field · type · constraints · notes) · `## Relations` (one line per relation: A 1—N B + why) · `## Indexes` (one line per index: entity.field + why) · `## Validation rules` (one line per rule) · `## Sample JSON` (one realistic sample object for the main entity)

Fill: entities and fields from the S3 inventory + the S4 features; entity names identical everywhere in the bundle.

## 7. SPEC/api.md
Headings, in order: `# API` · `## Conventions` · `## Endpoints` · `## Critical endpoints` · `## Status codes` · `## Error format`

Fill: Conventions — base URL, auth, versioning, error envelope, one line each; auth matches the S3 decision id. Endpoints — table: method · path · purpose · auth, derived from the F-NN happy paths and the data model. Critical endpoints — per endpoint: request sample + `200` response sample. Status codes — which code is returned when. Error format — the envelope every endpoint reuses.

## 8. SPEC/architecture.md
Headings, in order: `# Architecture` · `## Stack` · `## Components` · `## Data flow` · `## Folder structure` · `## Local run` · `## Failure points`

Fill: Stack — primary stack + components; every reason cites its DECISIONS.md row. Components — one line per component. Data flow — ASCII diagram in a fenced `text` block: user → UI → API → data store → external services. Folder structure — the project tree (fenced `text` block). Local run — exact commands. Failure points — what breaks first and what it looks like. Stack names identical to DECISIONS.md and RESEARCH.md.

## 9. USER_FLOWS.md
Headings, in order: `# User flows` · one section per F-NN:

```markdown
## F-01 — <name> (in-MVP)
<ASCII flow diagram: first tap → visible result>
1. <click-by-click step, "posting ke IG" style — a stranger could follow it>
2. <…>
- **Alternatives:** <key alternative paths, one line each>
```

Fill: every F-NN gets a section — in-MVP features get diagram + numbered script + alternatives; parked features get their heading marked `(parked — see SCOPE.md)` plus the S4 script kept as captured.

## 10. CODE_STYLE.md
Headings, in order: `# Code style` · `## Language and framework conventions` · `## Error handling` · `## Testing expectations` · `## Simplicity rules`

Fill: conventions, naming, and file layout for the chosen stack; how errors are raised, wrapped, and surfaced; what must have tests and how to run them; karpathy + ponytail distilled for this stack (minimal sufficient solution, no speculative abstraction). Adapted to the chosen stack, never generic advice.

## 11. SECURITY.md
Headings, in order: `# Security` · `## Auth model` · `## PII inventory and protection` · `## Secrets handling` · `## Dependencies policy` · `## Compliance notes`

Fill: Auth model — from the S3 auth decision (method, sessions, password reset). PII — table: data · where it lives · protection; covers every S3 inventory entry (empty inventory → one row "none collected"). Secrets — where keys live, what never enters the repo. Dependencies — how they are chosen and updated. Compliance — region-appropriate notes from S3 (data location, erasure, privacy policy).

## 12. RESEARCH.md
Headings, in order: `# Research` · `## Competitor scan` · `## Comparable products` · `## Stack comparison and trade-offs` · `## Cost table` · `## Risks (from S6)`

Fill: compiled from the S5 record plus the S6 risks appendix — nothing new is researched at S9, claims keep their S5 flags. Competitor scan — product, pricing model, one lesson. Stack comparison — the trade-offs table; the chosen stack cites its decision id. Cost table — item · price · type · source, built on the S2 fact-sheet plus S5 additions; every claim with source + access date or `unverified`. Risks — one line each: R-n, finding, outcome (`resolved via L-NN | accepted → D-NNN | note`).

## 13. SCOPE.md
Headings, in order: `# Scope` · `## In MVP` · `## Parking Lot (recorded, never deleted)`

Fill: verbatim from the S7 record — cite the lock decision id directly under the title; In MVP: one line per F-NN; Parking Lot: one line per parked F-NN with its recorded reason. Nothing added, nothing dropped.

## 14. MILESTONES.md
Headings, in order: `# Milestones` · one block per milestone, M0 first:

```markdown
## M0 — <name>
- **Goal:** <one line>
- **Deliverables:** <F-NNs built, files/components, deploy/config steps>
- **Acceptance criteria:** <numbered; every one machine-checkable>
- **Estimate:** <rough cost/effort + basis>
```

Fill: verbatim from the S8 record; every F-NN lands in exactly one milestone.

## 15. VERIFICATION.md
Headings, in order: `# Verification` · one `## M<n> — <name>` section per milestone · `## Global smoke test` · `## Definition of verified`

Fill: per milestone — the S8 verification procedure verbatim: exact commands + expected outputs, visual checks as observable facts plus how to look. Global smoke test — one scripted pass over the whole product, end to end. Definition of verified — a milestone is verified when every acceptance criterion's procedure was run on the deploy target and produced the expected result. No criterion without a procedure.

## 16. ASSUMPTIONS.md
Headings, in order: `# Assumptions` · one block per non-confirmed decision:

```markdown
## D-0NN — <summary> (assumed | designer_filled)
- **Why:** <asked and skipped, or never surfaced — the user could not have known to ask>
- **How to replace or confirm:** <the question to ask, or the test to run>
```

Fill: every `decisions[]` entry whose status is not `user_confirmed` gets a block; `user_confirmed` decisions never appear here.

## 17. HANDOVER.md — owner document
Headings, in order: `# Handover (owner guide)` · `## How to run it` · `## How to deploy and update` · `## How to back up` · `## Where secrets and API keys live` · `## Who to ask what`

Fill: written for the non-technical owner like OVERVIEW.md. Run — exact steps, no code knowledge assumed. Deploy/update — steps and rhythm from the S2 maintenance answer; deploy target = the S2 decision. Back up — what to copy, where, how often. Secrets — accounts, admin email, key locations from S2/S3. Who to ask what — who or what is responsible for each part.

## 18. CAPABILITIES.md
Headings, in order: `# Capabilities` · one table row per recommended booster:

```markdown
| Name | Kind | License | Install | Notes |
|---|---|---|---|---|
| <booster> | skill | MIT | `npx skills add <repo>` | <when it helps> |
```

Fill: boosters recommended for this stack, from the Capability Registry, license-tagged; NC items marked `runtime-dependency-only` — credited, never vendored (principle 11).

## 19. blueprint.json — machine snapshot (derived)
Schema v1, stable — consumers: web UI, external harnesses (verbatim from spec 04):

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

Fill: derived from `.lvp/state.json` plus the bundle (refs, counts) — regenerate it, never hand-edit it; `.lvp/state.json` stays the pipeline's source of truth.

## 20. CLAUDE.md and GEMINI.md — harness stubs
Both files carry exactly this one line and nothing else:

```markdown
Read [AGENTS.md](AGENTS.md) — the builder entry point for this project.
```

Fill: identical content in both files; the agents.md entry point stays the single source.
