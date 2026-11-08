# 12: Skill `/lvp-build`

**What to build:** Optional milestone executor per `plan/lvp-v1.md`. Runs M0→Mn, verifies each with the recorded procedure, records real output, stops on the first unresolvable failure.

**Blocked by:** 11

**Status:** ready-for-agent

- [ ] Refuses without bundle, milestones, or VERIFICATION.md
- [ ] Loads builder context in AGENTS.md order
- [ ] First unverified milestone selected; verified milestones never re-run
- [ ] Verification procedure executed exactly; output captured verbatim
- [ ] `VERIFICATION.md` result appended; state `verified` + `verified_at` set; journal event emitted
- [ ] Deployment milestone writes `state.deployment` when live check passes
- [ ] On failure: `milestone_failed` / `build_blocked`, plain report, no silent skip
- [ ] `.lvp/` writes limited to documented milestone/deployment fields and journal
