# Recheck Audit Checklist

Run every check, every time, on every recheck. Do not sample. Each failed check becomes one finding `RC-NN` with the severity shown (raise it when the evidence is worse), the evidence (file + line/row/heading), the owner, and one concrete fix.

Owner values: `S9` (bundle compile), `S8`, `S7`, `S6`, `S5`, `S2`, `lvp-handoff`, `lvp-add-feature`, `owner` (needs the user's call).

## R1 — Decision integrity

| ID | Check | Default severity | Owner |
|---|---|---|---|
| R1.1 | Every `decisions[]` entry has `id`, `section`, `summary`, non-empty `rationale`, and a valid `status` (`user_confirmed` / `assumed` / `designer_filled`). | major | source Section |
| R1.2 | `DECISIONS.md` mirrors `decisions[]` exactly: every state decision has a row; no row exists that state lacks; every row carries summary, rationale, alternatives (`None recorded` is valid), date. | major | S9 |
| R1.3 | Every `assumed` and `designer_filled` decision appears in `ASSUMPTIONS.md` with why it was assumed and how to replace or confirm it. | major | S9 |
| R1.4 | Every `designer_filled` decision is still valid for the current product: its assumption is stated, visible, and not silently contradicted by a later decision. | major | owner review |
| R1.5 | No two decisions contradict each other, and no decision contradicts the locked scope. | blocking | S7 / owner |
| R1.6 | Every risk accepted in the S6 record points at a `user_confirmed` decision with the accepted cost written down. | blocking | S6 |

## R2 — Evidence freshness

| ID | Check | Default severity | Owner |
|---|---|---|---|
| R2.1 | Every price or cost in `RESEARCH.md`, `OVERVIEW.md`, and `blueprint.json` carries a source URL + access date, or an explicit `unverified` flag. | major | S5 |
| R2.2 | Every price/cost row older than 90 days is re-verified live now; the refreshed row carries the new source + access date. | major | S5 |
| R2.3 | Competitor and pricing-model claims older than 180 days are re-verified live, or explicitly kept as historical with a `stale` note. | minor | S5 |
| R2.4 | Legal, Terms-of-Service, regional-availability, and external-API claims older than 90 days are re-verified live. | blocking | S5 |
| R2.5 | No claim reads as certain without a source; anything unverifiable is flagged `unverified` in place, never softened with vague language. | major | S5 |
| R2.6 | Cost totals in `blueprint.json` equal the `RESEARCH.md` cost table and the totals shown in `OVERVIEW.md`. | major | S9 |

Refresh rule: use real web search/fetch when the harness provides it. When it does not, say so loudly in the report, keep the claim `unverified`, and never write a fake access date.

## R3 — Cross-file coherence

| ID | Check | Default severity | Owner |
|---|---|---|---|
| R3.1 | All 20 bundle entries exist and are non-empty (conventions §8). | blocking | S9 |
| R3.2 | Every in-MVP `F-NN` has a `SPEC/requirements.md` row, a `USER_FLOWS.md` entry, a `SCOPE.md` row, and exactly one milestone in `MILESTONES.md`. Every parked `F-NN` has a requirements row marked parked and a scope row with a reason; no milestone is required. | blocking | S9 |
| R3.3 | Every milestone acceptance criterion has a matching verification procedure with exact commands and expected outputs. | blocking | S8 |
| R3.4 | Stack, entity, and feature names are identical across `AGENTS.md`, `DECISIONS.md`, `SPEC/*`, `USER_FLOWS.md`, `SCOPE.md`, `MILESTONES.md`, and `blueprint.json`. | major | S9 |
| R3.5 | Every bundle file is English GFM, uses ASCII diagrams only, and contains no Mermaid. | minor | S9 |
| R3.6 | `OVERVIEW.md` → Limitations lists every degraded booster and every blocked-then-resolved Section from the records. | major | S9 |
| R3.7 | `AGENTS.md` states what the product is, the context load order (`DECISIONS.md` → `SPEC/` → `MILESTONES.md` → `VERIFICATION.md`), the working rules, and a file map pointing at every other bundle file. | blocking | S9 |
| R3.8 | `CLAUDE.md` and `GEMINI.md` each contain exactly the one-line pointer to `AGENTS.md`. | minor | lvp-handoff |
| R3.9 | `blueprint.json` follows schema v1 and matches state + bundle: project, stack, features with `in_mvp`, decision counts, milestones, costs, capabilities, pointers. | major | lvp-handoff |
| R3.10 | When handoff status is `done`, `HANDOFF-PROMPT.md` exists and contains all required builder rules. | major | lvp-handoff |

## R4 — Feasibility and risk

| ID | Check | Default severity | Owner |
|---|---|---|---|
| R4.1 | Every in-MVP feature is buildable with the recorded stack, accounts, and budget — no feature needs an account, service, or device the S2 record lacks. | blocking | owner |
| R4.2 | Total recurring cost fits the S2 budget ceiling; every one-time cost is shown in the cost table. | blocking | S2 / owner |
| R4.3 | Auth, PII, and payment decisions match `SECURITY.md` and `SPEC/data-model.md`; the privacy-policy decision exists whenever login, PII, or a store presence exists. | blocking | S3 |
| R4.4 | Legal/ToS risk for every integration, scraping, or automation flow is recorded and either resolved or consciously accepted as a decision. | blocking | S6 / owner |
| R4.5 | Every external dependency has a license, an install line, and a fallback when the dependency is unavailable. | major | S9 |
| R4.6 | `M0` exists and is a walking skeleton (real stack, real data store, one real user task end to end, one scripted check). Every milestone fits one focused builder session. | blocking | S8 |
| R4.7 | Each failure point named in `SPEC/architecture.md` has a mitigation or a verification step. | major | S9 |
| R4.8 | No orphan in-MVP requirement (no flow or milestone) and no orphan milestone (no covered feature). Parked features are exempt from the milestone rule. | major | S9 |

## R5 — Bundle self-sufficiency

| ID | Check | Default severity | Owner |
|---|---|---|---|
| R5.1 | `AGENTS.md` names the context load order explicitly and does not require LVP skills. | blocking | S9 |
| R5.2 | Local run instructions are complete: prerequisites, install, env vars, run command, expected output. | blocking | S9 |
| R5.3 | `CODE_STYLE.md` and `SECURITY.md` are actionable for the chosen stack, not generic filler. | major | S9 |
| R5.4 | `HANDOVER.md` covers run, deploy, update, backup, where secrets live, and who to ask. | major | S9 |
| R5.5 | A builder can start from the bundle alone: no bundle file points at `.lvp/` as required reading, except appending open questions to the journal. | blocking | S9 |
| R5.6 | When handoff is done, the entry prompt carries the full builder rule set. | major | lvp-handoff |
| R5.7 | Every relative file pointer in every bundle file resolves to an existing file. | major | S9 |

## R6 — State and artifact consistency

| ID | Check | Default severity | Owner |
|---|---|---|---|
| R6.1 | `state.json` matches the conventions §2 shape; every Section status matches its record on disk. | blocking | lvp-continue |
| R6.2 | Scope is locked (`scope_locked` journal event and S7 done); every S4 feature is accounted for in the S7 scope record. | blocking | S7 |
| R6.3 | `state.milestones[]` ids, goals, and order match `MILESTONES.md`. | major | S8 |
| R6.4 | `project.status` is consistent with progress (`bundled` after S9; `handoff.status` matches the journal). | major | lvp-handoff |
| R6.5 | Journal integrity holds: `seq` is contiguous from 1, timestamps are non-decreasing, no line was rewritten or deleted. | blocking | all skills |
| R6.6 | Every blocking finding from the previous recheck report is either resolved with evidence or still listed as open here. | major | lvp-recheck-plan |

## Severity meaning

- **blocking** — the bundle cannot be built as written, or it carries a legal/security/scope contradiction. Fix or consciously accept before handoff or build.
- **major** — required content is missing, stale, or unreachable; the builder will improvise without it.
- **minor** — naming drift, formatting, or documentation polish; no build impact.

## Fix classes

- **Mechanical** (auto-apply, one file per turn, journal `recheck_fix_applied`): missing mirror row, missing source/date where the source exists, renamed entity drift, stale `blueprint.json`, broken pointer, count mismatch, missing stub, Mermaid block replaced with ASCII.
- **Research** (journal `recheck_research_refresh`): re-verify a dated claim, then update every file that repeats it (`RESEARCH.md`, `OVERVIEW.md`, `blueprint.json`).
- **User decision** (ask first, then apply and record `D-NNN`): scope change, budget change, feature removal/addition, accepted risk, choosing between two valid architectures.

Never auto-apply a user-decision fix. Never mark a milestone verified. Never delete a Parking Lot row.
