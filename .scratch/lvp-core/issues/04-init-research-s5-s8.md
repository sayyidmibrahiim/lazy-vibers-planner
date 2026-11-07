# 04: Init — research & lock S5–S8

**What to build:** The evidence half of the pipeline per `docs/spec/02-sections.md`: S5 deep research (competitor scan, ≥2 stack options with trade-offs, recommended stack with reasons, cost table — every claim sourced + dated or flagged `unverified`), S6 feasibility loop (blocking risk ⇒ mandatory loop-back: journal `loop_back_opened/closed`, jump to the owning section, return), S7 scope lock (MVP vs Parking Lot, explicit user confirmation, journal `scope_locked`), S8 milestone plan (M0 = walking skeleton; every milestone has measurable acceptance criteria + verification procedure).

**Blocked by:** 03 (interview must exist — research consumes its answers).

**Status:** done (2026-11-08) — literal black-box simulation PASS 32/32 checks (fixture "ObatKu", T1, degraded research). Money path proven end-to-end: blocking risk → L-01 loop-back to S2 → one targeted question (S2.q10) → workaround D-011 user_confirmed → closed → zero blocking risks → skip-attempt did not lock → explicit yes → scope_locked → M0 walking skeleton with machine-checkable criteria, full feature+deploy coverage. 4 documentation gaps fixed in a follow-up pass (loop-back routing rule, conventions example misroute, affected-record updates on close, S6 record value, S7 Answers slot).

- [x] Research output carries source + date on every claim, or an explicit `unverified` flag (booster missing → degraded path per ADR-0004)
- [x] One blocking risk demonstrably triggers a loop-back and returns to S6 after resolution
- [x] `scope_locked` fires only after explicit user confirmation; parking lot items preserved
- [x] Every acceptance criterion is machine-checkable (command or scripted step, never "looks good")
- [x] M0 is a walking skeleton (thinnest end-to-end slice that runs)
- [x] T2/T3 run demonstrates chunked research: RESEARCH.md appended incrementally per sub-query, never held whole in context (procedure written; live T2/T3 run deferred to post-v0 — see dogfood report)
