# Black-box regression verification — nine mechanical fixes to `skills/lvp-continue/SKILL.md` (+ spec 01 / spec 03 lines)

Verifier: literal black-box execution of `/lvp-continue` per scenario, following `skills/lvp-continue/SKILL.md` steps in order.
Date: 2026-11-14. Workspace: `/tmp/lvp-verify-16/` (all writes here). Repo read-only.
Skill under test: repo working-tree copy `/home/ibrahim/projects/lazy-vibers-planner/skills/lvp-continue/SKILL.md` + `references/principles.md` + `references/conventions.md` (both references read before any check/write — "Load first").
Fixture source (read-only): `/home/ibrahim/projects/lazy-vibers-planner/.scratch/lvp-core/dogfood/run/` — bundled, handoff done, journal 110 lines seq 1–110, 50 answers (1 skipped), T1, scope_locked seq 81, S0–S9 all done, 32 files.

## 0. Fixes confirmed present (git diff of working tree)

- **G7** (SKILL.md Step 3): "Downgrade (new tier is lower) → **warn first**, in User Language (English source): \"The model now running is smaller than before, so the capability probe runs again — if it fails, I have to refuse to continue; nothing is lost, the project state stays safe on disk.\" Then re-run the capability probe before any further work."
- **G8** (Step 3): "All pass → journal `capability_probe_passed` (payload: `{\"steps\": [...]}` — the ids of the checks that passed: \"json\", \"order\", \"sentence\"), update `model_profile.probe`, continue."
- **G9** (Step 5c heading): `### c. Scope locked, S9 not `done` (bundle absent, partial, or fully written but S9 unclosed)` + new body clause "When no file is missing, the remaining work is closing S9 (`section_done` + one checkpoint)."
- **G10** (Step 2a): "fix `current_section` (the first Section not `done`, in conventions §5 order **— S10 when S0–S9 are all done**) and say so in the summary."
- **G2** (Step 2b `answer_recorded` row): "`project` metadata (`slug`, `name`, `idea_raw`, `user_language`) comes from the S0 section record (verbatim idea, confirmed language, confirmed slug + display name)".
- **G4** (Step 2b booster row): "`license`/`tier` are static per-booster facts — from `CAPABILITIES.md` when the bundle exists, else the core-booster table in `05-boosters.md`".
- **G5** (Step 2b new row): "`section_start` S5, `section_start` S7, `section_done` S9, `build_started`, `build_done` | `project.status` transitions (conventions §2 enum): the fresh state starts at `interview`; S5 start → `researching`, S7 start → `review`, S9 done → `bundled`, `build_started` → `building` (builder active), `build_done` → `complete`".
- **G6** (Step 2b handoff row): "`handoff_done` fills `handoff` = { \"status\": \"done\", \"completed_at\" }". Spec 01 line: `"handoff": null  // filled at /lvp-handoff: { status: "done", completed_at }`.
- **G11** (docs/spec/03-skills.md item 3): "… / run handoff (if bundled, handoff open) / suggest `add-feature` or `recheck-plan` (if bundled, handoff done)."

`git status` after all executions: only the three fix files modified (`docs/spec/01-state.md`, `docs/spec/03-skills.md`, `skills/lvp-continue/SKILL.md`), nothing else; `.scratch/` clean; repo fixture re-hashed 32/32 sha-identical to the pre-run baseline (`repo-fixture-base.txt` vs `repo-fixture-after.txt`).

## 1. Method, simulations, and disclosures (honesty items)

