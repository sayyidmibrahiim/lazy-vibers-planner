# E2E-3 — Cross-model tier resume on /lvp-continue (docs/spec/06-model-tiers.md)

**Test date**: 2026-11-14 · **Executor**: end-to-end test agent consuming the INSTALLED skill exactly as a harness agent would.

**Skill identity check (setup step 1)**: `diff -q /home/ibrahim/projects/lazy-vibers-planner/skills/lvp-continue/SKILL.md /home/ibrahim/.zcode/skills/lvp-continue/SKILL.md` → identical. Proceeded against the installed copy (`~/.zcode/skills/lvp-continue/SKILL.md` + its `references/principles.md` and `references/conventions.md`).

**Sources loaded before any write ("Load first")**: `references/principles.md` (Constitution, 13 principles), `references/conventions.md` (§2 schema, §3 journal events, §5 section map, §7 tier tables, §9 checkpoints), `docs/spec/06-model-tiers.md`, and the tier-resume recipe `.scratch/lvp-core/verify-06-continue/report-tier-resume.md` (§ setup: scenario U simulated as a T2-born project because the fixture records T1, the top tier).

**Fixture**: `/home/ibrahim/projects/lazy-vibers-planner/.scratch/lvp-core/dogfood/run/` — project `futsal-court-booking` (Futsal Court Booking, `user_language: "id"`), status `bundled`, S0–S9 all `done`, handoff `done`, 50 answers (1 skipped, S7.q1), loop-back L-01 resolved, 9 core boosters `installed`, `model_profile {"tier": "T1", "probe": "skipped", "declared_at": "2026-11-07T08:03:22Z"}`. Journal: 110 lines, seq 1–110 continuous, ends `handoff_done` (seq 110); `scope_locked` at seq 81; the journal also contains two pre-existing `resume` events (seq 41, 69) from prior dogfood runs — event vocabulary unchanged.

**Copies**: `cp -r` to `/tmp/lvp-e2e-3/run-D`, `run-U`, `run-S` (32 files each; all three copies hash-identical at baseline). All writes confined to `/tmp/lvp-e2e-3/`. The repo was never written (`git status --porcelain` empty after the test; fixture re-hash identical, check f).

**Setup edits (documented simulation, NOT evidence)**:
- run-D: none. Stored tier stays T1; the resumed model declares T2 (downgrade).
- run-U: `model_profile` set to `{"tier": "T2", "probe": "passed", "declared_at": "2026-11-07T08:03:22Z"}` before running the skill (T2 mandates the bootstrap probe; `skipped` is only for declared T1 — per the recipe §3). Then the resumed model declares T1 (upgrade).
- run-S: none. Stored T1; resumed model declares T1.

**Tier determination note**: the skill says "Determine the current tier from harness config where available… Never guess." For this test the harness config is the test brief itself, which fixes the declared current tier per scenario (D: T2, U: T1, S: T1). The declared tier was taken from there, never guessed.

---

## Shared Steps 1–2 (all three runs, before any divergence)

