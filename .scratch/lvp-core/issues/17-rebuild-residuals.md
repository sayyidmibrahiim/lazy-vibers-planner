# 17: Rebuild residuals + wild-run observations (from ticket 16 closure)

**What to build:** Polish-round items left open when ticket 16 closed, plus observations from the owner's wild rebuild run (opencode + DeepSeek V4.1 Flash Free, 2026-11-14) and the G1/G3 grilling round's judge nits. All non-blocking for v1; triage before scheduling.

**Blocked by:** none (ticket 16 done — 11/11).

**Status:** needs-triage (2026-11-14).

## From ticket 16 residuals (recorded 2026-11-14)

- [ ] 1. Present-but-empty bundle file semantics in branch c's body: "existing bundle files are skipped" does not define whether a 0-byte file counts as existing or as missing required structure; pin the offer behavior in text (treat as remaining work, per conventions §7's truncation class).
- [ ] 2. Step 2a repair event mapping: the repair state-write rides the run's `resume` append (no dedicated event type); conventions §3's "every state mutation emits at least one event" holds only under that interpretation — now more visible since G10 makes the repair fire on terminal pristine states.
- [ ] 3. Build-events row carve-out: add "(status transitions per the row above)" to the informational build-events row in Step 2b to remove the dual-listing ambiguity; the `build_started`→`building` / `build_done`→`complete` replay arms are unexercised (row is a verbatim enum transcription; fixture is pre-build).
- [ ] 4. Unexercised arm: branch c "bundle absent, S9 never started" (S8 done, status review) — most common real crash; covered by heading text, walk logic identical to V1a minus file checks; deserves a scenario next round.
- [ ] 5. Minor: `created_at` replay source (ts of `section_start` S0) is used but unstated in the G2 row; the S9-branding rename has no journal event (the S0-record source restores the pre-rename name).

## From the G1/G3 judge nits (2026-11-14)

- [ ] 6. Wording tension (pre-existing, outside the G1/G3 diff): `skills/lvp-init-new-idea/SKILL.md` loop-back closure updates "(and the recorded state answers)" while the G1 decision rationale says "state and journal keep the original capture" (fixture evidence: state stores the original capture; records get mutated inline). Reconcile or scope the sentence.
- [ ] 7. Cosmetic: `skills/lvp-continue/SKILL.md` "the mirror is maintained through loop-back mutations" can be misread against spec 04's "DECISIONS.md rows are never rewritten" (which governs the post-bundle phase); the mirror is compiled at S9 from post-loop-back records. Tighten wording.

## From the owner's wild rebuild run (opencode + DeepSeek, 2026-11-14)

- [ ] 8. Booster status interpretation lottery: the Step 2b booster row maps journaled `present` → `installed` (the only enum-legal mapping), but a live model read OVERVIEW.md Limitations + CAPABILITIES.md context and reported all 9 boosters as `degraded`. Same journal, different verdicts across implementations. Consider pinning the status mapping explicitly and/or defining what evidence may override a journaled status.
- [ ] 9. The wild run wrote `.lvp/state.corrupt-<date>.json` before overwriting state — unsanctioned by skill text (surgical-changes principle), sensible as a safeguard. Decide: codify as optional/standard behavior, or forbid to keep the write surface exact.
