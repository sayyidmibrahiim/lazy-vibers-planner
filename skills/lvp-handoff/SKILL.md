---
name: lvp-handoff
description: Verifies a finished LVP Blueprint Bundle with the gap lint (all 20 bundle files against their structure, decisions, milestones, costs, scope, and state), emits blueprint.json, writes the CLAUDE.md/GEMINI.md harness stubs, verifies AGENTS.md, and composes the builder entry prompt (HANDOFF-PROMPT.md) plus the booster install lines. Use when the user wants to hand an LVP project to a builder agent, close out the pipeline after S9, or check whether a bundle is complete. Refuses with plain guidance when scope is not locked or S1–S8 are unfinished, and never lints silently past a known gap.
---

# lvp-handoff

The closing skill of the LVP pipeline. It verifies that the Blueprint Bundle (conventions §8) is complete and coherent — the gap lint — then emits `blueprint.json`, writes the harness adapter stubs, and composes the builder entry prompt, so any harness with no LVP skills installed can build the product from the bundle. It never fixes bundle content itself and never lints silently past a known gap.

## Load first

Before any check or file write:

1. Read `references/principles.md` (the Constitution). All 13 principles bind this skill — especially 2 (Anti-yes-man), 9 (Verification-before-completion), and 13 (Disk is memory).
2. Read `references/conventions.md` (the operational manual). It owns the state schema (§2), journal events (§3), Section map (§5), the tier tables (§7), and the bundle file list (§8); the steps below reference it instead of repeating it.
3. Interact in the user's language from the first message. The messages below are the English source; translate them when speaking. Artifacts and stored values follow the conventions (English source of truth).

## Flow at a glance

1. **Precondition** — `.lvp/state.json` readable, scope locked, S1–S8 done. Not met → refuse with guidance; never lint a half-built pipeline.
2. **Gap lint** — run `references/lint-checklist.md` literally, groups A–H in order. Journal `handoff_started` at open, `gap_found` per finding.
3. **Findings → offer** — fix now (jump back into the owning procedure) or abort; re-lint after fixes.
4. **Emit** — `blueprint.json` + the two harness stubs; AGENTS.md verified, never assumed fine.
5. **Entry prompt + close** — write `HANDOFF-PROMPT.md`, print the booster install lines and the harness kickoff command, journal `handoff_done`.

## Step 1 — Precondition

`TARGET` = cwd (or the folder the user named). Run the checks in order; the first failure stops the skill with plain guidance. Nothing is written to disk on a refusal.

1. **Project exists** — `TARGET/.lvp/state.json` exists and parses. Missing → say (English source): "There is no LVP project here. Run `/lvp-init-new-idea` in an empty folder to start one, or `/lvp-continue` in the folder that holds it." Present but unreadable → say: "This project's state file is damaged. Run `/lvp-continue` first — it rebuilds the state from the journal — then run `/lvp-handoff` again."
2. **Scope locked** — scope is locked iff the journal holds a `scope_locked` event or `pipeline.sections.S7.status` = "done". Not locked → say: "The scope is not locked yet — Section S7 (Scope lock) freezes the MVP before milestones and the bundle exist. Run `/lvp-continue` to finish the pipeline up to S7, then come back." Refusing here is the rule: nothing correct can be linted before the lock (conventions §5 hard rules).
3. **S1–S8 done** — every Section S1–S8 has `status` "done" in `pipeline.sections`. Any other status → name each unfinished Section with its purpose (conventions §5) and say: "Run `/lvp-continue` — it resumes the pipeline at Section \<S\>." Stop.

S9 is deliberately not a precondition: an uncompiled or half-compiled bundle is exactly what the gap lint reports — loudly, owned by S9 (Step 2). Never lint silently, never refuse what a lint should surface.

## Step 2 — Gap lint

