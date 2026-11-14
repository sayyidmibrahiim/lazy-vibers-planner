# E2E-2 — `/lvp-continue` black-box test: session-kill resume (R) + corrupt-state rebuild (X)

Tester: end-to-end test agent consuming the skill exactly as a harness agent would — by reading the INSTALLED skill file and literally following its procedure against fixture copies.
Date: 2026-11-14. Workspace (all writes here): `/tmp/lvp-e2e-2/`. Repo: READ-ONLY (proof in §5).
Skill under test: `/home/ibrahim/.agents/skills/lvp-continue/SKILL.md` + `references/principles.md` + `references/conventions.md`.
Source fixture: `/home/ibrahim/projects/lazy-vibers-planner/.scratch/lvp-core/dogfood/run/` (32 files; post-handoff_done healthy snapshot: status `bundled`, `handoff.status="done"`, journal seq 1–110 continuous, 50 answers (1 skipped, S7.q1), 21 decisions, `scope_locked` at seq 81, S0–S9 all done).

**Setup step 1 — harness-identity check**: `diff -q` of repo vs installed skill → files identical. Re-verified again after all executions (still identical).

## 0. Verdict summary

| Check | Scenario R (session-kill resume) | Scenario X (corrupt state) |
|---|---|---|
| a. Correct branch matched (verbatim heading) | **PASS** — `### b. Interviewing (status \`interview\`, \`researching\`, or \`review\`; the current Section S0–S8 is not done)` | **PASS** — rebuild path (Step 2b) then `### e. Bundled (\`handoff\` done), building, or complete` |
| b. Zero re-asked questions | **PASS** (audit in §2.4) | n/a (no interview position; nothing asked) |
| c. Rebuilt state.json byte-identical to pre-corruption snapshot (sha256) | n/a | **FAIL** — `0f3245a5…` vs `21d5c437…`; 63 semantic divergences in 12 characterized classes (§3.4). Reconstruction report present and in Bahasa Indonesia: **PASS** (half-check split explicitly) |
| d. Journal discipline (documented events only, seq-continuous; X has `resume` with `state_rebuilt:true`) | **PASS** — exactly 1 append (`resume`, seq 84); seq 1–84 continuous | **PASS** — exactly 1 append (`resume`, seq 111, `state_rebuilt: true`, `untranslatable: 0`); seq 1–111 continuous |
| e. Non-target files sha-identical | **PASS** — 1 of 9 files changed (journal only); state.json byte-identical pre/post | **PASS** — exactly 2 of 32 changed (state.json rebuilt + journal +1 line) — the only files the procedure legitimately writes |
| f. Repo fixture untouched | **PASS** (joint) — all 23,798 repo files sha-identical to pre-run baseline; `git status --porcelain` empty; dogfood fixture state/journal shas still `21d5c437…` / `7fd4a27e…` | **PASS** (joint) |

**Overall: Scenario R PASS 5/5. Scenario X: 4/5 — check c fails at byte level, with the exact reason fully characterized. The failure is a property of the fixture + skill contract (journal replay cannot byte-restore this state.json), not of the run; details and the fix direction in §3.4/§4.**

---

## 1. Setup and synthesis (SETUP, not evidence — exact diffs documented)

### 1.1 Scenario R fixture (`/tmp/lvp-e2e-2/run-R`)

