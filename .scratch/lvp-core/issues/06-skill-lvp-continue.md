# 06: Skill `/lvp-continue`

**What to build:** The resume skill per `docs/spec/03-skills.md`: read state (rebuild by journal replay when corrupt, with a report), print a plain-language progress summary, offer the correct next action per pipeline position, and resume the interview exactly at the interrupted micro-batch — idempotent, never re-asking.

**Blocked by:** 03 (an in-progress interview must exist to resume meaningfully).

**Status:** ready-for-agent

- [ ] Session killed mid-interview resumes with zero re-asked questions
- [ ] Corrupted `state.json` rebuilt from journal replay with a reconstruction report
- [ ] Bundled project → offers handoff; scope-locked → offers handoff or recheck; interviewing → resumes
- [ ] Sections marked `done` are never re-run (idempotency)
- [ ] Progress summary understandable to a non-technical owner in their language
- [ ] Cross-model resume: tier change journals `tier_changed`, re-applies tier rules, re-runs the probe on downgrade (docs/spec/06-model-tiers.md)