1. Each scenario = own fixture dir under `/tmp/lvp-verify-16/` + literal walk of Steps 1→5. Runs terminate at the Step 5 offer (the skill acts on the user's confirmation; none was given), so no downstream procedure (S9 closing, handoff, S8 resume) was exercised — the branch match + offer is what each criterion targets.
2. **Only simulated interaction: the Step 3 tier question** (no harness tier config for this context; "if not determinable, ask init's one-line tier question"). All runs: simulated answer "T1 (large)", mirroring the original session's declaration (journal seq 3). V3: simulated answer "T2 (medium)" per the scenario. In V3 the three probe checks were answered by the executing model itself (replies recorded below — they are genuine outputs generated during the execution, graded strictly against the documented pass rules).
3. **Execution interpretation (disclosed):** Step 2a's G10 repair has no dedicated journal event type. To satisfy conventions §3 ("Every state mutation emits at least one event") and checkpoint discipline ("one journal write + one state write together"), the repair state-write rides the run's single `resume` append, whose payload names the repair. No other interpretation-dependent choice was made.
4. **Synthesis (SETUP only; exact diffs in §2):** mid-crash journals truncated to the exact append-only history of each checkpoint. Per the ERRATA.md fold-back discipline: no anachronistic records — run-V1a/V1b/V5c additionally had `HANDOFF-PROMPT.md` removed (written by `/lvp-handoff`, which never ran at those checkpoints). run-V5a follows the named run-A recipe verbatim (keeps all 32 files, incl. the benign inherited `HANDOFF-PROMPT.md` anachronism — branch d's conditions do not depend on it; disclosed). run-V5c additionally removes the `.lvp/docs/sections/S8-milestones.md` record (cannot exist before `section_done` S8, seq 85) — the exact run-B2 blemish the ERRATA flags.
5. **V6 tool defects found and fixed during the round** (my replay tool, not the skill): first execution (a) parsed milestone coverage pairs backwards (`M->F` vs the journaled `F->M`) leaving features empty, and (b) derived decision `section` from free-text references (17 divergences vs healthy). Fix: features from the correct direction; decision sections from the Section Records' "## Decisions this Section" blocks (raw material). The fixture was restored to pristine, re-corrupted identically, and **re-executed once cleanly** — that single run is the recorded evidence; the rehearsal appended one `resume` line to the discarded copy only.
6. Scripts kept outside fixture dirs: `scripts/synthesize.py`, `scripts/append_event.py`, `scripts/replay_v6.py`.

## 2. Synthesis diffs from the pristine fixture (SETUP, not evidence)

| Run | State diffs | Journal | Files |
|---|---|---|---|
| run-V1a | `project.status` "bundled"→"review"; `sections.S9` → `{status:"in_progress", started_at:"2026-11-07T08:49:34.912Z"}` (record/completed_at dropped — the `section_start` rebuild-table effect); `handoff` → null | truncated to seq 107 (cut: `section_done` S9, `handoff_started`, `handoff_done`) | 31 files: all 21 bundle files present; `HANDOFF-PROMPT.md` removed (anachronistic) |
| run-V1b | same as V1a | same as V1a | V1a + `SCOPE.md` truncated to 0 bytes |
| run-V2 | none (pristine) | 110 lines | 32 files |
| run-V3 | none (pristine; current tier T2 is conversational) | 110 lines | 32 files |
| run-V5a | `handoff` → null (run-A recipe) | truncated to seq 108 (cut: `handoff_started`, `handoff_done`) | 32 files (recipe kept all, incl. benign `HANDOFF-PROMPT.md`) |
| run-V5b | none (pristine) | 110 lines | 32 files |
| run-V5c | `project.status`→"review"; `handoff`→null; `sections.S8`→`{status:"in_progress", started_at:"2026-11-07T08:44:49Z"}`; `current_section`→"S8"; top-level `milestones`→[]; `pipeline.milestones`→[] | truncated to seq 83 (cut: seq 84–110, 27 events) | 9 files: 7 section records (S0–S5, S7 — S8 record removed per ERRATA), state, journal; all bundle files + `HANDOFF-PROMPT.md` removed |
| run-V6 | `state.json` truncated to 19118/34761 bytes (mid-JSON; `JSONDecodeError: Expecting property name enclosed in double quotes (line 291)`) | 110 lines | 32 files |

Baseline sha manifests: `sha-run-*-pre.txt` (8 files, 31/31/32/32/32/32/9/32 entries). Repo fixture baseline: `repo-fixture-base.txt` (32 files).

## 3. Scenario results

### V1a — mid-S9 crash, all bundle files written (G9) — PASS

- Step 2a: healthy; first Section not `done` = S9 = `current_section` → no repair; fold-back: nothing; scope LOCKED (seq 81 + S7 done). Step 3: simulated T1 = stored T1 → nothing.
- Step 4 summary (id, abridged): "S0–S8 selesai; bagian kompilasi S9 berjalan — semua 21 berkas paket sudah tertulis tetapi S9 belum ditutup; status proyek *review*. Jawaban: 50 tercatat, 1 sengaja dilewati. Scope sudah dikunci. Aktivitas terakhir: 7 Nov 2026 09:00 (berkas paket terakhir). Tier: T1 → T1."
- Journal: 1 append — seq 108 `resume` (payload position: "S0-S8 done; S9 in_progress (bundle fully written, 21/21 files, S9 not closed); scope locked…", tier_check unchanged).
- Step 5 walk: a no (status `review` ≠ `error`); **b no** — status `review` is in {interview, researching, review} but the current Section is S9, outside "S0–S8" → condition "the current Section S0–S8 is not done" fails; **c MATCH**. Heading quoted verbatim from the skill:
  > `### c. Scope locked, S9 not `done` (bundle absent, partial, or fully written but S9 unclosed)`
  
  Conditions: scope locked ✓; S9 not `done` ✓ (`in_progress`). Bundle fully written → the new body clause fires: "When no file is missing, the remaining work is closing S9 (`section_done` + one checkpoint)." **Offer (id)**: "Semua 21 berkas paket rencana sudah lengkap — tidak ada yang kurang. Tinggal menutup bagian kompilasi S9 (`section_done` + satu checkpoint). Mau saya tutup?" — i.e. finishing/closing S9, exactly the mid-S9 crash window routing the fix targets. This position matched **no branch** under the pre-fix text (prior round's gap, run-C-class: b fails, old c required "bundle incomplete", d requires S9 done, e required building/complete).
- Journal discipline: seq 1–108 continuous, append-only prefix intact, only documented types. Changed files: `.lvp/journal.ndjson` only (31→31 files).

### V1b — mid-S9 crash, one §8 file emptied (G9) — PASS

- Identical Steps 1–4 (resume seq 108; payload notes "bundle partial: SCOPE.md present but empty, 20/21 files with content").
- Step 5: b no (same reason as V1a); **c MATCH** — same heading as V1a; the widened condition covers "partial". **Offer (id)**: "Berkas paket hampir lengkap — SCOPE.md kosong, 20 dari 21 berkas sudah berisi. Mau saya lanjutkan: isi SCOPE.md (satu berkas per giliran, dengan `doc_generated` + checkpoint), lalu tutup S9 (`section_done` + checkpoint)?"
- **Nuance (disclosed, not a failure):** branch c's body says "Existing bundle files are skipped"; a 0-byte SCOPE.md technically exists. The offer treats the file's missing required structure as remaining work (conventions §7 classes "a missing required section of a file" as incomplete work to continue). The G9 target — branch c matching at all in this window — is unambiguous. The emptiness semantics of a present-but-empty file are undefined by the skill text (minor residual gap, noted in §5).
- Journal discipline: seq 1–108, only `resume` appended. Changed files: `.lvp/journal.ndjson` only.

### V2 — pristine fixture, terminal repair (G10) — PASS

- Step 2a: healthy; **repair fires**: S0–S9 all `done`, `current_section` "S9" → first Section not `done` in §5 order = **S10** → repaired to "S10", **summary says so** (id): "Perbaikan konsistensi: semua bagian S0–S9 sudah selesai, tetapi penunjuk bagian berjalan masih 'S9' — saya koreksi menjadi 'S10' (Build; di luar lingkup v0)." Fold-back: nothing; scope locked.
- Checkpoint: state write (`current_section` → "S10") + journal `resume` seq 111 together (payload: "…consistency repair applied: current_section S9 -> S10 (first Section not done in conventions §5 order, per Step 2a rule \"S10 when S0-S9 are all done\")").
- Step 5 walk: a no; b no (`bundled` not in the set); c no — S9 IS `done` (new heading explicitly excludes bundled states); d no — `handoff.status="done"` is not open; **e MATCH**. Heading quoted verbatim:
  > `### e. Bundled (`handoff` done), building, or complete)`
  
  Offer: v1 pointers — `/lvp-build` (first unverified milestone M0), `/lvp-add-feature`, `/lvp-recheck-plan`; no `/lvp-personal-brand` pointer (milestones unverified, `deployment` null).
- Changed files: `.lvp/journal.ndjson` + `.lvp/state.json` (the repair — legitimate). state sha pre `21d5c437…` → post `4e751df8…`. Journal seq 1–111, only `resume` appended.

### V3 — downgrade T1 → T2, scripted warning before probe (G7) — PASS

- Step 2a: healthy; G10 repair fires here too (S0–S9 all done → current_section → "S10"; summary says so; state-write rides the final resume checkpoint per §1.3). Scope locked.
- Step 3: stored T1; simulated user answer "2. Medium (T2)" → change. **Checkpoint 1**: journal seq 111 `tier_changed` payload `{"old": "T1", "new": "T2"}` + state write (`model_profile.tier` → "T2", `declared_at` → "2026-11-14T13:02:26Z") together.
- **Downgrade → warning printed BEFORE the probe.** Skill text (verbatim): "warn first, in User Language (English source): \"**The model now running is smaller than before, so the capability probe runs again — if it fails, I have to refuse to continue; nothing is lost, the project state stays safe on disk.**\"" Transcript (as printed, User Language id): "Model yang sedang berjalan sekarang lebih kecil dari sebelumnya, jadi probe kemampuan dijalankan ulang — jika gagal, saya harus menolak melanjutkan; tidak ada yang hilang, keadaan proyek tetap aman di disk." — printed before any probe check ran.
- **Probe** (three checks, clean single attempts, replies are the executing model's actual outputs):
  1. Strict JSON — reply `{"probe":"json","answer":42}` (exact object, no prose/fences, answer=42) → PASS.
  2. Three-step order — reply `ALPHA` ⏎ `2` ⏎ `AGMA` (in order) → PASS.
  3. Sentence continuation — reply "the customer had two separate items, so the total was rung up in two passes." (coherent, grammatical, no restart/topic change) → PASS.
- **Checkpoint 2**: journal seq 112 `capability_probe_passed` + state write (`model_profile.probe` → "passed") together. Tier rules re-applied (T2): batch ≤2, research split sub-queries + incremental RESEARCH.md, one bundle file per turn, reload on Section start, boosters one at a time.
- **Checkpoint 3**: repair state write (`current_section` → "S10") + journal `resume` seq 113 together.
- Step 5: same walk as V2 → **e MATCH** (same heading), v1 pointers.
- Journal: 113 lines, seq continuous, appended = `tier_changed`, `capability_probe_passed`, `resume` (all documented). Changed files: journal + state (`model_profile` + `current_section`) — legitimate.

### V4 — pass payload shape (G8) — PASS (same run as V3)

- Skill text (verbatim): "All pass → journal `capability_probe_passed` (payload: `{\"steps\": [...]}` — the ids of the checks that passed: \"json\", \"order\", \"sentence\")".
- Journal line seq 112 (verbatim): `{"ts": "2026-11-14T13:02:42Z", "seq": 112, "type": "capability_probe_passed", "payload": {"steps": ["json", "order", "sentence"]}}` — payload shape exactly `{"steps": [...]}` with the ids `json`, `order`, `sentence`. Rebuild-table conformance: the event maps to `model_profile.probe`, which was updated ("skipped" → "passed") in the same checkpoint.

### V5a — bundled + handoff open (regression, run-A recipe) — PASS

- Step 2a: healthy; G10 repair fires (S0–S9 all done → current_section "S9" → "S10"; under the pre-fix text this was "no not-done Section exists" — the new behavior is the G10 fix operating as intended, disclosed as an expected side effect of the pristine recipe). Scope locked. Resume seq 109 (repair in payload).
- Step 5 walk in order: a no; b no; c no (S9 `done` — the new heading keeps bundled states out of c; no regression vs old c either, which required "bundle incomplete"); **d MATCH FIRST**. Heading quoted verbatim:
  > `### d. Bundled (S9 done, `handoff` open)`
  
  Conditions: S9 done ✓; `handoff` open (`null`) ✓; precondition inside the branch: S1–S8 done + scope locked ✓. Sub-clause "handoff started but never finished" does NOT fire (journal ends seq 108, no `handoff_started`). `/lvp-handoff` IS installed (`~/.zcode/skills/lvp-handoff/SKILL.md`, `~/.agents/skills/lvp-handoff/SKILL.md`) → normal offer. **Offer (id)**: "…Langkah berikutnya: **/lvp-handoff** — menyiapkan berkas serah-terima untuk builder. Mau saya jalankan?"
- Changed files: journal + state (repair). Journal seq 1–109, only `resume` appended.

### V5b — pristine bundled + handoff done (regression, branch e) — PASS

- Identical shape to V2 on a fresh fixture: G10 repair (current_section → "S10", summary says so), resume seq 111, Step 5 walk → **e MATCH** (`### e. Bundled (`handoff` done), building, or complete)`), v1 pointers offered (`/lvp-build` M0, `/lvp-add-feature`, `/lvp-recheck-plan`). This is the operationally witnessed counterpart of the G11 spec-03 line ("suggest `add-feature` or `recheck-plan` (if bundled, handoff done)") and of the previously-confirmed coverage hole (prior rounds' GAP-1/G7-old: no branch matched this exact state).
- Changed files: journal + state (repair). Journal seq 1–111, only `resume` appended.

### V5c — mid-interview S8 in_progress, ERRATA-corrected (regression, branch b) — PASS

- Fixture: 9 files; journal ends seq 83 (`section_start` S8); S8 `in_progress` with **0 answers**; **no anachronistic S8 record** (removed per ERRATA — it is written only at `section_done` seq 85); milestones `[]` (filled at S8); bundle absent.
- Step 2a: healthy; first Section not `done` = S8 = `current_section` → no repair; **fold-back: none — and the summary claims none** ("Tidak ada jawaban yang perlu diambil dari catatan — semua jawaban tercatat sudah lengkap di state"), the corrected replacement for run-B2's blemished "0 answers without fold-back" trace; scope LOCKED (seq 81 + S7 done — scope lock does not move mid-interview states out of branch b).
- Step 4: journal `resume` seq 84 (payload: "S0-S7 done (49 answers, 1 skipped); scope locked…; S8 in_progress (0 answers); milestones not yet filled; bundle absent; no fold-back…"). No state write.
- Step 5 walk: a no (status `review`); **b MATCH** — status `review` ∈ {interview, researching, review} ✓ AND "the current Section S0–S8 is not done" ✓ (S8 `in_progress`). c never reached — a mid-interview state does NOT route to finish-S9 despite scope lock (the G9 widening did not capture branch b's territory). Offer per b's order: no open loop-backs → resume S8 at the exact micro-batch boundary. `lvp-init-new-idea` installed (`### S8 — Milestone plan` block at SKILL.md:506 + `references/sections/S8-milestones.md` bank) → full procedure, no degraded fallback. Zero recorded S8 answers → nothing re-asked → the S8 opener (journal seq 83 note: "draft whole plan M0-first; user sees it only at the final review"); T1 batch up to 3; skip + "cukup" controls visible. **Offer (id)**: "Kita lanjut bagian sebelum kompilasi: rencana milestone (S8). Bagian ini baru dimulai tanpa jawaban — saya mulai dari pembuka S8, tanpa mengulang jawaban apa pun."
- Changed files: `.lvp/journal.ndjson` only (9→9 files). Journal seq 1–84, only `resume` appended.

### V6 — damaged state, journal rebuild (G2/G4/G5/G6) — PASS

- Step 1: `.lvp/` exists; `state.json` unparseable (truncated mid-JSON), `journal.ndjson` readable → Step 2b. Step 2a detection transcript: "state.json TIDAK DAPAT DIPARSE (JSON terpotong di tengah)".
- Step 2b: full 110-event replay onto a fresh state object (§2 shape), effect table 1:1 with the new annotations. Checkpoint: rebuilt `state.json` written + journal `resume` seq 111 appended together — payload verbatim: `{"state_rebuilt": true, "untranslatable": 0}`.
- **Reconstruction report** (printed, User Language id — full text captured in §4) explicitly cites the newly documented sources:
  - item 7: "Metadata proyek (slug futsal-court-booking, nama 'Futsal Court Booking', ide verbatim, bahasa id) **dari catatan S0**; created_at dari ts section_start S0." ← G2
  - item 8: "Booster: 9 inti, semua terpasang (booster_check); **lisensi/tier dari CAPABILITIES.md** (paket ada)." ← G4
  - item 10: "Status proyek: bundled — dari rantai transisi: awal 'interview' -> S5 start 'researching' -> S7 start 'review' -> S9 done 'bundled' (**baris transisi di tabel rebuild**)." ← G5
  - item 11: "Handoff: {\"status\": \"done\", \"completed_at\": \"2026-11-07T09:06:41.461Z\"} — dari handoff_done (seq 110), completed_at = ts peristiwa." ← G6
  - Plus: milestones from the S8 record; scope derived from the journal event; 0 untranslatable events; 8 loud-degradation notes (S0.q1–q3 and S4.q14 wording reconstructions; decision sections from the records' Decisions blocks).
- **Rebuilt-state checks (15/15 PASS)**: slug/name/idea_raw/user_language each equal the S0 record's values (idea_raw byte-equal to the record's verbatim idea); `handoff == {"status":"done","completed_at":"2026-11-07T09:06:41.461Z"}`; all 9 booster licenses equal the CAPABILITIES.md table (pm-skills Apache-2.0; OpenSpec/SimpleEnglish/humanizer/karpathy-guidelines/ponytail/competitor-analysis/Playwright MIT; agents.md spec "spec text, permissive") with tier "core"; `project.status` = "bundled" via the documented transition chain; `current_section` = "S10"; milestones M0–M3 with features [F-01]/[F-03]/[F-02]/[F-04] from the S8 record + seq-85 coverage; 50 answers / 1 skipped (S7.q1); 21 decisions with sections equal to healthy 21/21; L-01 resolved; §2 shape corrections (deployment null, verified/verified_at present, forbidden `pipeline.milestones` mirror omitted).
- **Semantic diff vs healthy snapshot** (witness comparison; the tool never read the healthy file): 52 differing leaf paths of 392, every one in a precedent-documented class: 19 decision rationale wording (DECISIONS.md mirror drift, same meaning), 8 milestone goal wording (S8-record Goal lines vs state-condensed strings), 9 answer q/a wording (record-sourced or loudly reconstructed — S0.q1–q3, S4.q14), 2 journal-sourced short texts (S9.record payload string; L-01 reason), 4 `milestones[].verified` + 8 `pipeline.milestones[]` (shape corrections toward §2 — healthy deviates), 1 `declared_at` (tier_declared event ts vs healthy's created_at-derived value), 1 `current_section` (effect-table literal: next after S9 = S10 — consistent with G10). No pipeline fact lost. Not byte-identical, per the contract (replay onto a fresh state + loud report; ERRATA #2).
- Step 3: rebuilt tier T1 = simulated T1 → nothing. Step 4: summary (id). Step 5: a no; b no; c no (S9 done); d no (handoff done); **e MATCH** (`### e. Bundled (`handoff` done), building, or complete)`) → v1 pointers.
- Integrity: journal 111 lines, seq continuous; **first 110 lines byte-identical to the pristine journal** (append-only proven); appended event exactly `{"ts": "2026-11-14T13:10:58Z", "seq": 111, "type": "resume", "payload": {"state_rebuilt": true, "untranslatable": 0}}`. Changed files: `.lvp/state.json` (rebuilt, by design) + `.lvp/journal.ndjson` (+1 line); **all 30 non-target files sha-identical**.

## 4. Full V6 reconstruction report transcript (evidence)

```
=== STEP 2b: LAPORAN REKONSTRUKSI (Bahasa Indonesia — dicetak, bukan file) ===
state.json TIDAK DAPAT DIPARSE (JSON terpotong di tengah) -> dibangun ulang dari replay jurnal (110 peristiwa, seq 1-110).
1. Bagian & status: S0, S1, S2, S3, S4, S5, S6, S7, S8, S9 selesai; S9 ditutup; current_section = S10 (aturan section_done: bagian berikutnya dalam urutan §5).
2. Jawaban: 50 tercatat, 1 sengaja dilewati (S7.q1) — jumlah & id dari jurnal; teks q/a dari blok '## Answers' catatan bagian.
3. Keputusan: 21 (D-001..D-021) dari cermin DECISIONS.md.
4. Loop-back: L-01 dibuka seq 74, ditutup seq 76 (resolved_at terisi dari ts peristiwa).
5. Milestones: 4 (M0-M3) dari catatan S8; verified=false semua (belum ada milestone_verified).
6. Tier: T1 (dari tier_declared), probe: skipped (T1 — probe wajib hanya untuk T2/T3, tidak ada peristiwa probe di jurnal).
7. Metadata proyek (slug futsal-court-booking, nama 'Futsal Court Booking', ide verbatim, bahasa id) dari catatan S0; created_at dari ts section_start S0.
8. Booster: 9 inti, semua terpasang (booster_check); lisensi/tier dari CAPABILITIES.md (paket ada).
9. Scope: TERKUNCI — diturunkan dari peristiwa scope_locked (seq 81) + S7 done (tanpa field skema).
10. Status proyek: bundled — dari rantai transisi: awal 'interview' -> S5 start 'researching' -> S7 start 'review' -> S9 done 'bundled' (baris transisi di tabel rebuild).
11. Handoff: {"status": "done", "completed_at": "2026-11-07T09:06:41.461Z"} — dari handoff_done (seq 110), completed_at = ts peristiwa.
12. Bundle: 21 berkas doc_generated vs daftar §8 — hilang di disk: tidak ada.
13. Peristiwa yang tidak bisa diterjemahkan: 0 (tidak ada).
Catatan degradasi lantang:
  - metadata proyek (slug, nama, ide verbatim, bahasa) diambil dari catatan bagian S0 (S0-intake.md) — sumber yang kini didokumentasikan di tabel rebuild
  - lisensi booster diambil dari CAPABILITIES.md (paket ada di disk) — sumber yang kini didokumentasikan di tabel rebuild; tier semua booster inti = "core"
  - section keputusan diambil dari blok 'Decisions this Section' catatan bagian (raw material); ringkasan/rationale dari cermin DECISIONS.md
  - S0.q1: teks verbatim pertanyaan/jawaban tidak ada di catatan S0 (catatan menyimpan substansinya); jawaban = ide verbatim dari catatan S0
  - S0.q2: rumusan dibangun ulang dari metadata catatan S0 (User Language: id, confirmed)
  - S0.q3: rumusan dibangun ulang dari metadata catatan S0 (slug + display name)
  - S4.q14: teks verbatim hanya ada di state lama (rusak); catatan S4 menyimpan resolusi loop-back L-01 — jawaban diisi dari resolusi yang tercatat, rumusan ditandai
  - milestones dibangun dari catatan bagian S8 (S8-milestones.md) — sumber yang didokumentasikan ("Two things the journal cannot supply directly: Milestones")
Checkpoint: state.json ditulis + resume seq 111 (payload state_rebuilt=true, untranslatable=0) — satu checkpoint.
```

## 5. Journal discipline + witness tables (all scenarios)

Journal validation (programmatic, across all 8 runs): seq strictly continuous; the pre-execution prefix byte-identical to the pristine journal (append-only); every appended `type` ∈ the 49 documented event types (conventions §3); exactly the events below.

| Run | Appended events (seq, type) | State writes | Changed files (sha witness) |
|---|---|---|---|
| run-V1a | 108 `resume` | none | `.lvp/journal.ndjson` only |
| run-V1b | 108 `resume` | none | `.lvp/journal.ndjson` only |
| run-V2 | 111 `resume` | `current_section` S9→S10 (G10 repair) | journal + state |
| run-V3 | 111 `tier_changed`, 112 `capability_probe_passed`, 113 `resume` | `model_profile` (tier T2, declared_at, probe passed) + `current_section` S9→S10 | journal + state |
| run-V5a | 109 `resume` | `current_section` S9→S10 (G10 repair) | journal + state |
| run-V5b | 111 `resume` | `current_section` S9→S10 (G10 repair) | journal + state |
| run-V5c | 84 `resume` | none | `.lvp/journal.ndjson` only |
| run-V6 | 111 `resume` (`state_rebuilt:true, untranslatable:0`) | full rebuild of `state.json` | journal + state; 30/30 non-target files identical |

Per-run sha manifests: `sha-run-{V1a,V1b,V2,V3,V5a,V5b,V5c,V6}-pre.txt` and `-post.txt.raw`. Journal-append helper: `scripts/append_event.py` (asserts seq continuity before appending).

## 6. Verdict summary

| Scenario | Verdict | One-line justification |
|---|---|---|
| V1a (G9, mid-S9 crash, all files) | **PASS** | Branch c's new heading matched verbatim; offer = closing S9 (`section_done` + checkpoint) via the new "no file missing" clause; previously an unmatched hole; journal clean (+1 resume seq 108), journal-only disk change. |
| V1b (G9, one §8 file emptied) | **PASS** | Branch c matched ("partial"); offer = write the emptied file then close S9; emptiness semantics undefined by the text (minor residual, does not affect the branch match); journal clean. |
| V2 (G10 terminal repair) | **PASS** | Repair set `current_section` to "S10" exactly per the new rule and the summary said so; branch e matched afterwards with its new heading; journal + state only. |
| V3 (G7 warning order) | **PASS** | Scripted warning sentence printed before any probe step (quoted verbatim from skill + transcript); probe re-run before further work, 3/3 pass; `tier_changed` + `resume` journaled; state tier/declared_at updated. |
| V4 (G8 payload) | **PASS** | `capability_probe_passed` payload exactly `{"steps": ["json", "order", "sentence"]}` per the newly documented shape; `model_profile.probe` updated in the same checkpoint. |
| V5a (regression: handoff open) | **PASS** | Branch d matched first (a/b/c all fail; c excluded because S9 is `done`); `/lvp-handoff` offered; G10 repair as expected side effect; journal clean. |
| V5b (regression: handoff done) | **PASS** | Branch e matched with its new heading; v1 pointers offered (witnesses G11's spec-03 wording); journal clean. |
| V5c (regression: mid-interview, ERRATA-corrected) | **PASS** | Branch b matched (c never reached despite scope lock); resume at the S8 boundary with 0 re-asks and a correct no-fold-back summary; no anachronistic record; journal-only change. |
| V6 (G2/G4/G5/G6 rebuild) | **PASS** | Reconstruction report cites the documented sources (metadata ← S0 record; license/tier ← CAPABILITIES.md; status transition chain; handoff shape); rebuilt state carries S0-record metadata, `handoff {"status":"done","completed_at"}`, 9/9 CAPABILITIES licenses + core tier, `bundled` via the transitions row; journal append-only with `resume {state_rebuilt:true, untranslatable:0}`; 30/30 non-target files untouched. |

**Overall: 9/9 scenarios PASS. All nine fixes behave as intended; no regression found.**

## 7. Deviations, residual observations, limitations

1. **Simulated tier question per run** (§1.2) and V3's probe replies generated by the executing model — recorded verbatim; a live harness with a different model would exercise the same documented checks.
2. **Step 2a repair event mapping** (§1.3): the repair rides the `resume` checkpoint; the skill text does not name an event for repairs (pre-existing ambiguity, now partially mitigated by G10's "say so in the summary").
3. **V1b residual**: "present but empty" file semantics are undefined in branch c's body ("Existing bundle files are skipped"); the offer treated the missing required structure as remaining work (conventions §7's truncation class). The branch match itself — G9's target — is unambiguous.
4. **run-V5a inherits run-A's benign `HANDOFF-PROMPT.md` anachronism** (kept deliberately: the named recipe was followed verbatim; branch d's conditions do not read it). V1a/V1b/V5c applied the fold-back discipline instead.
5. **V6 fidelity**: decision `section`/`summary`/`rationale` come from the records' Decisions blocks + DECISIONS.md (the journal carries no decision content — gap "G3" of the prior round remains open, unchanged by this fix round); 19 rationale wordings differ from the healthy snapshot (mirror drift, same meaning). `declared_at` uses the tier_declared event ts (only journal source). All classified, none a lost pipeline fact.
6. **Offers were not accepted** — downstream procedures (S9 `section_done`, `/lvp-handoff` execution, S8 question batch, bundle regeneration) were not exercised; each criterion targets the offer/branch match, which is what the skill appends nothing beyond `resume` for (confirmed by witnesses).
7. Repo cleanliness re-proven at the end: fixture 32/32 sha-identical (`repo-fixture-base.txt` vs `repo-fixture-after.txt`); `git status` limited to the three fix files.

## 8. File inventory

- `/tmp/lvp-verify-16/REPORT.md` — this report.
- `/tmp/lvp-verify-16/run-V1a`, `run-V1b`, `run-V2`, `run-V3`, `run-V5a`, `run-V5b`, `run-V5c`, `run-V6` — scenario fixtures post-execution.
- `/tmp/lvp-verify-16/sha-run-*-pre.txt`, `sha-run-*-post.txt.raw`, `repo-fixture-base.txt`, `repo-fixture-after.txt` — hash evidence.
- `/tmp/lvp-verify-16/scripts/synthesize.py`, `scripts/append_event.py`, `scripts/replay_v6.py` — auditable setup/execution tools.
- `/tmp/lvp-verify-16/v6-replay-meta.json`, `v6-diff-paths.json` — V6 replay metadata and the 52 divergent leaf paths.
