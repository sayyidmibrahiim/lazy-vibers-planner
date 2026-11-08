---
name: lvp-continue
description: Resumes an interrupted, errored, or parked LVP project — rebuilds state.json from the journal when it is damaged, prints a plain progress summary in the user's language, and continues the current Section at the exact micro-batch boundary without re-asking any recorded answer. Use when the user wants to continue an existing LVP project (cwd or a given path), or after a crashed session, a context-guard stop, or a model change. Refuses with Folder Gate guidance when the target folder holds no LVP project.
---

# lvp-continue

The resume skill of the LVP pipeline. It picks up any interrupted or parked LVP project exactly where disk says it stopped: damaged state is rebuilt from the journal, progress is reported in plain language, and the right next action is offered. It is self-contained — everything it needs lives in this skill folder. Interview Sections resume into the `lvp-init-new-idea` skill's Section procedures when that skill is installed; without it, this skill still works in a loudly degraded mode (the fallback in Step 5b). LVP skills degrade loudly, never silently.

## Load first

Before any check, question, or file write:

1. Read `references/principles.md` (the Constitution). All 13 principles bind this skill — especially 10 (State discipline) and 13 (Disk is memory).
2. Read `references/conventions.md` (the operational manual). It owns the state schema (§2), journal event list (§3), Section map (§5), Folder Gate (§6), and tier tables (§7); the steps below reference it instead of repeating it.
3. Interact in the user's language from the first message. The messages below are the English source; translate them when speaking. Artifacts and stored values follow the conventions (English source of truth).

## Flow at a glance

1. **Locate** the project (path argument or cwd).
2. **Load or rebuild** the state (journal replay when damaged).
3. **Tier check** — cross-model resume rules.
4. **Progress summary** — plain language, User Language.
5. **Offer the right next action** and, on confirmation, resume into it.

Every step is idempotent: re-running `/lvp-continue` is always safe.

## Step 1 — Locate the project

`TARGET` = the optional path argument, else cwd. Look for `TARGET/.lvp/`.

- **No `.lvp/`** → say (English source): "There is no LVP project here. To start one, run `/lvp-init-new-idea` in an empty folder — or let its Folder Gate create a subfolder in a projects root. It will pick the right place." Nothing is written to disk (there is no journal here to record the refusal). Stop.
- **`.lvp/` exists but holds neither a readable `state.json` nor `journal.ndjson`** → same guidance, plus the loud warning (English source): "A `.lvp/` folder exists here, but it holds neither a readable state file nor a journal, so there is nothing to rebuild from." Treat as no project. Stop.
- Otherwise continue at Step 2.

## Step 2 — Load or rebuild the state

### 2a. Healthy state

`state.json` parses and matches the conventions §2 shape → load it, then run the consistency repairs:

- Section statuses win over `pipeline.current_section`. If they disagree, fix `current_section` (the first Section not `done`, in conventions §5 order) and say so in the summary.
- An answer present in a Section Record file but missing from state is folded back in from the record (records are raw material — never re-ask what a record holds). Say so in the summary.
- Scope lock has no v1 state field — derive it from the journal: scope is locked iff a `scope_locked` event exists and S7 is `done`. Do this here and in Step 5; do not invent a schema field.

### 2b. Damaged or missing state, journal present → rebuild by journal replay

Replay the whole journal in `seq` order onto a fresh state object (shape per conventions §2). Event effects:

| Journal event | Effect on the rebuilt state |
|---|---|
| `session_start`, `folder_gate_passed`, `folder_gate_subfolder_created` | project confirmed here; keep payload details for the report |
| `tier_declared`, `tier_changed` | `model_profile.tier` (+ `declared_at`) |
| `capability_probe_passed`, `capability_probe_failed` | `model_profile.probe` |
| `booster_check`, `booster_install_ok`, `booster_install_failed`, `booster_choice` | `boosters` statuses — the last event per booster wins; a core booster never mentioned → `missing`, flagged in the report |
| `section_start` | `sections[S] = { "status": "in_progress", "started_at": ... }`; `current_section` = S |
| `answer_recorded` | `sections[S].answers[<id>] = { q, a, skipped }` from the payload |
| `section_done` | `sections[S] = { "status": "done", "record": ..., "completed_at": ... }`; `current_section` = the next Section in conventions §5 order |
| `loop_back_opened` | append the entry to `pipeline.loop_backs` (`resolved_at: null`) |
| `loop_back_closed` | set `resolved_at` on the matching entry |
| `scope_locked` | scope-lock evidence (no v1 schema field — see below) |
| `milestone_verified` | set `milestones[<id>].verified = true` + `verified_at` from the payload |
| `deployment_verified` | `deployment = { "status": "live", "url", "verified_at" }` from the payload |
| `build_started`, `milestone_started`, `milestone_failed`, `build_blocked`, `build_done` | informational — verification results are rebuilt from `VERIFICATION.md`, not from these events |
| `recheck_*`, `feature_*`, `brand_*` | informational — the report and bundle files on disk own the detail |
| `doc_generated` | bundle-file progress (compare against the conventions §8 list) |
| `handoff_started`, `gap_found`, `handoff_done` | handoff progress; `handoff_done` fills `handoff` |
| `error` | `project.status` = "error"; keep the payload for the summary |
| `context_guard_triggered`, `truncation_recovered`, `resume` | informational — no state effect |

