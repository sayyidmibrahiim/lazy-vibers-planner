# Verification Report — Ticket 06 AC: Cross-model resume (tier change)

**Criterion under test** (`.scratch/lvp-core/issues/06-skill-lvp-continue.md`):
> - [ ] Cross-model resume: tier change journals `tier_changed`, re-applies tier rules, re-runs the probe on downgrade (docs/spec/06-model-tiers.md)

**Method**: literal black-box execution of `skills/lvp-continue/SKILL.md` Steps 1–5 on a fixture copy at `/tmp/lvp-verify-tier/run` (copied from `/home/ibrahim/projects/lazy-vibers-planner/.scratch/lvp-core/dogfood/run/`). The repo itself was never written to.

---

## 1. Fixture and baseline

Fixture facts (from `.lvp/state.json` + `.lvp/journal.ndjson`):

| Field | Value |
|---|---|
| project | "Futsal Court Booking" / slug `futsal-court-booking` / `user_language: "id"` |
| project.status | `bundled` |
| pipeline.current_section | `S9`; sections S0–S9 all `done` |
| handoff | `{"status": "done", "completed_at": "2026-11-07T09:06:41.461Z"}` |
| model_profile | `{"tier": "T1", "probe": "skipped", "declared_at": "2026-11-07T08:03:22Z"}` |
| answers | 50 total, 1 skipped |
| loop-backs | L-01 opened and resolved (0 open) |
| boosters.core | 9 entries, all `installed` |
| journal | 110 lines, seq 1–110 continuous, ends `handoff_done`; `scope_locked` at seq 81 |
| last activity | `2026-11-07T09:06:41.461Z` |

Baseline hashes (full list in `/tmp/lvp-verify-tier/baseline.sha256`):
- `.lvp/state.json` = `21d5c437…d3e14`
- `.lvp/journal.ndjson` = `7fd4a27e…677ab`
- Non-target witnesses: `AGENTS.md`, `OVERVIEW.md`, `blueprint.json`, `SCOPE.md`, `.lvp/docs/sections/S0-intake.md`, `.lvp/docs/sections/S8-milestones.md` (all OK after every scenario).

Skill pre-load ("Load first") honored: `skills/lvp-continue/references/principles.md` and `references/conventions.md` read before any check/write; `skills/lvp-conventions.md` (repo copy) is byte-equivalent content for §2/§3/§7.

---

## 2. Requirement quotes (verbatim)

**SKILL.md Step 3 — Tier check (cross-model resume)**:
> Compare `model_profile.tier` in state with the model actually running now:
> - Determine the current tier from harness config where available; if not determinable, ask init's one-line tier question (large / medium / small). Never guess.
> - Same tier → nothing to do.
> - Any change → journal `tier_changed` (payload: old, new), update `model_profile.tier` + `declared_at`, and re-apply the new tier's rules for the resumed work (conventions §7: batch size, research, compile, reload discipline, booster loading).
> - **Downgrade** (new tier is lower) → re-run the capability probe before any further work. Three checks, graded strictly, each a clean single attempt: … All pass → journal `capability_probe_passed`, update `model_profile.probe`, continue. Any fail → journal `capability_probe_failed` (payload: which step). … Never push through.
> - Upgrade → no probe; `tier_changed` only.

**SKILL.md Checkpoint discipline**:
> Same as init (conventions §9): one journal write + one state write together, at event boundaries. This skill appends `resume` on every run, `tier_changed` + probe events on a tier change, … The journal is append-only: never rewrite, reorder, or delete lines.

**SKILL.md Step 4**:
> Journal `resume` (payload: position + tier-check result) before offering actions, if not already appended in Step 2.

**docs/spec/06-model-tiers.md — Cross-model resume**:
> `model_profile.tier` lives in `state.json`. On `/lvp-continue`, a tier change (bigger model resumed a small-model session or vice versa) → journal `tier_changed`, re-apply this spec's rules for the new tier, warn the user if downgrading (probe re-runs). Any model finishes what any model started — that is the contract.

**docs/spec/06-model-tiers.md — Per-tier behavior rules** (rules to "re-apply"): Question micro-batch size (T1 ≤3 / T2 ≤2 / T3 =1); Research (T1 full queries / T2 split sub-queries + incremental append / T3 one sub-topic per turn); Bundle compile (one file per turn; T3 one file section per turn); Reload discipline (T1/T2 on section start; T3 every turn); Booster loading (per Section; T2 one at a time; T3 only the one in use).

