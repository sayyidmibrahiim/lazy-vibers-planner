# Verification report — ticket 17 fixes (D17-1 … D17-9)

Tester: black-box verifier consuming the skills naively — literal walk of Steps 1–5 exactly as a harness agent would, against fixture copies. Date: 2026-11-14.
Workspace (all writes here): `/tmp/lvp-verify-17/`. Repo: READ-ONLY during execution; the only repo file written by this round is this report.
Skill under test: WORKING TREE `skills/lvp-continue/SKILL.md` + `skills/lvp-init-new-idea/SKILL.md` + `skills/lvp-conventions.md` (+ 7 mirrors) + `docs/spec/01-state.md` — the 12-file uncommitted diff for ticket 17.
Fixture: `.scratch/lvp-core/dogfood/run` — verified pristine before anything ran (state sha256 `21d5c437…` 34,761 B, journal 110 lines sha256 `7fd4a27e…`, byte-identical to the previous round's snapshots; 32-file tree aggregate `a5eb38d0…`). Never modified; every scenario works on a `cp -a` copy.
Method: identical to `report-ticket16-g1g3.md` — the Step 2b effect table implemented 1:1 by an auditable replay engine (`tools/replay.mjs` v2, updated for the ticket-17 text: D17-5 metadata sources, D17-8 booster mapping + loud context note, D17-9 MAY backup; reads only the run folder + the skill's own references + `docs/spec/05-boosters.md` for the booster fallback arm, never a healthy snapshot), Step 2a 1:1 by `tools/healthy-walk.mjs`, with Steps 1, 3, 4, 5 executed as the agent (transcripts + reconstruction reports in `evidence/w17-transcripts.md`). ERRATA.md compliance: no anachronistic record anywhere (vA keeps S8's record because S8 is done and removes HANDOFF-PROMPT.md because the handoff never ran; f2 is a real mid-S9 crash shape); contract judged as semantic equivalence + loud report, never byte-identity.

## 0. Verdict summary

| Scenario | Decision(s) | Verdict | One line |
|---|---|---|---|
| V-A — branch-c arm "bundle absent, S9 never started" | D17-4 | **PASS** | Position reverted anachronism-free (S0–S8 done, S9 no entry, status review, scope locked, journal truncated at 85); Step 5 matched `### c. Scope locked, S9 not \`done\` (bundle absent, partial, or fully written but S9 unclosed)`; offer = finish generation (S9) listing exactly the 21 §8 files (HANDOFF-PROMPT.md correctly absent from the list); journal discipline intact (+1 `resume` @86, first 85 byte-identical). |
| V-B — booster mapping pin + edge case | D17-8 | **PASS** | (a) pristine-journal replay: 9/9 `installed` from `booster_check` present ×9 (last event per booster = its sweep check, seq 4–12); loud context note from OVERVIEW.md § Limitations + CAPABILITIES.md added, statuses NOT changed. (b) edge case: synthetic late `booster_check` (seq 111, present) after a degraded-carrying old state → rebuilt `installed` (journal wins, journal-only replay), context note loud. |
| V-C — corrupt backup MAY | D17-9 | **PASS** | Rule text verbatim in SKILL.md:84 + spec 01:111 + conventions §9 (and 7/7 mirrors cmp-identical); backup-writing execution wrote exactly 1 `.lvp/state.corrupt-2026-11-14.json` (bytes = the corrupt file, sha-matched) and the reconstruction report names it; the `--no-backup` execution (h1) is contract-valid with write set = state + journal; canonical write set held in all 8 runs. |
| V-D — metadata sources | D17-5 | **PASS** | (a) bundle present: `name` = OVERVIEW.md H1 → "Futsal Court Booking" (template suffix stripped per templates.md §2), `created_at` = ts of `section_start` S0 @ seq 13 (2026-11-07T08:03:22Z), slug/idea_raw/user_language from the S0 record. (b) precedence proven: H1 renamed to "Futsal Court Booking Pro" → rebuilt name = the H1, beating the S0 record. (c) bundle absent: name falls back to the S0 record's display name. |
| V-E — init loop-back closure reconcile | D17-6 | **PASS** | Text: `grep "recorded state answers" skills/` = 0 hits; init step 3 closure now records-only + "the state answers keep their capture-time text (journal + state preserve the original answer; the corrected wording lives in the record)"; `loop_back_closed` payload touched-records intact. Fixture: legacy replay folds S1.q9.a from the L-01-corrected record (b1); new-format payload carrying the original capture beats the record (h1) — G1 behavior not regressed. |
| V-F — empty bundle file | D17-1 | **PASS** (branch-c window; scope note below) | f2 (mid-S9 crash, SCOPE.md a 0-byte in-flight write, 8 files not yet generated): branch c matched ("partial" arm); SCOPE.md counted as *missing required structure* and offered as remaining work — never existing-and-skipped; the 12 complete files skipped. Note: the brief's literal synthesis (f1, post-bundle copy) reaches branch e, where no shipped-text step surfaces a 0-byte file — D17-1 pinned the rule in branch c only; recorded as a scope observation, not a contract violation. |
| V-G — text pins | D17-2, D17-3, D17-7 | **PASS** | repair-rides-resume sentence verbatim at SKILL.md:46 (Step 2a); build-events row carries "(status transitions per the row above)" (SKILL.md:67); decisions bullet = "compiled at S9 from the post-loop-back records" (SKILL.md:78); "maintained through loop-back" = 0 hits repo-wide. |
| V-H — regressions (W1/W2 core) | (ticket-16 G1/G3 contract) | **PASS** | (a) new-format journal, 3 plants differing from records → 49 payload + 1 mixed (skipped S7.q1, prior-round interpretation) + 0 unrecoverable; payload beat the record on all 3 (S1.q9 original capture, S4.q14 recovered, S7.q2 `[journal-capture]` marker). (b) legacy journal → 46 record-folded, the same 4 unrecoverable texts loud (7 fields), rebuilt state byte-identical to the prior round's certified W2 rebuild (sha `d48691d1…`). |
| V-I — repo-level | — | **PASS** | conventions source vs 7 mirrors cmp 7/7 identical; `npm run lint` exit 0; `git status --porcelain` = exactly the 12 fixer files during execution; full worktree byte-equal before/after ALL executions (aggregate `5ed07fc5…`, 153 tracked files); dogfood fixture byte-equal (`a5eb38d0…`). |

**Overall: 9/9 scenario groups PASS. No contract violations found. Two interpretation/caveat notes (§7) are documented loudly; neither contradicts the shipped text.**

## 1. V-A — D17-4 (branch-c arm exercised; no text change was needed)

Synthesis (evidence/synth-vA.json): 22 bundle files removed (21 §8 files + HANDOFF-PROMPT.md — the handoff never ran, so that file cannot exist without an anachronism); state = healthy edited (S9 entry deleted, `project.status` "review", `handoff` null; S8's answer kept — S8 done ⇒ its record exists); journal truncated to 85 lines = seq(`section_start` S9)=86 − 1 (the parenthetical rule; all 21 `doc_generated` events ≥ 87 leave with the bundle files, so journal and disk agree).

Walk (full transcript in evidence/w17-transcripts.md): Step 2a healthy (0 repairs fired — current_section "S9" agrees with the first not-done Section, every answer present, scope derived) → Step 3 T1=T1 → Step 4 summary + `resume` @86 (payload: position + tier-check) → Step 5 branch c.

- **Branch heading matched verbatim**: `### c. Scope locked, S9 not \`done\` (bundle absent, partial, or fully written but S9 unclosed)`. Branch b correctly does not fire (the current Section is S9, not an S0–S8 section); d and e correctly do not.
- **Offer**: finish generation (S9), remaining files per conventions §8 — all 21: AGENTS.md, OVERVIEW.md, DECISIONS.md, SPEC/prd.md, SPEC/requirements.md, SPEC/data-model.md, SPEC/api.md, SPEC/architecture.md, USER_FLOWS.md, CODE_STYLE.md, SECURITY.md, RESEARCH.md, SCOPE.md, MILESTONES.md, VERIFICATION.md, ASSUMPTIONS.md, HANDOVER.md, CAPABILITIES.md, blueprint.json, CLAUDE.md + GEMINI.md. HANDOFF-PROMPT.md NOT offered (not a §8 file). Not another offer.
- **Journal discipline**: 85 → 86 lines; first 85 byte-identical (sha `60714a7e…` = the synthesized pre-execution journal); seq 1–86 continuous; +1 `resume`; no state write (0 repairs — the repair state-write rides the `resume` append only when a repair fired).
- **Interpretation note (loud)**: `current_section` stays "S9" — the healthy state's value, and the value a literal replay of the truncated journal produces (`section_done` S8 → next Section). The fixer's "current_section S9? TIDAK" is honored in the sense that S9 never started (no entry, not in progress — the field is the not-yet-started pointer); branch selection is identical either way.

## 2. V-B — D17-8 (booster status mapping pinned; the lottery is closed)

**(a) Fixture replay (run b1)**: pristine journal (110 events; `booster_check` result=present ×9 @ seq 4–12, one per core booster), state truncated. Last journaled event per booster = its sweep check → `present` maps to `installed` (the only enum-legal mapping) → **9/9 `installed`** (licenses from CAPABILITIES.md; never-mentioned set empty). The reconstruction report carries the **loud context note** — sources: OVERVIEW.md § Limitations ("recorded as present but were not actually loaded (a simulation in this test run)") + CAPABILITIES.md ("all nine were recorded as present but ran as a simulation") — and statuses are NOT changed. The wild run's 9/9-`degraded` reading is now impossible under the shipped text: bundle documents may annotate, never override.

**(b) Edge case (run b2)**: synthetic journal = pristine + ONE late event `{"seq":111,"type":"booster_check","payload":{"name":"agents.md spec","result":"present"}}` — now the LAST journaled event for that booster; the state (before corruption) carried `boosters.core["agents.md spec"].status = "degraded"` (the present-but-unloadable shape), then truncated → journal-only replay. Rebuilt: **agents.md spec = `installed`; 9/9 installed** — the stale `degraded` never enters a journal-only replay; the journal wins, exactly the D17-8 contract ("kontrak memang begitu"). The loud context note is present (the "present-but-unloadable" story itself is what Limitations/CAPABILITIES describe) without touching the status. Evidence detail: the rebuilt b2 state is byte-identical to b1's (`d48691d1…`) — the degraded value provably did not leak through any channel.

## 3. V-C — D17-9 (corrupt backup = documented MAY; canonical write set intact)

- **Text pins (verbatim)**:
  - `skills/lvp-continue/SKILL.md:84`: "Before writing it, the corrupt file MAY be preserved once as `.lvp/state.corrupt-<date>.json`; when present, name it in the reconstruction report. The backup is not part of the canonical write set."
  - `docs/spec/01-state.md:111`: "A rebuild may preserve the corrupt state file once as `.lvp/state.corrupt-<date>.json` before overwriting; it is not part of the canonical write set."
  - `skills/lvp-conventions.md:204` (§9): "…the corrupt file MAY be preserved once as `.lvp/state.corrupt-<date>.json` (not part of the canonical write set)." — and all 7 mirrors byte-identical (cmp 7/7).
- **Backup-writing arm** (b1, b2, d2, d3, f1, f2): each execution wrote **exactly 1** `.lvp/state.corrupt-2026-11-14.json` (sha = that run's corrupt state: b1 `d3fbd678…`, b2 `ff419fa3…` — the degraded-carrying state; 17,000–17,104 B), named in the reconstruction report ("Cadangan state rusak: .lvp/state.corrupt-2026-11-14.json").
- **No-backup arm** (h1, `--no-backup`): write set = `state.json` (rebuilt) + `journal.ndjson` (+1) only — contract-valid; the report names no backup. MAY = optional, both arms exercised.
- **Canonical write set held everywhere**: per-run pre/post 32-file manifests show exactly `state.json` (rebuilt) + `journal.ndjson` (+1 line) + at most the 1 backup — nothing else (evidence/manifest-*-pre/post.txt).

## 4. V-D — D17-5 (metadata sources pinned without a new event type)

| Run | Bundle | OVERVIEW.md H1 | Rebuilt `project.name` | Source recorded by the walk |
|---|---|---|---|---|
| b1 | present | `# Futsal Court Booking — plain-language overview` | **Futsal Court Booking** | OVERVIEW.md H1 (template suffix stripped per `references/bundle/templates.md` §2 `# <Display name> — plain-language overview`) |
| d2 | present, H1 renamed to `# Futsal Court Booking Pro — plain-language overview` | …Booking Pro… | **Futsal Court Booking Pro** | the H1 — **beats the S0 record's "Futsal Court Booking"** (precedence proven) |
| d3 | absent | — | **Futsal Court Booking** | S0 record display name (fallback arm) |

- **`created_at`** = ts of the `section_start` S0 event (seq 13 → `2026-11-07T08:03:22Z`) in every replay run — "bukan nilai lain": the only journal source; in this fixture it equals the healthy state's value (D17-5's own note: the residual never bit here; the rule is forward-looking).
- **`slug` / `idea_raw` / `user_language`** from the S0 record (verbatim Idea block, 238 chars; `futsal-court-booking`; `id`) in every replay run — d3 (bundle absent) included, so the S0-record sources are proven independent of the bundle.
- **Init-side guarantee pinned** (`skills/lvp-init-new-idea/SKILL.md:596`): "Any branding rename applies to `project.name` in state **before** the bundle is compiled, so OVERVIEW.md always carries the final name." — the d2 shape (records keep the old name, bundle carries the final one) is exactly what this makes reachable.

## 5. V-E — D17-6 (init loop-back closure reconciled with the G1 contract)

- **Text-level**: `grep -rn "recorded state answers" skills/` → **0 hits** (was the tension source). `skills/lvp-init-new-idea/SKILL.md:422` step 3 now reads: "When closing, search the Section Records for claims the resolution overrides and update each one's affected content … records must never keep a claim the decisions have overridden; **the state answers keep their capture-time text (journal + state preserve the original answer; the corrected wording lives in the record)**; journal nothing extra (the `loop_back_closed` payload lists the touched records)." — the touched-records payload clause is intact.
- **Fixture-level (G1 not regressed)**:
  - Legacy replay (b1): rebuilt `S1.q9.a` = the **L-01-corrected record line** (contains "dikoreksi lewat loop-back L-01…") — the fold-from-record arm lands on the corrected record, exactly the D17-6 contract (the corrected wording lives in the record).
  - New-format payload (h1): `S1.q9` payload carries the original capture → **payload wins** over the mutated record — the state/journal-preserve-the-original side of the contract. Both arms behave per the reconciled text; the two sources keep their distinct roles.

## 6. V-F — D17-1 (0-byte bundle file = missing required structure)

- **f2 (branch-c window)**: anachronism-free mid-S9 crash — journal at 98 (`section_start` S9 @86, `doc_generated` AGENTS…RESEARCH @87–98; SCOPE.md's @99 never fired — in-flight write), disk = those 12 files + SCOPE.md 0-byte, 9 not-yet-generated §8 files + HANDOFF-PROMPT.md removed, state truncated → replay. Rebuilt: S9 in_progress, status review, scope locked → **branch c matched verbatim** ("partial" arm). Offer: finish generation (S9) — **SCOPE.md counted as *missing required structure*** (0-byte, conventions §7 truncation class) and offered as remaining work together with the 8 absent files; the 12 complete files skipped. Never "existing and skipped".
- **f1 (the brief's literal synthesis)**: post-bundle copy (S9 done, handoff done), SCOPE.md zeroed, state truncated → replay → branch e (pointers). **The 0-byte file is not surfaced by the offer or the reconstruction report on this arm**: the only shipped disk-structure check lives in branch c's body (SKILL.md:144), and the post-bundle position does not reach it; Step 2b's bundle accounting is journal-driven (`doc_generated` vs §8 = 21/21). Reported as-is: this is a scope observation about D17-1's pin (branch-c offer path only), not a contract violation — item 1's deliverable was precisely the branch-c text. If post-bundle walks should also flag empty bundle files, that is a NEW residual (no shipped text mandates it today).
- Text pin verified verbatim: SKILL.md:144 "…a 0-byte file, or a file missing the structure conventions §8 requires, counts as *missing required structure* — it is offered as remaining work (the same class as truncation recovery, conventions §7), never as existing-and-skipped."

## 7. V-G — D17-2 / D17-3 / D17-7 (text pins, verbatim)

- **D17-2** (`skills/lvp-continue/SKILL.md:46`, Step 2a): "The repair state-write rides the run's `resume` append (one checkpoint at resume) — conventions §3's \"every state mutation emits at least one event\" holds under this named interpretation." — exercised operationally in vA: 0 repairs → no state write, only the `resume` append (and the checkpoint discipline still holds: the write that does fire rides the append).
- **D17-3** (SKILL.md:67): the informational build-events row now reads "`build_started`, `milestone_started`, `milestone_failed`, `build_blocked`, `build_done` | informational **(status transitions per the row above)** — verification results are rebuilt from `VERIFICATION.md`, not from these events". The dual-listing ambiguity is closed; the replay arms for `build_started`/`build_done` remain unexercised (fixture is pre-build — as the ticket records).
- **D17-7** (SKILL.md:78): decisions bullet now reads "…the mirror is **compiled at S9 from the post-loop-back records**, so its wording is the freshest; rows are never rewritten after S9 (spec 04) — else from the decision lines in the Section Records…". `grep -rn "maintained through loop-back" skills/ docs/` → **0 hits**. Behavior unchanged and re-confirmed by b1/d3 (mirror vs records sources; 21/21 both ways).

## 8. V-H — regressions (ticket-16 G1/G3 contract re-checked on the new text)

- **(a) h1 — payload wins**: journal upgraded to the G1 payload format on all 50 answers (q/a = pristine captures; a=null for skipped S7.q1); 3 answers planted differing from their record: S1.q9 (original capture — record mutated inline by L-01), S4.q14 (record lacks the line), S7.q2 (capture + ` [journal-capture]` suffix). Rebuild: **49 payload-sourced + 1 mixed + 0 record-only; 0 unrecoverable**; all 3 plants prove payload-wins (S1.q9.a = original capture with no L-01 note; S4.q14 fully recovered; S7.q2.a carries the marker the record lacks). S7.q1: skipped, q from payload, a folded from the record ("Skip dulu deh.") — the same documented §7.1 interpretation as the prior round. Report names the payload as the source; branch e; journal discipline intact.
- **(b) b1 — legacy journal**: 46 answers record-folded (44/50 byte-verbatim to pristine; drift only S1.q9.a = the L-01-corrected record line — which is now the D17-6-expected value — and S8.q1.q = record paraphrase), S0.q1.a from the Idea-verbatim block, unrecoverable = exactly the 4 legacy-era texts (7 fields) reported loudly; **rebuilt state sha `d48691d1…` = byte-identical to the prior round's certified W2/W4a rebuilds**; d3 (bundle absent) = `2efab673…` = the prior round's W4b rebuild. Same divergence classes as `report-corrupt-rebuild.md`; semantic equivalence + loud report (ERRATA §2), never byte-identity.

## 9. V-I — repo-level sync, lint, status, untouched-during-execution proof

- **Snapshot sync**: `cmp` `skills/lvp-conventions.md` vs every `skills/*/references/conventions.md` — **7/7 identical** (7 mirrors + 1 source = 8 copies repo-wide; there are 7 mirror files, the brief's count "8/8" includes the source).
- **`npm run lint`**: exit **0** (evidence/lint-output.txt).
- **`git status --porcelain`** (execution phase, before this report): exactly the 12 fixer-modified files (`git diff --stat` match: ticket 17 file, `docs/spec/01-state.md`, `skills/lvp-continue/SKILL.md`, `skills/lvp-init-new-idea/SKILL.md`, `skills/lvp-conventions.md`, 7 mirrors). No untracked entries appeared during the round. This report is the round's only added file.
- **Full repo untouched during execution**: 153 tracked files hashed before and after ALL 8 scenario executions — aggregate `5ed07fc5…` byte-equal (evidence/repo-worktree-pre/post.txt + aggregates). Dogfood fixture byte-equal (32-file aggregate `a5eb38d0…`).

## 10. Journal discipline (all 8 runs)

| Run | pre → post lines | first-N byte-identical | seq | appended | payload |
|---|---|---|---|---|---|
| vA | 85 → 86 | ✓ (`60714a7e…`) | 1–86 ✓ | `resume` @86 | position + tier-check |
| b1 | 110 → 111 | ✓ (`7fd4a27e…`) | 1–111 ✓ | `resume` @111 | `state_rebuilt:true` + untranslatable 0 |
| b2 | 111 → 112 | ✓ (`e430450f…`) | 1–112 ✓ | `resume` @112 | same |
| d2 | 110 → 111 | ✓ (`7fd4a27e…`) | 1–111 ✓ | `resume` @111 | same |
| d3 | 110 → 111 | ✓ (`7fd4a27e…`) | 1–111 ✓ | `resume` @111 | same |
| f1 | 110 → 111 | ✓ (`7fd4a27e…`) | 1–111 ✓ | `resume` @111 | same |
| f2 | 98 → 99 | ✓ (`5c643dd7…`) | 1–99 ✓ | `resume` @99 | same |
| h1 | 110 → 111 | ✓ (`1cc8b55d…`) | 1–111 ✓ | `resume` @111 | same |

All event types ∈ conventions §3; 0 untranslatable events in any run; 0 re-ask events; non-target files untouched in every run (manifests).

## 11. Interpretation choices (documented; none contradicts the shipped text)

1. **vA `current_section` = "S9"** (kept; = what a replay of the truncated journal yields; S9 has no entry = not started). See §1.
2. **Name extraction from OVERVIEW.md** strips the template suffix " — plain-language overview" (pinned by `skills/lvp-init-new-idea/references/bundle/templates.md` §2). Without it the "H1" would carry the descriptor; the verifier expectation ("Futsal Court Booking") requires the template-derived strip, and it is deterministic.
3. **V-F ran two arms** because the brief's literal synthesis (post-bundle copy) cannot reach branch c; f2 is the verifier's anachronism-free branch-c-window construction. Both outcomes reported as-is (§6).
4. **Skipped answer's payload `a` = null** treated as "text absent" → folded from the record (identical to the prior round's documented choice).
5. **d3 keeps the full journal with the bundle deleted** — the prior round's W4b shape (post-handoff disk loss), not an anachronistic record.
6. Simulated elements (no live user; tier T1) reused deliberately from every prior round so results stay comparable.

## 12. Evidence inventory (`/tmp/lvp-verify-17/`)

- `tools/replay.mjs` (Step 2b engine v2 — ticket-17 text 1:1, incl. D17-5/8/9; deterministic: clean-input rebuilds byte-match the prior round's certified shas), `tools/healthy-walk.mjs` (Step 2a 1:1), `tools/synth.mjs` (anachronism-free synthesizers, modes va/b2/f2/h1), `tools/jdisc.mjs` (journal discipline), `tools/manifest.sh`.
- `evidence/`: `w17-transcripts.md` (per-run Step 1/2/3/4/5 walks + reconstruction reports + verbatim branch headings), `synth-*.json/txt` (synthesis manifests), `snapshots-pre.txt` + `snapshots-post-synth.txt` (per-run pre-execution shas), `manifest-*-pre/post.txt` (32-file manifests per run per phase — write-set proof), `facts-*.json` + `*-stdout.json` (engine output per run), `lint-output.txt` (exit 0), `repo-worktree-pre/post.txt` + aggregates (`5ed07fc5…` byte-equal), `fixture-pre/post.txt` (`a5eb38d0…` byte-equal), `git-status-pre/post.txt`.
- `runs/vA, b1, b2, d2, d3, f1, f2, h1` — post-execution fixture copies.
- Prior-round cross-checks: `/tmp/lvp-verify-g1g3/runs/w2/.lvp/state.json` = `d48691d1…` and `runs/w4b/.lvp/state.json` = `2efab673…` — byte-identical to this round's b1 and d3 rebuilds respectively.

## 13. Residuals observed (for triage; nothing blocking)

1. **Post-bundle 0-byte visibility** (from V-F f1): a post-handoff walk has no mandated bundle disk-structure check — a 0-byte bundle file created/destroyed after S9 closed is invisible to `/lvp-continue` (branch e = pointers). If that should surface, it is a new text change (branch e body or a Step 2b bundle note), outside D17-1's pinned scope.
2. The `build_started` → `building` / `build_done` → `complete` replay arms remain unexercised (fixture is pre-build; ticket already records this for the D17-3 row).
