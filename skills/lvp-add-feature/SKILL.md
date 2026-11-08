---
name: lvp-add-feature
description: Adds one feature to a finished LVP Blueprint Bundle through a mini-pipeline — capture, targeted research, impact analysis across every affected bundle file, scope decision, then append-only application with a new decision and milestone. Use when the user wants to add, extend, or park a feature after the MVP is locked. Refuses when no bundle exists or scope is not locked.
---

# lvp-add-feature

The additive skill of the LVP pipeline. The MVP is frozen at S7; this skill is the only sanctioned way to change it after the bundle exists. It captures one feature with the same rigor as S4, researches only what the feature changes, walks every affected bundle file, and applies append-only edits with a recorded decision.

It never re-runs done Sections, never renumbers existing ids, never rewrites history, and never expands the MVP without an explicit answer.

## Load first

Before any check, question, or file write:

1. Read `references/principles.md` (the Constitution). Principles 1, 2, 9, 10, and 12 bind this skill hardest.
2. Read `references/conventions.md` (the operational manual): state schema, journal events, Section map, bundle list.
3. Read `references/feature-capture.md`: the mandatory capture form, targeted-research rules, impact matrix, and append templates.
4. Interact in `state.project.user_language`. Artifacts and stored values stay English.

## Flow at a glance

1. **Precondition** — project, scope lock, S1–S9 done, bundle present. Otherwise refuse with guidance.
2. **Open + locate ids** — journal `feature_started`; next `F-NN`, `D-NNN`, `M<n>`.
3. **Capture** — one feature, full script, priority confirmed aloud.
4. **Targeted research** — only what this feature changes; source + date or `unverified`.
5. **Impact analysis** — every affected bundle file with its exact edit.
6. **Scope decision** — extend milestone / new milestone / Parking Lot, confirmed.
7. **Apply** — append-only edits, one file per turn; state decisions + milestones updated.
8. **Close** — journal `feature_done`; recommend `/lvp-recheck-plan`, then `/lvp-handoff`.

## Step 1 — Precondition

`TARGET` = cwd (or the folder the user named). First failure stops with plain guidance; nothing is written on a refusal.

1. **Project exists** — `TARGET/.lvp/state.json` exists and parses. Missing/unreadable → route to `/lvp-init-new-idea` or `/lvp-continue` as in `lvp-recheck-plan` Step 1.
2. **Scope locked** — `scope_locked` journal event or S7 done. Not locked → "The MVP is not frozen yet. Run `/lvp-continue` to finish S7, then add the feature."
3. **Pipeline through S9 done** — every S1–S9 Section done. Not → name the Section and route to `/lvp-continue`. The feature needs a bundle to extend.
4. **Bundle present** — `AGENTS.md` and `blueprint.json` exist. Missing → finish S9 first.
5. **Request present** — a feature description from the user. Missing → ask one line: "What should the product do that it does not do today?" Do not start with a solution-shaped guess.

## Step 2 — Open and locate ids

1. Journal `feature_started` (payload: request verbatim) + a state write (no field change). One checkpoint.
2. Load state, journal, the S4/S7/S8 records and their additions record, `SPEC/requirements.md`, `SCOPE.md`, `MILESTONES.md`, `blueprint.json`.
3. Derive ids from the files on disk, never from memory:
   - `F-NN` = highest id in `SPEC/requirements.md` + `SCOPE.md` + `S4-additions.md`, plus one.
   - `D-NNN` = highest in `decisions[]` + `DECISIONS.md`, plus one.
   - `M<n>` = highest in `MILESTONES.md` + `state.milestones[]`, plus one.
   A mismatch between state and files is a finding to report now, not something to paper over.

## Step 3 — Capture

Follow `references/feature-capture.md` §1. Micro-batches by tier (T1 ≤3, T2 ≤2, T3 =1), every turn in the user's language, skip and enough controls visible.

Required before moving on: verbatim request, English display name, named user, complete click-by-click happy path, failure cases the user cares about, priority confirmed aloud, scope proposal. A missing script or priority blocks the capture; do not fill it with a guess.

Record the whole capture in `.lvp/docs/sections/S4-additions.md` (append-only, template in the reference). Journal `feature_captured` (payload: id, name, priority). One checkpoint.

## Step 4 — Targeted research

Follow `references/feature-capture.md` §2. Reuse evidenced rows from `RESEARCH.md`; research only the new service, data class, platform capability, or legal constraint this feature introduces.

