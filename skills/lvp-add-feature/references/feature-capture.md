# Feature Capture and Impact Analysis

Companion to `/lvp-add-feature`. The capture form is mandatory: a feature without a complete script is a placeholder, and placeholders never enter the bundle.

## 1. Capture form (`F-NN`)

Ask in the user's language, one micro-batch at a time (tier limits apply). Record verbatim answers in the additions record.

| Field | Rule |
|---|---|
| Verbatim request | The user's own words, unedited. |
| Display name (EN) | Short noun phrase used in every bundle file. Coin it; confirm when ambiguous. |
| Who uses it | One named kind of person, never "everyone". |
| Happy path | Numbered click-by-click script a stranger could follow: opening state → each tap/input → visible result. No step may say "and then it works". |
| Failure cases | The ones the user cares about; each with the visible result they expect. |
| Priority | `must` / `should` / `could`, confirmed aloud, never inferred. |
| Scope proposal | Extend current milestone / new milestone / Parking Lot, with one-line reasoning. |

Id rules: `F-NN` continues from the highest id found in `SPEC/requirements.md` + `SCOPE.md`; never reuse or renumber. Milestones continue from the highest `M<n>`.

## 2. Targeted research

Only what this feature changes:

- new external service/API → pricing, license, regional availability, ToS for the intended use;
- new data class → legal/regional storage constraint;
- new platform capability → current support status.

Every claim: source URL + access date, or explicit `unverified`. Reuse existing `RESEARCH.md` rows when the claim is already evidenced; cite the row instead of re-researching.

## 3. Impact matrix

Walk every row; mark `edit`, `append`, `none`, with the exact section/row. A row marked `edit` must name the existing text being changed.

| Bundle file | Ask |
|---|---|
| `SPEC/requirements.md` | New F-NN row; acceptance criteria. |
| `USER_FLOWS.md` | Flow diagram + click script, when in MVP. |
| `SCOPE.md` | In-MVP row or Parking Lot row with one-line reason. |
| `MILESTONES.md` | Extend an existing milestone's deliverables, or append one new milestone. |
| `VERIFICATION.md` | Procedure matching every new acceptance criterion. |
| `SPEC/data-model.md` | New entity/field/relation/validation/sample. |
| `SPEC/api.md` | New endpoint or changed contract. |
| `SPEC/architecture.md` | Component, storage, external dependency, data-flow change. |
| `SECURITY.md` | Auth, PII, secret, permission, or compliance change. |
| `DECISIONS.md` | One new decision for the scope + design choice. |
| `ASSUMPTIONS.md` | Every new `assumed` / `designer_filled` decision. |
| `RESEARCH.md` | New evidence rows + cost impact. |
| `OVERVIEW.md` | Owner-visible feature line + updated cost totals if changed. |
| `CAPABILITIES.md` | New booster/tool dependency with license + install line. |
| `HANDOVER.md` | Ops/deploy/backup change only. |
| `CODE_STYLE.md` | Only when the feature introduces a new code convention. |
| `AGENTS.md` | Only if the file map changes (it should not; no new bundle files). |
| `blueprint.json` | Always regenerate: new feature, milestone, decision counts, costs. |
| `CLAUDE.md`, `GEMINI.md` | Unchanged. |

## 4. Application rules

- Append-only by default. Existing decisions, milestones, scope rows, and records are never rewritten.
- A new decision gets the next `D-NNN`, `section: "S4"` (the owning section), a rationale, and `user_confirmed` (scope choice) or `assumed` / `designer_filled` per principle 12.
- A new milestone: append `M<n+1>` with goal, deliverables, measurable acceptance criteria, verification procedure, rough cost/effort, and `verified: false` in state.
- Parking Lot: record the requirement row marked parked + the scope row with the reason. No milestone, no verification procedure, and no flow required.
- Costs change → update `RESEARCH.md`, `OVERVIEW.md`, and `blueprint.json` in the same run, all from the same verified number.
- One file per turn; `feature_applied` journal event per file. Never leave half a cross-file edit without a checkpoint.

## 5. Post-lock record

Write `.lvp/docs/sections/S4-additions.md`, append-only:

```markdown
# S4 — Additions after scope lock

## F-NN — <display name>
- Captured: <date> · Priority: <must|should|could> · Scope: <in-MVP milestone|new milestone|Parking Lot>
- Request (verbatim, <language>): <text>
- Who: <named user>
- Happy path: <numbered script>
- Failure cases: <list>
- Research: <claims with source + date, or unverified>
- Decision: <D-NNN> · Files touched: <list>
```

This file is evidence for future rechecks; S9 does not compile it, and the skill applies the bundle edits itself.
