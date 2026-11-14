# Verification Report — Ticket 06, AC 2: "Corrupted `state.json` rebuilt from journal replay with a reconstruction report"

- **Repo under test (read-only):** `/home/ibrahim/projects/lazy-vibers-planner`
- **Skill under test:** `skills/lvp-continue/SKILL.md` (+ `references/principles.md`, `references/conventions.md`)
- **Fixture:** `.scratch/lvp-core/dogfood/run` — real completed LVP bundle (`handoff_done` at journal seq 110); journal 110 lines, seq 1..110 continuous
- **All writes confined to:** `/tmp/lvp-verify-corrupt/` (repo untouched; fixture restored to pristine at the end)
- **Method:** the skill's documented procedure was executed literally, in order, by a tool that implements SKILL.md's Step 2b effect table 1:1 (`tools/lvp_continue_replay.mjs`). The tool reads only the project folder + the skill's own reference files; it never reads the healthy snapshot. Both corruption variants were run independently from the pristine fixture.

---

## 0. Corruption variants

| Variant | Corruption | Detection path | Evidence |
|---|---|---|---|
| A | `state.json` truncated mid-JSON (`head -c 9000`; cut inside an answer string) | Step 2a: `JSON.parse` fails → damaged → Step 2b | transcript `variant-A-transcript.txt`: `state.json TIDAK DAPAT DIPARSE -> damaged: Unterminated string in JSON at position 8968` |
| B | Valid JSON, wrong schema: `project` missing 5 required fields, `pipeline` absent, `decisions` a string, `model_profile.tier` = 7, `probe` = "yes", `declared_at` = 42, `handoff` a string, `milestones`/`boosters`/`deployment` absent | Step 2a: parses but fails conventions §2 shape → damaged → Step 2b | transcript `variant-B-transcript.txt`: `state.json parses, TAPI tidak cocok dengan shape conventions section 2 -> damaged` + 11 named violations |

Pristine fixture sha256 before each variant (identical both times):
`state.json 21d5c437b7b5e9f633b82cd4d0f55d5d73d532fc4cceb9161eea48ad643d3e14`
`journal.ndjson 7fd4a27e00c34fd64a8d7082d2866171ee70ac5904384c2798f9eec0ccd677ab`

---

## 1. Procedure executed (mapped to SKILL.md, in order)

1. **Load first** — `references/principles.md` (2928 B) + `references/conventions.md` (16595 B) loaded before any check; documented event list (49 types) and §8 bundle list parsed from the conventions file itself.
2. **Step 1 Locate** — `TARGET/.lvp/` present; journal readable → not the "neither readable state nor journal" refusal case → Step 2.
3. **Step 2a** — per-variant detection (table above).
4. **Step 2b** — full journal replay in `seq` order onto a fresh state object (§2 shape), effect table implemented 1:1; then (1) rebuilt `state.json` written (one checkpoint), (2) reconstruction report printed in User Language (id), (3) journal `resume` appended.
5. **Step 3** — tier check: stored T1 = current T1 → nothing to do, no journal event.
6. **Step 4** — plain-language progress summary printed (Bahasa Indonesia).
7. **Step 5** — branch conditions 5a–5e evaluated literally; primary offer printed (see check below and gap G7).

Replay facts (both variants identical): 110 events replayed, 0 untranslatable, 0 events with unknown names; scope lock derived (`scope_locked` at seq 81 + S7 done); milestones rebuilt from `S8-milestones.md` (M0–M3); 50 answers folded (46 verbatim from record `## Answers` blocks + S0 metadata + L-01 resolution); 21 decisions from the `DECISIONS.md` mirror; booster statuses from `booster_check` payloads (present→installed), license/tier from `CAPABILITIES.md`; 21 `doc_generated` files = complete vs the conventions §8 list; bundle complete; handoff done.

**Exact journal event lines emitted by the procedure** (the only appends; one per variant, identical except ts):

```json
{"ts":"2026-11-13T18:03:34Z","seq":111,"type":"resume","payload":{"state_rebuilt":true,"untranslatable":0}}   (variant A)
{"ts":"2026-11-13T18:04:11Z","seq":111,"type":"resume","payload":{"state_rebuilt":true,"untranslatable":0}}   (variant B)
```

---

## 2. Check (a) — state.json rebuilt, semantically equivalent to the healthy snapshot

**Requirement quote (SKILL.md Step 2b):** *"Replay the whole journal in `seq` order onto a fresh state object (shape per conventions §2)."* Ticket: *"Corrupted `state.json` rebuilt from journal replay with a reconstruction report"*.