1. **Open** — journal `handoff_started` (payload: project slug) + a state write (no state field changes) — one checkpoint.
2. **Run the checklist** — read `references/lint-checklist.md` and execute every check literally, groups A–H in order. Material: the bundle files in `TARGET`, `TARGET/.lvp/state.json`, and the journal (scope evidence). Do not sample: every check runs, every time, on every run.
3. **Findings** — every failed check is one finding: a plain-language line (what is wrong, where) plus its owner (the checklist's owner table). Journal `gap_found` per finding (payload: check id, one-line finding, owner) at the moment it is found.
4. **Two finding kinds** (the checklist marks them):
   - **Bundle gaps** — owner: a Section/skill. Collected for Step 3.
   - **Self-fix items** — owner: this skill (missing or stale `blueprint.json`). Journaled, then fixed automatically in Step 4 — no user decision needed.
5. **Report** — all findings together, grouped, in plain language: what is missing or wrong, the owning Section, the concrete fix. Zero findings → straight to Step 4.

## Step 3 — Findings → fix now or abort

With at least one bundle gap, offer exactly two options (in User Language):

1. **Fix now** — jump back into the owning procedure:
   - The owning procedures live in the `lvp-init-new-idea` skill (S7 scope lock, S8 milestone plan, S9 compile — its SKILL.md). If it is installed (harness skill list, or the known skills directories: `~/.claude/skills/`, `<cwd>/.claude/skills/`, `~/.agents/skills/`), hand the user to it: re-open the owning Section's procedure on the failing items only, then return here and re-lint.
   - If it is NOT installed, instruct precisely instead: per finding, name the file, the exact heading or row to add or fix (the checklist embeds the required structure per file), and the record or state field the content comes from. Content from the records only — never invented. The user or another session applies the fixes; this skill never writes bundle files.
   - Fixes land through the owning procedure's own checkpoint events (`doc_generated`, `section_done`, …).
2. **Abort** — stop cleanly: "The bundle still has \<N\> gaps. Nothing was emitted this run and nothing was changed. Fix the items above, then run `/lvp-handoff` again." No `blueprint.json`, no stubs, no entry prompt, no `handoff_done` — a later run re-lints from disk.

After fix-now: **re-lint** — run the full checklist again (Step 2; not just the failed items — a fix can break a neighbor). Clean → Step 4. Still failing → offer again.

## Step 4 — Emit

Only when the lint is clean. These are the only bundle writes this skill ever makes:

1. **`blueprint.json`** — derive it from `state.json` + the bundle, exact schema v1 (spec 04, reproduced in the checklist): project fields, stack, features with `in_mvp`, `decisions_count`, milestones with `acceptance_count`, costs, capabilities, pointers. Compare against the existing file ignoring `generated_at`: identical → leave untouched; missing or any drift → write it with `generated_at` = now. It is a derived file — regenerate, never hand-edit, never keep a stale copy.
2. **`CLAUDE.md` + `GEMINI.md`** — write each when missing or not exactly this one line, with nothing else:

   ```markdown
   Read [AGENTS.md](AGENTS.md) — the builder entry point for this project.
   ```

3. **AGENTS.md, verified** — it must exist and cover all four: what the product is (`## What this is`, concrete); the context load order (`DECISIONS.md` → `SPEC/` → `MILESTONES.md` → `VERIFICATION.md`); working rules (stack → `CODE_STYLE.md`, security → `SECURITY.md`, a milestone is done only when its `VERIFICATION.md` procedure passes); and a file map pointing at every one of the other 19 bundle files. Thin on any of these → that is a gap finding (back to Step 3), never a silent pass.

## Step 5 — Entry prompt + close

1. **Entry prompt** — write `TARGET/HANDOFF-PROMPT.md` in English (refreshed at every completed close; its content is deterministic for a given project, so re-running produces the same file). Required content, as numbered rules the builder must follow:
   - read `AGENTS.md` first — it is the entry point and names the context load order;
   - execute the milestones from `MILESTONES.md` in order;
   - verify each milestone with its `VERIFICATION.md` procedure BEFORE claiming it done (verification-before-completion, principle 9);
   - record every verification result — pass or fail, with the actual outputs — in `VERIFICATION.md`;
   - consult `DECISIONS.md` before asking anyone anything — the answer is usually already recorded;
   - open questions go to the journal (`.lvp/journal.ndjson`), never guessed, never silently resolved;
   - follow `CODE_STYLE.md` for every line written;
   - if the plan has a gap, show it immediately with a concrete fix option attached — never smooth it over (anti-yes-man, principle 2);
   - `.lvp/` is read-only planning state — the builder must not modify it, except appending open questions to `.lvp/journal.ndjson`; the optional `/lvp-build` skill may also set milestone verification and deployment fields.
2. **Close** — print, in the user's language: the recommended install lines from `CAPABILITIES.md` (every row's install command with name and license; NC items marked runtime-dependency-only), then the kickoff command for the current harness with the entry prompt as the first input. Kickoff forms: Claude Code `claude "$(cat HANDOFF-PROMPT.md)"` · Gemini CLI `gemini -p "$(cat HANDOFF-PROMPT.md)"` · Codex `codex "$(cat HANDOFF-PROMPT.md)"` · ZCode `zcode "$(cat HANDOFF-PROMPT.md)"` · harness unknown → "open a fresh session in this folder and paste the contents of `HANDOFF-PROMPT.md`".
3. **Done** — journal `handoff_done` (payload: gaps found, self-fixes applied, entry prompt path) and fill `state.handoff` = `{ "status": "done", "completed_at": <now> }` — one checkpoint. This is the only state-field change the skill ever makes.

## Idempotency

- Re-running is always safe: the full lint runs again every time — findings are re-derived from disk, never remembered.
- No blanket regeneration, ever. `blueprint.json` is re-emitted only when stale vs `state.json` (or missing); the stubs are written only when missing or wrong; `HANDOFF-PROMPT.md` is refreshed at each completed close (same project → same content).
- A prior `handoff_done` does not block a re-run: the bundle may have drifted since; the re-lint decides.
- The journal is append-only: `seq` numbering continues; lines are never rewritten, reordered, or deleted. (Conventions §3)

## Checkpoint discipline

One journal append + one state write together, at every handoff event boundary (conventions §9): `handoff_started` (Step 2 open), `gap_found` (per finding, the moment it is found), `handoff_done` (Step 5 close — the only one that changes a state field: `handoff`). A run that dies mid-lint leaves only extra journal lines and a consistent state; the next run re-lints from disk.

## Never list

- Never lint silently past a known gap — every failed check is reported, journaled, and offered, never smoothed over. (Principle 2)
- Never run on a half-built pipeline — precondition failures refuse with guidance naming what is missing and which skill finishes it.
- Never invent bundle content, and never write bundle files other than these four outputs: `blueprint.json`, `CLAUDE.md`, `GEMINI.md`, `HANDOFF-PROMPT.md`. Every other fix goes through the owning Section's procedure.
- Never mark milestones verified or touch verification results — running the procedures is the builder's job with `VERIFICATION.md`.
- Never rewrite journal lines — append only. (Conventions §3)