**skills/lvp-conventions.md §7 (and skill references/conventions.md, same text)**:
> Cross-model resume: on /lvp-continue, a tier change compared to `model_profile.tier` → journal `tier_changed`, re-apply this section's rules for the new tier, and warn the user when downgrading (probe re-runs). Any model finishes what any model started.

**Rebuild table confirmation (SKILL.md Step 2b)** — documented field semantics of the events used:
> | `tier_declared`, `tier_changed` | `model_profile.tier` (+ `declared_at`) |
> | `capability_probe_passed`, `capability_probe_failed` | `model_profile.probe` |

**Tier naming (docs/spec/06-model-tiers.md)**: T1 = 1M-class APIs (frontier AND flash); T2 = open-weight mid; T3 = compact/local. Higher tier = closer to T1.

**Upgrade semantics (explicit)**: SKILL.md "Upgrade → no probe; `tier_changed` only." Spec 06 ties probe re-runs to downgrade only ("warn the user if downgrading (probe re-runs)") — nothing beyond `tier_changed` + rule re-application is required on upgrade.

---

## 3. Scenario A — Upgrade (stored T2 → current T1)

**Simulation setup (documented deviation, not a skill step)**: the fixture records T1, the top tier per docs/spec/06-model-tiers.md, so no higher current tier exists. To create an upgrade, the copy's `model_profile` was set to a coherent T2-born project before running the skill: `tier: "T2"`, `probe: "passed"` (T2 mandates the bootstrap probe; `skipped` is only for declared T1). Everything else untouched. Then `/lvp-continue` was executed literally with the current model being T1.