**sha256 evidence:**

| Artifact | sha256 |
|---|---|
| Healthy snapshot (`state-healthy.json`) | `21d5c437b7b5e9f633b82cd4d0f55d5d73d532fc4cceb9161eea48ad643d3e14` |
| Rebuilt state.json, variant A | `d586dd2159ee20f0bc10b1b397defaaf08357055267e17c3bee8157529b584f9` |
| Rebuilt state.json, variant B | `d586dd2159ee20f0bc10b1b397defaaf08357055267e17c3bee8157529b584f9` |

Rebuilt ≠ healthy byte-wise (34761 → 33508 bytes) — a replay is a fresh serialization, and the check explicitly allows semantic equivalence with noted differences. Determinism proof: **both corruption variants rebuild to a byte-identical state.json** (same journal → same state).

**Semantic equivalence evidence** (`variant-A-diff.json`, detail in `variant-A-diff-detail.txt`; variant B diff set identical):

Identical (0 diffs) — every pipeline fact:
- `project` (slug, name, user_language, status="bundled"; `created_at` = S0 `section_start` ts), `handoff` = `{status:"done", completed_at:"2026-11-07T09:06:41.461Z"}`, all 10 section statuses + `started_at`/`completed_at`/`record` (journal ts values), all `section_start`/`section_done` timestamps, L-01 loop-back (id/from/to/opened_at/resolved_at), tier T1 + probe "skipped", all 9 boosters (name/repo/license/tier/status — zero diffs), milestones M0–M3 ids/features, 21 decision ids/sections/summaries/statuses, answers **S0.q1.a** (= idea verbatim), skipped flags (S7.q1 true, all others false).
- Answer texts: **44 of 50 answers stored verbatim-identical (q and a)**, folded from the Section Records' `## Answers` blocks — the records verifiably hold the answers, so nothing needed re-asking.
- Rebuilt state passes the conventions §2 shape validator with **zero violations**.

**All 47 differing fields, classified** (grouped; full values in `variant-A-diff-detail.txt`):

| Class | Fields | Why the skill text justifies / ignores it |
|---|---|---|
| 1. Shape corrections toward §2 (skill mandates §2 shape for the rebuild) | `deployment: null` added (healthy omits the key); `milestones[0..3].verified: false` + `verified_at: null` added (healthy omits both); `pipeline.milestones` omitted (healthy duplicates milestones under `pipeline`; conventions §2 field note: *"milestones: top-level only … never mirrored under `pipeline`"*) | 10 fields. Skill text: *"shape per conventions §2"*. The healthy fixture itself deviates from §2 here. |
| 2. Journal-sourced values where the effect table names the source | `pipeline.current_section` "S10" vs healthy "S9" (effect: *"section_done … `current_section` = the next Section in conventions §5 order"* — next after S9 is S10; healthy retained S9); `S9.record` = payload's `"Blueprint Bundle (20 files)"` vs healthy's longer enumeration (effect: record comes from the payload); `loop_backs[0].reason` = the shorter journaled `loop_back_opened` payload reason vs healthy's longer text (same risk, same resolution — journal is the audit trail) | 3 fields. Effect-table-literal. No pipeline fact lost. |
| 3. Timestamp fields (explicitly allowed by the check) | `model_profile.declared_at` `2026-11-07T08:02:40Z` (the `tier_declared` event ts — the only journal source) vs healthy `2026-11-07T08:03:22Z`. Skill says `tier_declared … model_profile.tier (+ declared_at)` without naming a source | 1 field. |
| 4. Mandated-source substitutions (record text ≠ text stored at answer time) | `S1.q9.a` — the S1 record was corrected inline via L-01 (*"S1-context.md (S1.q9 'online' wording corrected inline)"* in the `loop_back_closed` payload); the fold-in takes the record's current text. `S8.q1.q` — the S8 record paraphrases/extends the question | 2 fields. SKILL.md: records are *"raw material — never re-ask what a record holds"*; milestones/answers fold-in rule. Loudly noted in the reconstruction report. |
| 5. Reconstructed wording, substance preserved (loud degradation notes in the report) | `S0.q1.q`, `S0.q2.q/a`, `S0.q3.q/a` — the S0 record has no `## Answers` block; it holds the substance as metadata (idea verbatim, language confirmed id, slug+name). `S4.q14.q/a` — verbatim exists only in the (corrupted) state; the S4 record holds the loop-back resolution summary, the question reconstructed from the journaled L-01 reason | 6 fields. SKILL.md's unrecoverable-answer rule (*"…whose Section Record does not hold it either, is reported as unrecoverable"*) does not trigger: the records DO hold the content; wording is reconstructed and loudly reported. |
| 6. Gap-driven wording drift (see gap G3) | `decisions[N].rationale` — 19 of 21 differ textually (D-005, D-006 identical); `milestones[N].goal` — all 4 differ (the S8 record's Goal lines vs healthy's condensed strings; the record is the skill-mandated source) | 23 fields. Mirror/record wording differs from what init stored; same meaning in every case (e.g. D-011: state carried the pre-L-01 FLAG text, DECISIONS.md carries the post-L-01 resolution text — same decision). |

