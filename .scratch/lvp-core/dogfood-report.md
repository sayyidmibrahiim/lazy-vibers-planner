# Dogfood report — ticket 09 (end-to-end run, 2026-11-07)

Idea: "aplikasi booking lapangan futsal" (Indonesian owner, tier T1). Run folder: `.scratch/lvp-core/dogfood/run/` (fresh folder, `.lvp/` created by the pipeline). The run was executed as five legs (D1–D5), each in a fresh harness context, with a scripted non-technical owner and a deliberate clean kill mid-interview.

## 1. Verdict

The pipeline completed end-to-end: empty folder → `/lvp-init-new-idea` S0–S9 → `/lvp-handoff`, with two mid-interview kills and resumes in between. The final state is `project.status = "bundled"`, `handoff.status = "done"`, a 20-entry Blueprint Bundle (21 physical files, 1,166 lines) that passed its own handoff lint 67/67 with zero findings and zero out-of-pipeline fixes, and a `HANDOFF-PROMPT.md` judged sufficient for a builder with no LVP skills. All five ticket-09 acceptance criteria are met: full run with no manual spec overrides (done — five fresh contexts, which made the resume test *stronger* than one long session); kill + `/lvp-continue` exercised mid-interview (done — three resume boundaries: D2, D3, D4); bundle passes `/lvp-handoff` lint with zero manual fixes (done — journal seq 110, 0 `gap_found`); dogfood report written (this file); `designer_filled` decisions appeared organically and were reviewed (done — 13 of 21 decisions, 0 assumed, all surfaced at checkpoints and compiled into DECISIONS.md / ASSUMPTIONS.md). The pipeline works. What this run did *not* test is listed in §5.

## 2. Run timeline

| Leg | Entry point | Covered | Key numbers | Journal |
|---|---|---|---|---|
| D1 | Fresh init | S0–S2, clean kill after S2's `section_done` | 22 answers (S0:3, S1:9, S2:10), 9 decisions (D-001..D-009), 9 booster_checks (simulated-present) | seq 1–40 |
| D2 | `/lvp-continue` | Resumed exactly at S3 opener; S3 + S4 | +23 answers (total 45), +8 decisions (D-010..D-017), zero re-asks | seq 41–68 |
| D3 | `/lvp-continue` | S5 (degraded research), S6 (risk R-1 + loop-back L-01), S7 (scope lock), S8 (M0–M3) | +5 answers (50 total, 1 skip: S7.q1), +4 decisions (21 total), L-01 opened/closed, `scope_locked` | seq 69–85 |
| D4 | `/lvp-continue` | S9: full 6-step bundle compile | 21 files / 1,166 lines, `doc_generated` ×21, 4 cross-check findings caught + fixed, status `bundled` | seq 86–108 |
| D5 | `/lvp-handoff` | Precondition, lint, handoff prompt | lint 67/67 PASS, 0 `gap_found`, 0 fixes, `HANDOFF-PROMPT.md` emitted | seq 109–110 |

Final journal: 110 lines, seq 1–110 continuous (verified). Events: 50 `answer_recorded` (1 skipped), 10 `section_start` / 10 `section_done`, 2 `resume`, 21 `doc_generated`, 1 `loop_back_opened` / 1 `loop_back_closed`, 1 `scope_locked`, 9 `booster_check`, 1 each `session_start` / `folder_gate_passed` / `tier_declared` / `handoff_started` / `handoff_done`. Decisions in state: 21 — 8 `user_confirmed`, 13 `designer_filled`, 0 `assumed`.

## 3. What the run proved

- **Checkpoint/resume is real, not theoretical.** D1 killed the session exactly after S2's `section_done` (journal seq 40), the nastiest possible boundary: state had already advanced `current_section` to S3 with no S3 events. `/lvp-continue` resolved it to "resume at the S3 opener", journaled `section_start` as the first resumed checkpoint (seq 41), and re-asked nothing — the 23 D2 answers were all new ids, including two bank items that were near-duplicates of D1 material and were caught by the never-re-ask rule. Two more resumes (seq 69, seq 86) landed cleanly. Evidence: `.lvp/journal.ndjson` seq 40–41, 68–69, 85–86 (`state_rebuilt: false` both times).
- **The loop-back fires on a genuine conflict, not a scripted one.** The scripted conflict (D-011 manual-transfer-first vs a captured "DP online" promise) turned out to live in different records than predicted — S1.q9 ("bayar DP 30% online") and S3.q3, not F-02's own wording — and S6 still found it, routed L-01 S6→S4 per the feature-behavior rule, took one targeted question (S4.q14), and updated both affected records on close (S4-fitur.md locked the v1 method; S1-context.md corrected inline with the verbatim preserved). Evidence: journal seq 74 (`loop_back_opened`) and 76 (`loop_back_closed`), `state.json` `pipeline.loop_backs[0].resolved_at`.
- **A skip is not a lock.** At S7 the scripted owner skipped the confirmation (S7.q1, `skipped: true` in the journal); the pipeline re-asked once (S7.q2, explicit yes) and only then wrote `scope_locked` (seq 81). The lock protocol held under the failure mode it exists for.
- **The bundle compiles from records and catches its own errors.** S9 produced all 21 files from state + Section Records alone, one `doc_generated` checkpoint per file (seq 87–107). Its cross-checks caught 4 inconsistencies — including an arithmetic error in the *source record* (S8 M3: 15−3 is 12, not 13), a public-URL sample violating the private-bucket rule, a missing 502 row in api.md, and an entity-name drift — all fixed through S9's own procedure before handoff, which is why D5's lint then found the bundle already clean. Evidence: `.lvp/journal.ndjson` seq 87–107; bundle in `.scratch/lvp-core/dogfood/run/` (1,178 lines including the later 12-line HANDOFF-PROMPT.md).
- **Handoff is self-contained.** `/lvp-handoff` verified blueprint.json fresh against state, left CLAUDE.md/GEMINI.md byte-exact, emitted HANDOFF-PROMPT.md, and its 67 checks ran entirely off bundle+state+journal. Evidence: journal seq 109–110; `.scratch/lvp-core/dogfood/run/HANDOFF-PROMPT.md`.

