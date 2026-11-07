# lvp-core — Build LVP v0

Build the three v0 skills (`/lvp-init-new-idea`, `/lvp-continue`, `/lvp-handoff`) plus the Constitution, per the F1 spec in `docs/spec/00-overview.md` … `06-model-tiers.md` and ADR-0001..0006.

- Source spec: `docs/spec/` (F1, approved 2026-11-08)
- Scope: S0–S9, file-based state, booster dependency model, bundle generation, handoff. Out of scope: S10 executor, web UI two-way, v1 skills (stubs only).
- Status: **ALL 9 TICKETS DONE** (2026-11-08), including the end-to-end dogfood (see `dogfood-report.md`).
- Deferred to owner / post-v0: real `npx skills add` live test (repo has no remote yet), LICENSE file decision, live T2/T3 model-tier runs, live booster installs.

## Tickets

| NN | Title | Blocked by | Status |
|---|---|---|---|
| 01 | Constitution + skill scaffold | — | ✅ done |
| 02 | Init: Folder Gate + booster bootstrap + S0 intake | 01 | ✅ done |
| 03 | Init: interview engine S1–S4 | 02 | ✅ done |
| 04 | Init: research & lock S5–S8 | 03 | ✅ done |
| 05 | Init: bundle compilation S9 | 04 | ✅ done |
| 06 | Skill `/lvp-continue` | 03 | ✅ done |
| 07 | Skill `/lvp-handoff` | 05 | ✅ done |
| 08 | Installer + README | 03 | ✅ done |
| 09 | Dogfood end-to-end | 06, 07, 08 | ✅ done |