**Verdict (a): PASS.** Semantically equivalent — every section status, timestamp, answer count, skipped flag, decision id/section/summary/status, loop-back state, milestone set, tier/probe, scope derivation, handoff, and project status matches; 44/50 answers byte-verbatim; all divergences are shape corrections toward §2, journal-sourced values, timestamps, or loudly-reported wording reconstructions, each traceable to a skill quote or a recorded contract gap. The criterion's deliverables (rebuilt state + reconstruction report) both exist.

---

## 3. Check (b) — a reconstruction report was produced

**Requirement quotes:**
- SKILL.md Step 2b item 2: *"Report plainly (User Language): what was reconstructed (Sections and statuses, answer counts, decisions, loop-backs, milestones, tier), everything derived indirectly (scope from the journal event, milestones from the S8 record), and every event that could not be translated, by `seq`."*
- conventions §9 / spec 01: *"Rebuild: load `state.json`; if it is unreadable, replay the Journal and report what was reconstructed."*

**Answer to "printed output or file?":** the skill text requires a **printed (spoken) report in User Language** — no file path is specified anywhere in SKILL.md, conventions, or spec 01. No reconstruction file was written into the bundle (nothing authorizes it; principle 8 surgical changes).

**Compliance:** the printed report is in `variant-A-transcript.txt` / `variant-B-transcript.txt` (section `Step 2b item 2 - Laporan rekonstruksi (Bahasa Indonesia, dicetak - bukan file)`), in Bahasa Indonesia (User Language `id` per state), containing exactly the required elements: Sections and statuses (S0–S9 done), answer counts (50 recorded, 1 consciously skipped), decisions (21, with source stated), loop-backs (L-01 opened/closed with timestamps), milestones (M0–M3, from the S8 record), tier (T1, probe skipped), everything derived indirectly (scope from the journal event; milestones from the S8 record; answer texts from records; decisions from DECISIONS.md; booster licenses from CAPABILITIES.md; project metadata from the S0 record), every untranslatable event by seq ("tidak ada (0)"), and loud-degradation notes (S0.q1–q3 and S4.q14 wording, S1.q9 corrected record).

**Verdict (b): PASS.**

---

## 4. Check (c) — journal appends seq-continuous, documented event names only

**Requirement quotes:** conventions §3: *"Append-only; never rewritten."* SKILL.md Checkpoint discipline: *"The journal is append-only: never rewrite, reorder, or delete lines."* SKILL.md Step 2b item 3: *"Journal `resume` (payload: `state_rebuilt: true` + the untranslatable count)."*

**Evidence (both variants):**
- First 110 lines' sha256 **before and after** each run: `7fd4a27e00c34fd64a8d7082d2866171ee70ac5904384c2798f9eec0ccd677ab` — unchanged; nothing rewritten, reordered, or deleted.
- After each run: 111 lines, `seq` 1..111 strictly continuous, every `type` ∈ the 49 documented event types (validated programmatically against the list parsed from `references/conventions.md` §3).
- The single appended event per variant: `resume` (documented in conventions §3), payload exactly as the skill specifies: `{"state_rebuilt":true,"untranslatable":0}`.
- Checkpoint discipline: one state write + one journal append together, at the event boundary.

**Verdict (c): PASS.**

---

## 5. Check (d) — zero questions re-asked; done sections never re-run (idempotency)

**Requirement quotes:** SKILL.md Idempotency: *"Sections marked `done` are never re-run."* *"Recorded or skipped answers are never re-asked."* *"Re-running `/lvp-continue` is always safe."* Never list: *"Never re-ask a recorded or skipped answer — check `sections.<S>.answers` and the record before composing every batch."*

