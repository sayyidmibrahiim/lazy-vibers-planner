# Verification report — ticket 16, Decision G1 + G3 (payload `answer_recorded` q/a + `decisions[]` rebuild source)

Tester: black-box verifier consuming the skills naively — literal walk of Steps 1–5 exactly as a harness agent would, against fixture copies. Date: 2026-11-14.
Workspace (all writes here): `/tmp/lvp-verify-g1g3/`. Repo: READ-ONLY during execution; the only repo file written by this round is this report.
Skill under test: WORKING TREE `skills/lvp-continue/SKILL.md` + `skills/lvp-init-new-idea/SKILL.md` + `skills/lvp-conventions.md` + `docs/spec/01-state.md` (not installed copies).
Fixture: `.scratch/lvp-core/dogfood/run` (pristine: state sha `21d5c437…` 34,761 B, journal 110 lines sha `7fd4a27e…`, 50 answers — 1 skipped S7.q1 — 21 decisions, post-handoff). Never modified; every scenario works on a `cp -a` copy.
Method: the Step 2b effect table implemented 1:1 by an auditable replay engine (`/tmp/lvp-verify-g1g3/tools/replay.mjs`, reads only the run folder + the skill's own references + `docs/spec/05-boosters.md` for the booster fallback arm — never a healthy snapshot), with Steps 1, 2b-report, 3, 4, 5 executed as the agent (transcripts in `evidence/w*-transcript.md`). Same two simulated elements as every prior round, reused deliberately: no live user (each run terminates at the Step 5 offer) and current tier = T1 from session context.
ERRATA.md compliance: no anachronistic record kept anywhere (fixture is post-handoff; nothing synthesized mid-S8); the rebuild contract is judged as **semantic equivalence + loud report**, never byte-identity; the bundled+handoff-done branch (5e) is the fixed text and matched in every run.

## 0. Verdict summary

| Scenario | Verdict | One line |
|---|---|---|
| W1 — new-format payload carries q/a (gains test) | **PASS 6/6** | Rebuilt q/a = payload text for all payload-text answers incl. all 5 planted (S1.q9 → ORIGINAL capture, beating the L-01-mutated record); S0.q1–q3 + S4.q14 recovered; 0 unrecoverable; 0 re-ask; report names the payload as source; discipline intact. |
| W2 — legacy journal (backward-compat) | **PASS 5/5** | Behavior identical to the pre-fix era: 46 answers folded from records (44/50 byte-verbatim), same 4 unrecoverable texts reported loudly, "absent or unreadable" rule fires exactly as before; 0 unreadable events; 47-field semantic diff = same 12 classes as `report-corrupt-rebuild.md`. |
| W3 — mixed journal (per-answer fallback) | **PASS 3/3** | Source routing correct per answer (10 payload / 39 record / 1 unrecoverable-loud), no crash, report states the mixed sourcing loudly. |
| W4 — decisions[] source (G3) | **PASS 6/6** | (a) mirror source + D-011 = post-L-01 mirror text; (a') mirror/records divergence reported loudly; (a'') missing-from-both reported unrecoverable loudly; (b) pre-bundle records source; parity 21/21 ids + statuses (+ sections); 20/21 texts differ in wording only. |
| W5 — journal discipline (all runs) | **PASS 7/7** | Per run: only `resume` @ 111 (`state_rebuilt: true` + untranslatable count), seq 1–111 continuous, first 110 lines sha-identical, all types ∈ conventions §3, zero re-ask events; non-target files untouched. |
| W6 — repo-level sync + lint | **PASS 4/4** | Conventions source + all 7 mirrors byte-identical (8/8 copies); `npm run lint` exit 0; "Two things" gone, `answer_recorded` row qualified with the fallback, "absent or unreadable" shipped; `git status` = the 12 fixer files + 1 pre-existing untracked grilling note + this report. |

**Overall: 6/6 scenarios PASS (31/31 checks). No failures. Interpretation choices are documented in §7 — none of them contradicts the shipped text.**

## 1. W1 — payload carries text; payload WINS over the record (gains test)

**Setup** (`runs/w1`): journal synthesized to the decided G1 payload shape `{section, answer_id, q, a, skipped}` on all 50 `answer_recorded` events — q/a from the pristine state's stored captures (what a real post-G1 init engine journals at capture time), `a` = null for skipped S7.q1; everything else byte-identical (110 events, same ts/seq). Five answers planted with text ≠ Section Record line: **S1.q9** (payload = original capture; the S1 record was mutated inline by L-01), **S4.q14** (record does not hold the line at all), and S2.q5 / S3.q7 / S7.q2 (payload `a` = record text + literal `[journal-capture]` suffix). State truncated at 17,000 B (corrupted sha `d3fbd678…`, parse fails) → Step 2b.

**Payload-wins proof (3 of the 5 planted, full data in `evidence/w1-semantic-diff.json`):**

| id | payload (planted) | Section Record line | rebuilt state |
|---|---|---|---|
| S1.q9 (`a`, from char 145) | `Di sisi saya, jadwal Sabtu itu langsung terkunci…` (original capture) | `*(dikoreksi lewat loop-back L-01, 2026-11-07: versi pertama = transfer manual + konfirmasi admin — D-011, S4.q14; "onlin…` (mutated inline) | **= payload (original capture)** — NOT the mutated record |
| S4.q14 (`q`/`a`) | verbatim capture (`Loop-back L-01: catatan awal menulis pemain 'bayar DP 30% online'…` / `Oh iya, yang penting DP-nya kecatat…`) | **absent** from the S4 record | **= payload** (fully recovered) |
| S7.q2 (`a`) | `Ya, ini dia versi pertamanya. Kunci. [journal-capture]` | `Ya, ini dia versi pertamanya. Kunci.` | **= payload (marker present)** |

S2.q5 / S3.q7: same marker result (rebuilt `a` ends with `[journal-capture]`, record does not contain it).

**Criteria:** rebuilt q/a = payload for 50/50 q and 49/50 a (the one exception is skipped S7.q1 whose payload `a` is null — see §7.1); 0 unrecoverable; S0.q1–q3 and S4.q14 rebuilt byte-equal to the pristine captures — **not** reported missing; 0 untranslatable; 0 re-ask (no interview events appended; Step 5 landed on **`### e. Bundled (\`handoff\` done), building, or complete`** — pointers only); report says "teks q/a diambil verbatim dari payload jurnal". Semantic diff vs pristine = **41 fields, all traceable**: the 3 planted markers + the 7 documented structural classes (current_section S10, S6.answers omitted, S9.record payload short form, loop-back reason journal short form, `pipeline.milestones` mirror omitted, `declared_at` = event ts, `deployment` null per §2) + 19 decision rationales (mirror wording) + 12 milestone fields (record Goal wording + §2 `verified` keys) — **zero unintended answer-text divergence**. shas: synthesized journal (first 110) `4b7bc1ec…` unchanged pre/post; rebuilt state `8fac9e32…`; 29/29 non-target files identical.

## 2. W2 — legacy journal replays unchanged (backward-compat)

**Setup** (`runs/w2`): pristine copy, journal untouched (legacy payloads `{section, answer_id, skipped}`), state truncated (`d3fbd678…`).

**Criteria:** every legacy payload folded q/a from its own Section Record line — 46 answers record-sourced (44/50 byte-verbatim to pristine; drift only S1.q9.a = L-01-mutated record line, S8.q1.q = record paraphrase — the same two fields as the pre-fix era), S0.q1.a recovered from the record's Idea (verbatim) block; unrecoverable set = exactly the 4 legacy-era texts (S0.q1.q, S0.q2.q/a, S0.q3.q/a, S4.q14.q/a) reported loudly per the new "absent or unreadable → record → loud" chain; 0 unreadable/untranslatable events; journal discipline intact (first 110 sha `7fd4a27e…` unchanged; only `resume` @ 111). Semantic diff vs pristine: **47 fields, same 12 classes as `report-corrupt-rebuild.md` §2** (same count as that round's 47) — contract is semantic equivalence + loud report (ERRATA §2), not byte-identity. Rebuilt state sha `d48691d1…`.

## 3. W3 — mixed journal, per-answer fallback

**Setup** (`runs/w3`): 10 payloads new-format (S0.q1–q3, S1.q1, S1.q2, S2.q3, S3.q5, S4.q1, S5.q1, S7.q2 — S7.q2 also carries the planted marker, same set as W1), 40 left legacy (incl. S1.q9, S4.q14). State truncated.

**Criteria:** per-answer source routing exact, 0 mismatches vs plan: 10 payload-sourced, 39 record-folded (incl. S1.q9 → mutated record line, S8.q1 → record paraphrase), 1 unrecoverable-loud (S4.q14 — legacy payload + record lacks the line); no crash; decisions 21 from mirror; report names both sources ("untuk 10 jawaban … dari payload jurnal; untuk 39 jawaban lain … dilipat dari catatan") and the fallback loudly. Journal (first 110) sha `d67b338c…` unchanged; rebuilt state sha `6a3fe05d…`; semantic diff 43 fields, every one traceable (5 answer fields incl. the planted marker + 7 structural + 19 decisions + 12 milestones).

## 4. W4 — `decisions[]` rebuild source (G3)

All runs: pristine legacy journal + truncated state (the Decisions bullet governs; no decision event exists). Steps 3–5 identical to W2 (branch e).

**(a) Post-bundle** (`runs/w4a`, bundle present): decisions rebuilt from **DECISIONS.md** — 21/21. **D-011** rationale = the MIRROR text ("…the tension was resolved aloud in S4.q14 via loop-back L-01: recorded DP + proof upload + confirm button is enough for v1") and does NOT contain the pre-L-01 state wording ("FLAG for S5/S6…") — the mirror is fresher than state, exactly as the decision says. `section` per decision taken from the records' own decision lines (the mirror has no section column; see §7.4).

**(a') Precedence divergence** (`runs/w4a2`, D-021 row removed from DECISIONS.md by synthesis): mirror yields 20; the S8 record still holds the D-021 decision line → the bullet's parity claim ("ids and statuses are the same in both sources") visibly violated → **reported loudly, not silently dropped** (report carries an explicit warning naming D-021, S8, and the violated parity claim); rebuilt state keeps mirror precedence (20 decisions), no crash.

**(a'') Missing from both surfaces** (`runs/w4a3`, D-021 removed from mirror AND from the S8 record's decision block): detected via the records' prose references (S8 "Order note… (see D-021)") with no decision line and no mirror row → **D-021 reported unrecoverable loudly** ("tidak dapat dipulihkan"), matching the bullet verbatim. On the clean fixture this detector fires 0 times (all 21 referenced ids have decision lines) — no false positives.

**(b) Pre-bundle** (`runs/w4b`, all 22 bundle files removed — 16 root + SPEC/ 5 + HANDOFF-PROMPT.md — `.lvp/` intact): decisions rebuilt from **the Section Records' decision lines** — 21/21; booster licenses correctly fell back to the `05-boosters.md` core table (9/9, incl. "agents.md spec" → "(spec text, permissive)"); milestones from the S8 record; unrecoverable answers = the legacy-era 4. Step 5 still matches branch e (status/handoff-driven).

**(a) vs (b) parity (measured):** ids **21/21**, statuses **21/21**, sections 21/21, no only-a/only-b; **text: 20 of 21 differ in wording** (only D-010 byte-equal; summary+rationale compared combined), substance equivalent — mirror = compiled wording, records = section-level lines. Expected per the decision text ("texts may differ in wording").

Rebuilt state shas: w4a `d48691d1…` (byte-identical to W2's rebuild — same inputs, deterministic), w4a2/w4a3 `64d8578f…`, w4b `2efab673…`.

## 5. W5 — journal discipline (all 7 runs)

| Run | lines | seq 1–111 continuous | first 110 sha unchanged vs own pre | appended | payload has `state_rebuilt:true` + untranslatable | types documented | re-ask events |
|---|---|---|---|---|---|---|---|
| w1 | 111 | ✓ | ✓ (`4b7bc1ec…` = synthesized pre) | `resume`@111 | ✓ | ✓ | 0 |
| w2 | 111 | ✓ | ✓ (`7fd4a27e…` pristine) | `resume`@111 | ✓ | ✓ | 0 |
| w3 | 111 | ✓ | ✓ (`d67b338c…` mixed pre) | `resume`@111 | ✓ | ✓ | 0 |
| w4a / w4a2 / w4a3 | 111 | ✓ | ✓ (`7fd4a27e…` pristine) | `resume`@111 | ✓ | ✓ | 0 |
| w4b | 111 | ✓ | ✓ (`7fd4a27e…` pristine) | `resume`@111 | ✓ | ✓ | 0 |

Non-target files: in every run exactly `state.json` (rebuilt) + `journal.ndjson` (+1 line) changed vs that run's pre-execution manifest (plus the intentionally synthesized DECISIONS.md / S8 record in w4a2/w4a3). Evidence: `evidence/w5-first110.txt`, `w5-journal-discipline.json`, `sha-w*-pre/post.txt`.

## 6. W6 — repo-level sync, lint, greps, status

- **Snapshot sync**: `cmp` `skills/lvp-conventions.md` vs every `skills/*/references/conventions.md` — **7/7 mirrors byte-identical** (7 mirrors + 1 source = 8/8 copies repo-wide identical; there are 7 mirror files, not 8 — the brief's "8/8" counts the source).
- **`npm run lint`**: exit **0**.
- **Greps**: "Two things" → 0 hits in `skills/` + `docs/`; "Three things" → exactly 1 (SKILL.md:72); the `answer_recorded` row (SKILL.md:57) now reads "q/a verbatim from the payload **when it carries the text**; a legacy payload without q/a text folds q/a from the answer's own Section Record line" — the "from the payload" claim is qualified with the fallback; the unrecoverable rule (SKILL.md:78) uses "absent or unreadable"; the payload contract (`q` as asked, `a` verbatim/null-when-skipped, legacy-replayability) is present in `docs/spec/01-state.md` §3 and `skills/lvp-conventions.md` §3 (and mirrors), and the init skill writes the new payload (`skills/lvp-init-new-idea/SKILL.md` step 3).
- **`git status --porcelain`**: the 12 fixer-modified files (12 × ` M`, matching `git diff --stat`: ticket file, `docs/spec/01-state.md`, `skills/lvp-continue/SKILL.md`, `skills/lvp-init-new-idea/SKILL.md`, `skills/lvp-conventions.md` + 7 `references/conventions.md` mirrors) + 1 untracked `.scratch/g1-g3-grilling-handoff.md` (pre-existing from the grilling session — present in the baseline before any verifier work) + this report (`??`). Nothing else appeared during the round.

## 7. Interpretation choices (documented, none contradicts the shipped text)

1. **Skipped answer's `a`**: payload `a` = null (the G1 contract for skipped) is treated as "text absent" per the rebuild row's own trigger wording ("when it carries the text" / "absent or unreadable") → folded from the record ("Skip dulu deh."), `skipped` stays true. Alternative reading (null stays null) would need text the skill doesn't have.
2. **Mirror/records divergence loudness** (W4a'): the bullet mandates loud reporting only for "missing from both surfaces"; the divergence warning is the literal application of the bullet's parity assertion + the Never list's "Never degrade silently". Reported as PASS with this rationale spelled out.
3. **Missing-from-both detection route** (W4a''): with no decision line and no mirror row, the only disk evidence is prose references (S8 "Order note… (see D-021)") — the route a literal rebuild can take; zero false positives on the clean fixture.
4. **`section` for mirror-sourced decisions**: the mirror carries no section column; taken from the records' own decision lines (ids unambiguous). Not spelled out by the text; consistent with "ids and statuses are the same in both sources".
5. **`current_section` after S9 done** rebuilds to **S10** (effect-row literal: "the next Section in conventions §5 order"; matches the G10 terminal-repair rule) — a known, harmless divergence class vs the healthy S9 (same class as `report-corrupt-rebuild.md` class 2).
6. Simulated elements (no user; T1) reused deliberately from prior rounds so results stay comparable.

## 8. Evidence inventory (`/tmp/lvp-verify-g1g3/`)

- `tools/replay.mjs` (literal Step 2b engine, final version re-certified: clean fixture rebuilds byte-identical state `d48691d1…` before/after the last engine edit), `tools/synth_journal.mjs`, `tools/compare_state.mjs` (verifier-only diff).
- `evidence/`: `w1..w4 transcripts.md`, `w1/w2/w3-semantic-diff.json` (41/47/43 fields), `w1/w3-synth.json` (planted sets), `sha-w*-pre/post.txt` (32-file manifests per phase), `w5-first110.txt`, `w5-journal-discipline.json`, `w*-replay-stdout.json`, `repo-worktree-sha-baseline/after.txt` (150 git-visible files, `b4c1a462…` — byte-equal before/after ALL executions), `fixture-tree-sha-baseline/after.txt` (`a5eb38d0…` — dogfood fixture untouched), `git-status-baseline/after.txt` (identical), `lint-output.txt` (exit 0).
- `snapshots/`: per-scenario pristine/corrupted state + pre-execution journals (`w1 4b7bc1ec…`, `w2/w4* 7fd4a27e…`, `w3 d67b338c…`; corrupted state `d3fbd678…` everywhere).
- `runs/w1, w2, w3, w4a, w4a2, w4a3, w4b` — post-execution fixture copies.
