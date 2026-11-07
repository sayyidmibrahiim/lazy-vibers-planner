# 01: Constitution + skill scaffold

**What to build:** The foundation every LVP skill loads before working — as a **self-contained package** (skills run in the user's empty project folder, where `docs/spec/` does not exist):

- `skills/lvp-principles.md` — the 13 principles from `docs/spec/03-skills.md` (including "Fill what the user couldn't ask" / `designer_filled` and "Disk is memory"), compact, always loaded.
- `skills/lvp-conventions.md` — the packaged operational manual: state schema quick-reference, journal event list, ID conventions, language rules, Folder Gate summary, model-tier table, bundle file list. Embedded content (not repo pointers), headed by a note that `docs/spec/` in the LVP repo is canonical and this file is its packaged snapshot (drift checked at dogfood, ticket 09).

**Blocked by:** None (can start immediately).

**Status:** done (2026-11-08)

- [x] `skills/lvp-principles.md` exists with all 13 principles, meaning-identical to spec 03
- [x] Uses GLOSSARY vocabulary exactly (Section, Conductor, Booster, designer_filled, …)
- [x] Includes license discipline consistent with ADR-0001 (NC = runtime dependency, never vendored)
- [x] `skills/lvp-conventions.md` embeds the operational rules (state schema, journal events, IDs, language, tiers, Folder Gate, bundle list) without requiring repo files at runtime
- [x] Both files are plain markdown, installable in any harness, English source of truth

Note: implementer normalized two spec-01 inconsistencies (answer keys → `S<NN>.q<NN>`, loop-backs carry `id: L-01`) — spec 01 should adopt the same at next touch.

