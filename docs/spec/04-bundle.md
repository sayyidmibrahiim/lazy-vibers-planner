# Spec 04 — Blueprint Bundle

The bundle is the product. It is generated at S9 (and maintained by v1 skills), lives in the project folder next to `.lvp/`, and must be **self-sufficient**: any harness, with no LVP skills installed, can build the product from it.

## File list (v0)

| File | Owner | Audience | Content rules |
|---|---|---|---|
| `AGENTS.md` | S9 | builder | Entry point per agents.md spec: what the product is, how to load context (read DECISIONS → SPEC → MILESTONES), working rules, pointers to all other files |
| `OVERVIEW.md` | S9 | owner | Plain-English (SimpleEnglish doc rules, strictest here): what was decided, total cost table, how the product will be used, what is parked. The web UI renders this in User Language |
| `DECISIONS.md` | S9 | builder | Append-only log: D-001… with summary, rationale, alternatives considered (optional — record when a real alternative was rejected; `None recorded` is valid), date. Mirrors `decisions[]` |
| `SPEC/prd.md` | S9 | builder | Problem, context, target users, value proposition, goals/non-goals, success metrics |
| `SPEC/requirements.md` | S9 | builder | F-01… per feature: behavior, priority (must/should/could), acceptance criteria (Gherkin where natural) |
| `SPEC/data-model.md` | S9 | builder | Entities, fields (name/type/constraints), relations + cardinality, indexes + why, validation rules, sample JSON |
| `SPEC/api.md` | S9 | builder | Conventions, endpoint table, request/response examples for critical endpoints, status codes, error format |
| `SPEC/architecture.md` | S9 | builder | Stack + reasons (mirrors DECISIONS), components, **ASCII data-flow diagram**, folder structure, local run instructions, failure points |
| `USER_FLOWS.md` | S9 | builder + owner | Per feature: flow diagram (ASCII) + numbered click-by-click interaction script (the "posting ke IG" style), both happy path and key alternatives |
| `CODE_STYLE.md` | S9 | builder | Language/framework conventions, naming, testing expectations, error handling, simplicity rules (ponytail + karpathy distilled, adapted to the chosen stack) |
| `SECURITY.md` | S9 | builder | Auth model, PII inventory + protection, secrets handling, dependencies policy, compliance notes (region-appropriate) |
| `RESEARCH.md` | S5/S9 | builder + owner | Competitor scan, comparable products, stack comparison with trade-offs, cost table — every claim with source + date, `unverified` flags where applicable |
| `SCOPE.md` | S7/S9 | builder + owner | MVP list (F-01…) + Parking Lot, explicit |
| `MILESTONES.md` | S8/S9 | builder | M0…Mn: goal, deliverables, acceptance criteria, estimate |
| `VERIFICATION.md` | S8/S9 | builder | Per milestone: verification procedure (commands, expected outputs, visual checks); global smoke test; "definition of verified" |
| `ASSUMPTIONS.md` | S9 | builder + owner | Every decision not `user_confirmed`: `assumed` (asked, skipped) and `designer_filled` (proactively filled — the user couldn't have known to ask), each with why + how to replace/confirm it |
| `HANDOVER.md` | S9 | owner | How to run, deploy, update, back up; where secrets/API keys live; who to ask what |
| `CAPABILITIES.md` | S9 | builder | Recommended boosters for this stack (install lines), license-tagged; NC items marked runtime-dependency-only |
| `blueprint.json` | S9 | UI + harness | Machine snapshot (schema below) |
| `CLAUDE.md`, `GEMINI.md` | S9 | harnesses | One-line stubs pointing to AGENTS.md |

Format rules (all files): GitHub-flavored Markdown · English source · no Mermaid (ASCII diagrams) · SimpleEnglish document rules · consistency enforced (same stack/entity/feature names everywhere).

## Compilation order (S9)

1. Draft each file from section records + `decisions[]` + `milestones[]`.
2. **Cross-check pass**: every F-… has a USER_FLOWS entry and requirements entry; every decision has a DECISIONS.md row; every non-confirmed decision (`assumed` + `designer_filled`) is in ASSUMPTIONS.md; stack names identical across files.
3. SimpleEnglish document-rules pass.
4. Humanizer pass (de-slop).
5. Emit `blueprint.json` + harness adapters.
6. Journal `doc_generated` per file (checkpoint granularity).

## Maintenance after S9 (v1 skills)

The 20-file list above is fixed. The v1 skills change the bundle by editing those files, never by adding a 21st:

| Skill | Bundle effect | Side artifacts (never in the bundle) |
|---|---|---|
| `/lvp-handoff` | regenerates `blueprint.json`, refreshes the entry prompt | `HANDOFF-PROMPT.md` |
| `/lvp-recheck-plan` | fixes confirmed findings in place; regenerates `blueprint.json` when stale | `.lvp/recheck/RECHECK-<date>.md` |
| `/lvp-add-feature` | appends the requirement, flow, scope, milestone, verification, decision, assumption, research, and cost rows | `.lvp/docs/sections/S4-additions.md` |
| `/lvp-build` | appends the build log to `VERIFICATION.md`; never edits a requirement or an acceptance criterion | `brand/` (next row), `state.milestones[].verified` |
| `/lvp-personal-brand` | none — the bundle is read-only here | `brand/BRAND.md`, `brand/LINKEDIN-PROFILE.md`, `brand/CONTENT-PLAN.md` |

Rules: existing ids are never renumbered; earlier `VERIFICATION.md` entries and `DECISIONS.md` rows are never rewritten; `blueprint.json` stays derived; parked features keep a requirements row and a scope row, and require no milestone.

## `blueprint.json` schema (v1, stable — consumers: web UI, external harnesses)
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

Rules: `blueprint.json` is a **derived** file — regenerate, never hand-edit; `.lvp/state.json` remains the pipeline's own source of truth.
