# 10: Skill `/lvp-recheck-plan`

**What to build:** Adversarial audit skill per `plan/lvp-v1.md`. Six audit groups R1–R6, live refresh of stale claims, findings report at `.lvp/recheck/RECHECK-<date>.md`, confirmed fixes applied to bundle files.

**Blocked by:** —

**Status:** done

- [x] Precondition refuses on unlocked scope or unfinished S1–S9, with plain guidance
- [x] R1–R6 every check runs, every run; no sampling
- [x] Findings `RC-NN` carry severity, evidence, owner, concrete fix
- [x] Stale or unverified price/claim re-verified live with source + access date; unverifiable flagged
- [x] Fix classes split: mechanical auto-apply vs user decision (recorded as decision)
- [x] Re-audit runs on touched items after fixes
- [x] Journal events emitted; report file written; `/lvp-handoff` recommended at close
- [x] Never changes scope silently, deletes Parking Lot rows, or marks milestones verified