## 4. Frictions found & fixed

~19 frictions from the notes were fixed post-dogfood across skill files, conventions, and the lint checklist, by category:

1. **Status semantics** — `present` wasn't mappable to the state enum; no fallback for "installed but not loadable" (D1 #2).
2. **Id assignment rule** — bank numbers ≠ actual ask order; every cross-reference needed mental re-mapping (D1 #4).
3. **Never-re-ask scope** — didn't cover `idea_raw`, so content already spoken by the owner could be re-asked (D1 #5).
4. **Loop-back affected-records generalization** — close rule said "update that record" but had no way to find *every* record claiming the overridden thing (D3 #3).
5. **Milestones single location** — `pipeline.milestones` vs top-level `milestones` drifted silently (D4 #1).
6. **English feature names** — records hold only Indonesian names; the English bundle had to coin them with no template acknowledgment (D4 #6).
7. **blueprint.json `designer_filled` count** — the `assumed` key cannot express the confirmed/assumed/designer_filled split (D4 #5).
8. **Lint fixes** — B20 false-failed legitimate `<…>` usages; C4's label check failed 10/13 semantically-correct blocks; H1–H3 weren't actually self-contained (schema never embedded) (D5 #2–4).
9. **`.lvp/` read-only carve-out** — the handoff prompt never told the builder to treat planning state as read-only (D5 #6).
10. **Stale scaffolding text** — "appended by a later ticket" cells that are already real pointers (D1 #1).

**Deferred (flagged in notes, not yet fixed):** a precedence rule for state-vs-journal disagreement at resume (D2 #1 / D3 #1); bank files carry no cross-Section overlap annotations (D2 #3); the "enough" protocol's one-final-batch rule contradicts the tier batch cap for >3 failing features (D2 #5); no `alternatives` capture at decision time, so DECISIONS.md rows read "None recorded" (D4 #4); no provisional marker on decisions accepted over unverified research (D3 #1); S6 has no own record file on disk, so grep-for-S6 finds nothing (D3 #5); unasked/skipped bank items leave no template trace (D1 #8 / D3 #2); close-ordering (edits before checkpoint) undocumented (D3 #4); language-before-detection gate and the tier question's meaning to a non-technical owner (D1 #11–12 / D2 #4); B12 can't see drift in non-required headings (D5 #5); checklist briefs should be regenerated from the file at run time (D5 #1).

## 5. Known limitations of this dogfood

Honest list of what this run did **not** prove:

- **All 9 core boosters were simulated-present.** Recorded `booster_check` ×9 `result: "present"` / state `installed`, but nothing was ever installed or loaded in-session; rules were applied by hand. The real booster bootstrap and the installed-vs-loadable fallback path are untested.
- **Research was degraded.** S5 ran with no web access, so every load-bearing number (Supabase Pro, gateway MDR) is flagged `unverified` under a degraded banner; Principle 3 (recheck before agreeing) was unsatisfiable. Only D1's one-off price checks used live fetches (which caught a stale snapshot: Namecheap USD 12.08 live vs 15.98 snapshot).
- **The user was scripted.** A single simulated non-technical Indonesian owner; no real human hesitation, contradictions mid-answer, or "enough" fired at a genuinely bad moment.
- **One tier only.** Everything ran at T1. T2/T3 batch caps, gating, and degraded-mode behavior at lower tiers are untested.
- **The handoff prompt was assessed, not executed.** A fresh builder agent never actually picked up HANDOFF-PROMPT.md and attempted M0.
- **Lint was never run standalone.** H1–H3 only worked because the dogfood ran inside the source repo with `docs/spec/04-bundle.md` reachable — a real `npx skills add` install has not been performed at all.

## 6. Recommended next actions for the owner

1. **Do the real install** in a scratch location: `npx skills add <owner>/lazy-vibers-planner` (see `skills/README.md`), then verify each booster is actually loadable in-session — this closes the biggest gap (simulated boosters) and re-tests the lint standalone, outside `docs/spec/`' reach.
2. **Run init in an empty folder with a real user at a different tier:** `mkdir /tmp/lvp-t2 && cd /tmp/lvp-t2`, start a session, invoke the init skill with a T2 or T3 model, and confirm tier gating and batch caps behave differently from this T1 run.
3. **Test the deferred resume edge:** kill a session, then hand-edit `state.json` to disagree with the journal (e.g. add a phantom answer) and run `/lvp-continue` — there is currently no precedence rule; the failure mode is undocumented.
4. **Execute the handoff for real:** point a fresh agent (no LVP skills, fresh context) at `.scratch/lvp-core/dogfood/run/HANDOFF-PROMPT.md` and let it attempt M0 against the bundle; the prompt was judged builder-sufficient but never consumed.
5. **Regenerate run briefs from the checklist file at run time** (ticket-09's brief said "51 checks"; the file holds 67) before any further dogfood legs, so the next report doesn't need a count reconciliation.