Copied from the repo dogfood fixture, then synthesized per the documented recipe in `.scratch/lvp-core/verify-06-continue/report-handoff-positions.md` §2, run-B2. Applied state diffs (via auditable string edits; resulting state.json is **byte-identical** to the prior verification round's run-B2 synthesis, sha `1ce22ec0…` — independent re-derivation landed on identical bytes):

1. `project.status`: `"bundled"` → `"review"` (the interview-window enum value per conventions §2: review = S7–S8 window).
2. `pipeline.current_section`: `"S9"` → `"S8"`.
3. `pipeline.sections.S8`: `{status:"done", started_at, answers{S8.q1}, record, completed_at}` → `{status:"in_progress", started_at:"2026-11-07T08:44:49Z"}` (per the rebuild table's `section_start` shape).
4. top-level `milestones`: `[M0..M3]` → `[]`.
5. `pipeline.milestones`: `[M0..M3]` → `[]`.
6. `handoff`: `{status:"done",…}` → `null`.
7. Journal truncated to seq 1–83 (last line = `section_start S8`) — the exact append-only history at a mid-S8 session kill.
8. The 22 bundle files (17 root files + SPEC/ 5) removed (they do not exist pre-S9; recipe: "Bundle files removed as in run-B").

**Documented deviation from the recipe (1 item, deliberately taken, with rationale):** the recipe's remaining-files list keeps `.lvp/docs/sections/S8-milestones.md` (10 files remain). That file could not exist at the seq-83 checkpoint — Section Records are written at `section_done` (S8's record was written at seq 85, per init engine step 6) — and the on-disk copy is the FINAL version holding S8.q1's answer. Keeping it would fire Step 2a's fold-back rule ("An answer present in a Section Record file but missing from state is folded back in") and route the resume to S8 close-out (`section_done` + continue to S9) instead of the S8 opener — silently converting the scenario into a different one and making the zero-re-ask audit vacuous. I removed it, making the disk state a faithful seq-83 checkpoint (9 files remain). **Note the inconsistency this exposes in the prior verification round:** verify-06's run-B2 kept the anachronistic record yet reported "S8 in_progress (0 answers)" — i.e. it did not apply its own fold-back rule. One of the two behaviors is not literal; mine is.

Also inherited from the recipe (not changed): `pipeline.sections.S9` entry remains `{status:"done", …}` in the synthesized state (the recipe's diff list does not remove it; a real seq-83 state would have no S9 entry). It does not affect any evaluated condition: the first Section not `done` in §5 order is S8 (= `current_section`, so no repair), and branch b's condition tests S8, not S9.

Snapshots: `evidence/sha-run-R-pristine.txt` (32 files, pre-synthesis; state sha `21d5c437…` — byte-identical to verify-06's base), `snapshots/run-R-state-pristine.json`, `evidence/sha-run-R-pre.txt` (9 files, post-synthesis pre-execution), `snapshots/run-R-state-pre.json`, `snapshots/run-R-journal-pre.ndjson`.

### 1.2 Scenario X fixture (`/tmp/lvp-e2e-2/run-X`)

1. Fresh copy of the pristine repo fixture (32 files; state sha `21d5c437…`, journal 1–110). **No synthesis.**
2. Pre-corruption snapshot: `evidence/sha-run-X-pre-corruption.txt`, `snapshots/run-X-state-pre-corruption.json` (34,761 bytes, sha `21d5c437…`).
3. Corruption: `head -c 19000 state.json` — truncation lands mid-value inside the `S5.q1` "q" string. Parse fails: `Expecting property name enclosed in double quotes at line 290 col 12`. Corrupted sha `6abab0a9…` (`evidence/sha-run-X-corrupted.txt`, `snapshots/run-X-state-corrupted.json`).

### 1.3 Execution semantics (both scenarios)

- Steps 1–5 walked literally in order against the installed skill; every condition evaluated, first matching branch taken ("Pick ONE primary offer"), branch quote recorded verbatim.
- **Simulated/declared elements (only two, mirroring the prior verification round's precedent):** (1) the offer is conversational — Step 5 says "act on the user's confirmation", and no user exists in this test, so each run terminates at the offer/question with no further writes; (2) Step 3's current tier: no harness tier config exists; determined as T1 from the running session's context budget (1M+-class per conventions §7), consistent with the stored T1 and the original session's declaration (journal seq 3: `"1. Large"`). Same tier → nothing to do, no event.
- All user-facing output rendered in Bahasa Indonesia (`user_language: "id"` per state), as recorded in the transcripts below.
- Step 5b's reload discipline: the installed `lvp-init-new-idea` skill was found (harness skill list; `~/.agents/skills/lvp-init-new-idea/SKILL.md`) → full procedure; its `### S8 — Milestone plan` block + `references/sections/S8-milestones.md` bank loaded for Scenario R. No degraded fallback fired anywhere.

---

## 2. Scenario R transcript — session-kill resume at the S8 boundary

**Step 1 — Locate**: `TARGET/.lvp/` holds readable `state.json` + `journal.ndjson` → "Otherwise continue at Step 2."

**Step 2a — Healthy state**: parses; shape per conventions §2 (inherited tolerated anomalies: `milestones` was mirrored under `pipeline` — now `[]`/`[]` per synthesis; `deployment` field absent). Consistency repairs, all evaluated:
- Section statuses vs `current_section`: first Section not `done` in §5 order = S8 (`in_progress`); `current_section` = "S8" → **agree, no repair, no write**.
- Fold-back: programmatic audit (`record own-section answer ids ⊆ state answers`) — S1: 9/9, S2: 10/10, S3: 10/10, S4: 14/14, S5: 1/1, S7: 2/2, S0: present → **nothing to fold in**. (An initial naive cross-section regex flagged 8 false positives — ids cited inside S5-research.md prose as evidence; section-scoped audit shows no own-section answer missing.)
- Scope derivation: `scope_locked` exists (seq 81) AND S7 `done` → **scope LOCKED**.

**Step 3 — Tier check**: stored T1 = current T1 → nothing.

**Step 4 — Progress summary** (Bahasa Indonesia, printed):

> **Futsal Court Booking** (futsal-court-booking) — aplikasi booking lapangan futsal dengan DP 30% dan jadwal real-time, menggantikan buku tulis dan catatan WhatsApp.
> - **Posisi**: S0–S7 selesai. Scope sudah dikunci (F-01–F-04 masuk versi pertama; gateway pembayaran otomatis diparkir). Bagian berjalan: S8 — menyusun rencana milestone (M0…) yang tiap tahapnya bisa diverifikasi — baru dimulai, belum ada jawaban.
> - **Jawaban**: 49 tercatat, 1 sengaja dilewati (S7.q1 — Anda memilih melewatinya; konfirmasi dikunci pada pertanyaan berikutnya).
> - **Loop-back terbuka**: tidak ada (L-01 sudah ditutup).
> - **Booster**: 9 booster inti terpasang; tidak ada yang rusak atau hilang.
> - **Aktivitas terakhir**: 7 Nov 2026 08:44 — bagian S8 dimulai.
> - **Tier model**: tersimpan T1, saat ini T1 — tidak berubah.

Journal `resume` appended (seq 84 — the skill's only documented healthy-path write; Step 2 performed zero writes):
`{"ts": "2026-11-14T08:54:57Z", "seq": 84, "type": "resume", "payload": {"skill": "lvp-continue", "position": "S0-S7 done (49 answers, 1 skipped); scope locked (journal seq 81 + S7 done); S8 in_progress (0 answers); bundle absent", "tier_check": "unchanged: stored T1 = current T1"}}`

**Step 5 — branch walk** (evaluated in order):
- a. `project.status` = "error"? — status is "review" → **no**.
- **b. MATCH** — verbatim heading: **`### b. Interviewing (status \`interview\`, \`researching\`, or \`review\`; the current Section S0–S8 is not done)`** — status "review" ∈ set ✓ AND current Section S8 `in_progress` (not done) ✓.
- c, d, e: not reached (ONE primary offer).

Branch b order of offers:
1. Open loop-backs exist → offer them first? — none open (L-01 `resolved_at` set) → skipped.
2. **Resume the current Section at the exact micro-batch boundary**:
   - Loaded `lvp-init-new-idea`'s S8 procedure + bank (T1 reload discipline; no degraded fallback).
   - Batch composed from recorded answers after checking `sections.S8.answers` (empty) and the (absent) S8 record; S0–S7 answers checked — none re-asked.
   - S8 procedure: "First batch — draft the whole plan, M0 first; the user sees it only at the final review." / "User questions — one review at the end." → the boundary presentation = the drafted plan + ONE review question (T1 batch cap is 3; this procedure needs 1).

**Offer + resume start** (Bahasa Indonesia):

> Kita lanjut bagian yang tersisa sebelum kompilasi: **rencana milestone (S8)**. Tidak ada jawaban yang diulang — saya susun draf rencananya dari semua keputusan tercatat, lalu Anda tinjau sekali di akhir.
>
> Draf rencananya (dari scope terkunci dan keputusan Anda):
> - **M0 — Kerangka jalan (walking skeleton)**: deploy di alamat asli (Vercel + Supabase gratis, D-019/D-007) + F-01 booking beneran — slot terkunci di database sungguhan, dobol tidak mungkin (D-004). Tugas hari pertama Anda (S1.q9) jalan dari tap pertama sampai hasil kelihatan.
> - **M1 — F-03**: login admin + kelola lapangan, jam, harga, slot ditutup — pemain langsung lihat perubahannya.
> - **M2 — F-02**: alur DP 30% transfer manual + konfirmasi admin (D-011/L-01 — tanpa gateway online di versi pertama).
> - **M3 — F-04**: laporan harian + cek ulang deploy M0.
>
> **Satu pertanyaan tinjau (S8.q1):** Review rencana bangun: M0 kerangka jalan di alamat asli (booking beneran, slot terkunci), M1 admin atur lapangan & jadwal, M2 alur DP + konfirmasi, M3 laporan harian + cek ulang deploy. Setiap tahap ada cara ceknya yang hitung-hitungan, masing-masing kira-kira satu sesi kerja. Sip, atau ada yang mau diubah?
> *(Kontrol tetap terlihat: **skip** — dicatat, tidak memblokir — dan **"cukup"** untuk langsung ke pemeriksaan exit criteria bagian ini.)*

Run terminates at the presented question (no user; no further writes). The plan draft is composed entirely from recorded answers (S7 scope lock, D-019/D-007 stack, D-011/L-01 manual DP, D-005 ceiling, S1.q6 scale, S1.q9 day-one task, D-004 concurrency) — nothing recorded is re-solicited.

### 2.4 Check b — zero-re-ask audit (against all 50 pristine recorded answers)

The single question I would ask at this boundary is the S8 review above. Programmatic audit (`evidence` in the run transcript; script output preserved in session):

| Reference set | Result |
|---|---|
| 49 recorded answers S0–S7 (verbatim question texts) | Closest similarity ratio 0.326 (S2.q7, different topic); **no verbatim duplicate**; the batch asks nothing from S0–S7 → **0 re-asked** |
| 1 consciously-skipped answer (S7.q1) | Not asked again (skip recorded, never blocks; S7 is `done` and never re-run) |
| S8.q1 (present in the pristine 50-set) | Ratio 0.824 — it is the same review at the same boundary. **Fair game per the brief**: in the synthesized resume position it is genuinely unanswered — journal ≤ 83 contains no S8 answer event (`section_start S8` at seq 83 is the last line), state `sections.S8.answers` = {} (absent), no S8 record on disk (removed per documented setup deviation §1.1) |

**Verdict: PASS — zero questions re-asked; the only question presented is a genuinely-unanswered S8 question.**

### 2.5 Check d/e — journal discipline and file deltas (Scenario R)

- Journal: 84 lines, seq 1–84 **continuous**, last event `resume` @ 84. Events appended by the procedure: exactly `[resume]` (payload = position + tier-check result per Step 4). No `answer_recorded`/`section_done`/`section_start` appended — branches only OFFER; resumed work would append only after user confirmation.
- Pre/post sha256 (`evidence/sha-run-R-pre.txt` → `sha-run-R-post.txt`): **1 of 9 files changed** = `.lvp/journal.ndjson` (`699a2d54…` → `420bea9b…`). `state.json` byte-identical pre/post (`1ce22ec0…`). All 7 section records unchanged.

**Verdict: PASS.**

---

## 3. Scenario X transcript — corrupt state rebuilt by journal replay, then branch e

**Step 1 — Locate**: `.lvp/` exists; `state.json` unreadable (JSON parse fails), `journal.ndjson` readable → the "neither a readable state.json nor journal.ndjson" refusal does NOT apply (the journal exists) → "Otherwise continue at Step 2."

**Step 2b — Damaged state, journal present → rebuild by journal replay**: all 110 events replayed in `seq` order onto a fresh state object (shape per conventions §2), applying the SKILL.md rebuild table. Implementation: `/tmp/lvp-e2e-2/rebuild-replay.py` (kept for audit; sources beyond the journal are exactly the ones the skill names or implies, each documented in the report):
- `answer_recorded` payloads carry only `{section, answer_id, skipped}` → q/a text folded in from the answer's own Section Record line (records are raw material; never re-ask).
- `milestones[]` rebuilt from `.lvp/docs/sections/S8-milestones.md` (the skill's explicit rule; no journal event covers milestones).
- `decisions[]` rebuilt from the records' "Decisions this Section" lines (no journal event type covers decisions).
- Booster `license`/`tier` fields absent from journal payloads → recovered from `CAPABILITIES.md` (compiled at S9, license-tagged per conventions §8). First extraction grabbed the wrong column (Kind); fixed — final rebuilt state matches all 9 license values.
- `project.slug/name/user_language/idea_raw` from the S0 record (Metadata + "Idea (verbatim)" block); `created_at` derived from `section_start S0` ts (documented derivation choice).
- `project.status` from payload hints (`status_set` seq 70 → researching; `scope_locked` seq 81 → review; `section_done S9` seq 108 payload status → bundled) — agrees with the §2 enum semantics.
- Scope derived: `scope_locked` exists + S7 done → locked. `current_section` after S9 `done` kept "S9" (no next Section within the S0–S9 pipeline scope; S10 is out of v0 scope — matches the fixture's own terminal behavior).
- `probe` derived "skipped" (T1 skips the probe per conventions §7; no probe events in journal).

Then, per Step 2b items 1–3: (1) rebuilt `state.json` written (one checkpoint write); (2) reconstruction report printed plainly in Bahasa Indonesia (transcript below); (3) journal `resume` with `state_rebuilt: true` (seq 111).

### 3.1 Reconstruction report (verbatim, Bahasa Indonesia)

> **State dibangun ulang dari jurnal** — 110 kejadian (seq 1–110) diputar ulang berurutan ke state baru.
>
> **Yang berhasil direkonstruksi:**
> - **Proyek**: Futsal Court Booking (futsal-court-booking) — status *bundled*, Bahasa Indonesia, dibuat 7 Nov 2026 08:03.
> - **Bagian**: S0–S9 semuanya selesai; bagian berjalan: S9.
> - **Jawaban**: 50 tercatat, 1 sengaja dilewati (S7.q1).
> - **Keputusan**: 21 (D-001…D-021) — dipulihkan dari catatan bagian (jurnal tidak punya kejadian keputusan).
> - **Milestone**: M0–M3 — dipulihkan dari catatan S8-milestones.md (tidak ada kejadian jurnal untuk milestone); belum ada yang terverifikasi.
> - **Loop-back**: L-01 (S6→S4) dibuka 08:43, sudah ditutup 08:43.
> - **Booster**: 9 inti, semuanya *installed* (lisensi dipulihkan dari CAPABILITIES.md).
> - **Tier model**: T1, probe dilewati (T1), dideklarasikan 7 Nov 2026 08:02.
> - **Serah-terima**: selesai 7 Nov 2026 09:06.
> - **Scope**: dikunci — turunan dari kejadian `scope_locked` (seq 81) + S7 selesai (jurnal tidak punya kolom scope).
>
> **Yang diambil secara tidak langsung**: teks tanya-jawab tiap jawaban dari catatan bagian (jurnal hanya menyimpan id + flag skip); keputusan dari catatan; milestone dari catatan S8; lisensi booster dari CAPABILITIES.md.
>
> **Yang tidak dapat dipulihkan (per seq)** — kata-kata asli Anda hilang dari disk; mohon diulang hanya untuk 4 ini:
> - seq 14 (S0.q1): teks pertanyaan intake tidak ada di jurnal maupun catatan — jawabannya (ide verbatim) berhasil dipulihkan dari catatan S0.
> - seq 15 (S0.q2): teks tanya-jawab konfirmasi bahasa tidak ada di mana pun (faktanya — Bahasa Indonesia — sudah tertangkap dari catatan S0).
> - seq 16 (S0.q3): teks tanya-jawab konfirmasi nama/slug tidak ada di mana pun (faktanya sudah tertangkap dari catatan S0).
> - seq 75 (S4.q14): teks tanya-jawab loop-back tidak ada di jurnal, dan catatan S4 tidak memuat baris jawabannya (hanya ringkasan di catatan L-01).
> - Tidak ada kejadian jurnal yang gagal diterjemahkan (0 dari 110).
>
> Jawaban yang sudah tercatat tidak akan ditanyakan ulang — kecuali 4 teks di atas, yang kata-kata aslinya memang tidak ada lagi di disk.

Journal append (seq 111): `{"ts": "2026-11-14T09:07:12Z", "seq": 111, "type": "resume", "payload": {"skill": "lvp-continue", "state_rebuilt": true, "untranslatable": 0, "notes": "rebuild dari replay jurnal 110 event; teks verbatim 4 jawaban tidak dapat dipulihkan (S0.q1.q, S0.q2, S0.q3, S4.q14) - diminta diulang ke pengguna; lihat laporan rekonstruksi"}}`

**Step 3 — Tier check**: stored T1 (replayed from seq 3) = current T1 → nothing.

**Step 4 — Progress summary** (Bahasa Indonesia): S0–S9 selesai, paket 21 berkas lengkap, status *bundled*, serah-terima selesai; 50 tercatat / 1 dilewati + 4 teks hilang diminta diulang; L-01 tertutup; 9 booster; aktivitas terakhir 7 Nov 09:06; T1 → T1. (Step 4's `resume` append skipped — already appended in Step 2, per "if not already appended in Step 2".)

**Step 5 — branch walk** (in order):
- a. status "error"? — "bundled" → no.
- b. Interviewing? — "bundled" ∉ {interview, researching, review} → no.
- c. Scope locked, bundle incomplete? — scope locked ✓ but all 21 bundle files on disk → complete → no.
- d. `### d. Bundled (S9 done, \`handoff\` open)` — S9 done ✓ but `handoff.status` = "done" → handoff NOT open → **no**.
- **e. MATCH** — verbatim heading: **`### e. Bundled (\`handoff\` done), building, or complete`** — status "bundled" ✓ AND handoff done ✓. (Note: this heading now explicitly covers the `bundled + handoff done` position — the branch-coverage hole that verify-06 §7 confirmed has been fixed in the current skill text.)
- Offer (Bahasa Indonesia): pointers only — **/lvp-build** (eksekusi milestone pertama yang belum terverifikasi — M0), **/lvp-add-feature** (fitur baru lewat mini-pipeline), **/lvp-recheck-plan** (audit adversarial keputusan + paket). `/lvp-personal-brand` not pointed (milestones unverified, `deployment` null). Run terminates at the offer.

### 3.4 Check c — byte-identity of the rebuilt state: **FAIL**, fully characterized

| Measure | Value |
|---|---|
| Pre-corruption snapshot sha256 | `21d5c437b7b5e9f633b82cd4d0f55d5d73d532fc4cceb9161eea48ad643d3e14` (34,761 bytes) |
| Rebuilt state.json sha256 | `0f3245a573001409f15a62dc73f1f7c2c85aa67742c713d6df3e2ae5721d7d57` (32,316 bytes) |
| Byte-identical? | **NO** |
| JSON-semantic divergences | **63 field-level, in 12 classes** (below); everything structural matches: status, current_section, all 50 answer entries (ids + skipped flags), 21 decision ids/sections/statuses, M0–M3 ids/features, L-01 structure + timestamps, 9 boosters (name/repo/license/tier/status), handoff, S0–S9 statuses + record filenames + timestamps |

The 12 divergence classes (full list preserved in `evidence/run-X-semantic-diff.txt`):

| # | Class | Count | Nature |
|---|---|---|---|
| 1 | `decisions[]` summary/rationale prose | 36 | Record wording ≠ state wording (split points + paraphrase). Journal has no decision events; records are the only source → prose not byte-recoverable. Content equivalent. |
| 2 | `milestones[]` goal text + §2 `verified`/`verified_at` keys | 12 | Record Goal lines are longer than the state's stored goals; §2 shape adds `verified:false`/`verified_at:null` (fixture omits these keys). |
| 3 | S0 answer text unrecoverable | 5 | `S0.q1.q`, `S0.q2.q/a`, `S0.q3.q/a` = null: journal payloads carry no text; the S0 record holds only the idea verbatim + metadata facts, not the intake prompt or the user's spoken confirmations. |
| 4 | `S4.q14` text unrecoverable | 2 | Verified absent from every disk surface (grep across all records for the verbatim text: 0 hits; journal payload has no text). Only paraphrases exist (S4 record's locked v1-method line, L-01 resolution note). |
| 5 | `S1.q9.a` | 1 | The record was edited during L-01 (seq 76 `touched_records: S1-context.md (S1.q9 'online' wording corrected inline)`); fold-back from the mutated record yields the corrected/annotated line, not the originally-stored verbatim answer. |
| 6 | `L-01.reason` | 1 | Journal payload's short reason vs the state's longer prose — the long text exists on no disk surface. |
| 7 | `model_profile.declared_at` | 1 | Rebuild uses the `tier_declared` event ts (`08:02:40Z`); fixture has `08:03:22Z` — the fixture's stored value is not the event ts and is derivable from nowhere. |
| 8 | `deployment` key | 1 | §2 shape includes `"deployment": null`; the fixture omits the key entirely. |
| 9 | `pipeline.milestones` mirror | 1 | Conventions §2: "top-level only … never mirrored under `pipeline`"; no rebuild-table event creates the mirror; the rebuild correctly omits it. (The fixture's own journal seq 86 note documents that the original session created the duplication.) |
| 10 | `S6.answers` empty object | 1 | Fixture has `"answers": {}` on S6; the rebuild table creates `answers` only on `answer_recorded` (none for S6). |
| 11 | `S8.q1.q` wording | 1 | Record line reads "Review: ini rencana bangunnya — …" vs the state's stored "Review rencana bangun: …". |
| 12 | `S9.record` | 1 | Journal payload "Blueprint Bundle (20 files)" vs the state's long enumeration — the enumeration exists on no disk surface (payload or record). |

**Honest reading of the failure**: the fixture state.json is not byte-reconstructible from journal + records BY CONSTRUCTION — it contains post-dogfood-conventions artifacts (the `pipeline.milestones` mirror, omitted `deployment` key) whose creation is documented only in prose (journal payload notes), plus prose (decision/decision/milestone/loop-back wording, S9.record enumeration, declared_at) that was never journaled. A semantically complete, pipeline-correct rebuild IS achieved (all statuses/counts/ids/flags/structure correct; the run then correctly reaches branch e). Byte-identity would require either (a) journaling decision/milestone prose at capture time, or (b) a rebuild that also mines the bundle mirrors (DECISIONS.md/MILESTONES.md) AND tolerates the pre-conventions anomalies — neither is in the skill text. The reconstruction report discloses every gap loudly, per the skill's degradation rules.

### 3.5 Check d/e — journal discipline and file deltas (Scenario X)

- Journal: 111 lines, seq 1–111 **continuous**. Events appended by the procedure: exactly `[resume @ 111]` with `state_rebuilt: true` + untranslatable count (0 events untranslatable; 4 answer texts unrecoverable, disclosed in payload notes). No other events.
- Pre-corruption vs post-execution sha256 (`evidence/sha-run-X-pre-corruption.txt` → `sha-run-X-post.txt`): **exactly 2 of 32 files changed** = `.lvp/state.json` (rebuilt — legitimately written by Step 2b item 1) and `.lvp/journal.ndjson` (+1 resume line). All 30 other files — including all 21 bundle files, all 8 section records, HANDOFF artifacts — sha-identical.

**Verdict: PASS (d and e).**

---

## 4. Findings about the skill (beyond the checklist)

1. **Rebuild durability hole (new, concrete):** answer verbatim text is not journaled (`answer_recorded` payloads carry only id + skipped). For this fixture, 3 answers' text (S0.q2, S0.q3, S4.q14) plus S0.q1's question text are unrecoverable from ANY disk surface, and S1.q9's folded-back text is drifted (record mutated after its checkpoint). The skill handles this loudly (report + re-state request), but "a session that dies loses nothing but the current question" (principle 10) is weaker than it reads: a corrupted state loses verbatim text the journal cannot restore. Journaling the q/a text in `answer_recorded` payloads (or hashing state into the journal) would close it.
2. **Rebuild vs byte-identity:** see §3.4 — the rebuild path restores semantics, not bytes, and cannot for this fixture. If byte-restoration is the intent, the skill needs either journaled prose or explicit license to mine bundle mirrors + tolerate pre-conventions anomalies.
3. **verify-06 inconsistency (prior round, not the skill):** its run-B2 kept the anachronistic `S8-milestones.md` record yet reported "0 answers" — skipping its own fold-back rule. My Scenario R removes that record (documented deviation) precisely so the literal fold-back does not redirect the scenario.
4. **Branch coverage confirmed fixed:** Step 5e's heading is now `### e. Bundled (\`handoff\` done), building, or complete` — the "bundled + handoff done" hole that verify-06 §7 confirmed is closed in the current skill; Scenario X lands on it.
5. **S10 boundary ambiguity (minor):** the rebuild table's "current_section = the next Section in conventions §5 order" is ambiguous after S9 (`section_done S9`); §5 lists S10 but "out of v0 scope". I kept "S9" (matches the fixture's own terminal behavior and verify-06's "no not-done Section exists in terminal states" reading). A one-line clarification would remove the ambiguity.
6. **S0 record gap (minor):** the S0 record template holds idea + metadata but not the S0.q1–q3 question/confirmation texts; any rebuild of S0 answers will have null text. Inherited from finding 1.

## 5. Repo untouched — proof (check f)

- Full repo re-hash after ALL executions: `evidence/repo-baseline-all.txt` vs `evidence/repo-after-all.txt` — **diff empty, 23,798 files byte-identical**.
- `git status --porcelain` → empty (0 lines), before and after.
- Repo skill file vs installed skill file: identical before and after.
- Dogfood fixture post-run: `state.json` `21d5c437…`, `journal.ndjson` `7fd4a27e…` — unchanged from baseline.

## 6. File inventory

- `/tmp/lvp-e2e-2/REPORT.md` — this report.
- `/tmp/lvp-e2e-2/run-R/` — Scenario R fixture post-execution (9 files; 1 changed vs pre-execution snapshot).
- `/tmp/lvp-e2e-2/run-X/` — Scenario X fixture post-execution (32 files; 2 changed vs pre-corruption snapshot).
- `/tmp/lvp-e2e-2/snapshots/` — pristine/pre/post state + journal copies (`run-R-state-pristine.json`, `run-R-state-pre.json`, `run-R-journal-pre.ndjson`, `run-R-journal-pristine.ndjson`, `run-X-state-pre-corruption.json`, `run-X-state-corrupted.json`).
- `/tmp/lvp-e2e-2/evidence/` — sha manifests (`sha-run-R-pristine.txt`, `sha-run-R-pre.txt`, `sha-run-R-post.txt`, `sha-run-X-pre-corruption.txt`, `sha-run-X-corrupted.txt`, `sha-run-X-rebuilt.txt`, `sha-run-X-post.txt`, `repo-baseline-all.txt`, `repo-after-all.txt`, `run-X-semantic-diff.txt`, `rebuild-notes.txt`).
- `/tmp/lvp-e2e-2/rebuild-replay.py` — the Scenario X replay implementation (auditable; every non-journal source documented in its header and in §3).
