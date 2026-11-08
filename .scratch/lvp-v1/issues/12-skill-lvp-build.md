# 12: Skill `/lvp-build`

**What to build:** Optional milestone executor per `plan/lvp-v1.md`. Runs M0→Mn, verifies each with the recorded procedure, records real output, stops on the first unresolvable failure.

**Blocked by:** 11

**Status:** done

- [x] Refuses without bundle, milestones, or VERIFICATION.md
- [x] Loads builder context in AGENTS.md order
- [x] First unverified milestone selected; verified milestones never re-run
- [x] Verification procedure executed exactly; output captured verbatim
- [x] `VERIFICATION.md` result appended; state `verified` + `verified_at` set; journal event emitted
- [x] Deployment milestone writes `state.deployment` when live check passes
- [x] On failure: `milestone_failed` / `build_blocked`, plain report, no silent skip
- [x] `.lvp/` writes limited to documented milestone/deployment fields and journal