**Evidence:**
- The only journal append in either variant is `resume` — **zero** `answer_recorded`, `section_start`, `section_done`, or `loop_back_closed` events were emitted; no interview machinery ran.
- The rebuilt state carries all 50 recorded answers including the consciously skipped `S7.q1` (folded from records — the report names it as consciously skipped, never as missing); no question was printed anywhere in either transcript (Step 4 is a summary; Step 5 offers build pointers).
- All 10 sections are `done` in the rebuilt state and none was re-run; the offer targets the build phase, not any Section.
- The degraded-answer path (*"ask the user to re-state only that one"*) never triggered — zero answers were unrecoverable in substance.

**Verdict (d): PASS.**

---

## 6. Check (e) — non-target files untouched

**Requirement quote:** SKILL.md Step 2b item 1: *"Write the rebuilt `state.json` (one checkpoint). Never touch existing journal lines."* Principle 8 (surgical changes).

**Evidence:** full sha256 manifest of all 32 fixture files before/after each variant (`manifest-before-A.txt`, `manifest-after-A.txt`, `manifest-after-B.txt`): all **30 non-target files** (bundle files, `SPEC/*`, Section Records, `HANDOFF-PROMPT.md`, …) byte-identical after both variants; the only changed files are the target `state.json` (rebuilt, by design) and `journal.ndjson` (append-only, verified above). Fixture restored to pristine afterwards (shas re-verified).

**Verdict (e): PASS.**

---

## 7. Step 5 offer — what the literal procedure offers, and the task's parenthetical

The task brief said "(here: bundled project → offers handoff)". Literal execution on **this** fixture says otherwise, and the skill text is unambiguous:

- SKILL.md 5d: *"### d. Bundled (S9 done, `handoff` open) — Offer `/lvp-handoff` … If a handoff started but never finished, offer to re-run it there"*.
- This fixture is **post-handoff**: `handoff_done` journaled at seq 110; rebuilt/healthy `handoff` = `{status:"done", completed_at:…}`; `handoff_open` = false.
- 5d therefore does **not** fire. 5e's header (*"Building or complete"*) does not literally fire either (status is still `bundled` — handoff_done does not advance the §2 status enum). **No Step 5 branch matches "bundled + handoff done"** — recorded as **gap G7**. The procedure offered the nearest skill-supported branch, 5e's v1 pointers (`/lvp-build` for the first unverified milestone M0, `/lvp-add-feature`, `/lvp-recheck-plan`), in User Language, and explicitly did not offer `/lvp-handoff`.

The ticket's own check 3 ("Bundled project → offers handoff") targets a bundle whose handoff is still open — a different fixture position than this one. This is a finding about the task's parenthetical and a contract gap (G7), not a failure of the criterion under verification (AC 2).

---

## 8. Contract gaps (findings, not failures — none blocked completing the procedure)

Exact quotes from `skills/lvp-continue/SKILL.md` unless noted.

