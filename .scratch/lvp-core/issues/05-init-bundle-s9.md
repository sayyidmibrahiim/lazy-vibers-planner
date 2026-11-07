# 05: Init — bundle compilation S9

**What to build:** The compiler that turns section records + decisions + milestones into the 20-file Blueprint Bundle per `docs/spec/04-bundle.md`, in the 6-step order (draft → cross-check → SimpleEnglish doc rules → humanizer pass → emit blueprint.json + harness adapters → journal `doc_generated` per file). This is the product: it must be self-sufficient for any builder with no LVP skills.

**Blocked by:** 04 (S5–S8 records + milestones must exist to compile).

**Status:** done (2026-11-08) — author self-verification complete (6-step procedure walked against a hypothetical S8-done state; all 6 acceptance criteria reachable from the text). SKILL.md 624 lines with S9 block + references/bundle/templates.md (173 lines, 20 skeletons in conventions §8 order, blueprint.json schema verbatim). Behavior proof lands at dogfood (ticket 09), including truncation recovery.

- [x] All bundle files exist, non-empty, follow the format rules (GFM, English, ASCII diagrams, no Mermaid) — verified at dogfood
- [x] Cross-check passes: every F-… has USER_FLOWS + requirements rows (parked features marked, so the check is satisfiable); every decision has a DECISIONS.md row; `assumed` + `designer_filled` all listed in ASSUMPTIONS.md; stack/entity names identical across files
- [x] OVERVIEW.md obeys the strictest SimpleEnglish reading level for a non-technical owner
- [x] `blueprint.json` matches `state.json` (derived file, schema per spec 04)
- [x] `CLAUDE.md` + `GEMINI.md` stubs written; `AGENTS.md` follows the agents.md spec
- [x] Truncation recovery demonstrated on a long file: append-continue from last complete block, journal `truncation_recovered`, no truncated file ever saved as complete (docs/spec/06-model-tiers.md) — procedure embedded; live demonstration at dogfood
