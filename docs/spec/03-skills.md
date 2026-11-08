# Spec 03 — Skill Contracts & Constitution

Skills are plain markdown instruction files (Agent Skills format) living in `skills/lvp-<name>/SKILL.md` in this repo, installed into harnesses via standard installers (see `05-boosters.md`). Per-harness thin adapters are generated from the same source.

## `/lvp-init-new-idea` (v0)

**Precondition**: none — the Folder Gate decides (`01-state.md`).

**Flow**:
1. Folder Gate → proceed / create subfolder / refuse with pointers.
2. S0 intake: capture idea verbatim, detect + confirm User Language, propose slug + name.
3. **Booster bootstrap** (core check → install → interactive failure handling; `05-boosters.md`).
4. Sections S1–S8 in order with checkpoints; S6 loop-backs as specified; scope lock mandatory before S8.
5. S9 compile the Blueprint Bundle.
6. Suggest `/lvp-handoff`.

**Never**: re-ask a recorded answer · generate the bundle before scope lock · write NC-licensed content into any LVP file · answer a factual question from memory when it can be verified (mark `unverified` or research).

**Interruption**: safe anywhere; resume is `/lvp-continue`'s job.

## `/lvp-continue` (v0)

**Input**: optional path (default cwd).

**Flow**:
1. Read `.lvp/state.json`. Missing → explain and suggest `/lvp-init-new-idea` (with Folder Gate guidance). Corrupt → rebuild by journal replay, report what was reconstructed.
2. Print a plain-language progress summary: project name, current Section, answered/total, pending loop-backs, booster status, last activity time.
3. Offer the right next action: resume interview / answer pending loop-back / run handoff (if ready) / suggest `add-feature` or `recheck-plan` (if bundled).
4. Resume the current Section exactly where it stopped (micro-batch boundary).

**Never**: skip ahead of scope lock · re-ask answered questions.

## `/lvp-handoff` (v0)

**Precondition**: S1–S8 `done` + scope locked.

**Flow**:
1. **Gap lint** — checklist: every bundle file exists and non-empty · every milestone has measurable acceptance criteria + verification procedure · every `assumed` decision appears in ASSUMPTIONS.md · every decision has rationale · cost table present · OVERVIEW.md present · `blueprint.json` matches state · no contradictions with `decisions[]`.
2. Gaps → report in plain language + offer to jump back to the owning Section. Journal: `gap_found`.
3. Emit `blueprint.json` (schema in `04-bundle.md`).
4. Write harness adapters: `CLAUDE.md`, `GEMINI.md` (one-line pointers to AGENTS.md), verify AGENTS.md against the agents.md spec.
5. Compose the **entry prompt** (English): read AGENTS.md first · execute milestones in order · verify each milestone before claiming done · record results in VERIFICATION.md · consult DECISIONS.md before asking · open questions go to journal, never silently guessed · follow CODE_STYLE.md.
6. Print the recommended install lines for `CAPABILITIES.md` boosters and the builder kickoff commands for the harness the user is currently in. Journal: `handoff_done`.

## v1 skills

### `/lvp-recheck-plan` (v1, implemented)

**Precondition**: `.lvp/state.json` readable, scope locked (`scope_locked` journal event or S7 done), S1–S9 done, bundle present. Otherwise refuse with guidance to `/lvp-continue`.

**Flow**:
1. Open: journal `recheck_started`; inventory state, journal, Section Records, all 20 bundle files.
2. Audit: run `references/audit-checklist.md` groups R1–R6 literally — decision integrity, evidence freshness, cross-file coherence, feasibility/risk, bundle self-sufficiency, state/artifact consistency. Every failure is a finding `RC-NN` with severity, evidence, owner, fix; journal `recheck_finding`.
3. Refresh: re-verify stale (price/cost > 90 days, legal/ToS/API > 90 days, competitor claims > 180 days) or unsourced claims live; update every file repeating the claim; journal `recheck_research_refresh`. No web access → claim stays `unverified`, stated loudly.
4. Report: write `.lvp/recheck/RECHECK-<date>.md` (never overwrite a prior report); split fixes into mechanical and user-decision.
5. Apply: mechanical one file per turn (`recheck_fix_applied`); user-decision fixes only after an explicit answer, recorded as `D-NNN`; `blueprint.json` regenerated from state + bundle when stale.
6. Re-audit R3, R6, and every touched group; append results; journal `recheck_done`.

**Never**: silent scope change · Parking Lot deletion · milestone verification · fabricated source/date · rewriting journal lines.

### v1 stubs (pending implementation)

- **`/lvp-add-feature`** — precondition: bundle exists and scope locked. Runs a mini-pipeline (S4-style for the new feature → research → impact analysis over bundle files → sync all affected files → new DECISIONS entry + new milestones appended).
- **`/lvp-build`** — optional milestone executor: execute M0→Mn, verify each per VERIFICATION.md, stop and report on first unresolvable failure. Never required — any harness can build without it.
- **`/lvp-personal-brand`** — precondition (machine-checkable): all milestones `verified` + product live/deployed. Separate output; never mixed into the product pipeline.

## Constitution — `lvp-principles.md`

Loaded by every LVP skill before any work. Content (English; skill files keep it verbatim):

1. **Evidence-first** — claims carry sources and dates; if unverifiable, say so explicitly.
2. **Anti-yes-man** — if the user's idea has a gap, show it immediately with a concrete fix option. Disagreement is a duty, not a risk.
3. **Recheck before agreeing AND before disagreeing** — verify, then take a position.
4. **Allowed to say "I don't know"** — followed immediately by "let me research".
5. **User Language** — interact in the user's language; artifacts stay English source of truth.
6. **No slop** — concrete, specific, no filler; final documents pass the humanizer pattern list.
7. **Plain language** — documents follow SimpleEnglish document rules (short sentences, active voice, jargon defined); this never fights GFM structure.
8. **Simplicity + surgical changes** — minimal sufficient solution (ponytail ladder), touch only what the task needs (karpathy surgical rule).
9. **Verification-before-completion** — nothing is "done" without its verification step passing; milestones are the unit of proof.
10. **State discipline** — every meaningful event is checkpointed; a session that dies must lose nothing but the current question.
11. **License discipline** — NC content is a runtime dependency, never vendored.
12. **Fill what the user couldn't ask** — the owner is non-technical: they cannot name what they don't know. Important decisions that were never surfaced are made proactively, recorded with status `designer_filled`, and shown visibly for correction — never silent, never buried. The gap between what users say and what they need is the pipeline's job, not theirs.
13. **Disk is memory** — the pipeline's memory lives in `.lvp/`, never in the context window. Any model able to follow the skill files finishes what any model started: checkpoint on pressure, reload from disk instead of improvising, continue truncated work instead of regenerating (spec 06).
