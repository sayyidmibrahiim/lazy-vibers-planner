# 09: Dogfood end-to-end

**What to build:** The proof: run one real test idea through the whole pipeline (fresh context, empty folder → S0 → S9 → handoff) exactly as a user would, then fix what reality breaks. The dogfood report is the deliverable: every friction point, every spec amendment it triggered, and the evidence that the bundle survives its own handoff lint untouched.

**Blocked by:** 06, 07, 08 (all v0 surfaces must exist).

**Status:** done (2026-11-08) — full pipeline executed literally by 5 sequential harness agents (D1–D5) on a real test idea ("aplikasi booking lapangan futsal", Indonesian user, T1): init S0–S2 → genuine session-kill → /lvp-continue resume (exact boundary, zero re-asks) → S5–S8 with a LIVE loop-back on a real conflict (DP-online expectation vs D-011, found in S1.q9/S3.q3 records, 2 records updated) → S9 compile (21-file bundle, 1,166 lines; 4 cross-check findings caught incl. a source-record arithmetic error) → handoff lint 67/67 PASS, 0 gap_found, zero out-of-pipeline fixes. 110 journal lines seq-continuous; 50 answers + 1 skip; 21 decisions (8 user_confirmed / 13 designer_filled / 0 assumed). Report: .scratch/lvp-core/dogfood-report.md. ~19 frictions fixed in the post-dogfood polish pass; copies re-synced.

- [x] Full run completed in a fresh harness context with no manual spec overrides
- [x] Session-kill + `/lvp-continue` exercised at least once mid-interview during the run
- [x] Resulting bundle passes `/lvp-handoff` lint with zero manual fixes
- [x] Dogfood report written (`.scratch/lvp-core/dogfood-report.md`): frictions found, spec amendments applied or ticketed
- [x] `designer_filled` decisions appeared organically and were reviewed
