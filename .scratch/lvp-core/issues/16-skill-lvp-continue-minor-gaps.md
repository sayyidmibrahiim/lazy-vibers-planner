# 16: `/lvp-continue` minor-gap polish (from ticket 06 verification)

**What to build:** Resolve the non-blocking gaps recorded in ticket 06's verification findings (2026-11-13), so `/lvp-continue` has no ambiguity left for edge positions and rebuild sources. SKILL.md edits must sync `references/` snapshots with `docs/spec/` per AGENTS.md; anything touching the journal payload shape or state schema is a spec change first.

**Blocked by:** 06 (done — findings carried over).

**Status:** needs-triage

- [ ] G1: `answer_recorded` payloads carry no q/a text while the Step 2b rebuild table says "from the payload" — either record q/a in the payload (spec/schema change) or reword the rebuild source (mechanical)
- [ ] G2: project metadata (name/slug/idea) has no journal source — rebuild pulls it from the S0 record; state the source explicitly in the rebuild table (mechanical)
- [ ] G3: `decisions[]` has no journal source — rebuilt from the DECISIONS.md mirror, unnamed by the skill; name the mirror as the source or journal decision payloads (naming the mirror is mechanical; journaling is a schema change)
- [ ] G4: booster license/tier and the core-booster list have no stated rebuild source (mechanical)
- [ ] G5: no effect row for `project.status` transitions in the Step 2b table (mechanical)
- [ ] G6: `handoff_done` "fills handoff" without a documented shape — document the handoff object shape (mechanical, cross-check docs/spec/01-state.md)
- [ ] G7: scripted downgrade warning in Step 3 — conventions §7 and spec 06 ask for one; SKILL.md scripts only the probe-failure refusal (mechanical)
- [ ] G8: `capability_probe_passed` payload undocumented — only the fail case specifies a payload (mechanical)
- [ ] G9: mid-S9 crash window (status `review`, bundle complete, S9 `in_progress`) matches no Step 5 branch (mechanical — add or widen a branch)
- [ ] G10: Step 2a repair rule has no target when every section is done (mechanical — define or explicitly skip)
- [ ] G11 (judge nit): spec 03 item 3's compressed "run handoff (if bundled)" overlaps the bundled+handoff-done position — tighten wording (mechanical)

**Notes:** G1 and the journaling variant of G3 touch the journal payload shape → grilling with the owner before implementing (the journal/state schema is a spec-level contract). The rest are mechanical doc/branch fixes verifiable with the same black-box harness used in ticket 06 (`verify-06-continue/` holds the fixture recipes).
