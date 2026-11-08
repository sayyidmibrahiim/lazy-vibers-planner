---
name: lvp-recheck-plan
description: Adversarial audit of a finished LVP Blueprint Bundle and its decisions. Re-verifies stale prices and claims with current sources, flags contradictions, feasibility risks, and bundle gaps, then fixes the confirmed ones in place. Use when the user wants a plan or bundle rechecked, stress-tested, refreshed with current data, or audited before building. Refuses when scope is not locked or the pipeline has not reached S9.
---

# lvp-recheck-plan

The adversarial audit skill of the LVP pipeline. It treats the existing Blueprint Bundle as a claim to disprove: every decision, price, milestone, and cross-file link is checked again, stale evidence is refreshed live, and confirmed findings are fixed where they live. It is not a lint that praises; a clean report is earned, never assumed.

It never rebuilds the pipeline, never re-runs done Sections, and never marks milestones verified. `/lvp-handoff` remains the closing authority for the bundle; `/lvp-build` remains the executor.

## Load first

Before any check or file write:

1. Read `references/principles.md` (the Constitution). Principles 1, 2, 3, 9, and 13 bind this skill hardest.
2. Read `references/conventions.md` (the operational manual). It owns the state schema, journal events, Section map, and the 20-file bundle list; the steps below reference it.
3. Read `references/audit-checklist.md` (this skill's checklist). It is the audit contract: every check runs, every time.
4. Interact in the user's language (`state.project.user_language`) from the first message. Artifacts and findings stay English; conversation is translated at runtime.

## Flow at a glance

1. **Precondition** — project present, scope locked, S1–S9 done. Not met → refuse with guidance.
2. **Open + inventory** — journal `recheck_started`, load state, journal, records, and all bundle files.
3. **Audit** — run checklist groups R1–R6 literally; every failure becomes a finding `RC-NN`.
4. **Refresh** — re-verify stale or unsourced claims live; update every file that repeats the claim.
5. **Report + fix plan** — write `.lvp/recheck/RECHECK-<date>.md`; split fixes into mechanical and user-decision.
6. **Apply** — mechanical fixes now; decision fixes only after an explicit answer, recorded as `D-NNN`.
7. **Re-audit + close** — re-run R3, R6, and every touched group; append results; journal `recheck_done`.

## Step 1 — Precondition

`TARGET` = cwd (or the folder the user named). Run in order; the first failure stops with plain guidance. Nothing is written on a refusal.

1. **Project exists** — `TARGET/.lvp/state.json` exists and parses. Missing → "There is no LVP project here. Run `/lvp-init-new-idea` in an empty folder, or `/lvp-continue` in the folder that holds it." Unreadable → "This project's state file is damaged. Run `/lvp-continue` first — it rebuilds the state from the journal — then run `/lvp-recheck-plan` again."
2. **Scope locked** — scope is locked iff the journal holds `scope_locked` or `pipeline.sections.S7.status` = "done". Not locked → "The scope is not locked yet. Run `/lvp-continue` to finish the pipeline up to S7."
3. **Pipeline complete through S9** — every Section S1–S9 has `status` "done". Any other status → name each unfinished Section with its purpose (conventions §5) and say: "The bundle does not exist yet. Run `/lvp-continue` — it resumes at Section `<S>` — then recheck."
4. **Bundle present** — at least `AGENTS.md` and `blueprint.json` exist in `TARGET`. Missing → "S9 is marked done but the bundle is missing. Run `/lvp-continue` to finish S9 (it skips files already on disk), then recheck."

S9 done but the bundle has gaps is exactly what this skill audits; do not refuse that case.

## Step 2 — Open and inventory

1. **Open** — journal `recheck_started` (payload: project slug, report path) + a state write (no field change). One checkpoint.
2. **Load material** — `state.json`, the full journal, every Section Record in `.lvp/docs/sections/`, and all 20 bundle entries (conventions §8). Per tier: T1/T2 load at start; T3 reload only what the current group needs, never the transcript. The disk is the memory (principle 13).
3. **Inventory the bundle** — build a file → exists/size table and a list of feature ids (`F-*`), milestone ids (`M*`), decision ids (`D-*`), and pointers found. This table drives R3 and R6; do not hold it as prose.

## Step 3 — Audit

Run `references/audit-checklist.md` literally, groups R1–R6 in order. Do not sample and do not skip a group because a later one "looks clean".

For every failed check, create one finding:

```
RC-NN | severity: blocking | major | minor
check: R3.3
finding: one plain sentence — what is wrong and where (file + heading/row).
evidence: exact quote, row id, command output, or journal seq.
owner: file / Section / skill.
fix: one concrete action.
```

Rules:

- One finding per failed check. A check that fails in five files may produce five findings when the fixes are independent; otherwise one finding listing all locations.
- Journal `recheck_finding` at the moment the finding is created (payload: id, check, severity, owner). One checkpoint per finding batch is not allowed; findings are checkpointed as found.
- Severity follows the checklist. Raise it when the evidence is worse (for example, an unsourced price inside the MVP cost table is `blocking`, not `major`).
- Record clean groups with their check count; "R1 passed 6/6" is evidence, "looks fine" is not.

Do not fix anything during the audit pass. Fixing while auditing hides the second failure in the same file.

## Step 4 — Refresh evidence

After the audit pass, take every R2 finding plus any finding whose evidence is a dated or unsourced claim:

1. Re-verify live with web search/fetch when the harness provides it. Record source URL + access date.
2. No web access → say so loudly in the report, keep the claim `unverified`, and never write a fake access date.
3. Update every file that repeats the refreshed claim: `RESEARCH.md`, `OVERVIEW.md`, `blueprint.json`, and `SPEC/*` when the claim is an API or platform fact. Never leave the old number in a second file.
4. Journal `recheck_research_refresh` per claim (payload: claim, old value, new value, source, access date, files updated).
5. A refresh that changes a cost or an MVP constraint is a user-decision finding, not a mechanical fix: present it before editing budget or scope text.

## Step 5 — Report and fix plan

Write `.lvp/recheck/RECHECK-<YYYY-MM-DD>.md`. Same-day re-run → append `-2`, `-3`. Never overwrite a prior report.

```markdown
# Recheck — <project name> — <date>

- Trigger: <user request / pre-build audit / scheduled>
- State: status <project.status> · S1–S9 <done/pending> · handoff <status>
- Audit scope: R1–R6 (all checks) · prior report: <path or none>

## Summary
- Findings: <n> blocking · <n> major · <n> minor
- Refreshed claims: <n> · unverifiable: <n>
- Fixes applied: <n> mechanical · <n> decision

## Findings
| ID | Severity | Check | Finding | Evidence | Owner | Fix | Status |
|---|---|---|---|---|---|---|---|
| RC-01 | blocking | R4.1 | ... | ... | S4 | ... | open |

## Research refresh
| Claim | Old | New | Source | Access date | Files updated |
|---|---|---|---|---|---|

## Fix plan
1. <ordered by severity; mechanical first, then user-decision items>

## Applied fixes
| RC | File | Change |
|---|---|---|

## Re-audit
- R3, R6: <pass/fail counts>
- Touched groups: <group>: <pass/fail>
- Open blocking findings: <ids or none>

## Limitations
<no web access, unverifiable claims, unresolved decisions>
```

Then present the fix plan in plain language, grouped by severity. Lead with blocking findings and their consequence, not with the file names.

## Step 6 — Apply fixes

Two classes, never mixed:

- **Mechanical** — apply now, one file per turn, journal `recheck_fix_applied` (payload: finding id, file, change) + state write. Examples: missing mirror row, missing access date where the source exists, renamed entity drift, stale `blueprint.json`, broken pointer, count mismatch, missing stub.
- **User decision** — ask one plain question per finding, with the concrete options and the consequence of each. On an explicit answer: record `D-NNN` in `decisions[]` with `status: "user_confirmed"` and the rationale, apply the change, journal `recheck_fix_applied`. A skip or "later" keeps the finding **open**; never convert an open blocking finding into `assumed` silence.
- **`blueprint.json`** — derived; regenerate it from `state.json` + bundle per spec 04 whenever R3.9/R2.6 finds drift. Never hand-edit.
- **Bundle scope rows** — never delete a Parking Lot row. A scope change is always a user-decision finding recorded as a decision.

If the user declines every fix, stop fixing, keep the findings open, and still close the run with an honest report.

## Step 7 — Re-audit and close

1. Re-run R3, R6, and every group touched by a fix. A fix can break a neighbor; checking only the fixed row is not a re-audit.
2. Append the `## Re-audit` results to the report and set each finding's status `resolved` or `open` with evidence.
3. Journal `recheck_done` (payload: report path, counts, open blocking ids) + state write. One checkpoint.
4. Close in plain language:
   - zero open blocking findings → "The bundle is coherent as of `<date>`. Run `/lvp-handoff` again to refresh `blueprint.json` and the entry prompt before building." If handoff was never run, point at `/lvp-handoff`.
   - open blocking findings → name each finding, its owner, and the exact next skill (`/lvp-continue` for a Section gap, `/lvp-add-feature` for a missing feature, the user for a budget/legal call). State plainly that handoff and build are not ready.

## Journal events added by this skill

Append to conventions §3 when this skill ships: `recheck_started`, `recheck_finding`, `recheck_research_refresh`, `recheck_fix_applied`, `recheck_done`. Payloads are named above. All other events keep their v0 meaning.

## Idempotency

- Re-running is always safe: the audit is re-derived from disk, never remembered.
- A prior report is never edited; a new run writes a new dated report and carries prior open blocking findings forward (R6.6).
- Mechanical fixes are idempotent (present → no change, no duplicate journal event).
- Report files live under `.lvp/recheck/`; they are audit artifacts, not part of the Blueprint Bundle.

## Never list

- Never audit on an unlocked scope or before S9 — refuse with guidance. (Conventions §5 hard rules)
- Never claim clean without the full re-audit. (Principle 9)
- Never write a source or access date you did not actually verify. (Principle 1)
- Never apply a scope, budget, or risk decision without an explicit user answer. (Principle 2, 12)
- Never delete a Parking Lot row, renumber features or milestones, mark a milestone verified, or rewrite journal lines.
- Never degrade silently: no web access, an unreadable record, a skipped fix — all stated in the report and to the user.
