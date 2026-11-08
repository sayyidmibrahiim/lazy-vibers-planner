# Plan — LVP v1 skills

Branch: `feature/lvp-v1` · Date: 2026-11-08 · Source: `docs/spec/03-skills.md` v1 stubs, `/tmp/handoff-lvp-2026-11-08.md` roadmap item 3.

## Goal

Ship the four v1 skills so a bundled LVP project can be audited, extended, built, and branded without leaving the pipeline:

1. `/lvp-recheck-plan` — adversarial audit + refresh + fixes.
2. `/lvp-add-feature` — additive mini-pipeline with impact analysis.
3. `/lvp-build` — milestone executor with verification loop.
4. `/lvp-personal-brand` — separate branding output, gated by a live product.

## Non-goals

- F3 web UI rework (separate plan).
- Live T2/T3 model runs (needs external models).
- Auto-posting to social platforms; personal-brand produces files only.
- Changing the v0 Section procedures or the bundle file list.

## Shared invariants

- Every skill folder is self-contained: `SKILL.md` + `references/principles.md` + `references/conventions.md` + skill-specific references.
- `skills/lvp-principles.md` and `skills/lvp-conventions.md` stay canonical; each skill's `references/` copies are byte-identical snapshots (drift fails verification).
- `.lvp/journal.ndjson` stays append-only; every mutation gets a journal event.
- `.lvp/state.json` remains the pipeline source of truth; `blueprint.json` stays derived.
- Bundle files are English, GFM, ASCII diagrams, no Mermaid.
- No skill invents content: gaps become decisions (`assumed` / `designer_filled`) or findings.
- Scope changes require an explicit user confirmation recorded as a `user_confirmed` decision.

## Contracts

### /lvp-recheck-plan

Precondition: `.lvp/state.json` readable, scope locked, S1–S9 done. Refuse with guidance otherwise.

Flow: open recheck → inventory bundle + state + journal → run audit groups R1–R6 → write findings report → refresh stale/contested research live → present fix plan → apply confirmed fixes → re-audit touched items → close and recommend `/lvp-handoff`.

Audit groups:

- R1 decision integrity (rationale, status, DECISIONS/ASSUMPTIONS mirror).
- R2 evidence freshness (source + access date; stale > 90 days or `unverified`).
- R3 cross-file coherence (names, F-NN coverage, milestones ↔ verification).
- R4 feasibility and risk (contradictions, cost vs ceiling, legal/ToS, auth/PII, missing dependency).
- R5 bundle self-sufficiency (AGENTS.md load order, file map, entry prompt).
- R6 state/artifact consistency (`blueprint.json`, handoff status, scope evidence).

Output: `.lvp/recheck/RECHECK-<UTC date>.md` with findings `RC-NN` (severity `blocking|major|minor`), evidence, owner, fix. Journal: `recheck_started`, `recheck_finding`, `recheck_research_refresh`, `recheck_fix_applied`, `recheck_done`.

Never: change scope silently, delete Parking Lot rows, mark milestones verified, rewrite journal lines.

### /lvp-add-feature

Precondition: bundle exists, scope locked, handoff not required.

Flow: capture request → S4-style feature capture (`F-NN`, English name, priority, click script, edge cases) → targeted research (source + date) → impact analysis over 20 files → scope decision (extend current milestone, add milestone, or parking lot) → append decision + apply file edits → update `blueprint.json` + milestones → close with `/lvp-recheck-plan` recommendation.

Journal: `feature_started`, `feature_captured`, `feature_research`, `impact_analysis`, `feature_scope_decision`, `feature_applied`, `feature_done`.

Never: renumber existing features/milestones, rewrite historical decisions, mutate done Sections, or expand MVP without explicit confirmation.

### /lvp-build

Precondition: bundle exists, S8–S9 done, `VERIFICATION.md` present.

Flow: load builder context in order (AGENTS → DECISIONS → SPEC → MILESTONES → VERIFICATION) → pick first unverified milestone → implement per `CODE_STYLE.md`/`SECURITY.md` → run its verification procedure → record actual output in `VERIFICATION.md` → set `state.milestones[].verified` and `verified_at` → next milestone → stop on first unresolvable failure with a plain report.

Journal: `build_started`, `milestone_started`, `milestone_verified`, `milestone_failed`, `build_blocked`, `build_done`.

Never: skip a verification, claim a pass without captured output, edit `.lvp/` beyond state milestone fields + journal, or continue past an unresolvable failure.

### /lvp-personal-brand

Precondition (machine-checked): every milestone in `state.milestones[]` has `verified: true`, and deployment is live (`state.deployment.status = "live"` with URL, or a live URL the skill verifies with an HTTP check).

Flow: extract product evidence → positioning + audience → `brand/BRAND.md`, `brand/LINKEDIN-PROFILE.md`, `brand/CONTENT-PLAN.md` → self-check for unverifiable claims → close.

Journal: `brand_started`, `brand_file_generated`, `brand_done`.

Never: post to any platform, invent metrics/traction, mix brand files into the Blueprint Bundle, or run before the live gate passes.

## State additions (backward compatible)

- `milestones[]` entries gain optional `verified: boolean` + `verified_at`.
- New optional top-level `deployment: { status: "live|pending", url, verified_at }`, written by `/lvp-build` when the deploy milestone verifies.

Both documented in `docs/spec/01-state.md` and `skills/lvp-conventions.md` §2.

## Verification

1. Structural: every skill folder has a valid frontmatter (`name`, `description`), all `references/` targets exist, snapshots match canonical, no placeholder text.
2. Contract: black-box walkthrough per skill on a copy of `.scratch/lvp-core/dogfood/run/` in `/tmp/opencode`.
3. Regression: v0 skills unchanged; `npx skills add` from a local clone discovers 7 skill folders.
4. Repo gates: `npm run lint`, `npx tsc --noEmit`, `npm run build` (web app untouched, must stay green).

## Tickets

| NN | Title | Depends | Status |
|---|---|---|---|
| 10 | Skill `/lvp-recheck-plan` | — | open |
| 11 | Skill `/lvp-add-feature` | 10 | open |
| 12 | Skill `/lvp-build` | 11 | open |
| 13 | Skill `/lvp-personal-brand` | 12 | open |
| 14 | Spec/GLOSSARY/README sync + structural check | 10–13 | open |
| 15 | Black-box verification on dogfood bundle | 14 | open |

Commit per ticket. Delete this plan file only when every ticket is green.