Two things the journal cannot supply directly:

- **Scope lock** — the v1 schema has no scope field. Scope is locked iff a `scope_locked` event exists in the journal (and S7 is done). Derive it; do not invent a schema field.
- **Milestones** — no journal event type covers them. When S8 is done, rebuild `milestones[]` from the Section Record `.lvp/docs/sections/S8-milestones.md`. If that record is missing too, milestones are reported as unrecoverable.

An `answer_recorded` whose payload text is unreadable, and whose Section Record does not hold it either, is reported as unrecoverable — ask the user to re-state only that one, saying plainly why (loud degradation, not a silent re-ask).

Then:

1. Write the rebuilt `state.json` (one checkpoint). Never touch existing journal lines.
2. Report plainly (User Language): what was reconstructed (Sections and statuses, answer counts, decisions, loop-backs, milestones, tier), everything derived indirectly (scope from the journal event, milestones from the S8 record), and every event that could not be translated, by `seq`.
3. Journal `resume` (payload: `state_rebuilt: true` + the untranslatable count).

## Step 3 — Tier check (cross-model resume)

Compare `model_profile.tier` in state with the model actually running now:

- Determine the current tier from harness config where available; if not determinable, ask init's one-line tier question (large / medium / small). Never guess.
- Same tier → nothing to do.
- Any change → journal `tier_changed` (payload: old, new), update `model_profile.tier` + `declared_at`, and re-apply the new tier's rules for the resumed work (conventions §7: batch size, research, compile, reload discipline, booster loading).
- **Downgrade** (new tier is lower) → re-run the capability probe before any further work. Three checks, graded strictly, each a clean single attempt:
  1. **Strict JSON** — Prompt: `Return exactly this JSON object, nothing else, with ANSWER replaced by the value of 7×6: {"probe":"json","answer":ANSWER}`. Pass: the reply parses as exactly that object (surrounding whitespace tolerated; no prose, no code fences) with `answer` = 42.
  2. **Three-step order** — Prompt: `Do these steps in order and output only their results, one per line: 1. write the word ALPHA. 2. write the number 2. 3. write GAMMA backwards.` Pass: the reply contains ALPHA, 2, AGMA — in that order.
  3. **Sentence continuation** — Prompt: `Continue this sentence so it makes sense, and write only the continuation: "The cashier scanned the item twice because"`. Pass: a coherent, grammatical completion (no restart, no topic change, no gibberish).
  - All pass → journal `capability_probe_passed`, update `model_profile.probe`, continue.
  - Any fail → journal `capability_probe_failed` (payload: which step). Say (English source): "This model failed the capability probe (\<step\>), so it cannot finish what the previous model started. Switch this harness to a larger model, then run `/lvp-continue` again. Nothing is lost — the project state is safe on disk." Stop. Never push through.
- Upgrade → no probe; `tier_changed` only.

## Step 4 — Progress summary

Print it in the user's language, plain and non-technical — the owner must understand it without pipeline vocabulary:

- **Project**: name (slug) + one line of what it is, from the S0 record's English summary, translated.
- **Position**: which Sections are done (compact: "S0–S3 finished"), the current Section, and its purpose in one plain line (conventions §5 purpose column, translated).
- **Answers**: N recorded, M skipped in total (plus the current Section's count). Skipped answers are named as consciously skipped, never as missing.
- **Open loop-backs**: each `L-NN` with its target Section and reason, or "none".
- **Boosters**: count installed; name every core booster whose status is `degraded`, `failed`, or `missing` — loudly, with its consequence (output quality drops; S9 will surface it in OVERVIEW.md).
- **Last activity**: the journal's last line timestamp, phrased plainly.
- **Model tier**: the stored tier, the current tier, and any change Step 3 just applied.
- **Degraded-mode line** (only when Step 5b's fallback applies): "The lvp-init-new-idea skill is not installed here, so interview questions come from a simpler fallback. Install it for full interview support."

Journal `resume` (payload: position + tier-check result) before offering actions, if not already appended in Step 2.

## Step 5 — Offer the right next action

Pick ONE primary offer from the state; act on the user's confirmation.

### a. `project.status` = "error"

Report the last `error` event in plain words and offer to retry the failed step. Retry is idempotent: done Sections and recorded answers are never redone.

### b. Interviewing (status `interview`, `researching`, or `review`; the current Section S0–S8 is not done)

Order of offers:

1. **Open loop-backs exist** → offer to answer them first (the S6 return path): ask the targeted questions in the affected earlier Section (S1–S4), close each entry with `loop_back_closed` + one checkpoint when resolved, then return to S6.
2. **Otherwise resume the current Section** at the exact micro-batch boundary:
   - **Load the Section's procedure** per the tier's reload discipline (conventions §7). Find it in this order: (1) the installed `lvp-init-new-idea` skill — check the harness skill list, then known skills directories (`~/.claude/skills/`, `<cwd>/.claude/skills/`, `~/.agents/skills/`), then an `lvp-init-new-idea/` folder beside this skill — and use its `### S<NN>` procedure block plus its `references/sections/` bank files; (2) not found, or the block is still an "appended by a later ticket" placeholder → **degraded fallback, loudly**:
     - Reload `state.json` + the current Section Record.
     - Re-derive the next micro-batch from the Section's **exit criteria** (conventions §5): every not-yet-satisfied criterion becomes one targeted question, composed from the recorded answers, phrased in User Language with a one-line reason it matters. Use bank files if present; otherwise the model's own interview judgment.
     - Say plainly (English source): "The lvp-init-new-idea skill is not installed here, so my questions for this part come from a simpler fallback. Install it for full interview support." Write `Booster: init skill procedures (degraded — fallback questions used)` into the Section Record so S9 surfaces it in OVERVIEW.md.
     - Always still available without it: answering pending loop-backs, handoff guidance (5c–5e), status reporting.
   - **Compose the batch from recorded answers**: check `sections.<S>.answers` (and the record) before composing every batch. NEVER re-ask anything recorded or skipped. Batch size per the current tier (T1 up to 3, T2 up to 2, T3 exactly 1). Keep both controls visible: **skip** (recorded, never blocks) and **"cukup" / that's enough for this Section** (jump to the exit-criteria check).
   - **All exit criteria already satisfied but the Section is not done** (the session died between the check and the `section_done` write) → ask nothing: write the record, close the Section (`section_done`), continue to the next Section.
   - From the first new answer onward, follow the init skill's Section loop engine (its "Section loop engine" section): one checkpoint per answer, the same record shape, decisions `D-NNN` with statuses per principle 12.
   - **S0 special case**: `S0.q1` not recorded → the idea was never captured; run the S0 capture fresh (nothing is being re-asked). Recorded → continue at the language/slug confirmation steps.

### c. Scope locked, bundle incomplete

Offer to finish generation (S9): the remaining files per the conventions §8 list, one file per turn (T3: one file section per turn, append-chunks), `doc_generated` + one checkpoint per file. Existing bundle files are skipped; regenerating one happens only on an explicit per-file user request.

### d. Bundled (S9 done, `handoff` open)

Offer `/lvp-handoff` — its precondition (S1–S8 done + scope locked) is met. If a handoff started but never finished, offer to re-run it there (it re-lints instead of regenerating). If that skill is not installed in this harness, say so and point to it; do not improvise the handoff inside this skill.

### e. Building or complete

Offer the v1 pointers: `/lvp-build` (execute the next unverified milestone), `/lvp-add-feature` (a new feature through a mini-pipeline), or `/lvp-recheck-plan` (an adversarial audit of decisions + bundle). These are v1 skills — mention them as pointers only; do not improvise them here. When every milestone is verified and `state.deployment.status` = "live", also point at `/lvp-personal-brand`.

## Idempotency

- Sections marked `done` are never re-run.
- Recorded or skipped answers are never re-asked.
- Bundle regeneration is explicit and per-file only.
- Re-running `/lvp-continue` is always safe: it reloads from disk and offers the next action.

## Checkpoint discipline

Same as init (conventions §9): one journal write + one state write together, at event boundaries. This skill appends `resume` on every run, `tier_changed` + probe events on a tier change, and everything the resumed work emits (`answer_recorded`, `section_start`/`section_done`, `loop_back_closed`, `doc_generated`, `scope_locked`, `error`, …). The journal is append-only: never rewrite, reorder, or delete lines.

## Never list

- Never re-ask a recorded or skipped answer — check `sections.<S>.answers` and the record before composing every batch. (Principle 10)
- Never re-run a `done` Section.
- Never generate any Blueprint Bundle file before scope lock, and never skip ahead of the Section order except through S6 loop-backs. (Conventions §5)
- Never rewrite or reorder journal lines — append only. (Conventions §3)
- Never degrade silently: a missing init skill, an untranslatable journal event, an unrecoverable answer, a guessed tier — all said aloud, in User Language.
- Never push through a failed capability probe — refuse; the state on disk is safe. (Conventions §7)