Steps executed:
1. Step 1 Locate: `.lvp/` with readable `state.json` → continue. ✔
2. Step 2a Healthy state → three consistency repairs checked, none needed:
   - Section statuses vs `current_section`: all S0–S9 `done`; no first-not-done exists; no disagreement.
   - Answers-in-record-but-missing-from-state: NONE (own-section answer ids per record vs state answers — no gaps; cross-references to other sections' ids in record prose excluded).
   - Scope lock derived from journal: `scope_locked` exists (seq 81) AND S7 `done` → locked.
3. Step 3 Tier check: stored T2 vs current T1 → **change (upgrade)**. Checkpoint: journal seq 111 + state write together.
4. Step 4 summary + journal `resume` seq 112 (payload: position + tier-check result).
5. Step 5 offer: see GAP-1 (SKILL.md has no matching branch for bundled + handoff-done; per docs/spec/03-skills.md the bundled offer is add-feature/recheck-plan pointers).

**Journal events appended (exact lines)**:
```json
{"ts": "2026-11-13T17:49:46Z", "seq": 111, "type": "tier_changed", "payload": {"old": "T2", "new": "T1"}}
{"ts": "2026-11-13T17:50:06Z", "seq": 112, "type": "resume", "payload": {"skill": "lvp-continue", "position": "S0-S9 done (50 answers, 1 skipped); bundle complete (20 files); handoff done; 0 open loop-backs; scope locked", "state_rebuilt": false, "state": "healthy (no repairs needed: section statuses agree with current_section=S9; all record answers present in state; scope derived from journal = locked)", "tier_check": "changed: stored T2 -> current T1 (upgrade; no probe re-run per skill Step 3 'Upgrade -> no probe; tier_changed only'; T1 rules re-applied)"}}
```
`tier_changed` payload shape = `{old, new}` exactly as documented ("payload: old, new").

**State change (checkpoint together with seq 111)**:
```json
"model_profile": { "tier": "T1", "probe": "passed", "declared_at": "2026-11-13T17:49:46Z" }
```
(tier + declared_at updated per SKILL.md Step 3; probe untouched — upgrade runs no probe.)

**Tier rules re-applied (new tier T1, conventions §7)**: micro-batch up to 3 · research full queries · bundle compile one file per turn · reload discipline on Section start · booster loading per Section. At this pipeline position (bundled, handoff done, no open Section) none of the batch/research/compile mechanics fire immediately; the rule set governs any resumed work going forward.

**Probe on upgrade**: NONE — matches "Upgrade → no probe; `tier_changed` only." Zero `capability_probe_*` events in the journal.

**Integrity**: journal 112 lines, seq continuous 1–112; appended types = `tier_changed`, `resume` (both documented); all 6 non-target witness files bit-identical; only `state.json` model_profile changed.

**Verdict A: PASS** — tier change journaled at the correct seq (111) with the documented payload, tier+declared_at updated, T1 rules re-applied, no probe on upgrade, journal/state consistency intact.

---

## 4. Scenario B — Downgrade (stored T1 → current T2)

**Setup**: state.json + journal restored from snapshot (all 8 baseline hashes verified OK). Stored tier = original fixture T1; simulated current model = T2 (open-weight mid — lower than T1 1M-class per docs/spec/06-model-tiers.md).

Steps executed: Steps 1–2 identical to Scenario A (healthy, no repairs). Step 3:
- Change detected → checkpoint 1: journal seq 111 `tier_changed` + state tier/declared_at update together.
- **Downgrade → re-run the capability probe before any further work.** Executed literally, three checks, each a clean single attempt, graded strictly against the documented pass rules. The model under test is the one producing the replies below (the model actually running the resume).

**Probe execution (prompts verbatim from SKILL.md)**:

| # | Check | Prompt | Reply (actual model output) | Pass rule | Verdict |
|---|---|---|---|---|---|
| 1 | Strict JSON | `Return exactly this JSON object, nothing else, with ANSWER replaced by the value of 7×6: {"probe":"json","answer":ANSWER}` | `{"probe":"json","answer":42}` | parses as exactly that object (whitespace tolerated; no prose, no fences), `answer` = 42 | PASS |
| 2 | Three-step order | `Do these steps in order and output only their results, one per line: 1. write the word ALPHA. 2. write the number 2. 3. write GAMMA backwards.` | `ALPHA` ⏎ `2` ⏎ `AGMA` | contains ALPHA, 2, AGMA — in that order | PASS |
| 3 | Sentence continuation | `Continue this sentence so it makes sense, and write only the continuation: "The cashier scanned the item twice because"` | `the customer had two separate items, so the total was rung up in two passes.` | coherent, grammatical; no restart, no topic change, no gibberish | PASS |

All pass → per "All pass → journal `capability_probe_passed`, update `model_profile.probe`, continue." → checkpoint 2 (journal seq 112 + state `probe: "passed"` together). Had any failed, the documented refusal ("This model failed the capability probe … Nothing is lost — the project state is safe on disk.") would have applied instead — the refusal path was not exercised because the model passed.

**Journal events appended (exact lines)**:
```json
{"ts": "2026-11-13T17:51:02Z", "seq": 111, "type": "tier_changed", "payload": {"old": "T1", "new": "T2"}}
{"ts": "2026-11-13T17:51:18Z", "seq": 112, "type": "capability_probe_passed", "payload": {"steps": ["json", "order", "sentence"]}}
{"ts": "2026-11-13T17:51:29Z", "seq": 113, "type": "resume", "payload": {"skill": "lvp-continue", "position": "S0-S9 done (50 answers, 1 skipped); bundle complete (20 files); handoff done; 0 open loop-backs; scope locked", "state_rebuilt": false, "state": "healthy (no repairs needed: section statuses agree with current_section=S9; all record answers present in state; scope derived from journal = locked)", "tier_check": "changed: stored T1 -> current T2 (downgrade; capability probe re-run before further work and PASSED - all 3 checks; T2 rules re-applied: batch <=2, research split sub-queries + incremental RESEARCH.md, one bundle file per turn, reload on Section start, boosters one at a time)"}}
```

**State change (checkpoints with seq 111 and 112)**:
```json
"model_profile": { "tier": "T2", "probe": "passed", "declared_at": "2026-11-13T17:51:02Z" }
```

**Tier rules re-applied (new tier T2, conventions §7)**: micro-batch up to 2 · research split into sub-queries, append RESEARCH.md incrementally · bundle compile one file per turn · reload discipline on Section start · booster loading per Section, one at a time. Probe re-run completed before any further work, as required.

**Downgrade warning**: conventions §7 and docs/spec/06-model-tiers.md require "warn the user when/if downgrading (probe re-runs)". SKILL.md scripts no explicit downgrade-warning copy (see GAP-2). Executed as: the Step 4 model-tier line states stored T1 → current T2, the downgrade, and the probe re-run aloud, in User Language.

**Integrity**: journal 113 lines, seq continuous 1–113; appended types = `tier_changed`, `capability_probe_passed`, `resume` (all documented); all 6 non-target witness files bit-identical; only `state.json` model_profile changed.

**Verdict B: PASS** — tier_changed journaled, T2 rules re-applied, probe re-run before further work per spec and passed all three checks; `capability_probe_passed` journaled and `model_profile.probe` updated.

---

## 5. Scenario C — Same tier (stored T1 = current T1)

**Setup**: state.json + journal restored from snapshot (all 8 baseline hashes OK). Current tier = T1 = stored T1.

Steps executed: Steps 1–2 identical (healthy). Step 3: "Same tier → nothing to do." — no `tier_changed`, no probe, no state write. Step 4: summary + `resume` journal only (Step 2a did not append it). Step 5: same offer situation as A/B (GAP-1).

**Journal events appended (exact line)**:
```json
{"ts": "2026-11-13T17:51:47Z", "seq": 111, "type": "resume", "payload": {"skill": "lvp-continue", "position": "S0-S9 done (50 answers, 1 skipped); bundle complete (20 files); handoff done; 0 open loop-backs; scope locked", "state_rebuilt": false, "state": "healthy (no repairs needed: section statuses agree with current_section=S9; all record answers present in state; scope derived from journal = locked)", "tier_check": "unchanged (stored T1 = current T1)"}}
```

**State**: byte-identical to baseline (`sha256sum` OK) — `model_profile` untouched: `{"tier": "T1", "probe": "skipped", "declared_at": "2026-11-07T08:03:22Z"}`.

**Integrity**: journal 111 lines, seq continuous 1–111; the only appended event is `resume`; `tier_changed` count in the whole journal = 0; all non-target witness files bit-identical.

**Verdict C: PASS** — same tier emits no `tier_changed` (and no probe), only the mandatory `resume` event; state untouched.

---

## 6. Cross-scenario integrity summary

| Check | A (upgrade T2→T1) | B (downgrade T1→T2) | C (same tier) |
|---|---|---|---|
| `tier_changed` journaled | seq 111, `{old,new}` | seq 111, `{old,new}` | **not emitted** (correct) |
| state tier+declared_at updated | yes (T1) | yes (T2) | no (untouched) |
| tier rules re-applied | T1 set (≤3, full queries, 1 file/turn, reload on Section start, boosters per Section) | T2 set (≤2, sub-queries + incremental append, 1 file/turn, reload on Section start, boosters one at a time) | n/a |
| probe re-run | no (upgrade — per "Upgrade → no probe") | yes, before further work; 3/3 PASS | no |
| `capability_probe_passed` journaled | absent (correct) | seq 112 | absent (correct) |
| `resume` journaled | seq 112 | seq 113 | seq 111 |
| journal seq-continuous | 1–112 | 1–113 | 1–111 |
| only documented event names appended | yes | yes | yes |
| non-target files untouched | yes (6/6) | yes (6/6) | yes (6/6) |
| next action per pipeline position | see GAP-1 | see GAP-1 | see GAP-1 |

Next action in all three scenarios: the fixture's position is **bundled with handoff already done**. SKILL.md Step 5d ("Bundled (S9 done, `handoff` open) → offer `/lvp-handoff`") does not fire (handoff = `{"status":"done"}`), and Step 5e ("Building or complete") does not fire (status = `bundled`, neither `building` nor `complete`). Per docs/spec/03-skills.md Flow step 3 ("… suggest `add-feature` or `recheck-plan` (if bundled)") the offer is the v1 pointers (`/lvp-add-feature`, `/lvp-recheck-plan`; `/lvp-build` for the first unverified milestone M0). The tier change does not alter this offer in any scenario — the position logic is tier-independent — but SKILL.md's branch table itself has a coverage hole, recorded below.

---

## 7. Contract gaps and observations (findings, not scenario failures)

**GAP-1 — SKILL.md Step 5 has no branch for "bundled + handoff done" (this fixture's exact position).**
- SKILL.md Step 5d: "### d. Bundled (S9 done, `handoff` open)" → offer `/lvp-handoff` — fires only while handoff is open; explicitly covers "a handoff started but never finished", not a finished one.
- SKILL.md Step 5e: "### e. Building or complete" → v1 pointers — fires only for status `building`/`complete`; the fixture's status is `bundled`.
- docs/spec/03-skills.md `/lvp-continue` Flow step 3 does cover it: "Offer the right next action: resume interview / answer pending loop-back / run handoff (if ready) / suggest `add-feature` or `recheck-plan` (if bundled)."
- The ticket AC "Bundled project → offers handoff" likewise holds only while handoff is open.
- Impact: none on the tier-change criterion (Step 5 runs after all tier steps); a real post-handoff resume hits the same hole. Suggested alignment (not applied anywhere): extend Step 5e's condition to bundled-with-handoff-done, or add an explicit branch.

**GAP-2 — SKILL.md scripts no downgrade warning, though conventions §7 and spec 06 require one.**
- skills/lvp-conventions.md §7 (and the skill's own references/conventions.md): "… journal `tier_changed`, re-apply this section's rules for the new tier, and **warn the user when downgrading** (probe re-runs)."
- docs/spec/06-model-tiers.md: "… journal `tier_changed`, re-apply this spec's rules for the new tier, **warn the user if downgrading** (probe re-runs)."
- SKILL.md Step 3's downgrade branch contains only the probe-failure refusal message; the upgrade line is "Upgrade → no probe; `tier_changed` only." No explicit warning copy exists. Nearest coverage is Step 4's summary line: "**Model tier**: the stored tier, the current tier, and any change Step 3 just applied." — surfaces the change but is not phrased as a warning. Executed via the Step 4 tier line (stating the downgrade and the probe re-run aloud); a scripted warning sentence would remove the ambiguity.

**GAP-3 — `capability_probe_passed` payload shape is undocumented.**
- SKILL.md: "All pass → journal `capability_probe_passed`, update `model_profile.probe`, continue." — no payload spec, while the fail case documents "(payload: which step)". Used `{"steps": ["json", "order", "sentence"]}` (per-step granularity mirroring the fail payload); the rebuild table only requires the event to imply `model_profile.probe`, so any payload works, but the shape is unspecified. The fixture journal contains no prior `capability_probe_*` event to copy (T1 skipped the probe).

**Observation-1 — "Healthy state" vs the fixture's absent `deployment` key.**
- conventions §2 / docs/spec/01-state.md schema shows `"deployment": null` and `"handoff": null`; the fixture's `state.json` has `handoff` filled but **no `deployment` key at all**. Step 2a ("`state.json` parses and matches the conventions §2 shape") does not say whether an absent nullable key counts as a shape mismatch. Treated as healthy (parses; every present field conforms). Cosmetic ambiguity only.

**Observation-2 — upgrade simulation setup.**
- The fixture records T1, the top tier, so Scenario A necessarily simulated a T2-born project (copy's `model_profile.tier` → `T2`, `probe` → `passed`) before running the skill, with the current model being T1. This edit is scenario setup on the /tmp copy, not a skill step, and is called out wherever it matters above.

---

## 8. Final verdicts

| Scenario | Verdict | Justification |
|---|---|---|
| A — upgrade (stored T2 → current T1) | **PASS** | `tier_changed` journaled at seq 111 with documented `{old,new}` payload; `model_profile.tier` + `declared_at` updated in the same checkpoint; T1 tier rules re-applied; no probe, exactly per "Upgrade → no probe; `tier_changed` only"; journal seq-continuous with documented events only; non-target files untouched. |
| B — downgrade (stored T1 → current T2) | **PASS** | `tier_changed` journaled (seq 111); T2 rules re-applied; capability probe re-run before any further work per spec — executed literally, 3/3 checks PASS — `capability_probe_passed` journaled (seq 112) and `model_profile.probe` updated; downgrade warning delivered via the Step 4 tier line (GAP-2 notes SKILL.md scripts no explicit warning copy). |
| C — same tier (stored T1 = current T1) | **PASS** | "Same tier → nothing to do" honored: zero `tier_changed` in the journal, no probe, state byte-identical, only the mandatory `resume` appended (seq 111). |

Criterion **"Cross-model resume: tier change journals `tier_changed`, re-applies tier rules, re-runs the probe on downgrade (docs/spec/06-model-tiers.md)"** — **VERIFIED (PASS)** across all three scenarios. Three contract gaps (GAP-1 Step-5 coverage hole, GAP-2 unscripted downgrade warning, GAP-3 undocumented pass-event payload) and two minor observations recorded; none blocks the procedure.