Every new claim carries source URL + access date, or an explicit `unverified` flag. No web access → say so loudly and keep claims `unverified`. Journal `feature_research` (payload: claims added, sources, unverified count). One checkpoint.

## Step 5 — Impact analysis

Walk the matrix in `references/feature-capture.md` §3, row by row. Output a table:

```
file | action (edit/append/none) | exact section or row | content source
```

Rules:

- `edit` must quote the existing text it changes; no blind rewrite.
- No new bundle files. If the feature seems to need one, that is a finding for `/lvp-recheck-plan`, not a quiet addition.
- Every new acceptance criterion gets a matching verification procedure; every new data field gets a data-model row; every new cost gets one verified number used in `RESEARCH.md`, `OVERVIEW.md`, and `blueprint.json`.
- Journal `impact_analysis` (payload: file list). One checkpoint.

## Step 6 — Scope decision

Present the scope proposal in plain language with three options and consequences:

1. **Extend current milestone** — only when the feature fits the milestone's one-session size and shares its flow.
2. **New milestone** — default for a substantial feature; appended as `M<n+1>` after the last milestone.
3. **Parking Lot** — recorded, not built; the bundle gets a parked requirement row and a scope row with the reason, no milestone or verification procedure.

The user's explicit choice is recorded as the next `D-NNN` (`section: "S4"`, `user_confirmed`, rationale = the choice and why). A skip or "later" is not a scope decision: keep the capture and stop before applying bundle edits, reporting the open feature. Journal `feature_scope_decision` (payload: F-NN, choice, D-NNN). One checkpoint.

## Step 7 — Apply

Apply the impact table, one file per turn, append-only unless the row is a required edit:

- **Requirements** — append the F-NN row; for Parking Lot mark it `parked` and omit flow/milestone.
- **USER_FLOWS.md** — append the flow + numbered script for an in-MVP feature.
- **SCOPE.md** — append the in-MVP row or the Parking Lot row with its reason.
- **MILESTONES.md** — extend the chosen milestone's deliverables, or append `M<n+1>`.
- **VERIFICATION.md** — append the matching procedure with exact commands and expected outputs.
- **SPEC/data-model.md, SPEC/api.md, SPEC/architecture.md, SECURITY.md** — only when the matrix says so.
- **DECISIONS.md** — append the scope decision row (and any design decision made during capture).
- **ASSUMPTIONS.md** — append every new `assumed` / `designer_filled` decision.
- **RESEARCH.md, OVERVIEW.md** — new evidence rows and owner-visible feature/cost lines.
- **CAPABILITIES.md, HANDOVER.md, CODE_STYLE.md** — only when the matrix says so.
- **`blueprint.json`** — regenerate from state + bundle per spec 04, never hand-edit.
- **State** — append the decision; append the milestone entry (`verified: false`) when a milestone was added. Never touch done Sections or existing milestone entries.

After each file: journal `feature_applied` (payload: F-NN, file, action) + state write. One checkpoint per file.

## Step 8 — Close

1. Re-read the touched files and check the matrix is fully applied: every `edit`/`append` row has evidence. A half-applied feature is a failure, not a checkpoint.
2. Journal `feature_done` (payload: F-NN, scope, files touched, D-NNN, M-id or none). One checkpoint.
3. Close in plain language:
   - what the product now does (or what was parked),
   - which milestone covers it,
   - that the bundle changed and handoff artifacts may be stale.
4. Run `/lvp-recheck-plan` next, then `/lvp-handoff` again if it had already run. Do not tell the user the bundle is build-ready before the recheck.

## Journal events added by this skill

`feature_started`, `feature_captured`, `feature_research`, `impact_analysis`, `feature_scope_decision`, `feature_applied`, `feature_done`. Payloads are named above.

## Idempotency and resume

- Re-running with the same request on a bundle that already holds the captured F-NN: report it, show the recorded scope, and offer to continue at the first unapplied row instead of recapturing.
- Every file write is checkpointed; a dead session resumes from the impact table and the additions record.
- Never duplicate an `F-NN`, `D-NNN`, or milestone id.

## Never list

- Never start without a locked scope and a bundle.
- Never renumber, rewrite, or delete an existing feature, decision, milestone, or scope row.
- Never mutate a done Section Record; additions go to `S4-additions.md`.
- Never add a bundle file.
- Never expand the MVP on a guess; the scope choice needs an explicit answer. (Principles 2, 12)
- Never leave an unsourced claim unflagged, or a skipped verification procedure. (Principles 1, 9)