- **Step 1 — Locate**: `TARGET/.lvp/` exists with readable `state.json` and `journal.ndjson` → continue to Step 2.
- **Step 2a — Healthy state**, three consistency repairs checked for real in each run:
  1. Section statuses vs `pipeline.current_section`: all S0–S9 `done`; no first-not-done Section exists in conventions §5 order (S10 is out of v0 scope); `current_section: "S9"` agrees → no repair.
  2. Answers in Section Record but missing from state: NONE — every record's own-section answer ids match the state's answer keys exactly (S0: 3 confirmations anchored in `S0-intake.md` verbatim-idea + metadata; S1: q1–q9; S2: q1–q10; S3: q1–q10; S4: q1–q14; S5: q1; S7: q1–q2; S8: q1; cross-references to other sections' ids appear only in record prose and were excluded). 50 recorded / 1 skipped.
  3. Scope lock derived from journal (no schema field invented): `scope_locked` event exists (seq 81) AND S7 is `done` → scope locked.
- Result: state healthy, **nothing journaled in Step 2** (the `resume` event is Step 4's, per "if not already appended in Step 2").

---

## Scenario D — Downgrade (stored T1 → declared T2), run-D

**Step 3 execution**: change detected, new tier lower → `tier_changed` checkpoint, then capability probe re-run **before any further work**, then probe checkpoint.

**Checkpoint 1** (journal + state together, ts 2026-11-14T08:42:49Z):

```json
{"ts": "2026-11-14T08:42:49Z", "seq": 111, "type": "tier_changed", "payload": {"old": "T1", "new": "T2"}}
```

State (only `model_profile` touched; `probe` still untouched at this point):

```json
"model_profile": { "tier": "T2", "probe": "skipped", "declared_at": "2026-11-14T08:42:49Z" }
```

**Capability probe (downgrade gate, executed literally against the resumed model — the model writing this report — each check one clean single attempt, graded strictly)**:

| # | Check | Prompt (verbatim from SKILL.md) | Reply (actual model output) | Pass rule | Verdict |
|---|---|---|---|---|---|
| 1 | Strict JSON | `Return exactly this JSON object, nothing else, with ANSWER replaced by the value of 7×6: {"probe":"json","answer":ANSWER}` | `{"probe":"json","answer":42}` | parses as exactly that object (whitespace tolerated; no prose, no fences), `answer` = 42 | PASS |
| 2 | Three-step order | `Do these steps in order and output only their results, one per line: 1. write the word ALPHA. 2. write the number 2. 3. write GAMMA backwards.` | `ALPHA` / `2` / `AGMA` (one per line) | contains ALPHA, 2, AGMA — in that order | PASS |
| 3 | Sentence continuation | `Continue this sentence so it makes sense, and write only the continuation: "The cashier scanned the item twice because"` | `the customer had two separate items in the basket, so each one was rung up on its own.` | coherent, grammatical; no restart, no topic change, no gibberish | PASS |

Honesty note: the probe is self-graded (the resumed model grades its own replies), the same unavoidable setup as the recipe's Scenario B. The refusal path (`capability_probe_failed` + "Switch this harness to a larger model…") was not exercised because all three checks genuinely passed.

**Checkpoint 2** (journal + state together, ts 2026-11-14T08:43:06Z) — "All pass → journal `capability_probe_passed`, update `model_profile.probe`, continue":

```json
{"ts": "2026-11-14T08:43:06Z", "seq": 112, "type": "capability_probe_passed", "payload": {"steps": ["json", "order", "sentence"]}}
```

State after: `"model_profile": { "tier": "T2", "probe": "passed", "declared_at": "2026-11-14T08:42:49Z" }` (inter-checkpoint diff confirmed exactly the `probe` field changed).

**Tier rules re-applied (new tier T2, conventions §7 / spec 06 table)**: question micro-batch up to 2 · research split into sub-queries with incremental RESEARCH.md appends · bundle compile one file per turn · reload discipline on Section start · booster loading per Section, one at a time. At this pipeline position (bundled, handoff done, no open Section) none of the batch/research/compile mechanics fire immediately; the rule set governs any resumed work going forward.

**Step 4** (ts 2026-11-14T08:43:34Z) — progress summary spoken in User Language (id), including the downgrade warning per conventions §7 / spec 06 ("warn the user when downgrading (probe re-runs)"): tier tersimpan T1 → saat ini T2, turun kelas, probe diulang dan lulus 3/3, aturan T2 berlaku. Then:

```json
{"ts": "2026-11-14T08:43:34Z", "seq": 113, "type": "resume", "payload": {"skill": "lvp-continue", "position": "S0-S9 done (50 answers, 1 skipped); bundle complete (20 files); handoff done; 0 open loop-backs; scope locked", "state_rebuilt": false, "state": "healthy (no repairs needed: section statuses agree with current_section=S9; all record answers present in state; scope derived from journal = locked)", "tier_check": "changed: stored T1 -> current T2 (downgrade; warned aloud per conventions §7; capability probe re-run before further work and PASSED - all 3 checks; T2 rules re-applied: batch <=2, research split sub-queries + incremental RESEARCH.md, one bundle file per turn, reload on Section start, boosters one at a time)"}}
```

**Step 5**: position is bundled + handoff done — SKILL.md 5d (needs handoff open) and 5e (needs building/complete) both miss; per docs/spec/03-skills.md the offer is the v1 pointers (`/lvp-build` — M0 unverified, `/lvp-add-feature`, `/lvp-recheck-plan`). No interactive user in an automated run → offer recorded, execution stops. No writes beyond journal + state.

**Verification D**:
- (a) `tier_changed` at seq 111 (last 110 + 1), payload `{old, new}` exactly per SKILL.md; probe executed with all 3 checks, outcome journaled as `capability_probe_passed` (documented event name from conventions §3) with payload `{"steps": [...]}` (shape per GAP-3 of the recipe — pass payload is undocumented in SKILL.md; per-step granularity mirrors the fail payload); T2 rules re-applied and stated. **PASS**
- (d) Journal 113 lines, seq continuous 1–113; appended types = `tier_changed`, `capability_probe_passed`, `resume` — all in the conventions §3 event list; exactly one `resume` appended by this run (journal holds 2 pre-existing dogfood resumes at seq 41/69). **PASS**
- (e) All 30 non-target files sha-identical to baseline; `state.json` changed exactly in `model_profile.tier` (T1→T2), `model_profile.probe` (skipped→passed), `model_profile.declared_at` — all three legitimately written by the procedure (checkpoints 1 and 2). **PASS**

---

## Scenario U — Upgrade (stored T2 → declared T1), run-U

**Step 3 execution**: change detected, new tier higher → `tier_changed` checkpoint only. SKILL.md: "Upgrade → no probe; `tier_changed` only." No probe ran; `model_profile.probe` stayed `"passed"` (untouched by the procedure — its diff vs the original fixture is the setup edit's artifact).

**Checkpoint** (journal + state together, ts 2026-11-14T08:44:18Z):

```json
{"ts": "2026-11-14T08:44:18Z", "seq": 111, "type": "tier_changed", "payload": {"old": "T2", "new": "T1"}}
```

State after: `"model_profile": { "tier": "T1", "probe": "passed", "declared_at": "2026-11-14T08:44:18Z" }`

**Tier rules re-applied (new tier T1, conventions §7)**: question micro-batch up to 3 · research full queries · bundle compile one file per turn · reload discipline on Section start · booster loading per Section.

**Step 4** (ts 2026-11-14T08:44:26Z):

```json
{"ts": "2026-11-14T08:44:26Z", "seq": 112, "type": "resume", "payload": {"skill": "lvp-continue", "position": "S0-S9 done (50 answers, 1 skipped); bundle complete (20 files); handoff done; 0 open loop-backs; scope locked", "state_rebuilt": false, "state": "healthy (no repairs needed: section statuses agree with current_section=S9; all record answers present in state; scope derived from journal = locked)", "tier_check": "changed: stored T2 -> current T1 (upgrade; no probe re-run per skill Step 3 'Upgrade -> no probe; tier_changed only'; probe field untouched; T1 rules re-applied: batch <=3, research full queries, one bundle file per turn, reload on Section start, boosters per Section)"}}
```

**Step 5**: same GAP-1 bundled position → v1 pointers offered, stop.

**Verification U**:
- (b) `tier_changed` journaled at seq 111 with `{old, new}`; NO probe anywhere (zero `capability_probe_*` events in the whole journal); T1 rules re-applied and stated. **PASS**
- (d) Journal 112 lines, seq continuous 1–112; appended types = `tier_changed`, `resume` only; exactly one `resume` this run. **PASS**
- (e) All 30 non-target files sha-identical; `state.json` diff vs pre-resume state: exactly `model_profile.tier` (T2→T1) + `model_profile.declared_at` (procedure writes). `probe` untouched by the procedure. **PASS**

---

## Scenario S — Same tier (stored T1 = declared T1), run-S

**Step 3 execution**: "Same tier → nothing to do." — no `tier_changed`, no probe, **no state write at all**.

**Step 4** (ts 2026-11-14T08:44:55Z) — summary spoken in id, tier line states unchanged; the only event this run:

```json
{"ts": "2026-11-14T08:44:55Z", "seq": 111, "type": "resume", "payload": {"skill": "lvp-continue", "position": "S0-S9 done (50 answers, 1 skipped); bundle complete (20 files); handoff done; 0 open loop-backs; scope locked", "state_rebuilt": false, "state": "healthy (no repairs needed: section statuses agree with current_section=S9; all record answers present in state; scope derived from journal = locked)", "tier_check": "unchanged (stored T1 = current T1; no tier_changed, no probe, no state write per skill Step 3 'Same tier -> nothing to do')"}}
```

**Step 5**: same GAP-1 bundled position → v1 pointers offered, stop.

**Verification S**:
- (c) Zero `tier_changed` events in the entire journal (count = 0), zero probe events; the only appended event is the mandatory `resume` (seq 111). **PASS**
- (d) Journal 111 lines, seq continuous 1–111; appended = `resume` only; exactly one `resume` this run. **PASS**
- (e) All 30 non-target files sha-identical; `state.json` byte-identical to the repo fixture (`21d5c437…d3e14`) — nothing written. **PASS**

---

## SHA tables

Baseline = fresh copies (all three copies identical); repo baseline = repo fixture before the test (byte-equal to copy baselines). "after" = end of test.

| File | baseline sha256 (all copies) | run-D after | run-U after | run-S after |
|---|---|---|---|---|
| `.lvp/state.json` | `21d5c437b7b5e9f6…d3e14` | `65f9b0e60156ccdc…62547` | `6f0ed41d3b43c05a…f8a652` | `21d5c437b7b5e9f6…d3e14` (unchanged) |
| `.lvp/journal.ndjson` | `7fd4a27e00c34fd6…677ab` | `aafd3d373b908aee…c60a1` | `516d206104ce48a9…d4e820` | `2abdded331335b9e…88fd2f` |
| all other 30 files | — | identical to baseline | identical to baseline | identical to baseline |

Witness subset (first 16 hex chars, identical across all three runs and baseline): `AGENTS.md 876f734d93c62aed` · `OVERVIEW.md 3fa9b95a8bedcfbe` · `blueprint.json 6586b890bdefb387` · `SCOPE.md 28016bae2ad4c136` · `.lvp/docs/sections/S0-intake.md 451800b264806651` · `.lvp/docs/sections/S8-milestones.md fa421fc3c3fbcf5d`.

Repo fixture after the test: full-tree `sha256sum` diff vs baseline → identical; `git status --porcelain` → empty.

**Exact field changes per scenario (check e)**:
- run-D: `state.json` — `model_profile.tier` (T1→T2, checkpoint 1), `model_profile.declared_at` (→ 2026-11-14T08:42:49Z, checkpoint 1), `model_profile.probe` (skipped→passed, checkpoint 2). `journal.ndjson` — 3 appended lines (seq 111–113).
- run-U: `state.json` — `model_profile.tier` (T2→T1) + `model_profile.declared_at` (→ 2026-11-14T08:44:18Z), one checkpoint; `probe` untouched by the procedure. `journal.ndjson` — 2 appended lines (seq 111–112). (Vs the original fixture, `probe` reads `passed` instead of `skipped` — that is the documented setup edit of the T2-born simulation, applied before the skill ran.)
- run-S: no file content changes except 1 appended journal line (seq 111); `state.json` byte-identical.

---

## Verdicts per check

| Check | Scenario D | Scenario U | Scenario S |
|---|---|---|---|
| a. `tier_changed` (seq = last+1, payload `{old,new}`), probe 3/3 executed + outcome journaled, rules re-applied | **PASS** | — | — |
| b. `tier_changed` journaled, NO probe, rules re-applied | — | **PASS** | — |
| c. NO `tier_changed`, only the mandatory `resume` | — | — | **PASS** |
| d. Documented event names only, seq-continuous, one resume checkpoint per run | **PASS** | **PASS** | **PASS** |
| e. Non-target files sha-identical; only procedure-legitimate state/journal writes | **PASS** | **PASS** | **PASS** |
| f. Repo fixture untouched (re-hash) | **PASS** | **PASS** | **PASS** |

**Overall: PASS for all three scenarios.** The tier-resume criterion of docs/spec/06-model-tiers.md behaves exactly as specified by the installed SKILL.md Step 3.

## Deviations and observations (honesty notes)

1. **Probe is self-graded** (scenario D): the resumed model grades its own probe replies; no external grader exists in the skill. All 3 checks genuinely passed; the `capability_probe_failed` refusal path was not exercised.
2. **Tier source**: the current tier comes from the test brief standing in for harness config (the environment does not expose a harness tier setting). Declared, never guessed — the skill's fallback (asking the user) is not exercisable in an automated run.
3. **GAP-1 (inherited, unchanged)**: SKILL.md Step 5 has no branch for "bundled + handoff done" (this fixture's exact position); the offer was taken from docs/spec/03-skills.md (v1 pointers). Step 5 runs after all tier logic, so this does not affect the tier criterion.
4. **GAP-2 (inherited)**: SKILL.md scripts no explicit downgrade-warning sentence; the warning was delivered via the Step 4 model-tier line ("turun kelas… probe diulang, lulus 3/3"), per conventions §7 / spec 06.
5. **GAP-3 (inherited)**: the `capability_probe_passed` payload shape is undocumented; used `{"steps": ["json", "order", "sentence"]}`, mirroring the documented fail payload granularity (same choice as the recipe).
6. **Payload style for `resume`**: keys `{skill, position, state_rebuilt, state, tier_check}` — `position` + tier-check result are the two documented keys; the remaining keys match the fixture's own pre-existing `resume` events (seq 41, 69) for consistency.
7. **Fixture quirk**: `milestones[]` is mirrored under both `pipeline` and top level (conventions §2 says top-level only). Treated as healthy fixture data — Step 2a's three named repairs do not cover it, and the same fixture passed the prior verification run.
8. **Step 5 stop condition**: with no interactive user, the offer is recorded and no confirmation-driven work runs; every write in this test is therefore journal + `model_profile` state only, which is what checks e/f verify.

## Artifacts

- `/tmp/lvp-e2e-3/run-D` — downgrade run (journal 113 lines)
- `/tmp/lvp-e2e-3/run-U` — upgrade run (journal 112 lines)
- `/tmp/lvp-e2e-3/run-S` — same-tier run (journal 111 lines)
- `/tmp/lvp-e2e-3/*.baseline.sha256`, `/tmp/lvp-e2e-3/repo-fixture.baseline.sha256`, `/tmp/lvp-e2e-3/repo-fixture.after.sha256` — hash evidence
- `/tmp/lvp-e2e-3/run-D.state.after-ck1.json` — intermediate state snapshot between run-D's two checkpoints
