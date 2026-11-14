# 02: Init — Folder Gate + booster bootstrap + S0 intake

**What to build:** The opening of `/lvp-init-new-idea` per `docs/spec/03-skills.md`: the Folder Gate (5 scenarios, `docs/spec/01-state.md`), the booster bootstrap (check → install → interactive failure choice, `docs/spec/05-boosters.md`), and S0 intake (idea captured verbatim, User Language detected + confirmed, slug + display name proposed). State, journal, and the first section record get written correctly.

**Blocked by:** 01 (Constitution + scaffold).

**Status:** done (2026-11-08) — verified by literal black-box simulation, 6/6 scenarios PASS (empty, existing-LVP, foreign project, projects root, loose files, damaged state). Journal seq order, NDJSON validity, and byte-identical non-target files all evidenced. 6 literal-execution ambiguities found by the tester were fixed in a follow-up pass (per-booster loop, S0 mini-round storage, `q` language, Check-5 slug source, Check-1 timestamp source, event-name drift).

- [x] Folder Gate behaves correctly in all 5 scenarios: empty → proceed; `.lvp/state.json` present → refuse + recommend `/lvp-continue`; project markers → refuse + recommend new folder (+ recheck mention); parent of projects → subfolder created + journal `folder_gate_subfolder_created`; loose files → ask with recommendation
- [x] Refusal messages name the right next skill for each case
- [x] Core boosters checked and installed via cross-harness installer; failure presents the 3 explicit options and journals `booster_choice` (installs simulated in test; live install verified at dogfood)
- [x] Model tier declared and stored in `model_profile`; capability probe run for T2/T3 (docs/spec/06-model-tiers.md); probe failure refuses with guidance and journals `capability_probe_failed`
- [x] S0 record written with verbatim idea + language + slug; journal shows `folder_gate_*`, `booster_*`, `section_start|section_done` — proven by the dogfood fixture (ticket 09): `S0-intake.md` holds the verbatim idea + slug + display name, state `idea_raw`/`user_language` are verbatim, and the 110-event journal contains the full `folder_gate_*`/`booster_*`/`section_start`/`section_done` chain; re-verified by every rebuild round since (S0 metadata folded byte-equal from the record)
- [x] All artifacts English source of truth; interaction in the user's language (ADR-0002) — proven at dogfood: interaction transcripts are Bahasa Indonesia while all bundle files and Section Records follow the English artifact rules (conventions §4); rebuild rounds confirmed records keep verbatim User Language answers with English summaries
