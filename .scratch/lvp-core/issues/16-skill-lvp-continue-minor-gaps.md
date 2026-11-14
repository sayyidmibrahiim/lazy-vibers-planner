# 16: `/lvp-continue` minor-gap polish (from ticket 06 verification)

**What to build:** Resolve the non-blocking gaps recorded in ticket 06's verification findings (2026-11-13), so `/lvp-continue` has no ambiguity left for edge positions and rebuild sources. SKILL.md edits must sync `references/` snapshots with `docs/spec/` per AGENTS.md; anything touching the journal payload shape or state schema is a spec change first.

**Blocked by:** 06 (done — findings carried over).

**Status:** ready-for-human (2026-11-14) — 9/11 items fixed (G2, G4–G11) via fixer → verifier (9/9 scenarios PASS) → judge (SAFE-TO-COMMIT, 5.0/5). Only G1 and G3 remain, both schema decisions for grilling. Evidence: `verify-06-continue/report-ticket16-fixes.md`.

- [ ] G1: `answer_recorded` payloads carry no q/a text while the Step 2b rebuild table says "from the payload" — either record q/a in the payload (spec/schema change) or reword the rebuild source (mechanical)
- [ ] G3: `decisions[]` has no journal source — rebuilt from the DECISIONS.md mirror, unnamed by the skill; name the mirror as the source or journal decision payloads (both variants deferred to the G1/G3 grilling — same rebuild-table row, one decision covers both)
- [x] G4: booster license/tier and the core-booster list have no stated rebuild source — FIXED 2026-11-14: two-tier source stated in the Step 2b booster row (`CAPABILITIES.md` when the bundle exists, else the core-booster table in `docs/spec/05-boosters.md`; the `booster_check` sweep names the core list). Verified by V6 replay (9/9 licenses + tier core)
- [x] G5: no effect row for `project.status` transitions in the Step 2b table — FIXED 2026-11-14: new row transcribes the spec 01 enum chain (`section_start` S5 → researching, S7 → review, `section_done` S9 → bundled, `build_started` → building, `build_done` → complete). Verified by V6 replay
- [x] G6: `handoff_done` "fills handoff" without a documented shape — FIXED 2026-11-14: shape `{ status: "done", completed_at }` documented in SKILL.md and spec 01 (matches the fixture byte-for-byte). Verified by V6 replay
- [x] G2: project metadata (name/slug/idea) has no journal source — FIXED 2026-11-14: rebuild table now states metadata (`slug`, `name`, `idea_raw`, `user_language`) comes from the S0 section record. Verified by V6 replay (byte-equal to the record)
- [x] G7: scripted downgrade warning in Step 3 — FIXED 2026-11-14: warn-first-then-probe scripted sentence added to the downgrade path (plain User Language, "nothing is lost" phrasing per conventions §7 / spec 06). Verified by V3 (printed before the probe, verbatim)
- [x] G8: `capability_probe_passed` payload undocumented — FIXED 2026-11-14: pass payload documented as `{"steps": [...]}` (ids "json"/"order"/"sentence") next to the fail payload. Verified by V4 (journal seq 112 matches exactly)
- [x] G9: mid-S9 crash window (status `review`, bundle complete, S9 `in_progress`) matches no Step 5 branch — FIXED 2026-11-14: branch c widened to "S9 not `done` (bundle absent, partial, or fully written but S9 unclosed)" + closing-S9 clause. Verified by V1a/V1b (previously-unmatched position now routes correctly) and V5c (mid-interview still routes to branch b)
- [x] G10: Step 2a repair rule has no target when every section is done — FIXED 2026-11-14: rule now explicitly says `current_section` → S10 when S0–S9 are all done. Verified by V2/V5a/V5b
- [x] G11 (judge nit): spec 03 item 3's compressed "run handoff (if bundled)" overlaps the bundled+handoff-done position — FIXED 2026-11-14: tightened to "run handoff (if bundled, handoff open)"; single copy repo-wide, no stale mirrors

**Notes:** G1 and G3 touch the journal payload shape / rebuild-source contract → grilling with the owner before implementing (the journal/state schema is a spec-level contract); the owner's personal rebuild experience (paraphrased prose, ~4 re-asked answer texts) is the best input for that decision. Everything else in this ticket is resolved and re-verified.

## Verification round (2026-11-14)

- Fixer: 3 files (`skills/lvp-continue/SKILL.md` +17/−10, `docs/spec/01-state.md` 1 line, `docs/spec/03-skills.md` 1 line), snapshot sync verified unneeded (references byte-identical to sources — fixer and judge both grepped).
- Verifier: 9/9 scenarios PASS (`report-ticket16-fixes.md`) — V1a/V1b mid-S9 crash routing, V2 terminal repair, V3 downgrade warning, V4 probe payload, V5a/V5b/V5c branch regressions, V6 full rebuild with documented sources.
- Judge: per-item PASS ×9, zero contradictions with spec 01/03/05/06 + conventions §2/§3/§5/§7, exclusions clean (G1/G3 substance untouched). **SAFE-TO-COMMIT (5.0/5)**.

## Residuals (recorded 2026-11-14, non-blocking, for the next polish round)

1. **Present-but-empty bundle file semantics in branch c's body**: "existing bundle files are skipped" does not define whether a 0-byte file counts as existing or as missing required structure; pin the offer behavior in text (treat as remaining work, per conventions §7's truncation class).
2. **Step 2a repair event mapping**: the repair state-write rides the run's `resume` append (no dedicated event type); conventions §3's "every state mutation emits at least one event" holds only under that interpretation — now more visible since G10 makes the repair fire on terminal pristine states.
3. **Build-events row carve-out**: add "(status transitions per the row above)" to the informational build-events row in Step 2b to remove the dual-listing ambiguity; the `build_started`→`building` / `build_done`→`complete` replay arms are unexercised (row is a verbatim enum transcription; fixture is pre-build).
4. **Unexercised arm**: branch c "bundle absent, S9 never started" (S8 done, status review) — most common real crash; covered by heading text, walk logic identical to V1a minus file checks; deserves a scenario next round.
5. **Minor**: `created_at` replay source (ts of `section_start` S0) is used but unstated in the G2 row; the S9-branding rename has no journal event (the S0-record source restores the pre-rename name) — arguably G3-journaling territory.
