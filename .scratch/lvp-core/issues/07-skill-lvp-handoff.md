# 07: Skill `/lvp-handoff`

**What to build:** The gap lint + emit skill per `docs/spec/03-skills.md`: run the bundle completeness checklist, report gaps in plain language with a jump-back offer, emit `blueprint.json`, write harness adapter stubs, verify AGENTS.md against the agents.md spec, compose the builder entry prompt (read AGENTS.md first · milestones in order · verify each · record in VERIFICATION.md · decisions before questions · open questions journaled, never guessed), print CAPABILITIES install lines.

**Blocked by:** 05 (a real bundle must exist to lint and emit from).

**Status:** done (2026-11-08) — author self-verification: both walkthrough scenarios pass (healthy bundle → full pass to handoff_done; sabotaged bundle → both gaps caught with owning sections + fix-now/abort offered, re-lint after fixes). Lint = 51 checks with ids (A1…H4) grouped presence/structure/decisions/milestones/costs/scope/adapters/state-coherence; required-headings embedded per file so the lint works without the init skill installed. Live proof at dogfood (ticket 09).

- [x] Healthy bundle passes lint end-to-end; journal `handoff_done`
- [x] Sabotaged bundle (one deleted file + one milestone without verification procedure) fails lint with a plain-language report naming the owning section
- [x] `blueprint.json` re-emitted matches state; adapters are one-line stubs
- [x] Entry prompt includes verification-before-completion and anti-yes-man rules
- [x] Precondition enforced: refuses (with guidance) when scope not locked