- **G1 — `answer_recorded` payloads carry no text, and the effect table says "from the payload".** Effect row: *"`answer_recorded` | `sections[S].answers[<id>] = { q, a, skipped }` from the payload"* — but every `answer_recorded` payload in the fixture journal is `{"section","answer_id","skipped"}`. The only skill provision for text is indirect: *"An `answer_recorded` whose payload text is unreadable, and whose Section Record does not hold it either, is reported as unrecoverable"* — the fold-from-Record path is implied (and 2a states *"An answer present in a Section Record file but missing from state is folded back in from the record"*), but the rebuild instruction never explicitly says "take q/a from the Section Record when the payload has none".
- **G2 — project metadata has no journal source.** The `session_start`/`folder_gate_*` effect row says *"project confirmed here; keep payload details for the report"* — payloads hold only skill/cwd/dir. `project.slug/name/idea_raw/user_language/created_at` exist in no event. The rebuild sourced them from the S0 record (conventions §5 designates the S0 record's contribution as *"project metadata (idea_raw, user_language)"*), and `created_at` from the S0 `section_start` ts — neither source is named by SKILL.md.
- **G3 — `decisions[]` is a third thing the journal cannot supply, unlisted.** SKILL.md says *"Two things the journal cannot supply directly"* (scope lock, milestones) — but no effect row maps any event to `decisions[]`, and no event type carries decision content. The rebuild used `DECISIONS.md` (bundle §8: *"mirrors `decisions[]` … same ids, same statuses, nothing missing on either side"*) — a disk source SKILL.md never names for the rebuild. Fidelity: section 21/21, summary 21/21, status 21/21; rationale wording differs in 19/21 (mirror drift, e.g. D-011's pre/post-L-01 phrasing).
- **G4 — booster metadata beyond status has no journal source.** Effect row: *"`boosters` statuses — the last event per booster wins; a core booster never mentioned → `missing`, flagged in the report"* — payloads carry `name/repo/result` only; `license`/`tier` came from `CAPABILITIES.md` (*"license-tagged"*, §8) and "present"→"installed" is the only enum-legal mapping. Also, flagging a *"core booster never mentioned"* presumes a core-booster list whose source is unstated.
- **G5 — `project.status` transitions have no effect row.** The table maps only `error` → *"project.status = 'error'"*. The healthy "bundled" is reproducible only from journaled payload fields (`"status_set":"researching"` seq 70, `"status":"review"` seq 81, `"status":"bundled"` seq 108) or by deriving from conventions §2's status enum — SKILL.md is silent on how status is rebuilt.
- **G6 — `handoff_done` "fills handoff" without a shape.** Effect row: *"`handoff_started`, `gap_found`, `handoff_done` | handoff progress; `handoff_done` fills `handoff`"* — the object shape is unspecified; rebuilt as `{status:"done", completed_at:<event ts>}` (payload carries neither field; matches healthy here).
- **G7 — no Step 5 branch for "bundled + handoff done".** 5d requires *"`handoff` open"*; 5e requires status *"'Building' or 'complete'"*; §2's status enum leaves the status at `bundled` after handoff_done. Post-handoff bundles match no offer header; the executed procedure offered 5e's pointers as the nearest branch. (Ticket check 3's "Bundled project → offers handoff" is only reachable with an open handoff.)
- **G8 — the S0 record holds answers as metadata, not an Answers block.** The fold-in rule presumes records hold answers; S0.q1–q3's verbatim wording exists only in `state.json` itself, so a rebuild necessarily stores reconstructed wording (substance intact: idea verbatim, language, slug/name). Same class: S4.q14's verbatim (record holds only the loop-back resolution summary). A one-line note in the skill ("S0 record layout; answers whose verbatim text exists nowhere are loudly flagged") would close this.

Minor observations (not gaps): the section_done effect notation *"sections[S] = { "status": "done", … }"* reads as whole-object replacement but must be field assignment (else answers/started_at would be wiped — contradicting §2's shape and the no-re-ask invariant); the healthy fixture itself deviates from §2 (missing `deployment` key, milestones without `verified`/`verified_at`, `pipeline.milestones` mirror) — the rebuild per §2 shape is *more* conformant than the healthy snapshot.

---

## 9. Verdict summary

| Check | Verdict | One line |
|---|---|---|
| a. state.json rebuilt, semantically equivalent | **PASS** | Rebuilt state carries every pipeline fact; 44/50 answers verbatim; all 47 field differences classified and traceable to skill quotes, timestamps, or loud notes; deterministic across variants. |
| b. Reconstruction report produced | **PASS** | Printed (not a file) per the skill text, in User Language, with all required elements; transcripts captured. |
| c. Journal appends seq-continuous, documented names | **PASS** | Only `resume` appended at seq 111 in each variant; first 110 lines sha-identical; all types documented. |
| d. Zero re-asked questions; done sections never re-run | **PASS** | Zero interview events emitted; 50 answers incl. skipped S7.q1 preserved; offer targets build pointers. |
| e. Non-target files untouched | **PASS** | 30/30 non-target files sha-identical after both variants; journal append-only. |

**Overall AC 2: PASS** (with 8 recorded contract gaps; G1–G6 explain the documented divergence classes, G7/G8 are skill-text deficiencies worth fixing in the skill, none blocked the procedure).

## 10. Evidence inventory (`/tmp/lvp-verify-corrupt/`)

- `REPORT.md` — this report
- `variant-A-transcript.txt`, `variant-B-transcript.txt` — full literal procedure output per variant (Load first → Step 5)
- `variant-A-diff.json`, `variant-B-diff.json`, `variant-A-diff-detail.txt` — semantic diff vs healthy (47 fields, classified)
- `state-healthy.json` — pristine snapshot; `state-truncated-A.json`, `state-wrongschema-B.json` — the two corruptions
- `manifest-before-A.txt`, `manifest-after-A.txt`, `manifest-after-B.txt` — 32-file sha256 manifests per phase
- `journal-pristine.ndjson` — 110-line pristine journal (append-only baseline)
- `variant-A-state-sha.txt`, `variant-B-state-sha.txt` — rebuilt-state shas (identical: `d586dd21…`)
- `run/` — fixture, restored to pristine (shas verified against the repo original)
- `tools/lvp_continue_replay.mjs` — the literal-procedure harness (SKILL.md effect table 1:1); `tools/semantic_diff.mjs` — diff tool
