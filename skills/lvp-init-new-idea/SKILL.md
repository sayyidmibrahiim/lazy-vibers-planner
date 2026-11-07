---
name: lvp-init-new-idea
description: Opens a new LVP pipeline for a brand-new product idea — runs the Folder Gate, declares and probes the model tier, boots the core Boosters, and captures the idea in S0 intake. Use when the user wants to start a new product or idea from scratch; refuses to run in a folder that already holds a project and routes to /lvp-continue or /lvp-recheck-plan instead.
---

# lvp-init-new-idea

Opening skill of the LVP pipeline. It turns the user's target directory into an initialized LVP project — `.lvp/` created, S0 intake done, S1 ready to start — then hands control to the Section loop. It is self-contained: everything it needs lives in this skill folder.

## Load first

Before any check, question, or file write:

1. Read `references/principles.md` (the Constitution). All 13 principles bind this skill.
2. Read `references/conventions.md` (the operational manual). It owns the state schema, journal event list, Folder Gate details, and model-tier tables; the steps below reference it instead of repeating it.
3. Interact in the user's language from the first message. The messages below are the English source; translate them when speaking. Artifacts and stored values follow the conventions (English source of truth).

## Flow at a glance

Run in this order:

1. **Folder Gate** — decide where the project folder is (refuse, proceed in place, or create a subfolder).
2. **Model tier + capability probe** — refuse early if this model cannot run the pipeline.
3. **Booster bootstrap** — core Boosters present, or their absence explicitly chosen by the user.
4. **S0 intake** — idea verbatim, User Language, slug + display name; first `state.json`.
5. **Section loop (S1 onward)** — the generic engine below.

The journal starts immediately after the gate selects the project folder; the first `state.json` is written at the start of S0. The order is deliberate: the probe runs before the booster bootstrap so an incapable model is refused before any install work, and booster statuses are known before S0 records them in state.

## Step 1 — Folder Gate

Mandatory first action. Run the checks in order; the first match wins. `PROJECT_DIR` is the folder the gate selects.

### Check 1 — does an LVP project already live here?

If `<cwd>/.lvp/state.json` exists → refuse. Also refuse if `.lvp/` exists with `journal.ndjson` but no readable `state.json` (a damaged prior run; `/lvp-continue` rebuilds state by journal replay).

- Read `state.json` for a plain summary (project name, current Section) and the journal's last line for the last activity timestamp.
- Say (English source): "This folder already holds an LVP project ('\<name\>', currently at Section \<S\>, last activity \<time\>). I won't start a new idea on top of it. Run `/lvp-continue` to resume it — it prints the full progress summary and offers the next step. To start a different idea, run `/lvp-init-new-idea` in an empty folder."
- If `state.json` exists but is unreadable, same refusal, adjusted: "This folder holds an LVP project whose state file is damaged. Run `/lvp-continue` — it rebuilds the state from the journal."
- Append `folder_gate_rejected` to the existing journal (continue its `seq` numbering). Stop the skill. Change nothing else.

### Check 2 — is the folder empty?

List `<cwd>`. Ignore exactly these OS junk files: `.DS_Store`, `Thumbs.db`, `desktop.ini`. If nothing else remains:

- Say: "This folder is empty — I'll set the new project up right here."
- `PROJECT_DIR` = cwd. Journal `folder_gate_passed`. Continue at Step 2.

### Check 3 — does an existing (non-LVP) project live here?

If the folder contains project markers and no `.lvp/` → refuse. Markers: `.git`, `package.json`, `Cargo.toml`, `pubspec.yaml`, `pyproject.toml`, `go.mod`, `.solution`, `*.csproj` — or any similar manifest or lockfile indicating an existing codebase.

- Say: "This folder looks like an existing project (found: \<markers\>). I won't start a new LVP idea inside it. Create or move to an empty folder and run `/lvp-init-new-idea` there. If what you want is an adversarial audit of this project's existing plan, that's `/lvp-recheck-plan`."
- Nothing is written to disk (there is no LVP journal here to record the refusal). Stop the skill.

### Check 4 — is this a projects root?

If `<cwd>` itself has no markers but at least one direct subdirectory contains project markers (typical: `~/projects/`), the idea gets its own subfolder. When scanning subdirectories, ignore dependency and build outputs (`node_modules`, `.venv`, `dist`, `build`, `target`).

- Derive a provisional slug (rules in Step 4) from the idea text in the user's request. If no idea text is available yet, ask one quick question (English source): "In one short line — what are we building? Just enough to name the folder." Derive the slug from the answer.
- Say: "This looks like a projects root (found: \<example subdirectories\>). I'll create a new subfolder `\<slug\>/` for this idea and work there — OK?" Confirm, or take the user's alternative name.
- On confirm: create `./<slug>/` (if that name is taken, use the next free `<slug>-2` and say so); `PROJECT_DIR` = that folder.
- Journal `folder_gate_subfolder_created`. Continue at Step 2.

### Check 5 — loose files?

Non-empty, no markers, no `.lvp/` → ask (English source): "This folder has loose files (e.g. \<up to three names\>) but no project markers. Where should the new project live? 1. A new subfolder `\<slug\>/` here — recommended, keeps the idea self-contained. 2. Right here, next to the loose files." If no idea text exists yet, the `\<slug\>` placeholder has no source: ask the same quick question as Check 4 ("In one short line — what are we building?") and derive the slug from it.

- Choice 1 → confirm the slug, create the subfolder, `PROJECT_DIR` = it. Journal `folder_gate_subfolder_created`.
- Choice 2 → `PROJECT_DIR` = cwd. Journal `folder_gate_passed`.
- Continue at Step 2.

### After any passing check

1. Create `PROJECT_DIR/.lvp/`.
2. Start `PROJECT_DIR/.lvp/journal.ndjson`: line 1 `session_start` (payload: skill name + cwd), line 2 the gate event (`folder_gate_passed` or `folder_gate_subfolder_created`).
3. Journal lines: `{"ts": <ISO-8601 UTC>, "seq": <n>, "type": "...", "payload": { ... }}`; `seq` starts at 1 and increments per line; payloads are free-form objects carrying the ids named in each step below. Append every later event; never rewrite.

## Step 2 — Model tier + capability probe

### Declare the tier

- Read the tier from harness config where available; otherwise ask (English source): "How big is the model running this harness? 1. Large — frontier or 1M-class API (Gemini, GPT-6 family, Claude 5.x, DeepSeek V4). 2. Medium — open-weight mid (Qwen3.5, Llama 4, Gemma 3 27B). 3. Small — compact or local (Mistral Small, small Gemma/Qwen)."
- Map the answer to `T1 | T2 | T3` → `model_profile.tier`. Journal `tier_declared` (payload: tier).

### Capability probe (mandatory for T2 and T3, skipped for T1)

- T1 → set `model_profile.probe` = "skipped"; no probe events; continue at Step 3.
- T2/T3 → run all three probes now, before any further work. Prefer a fresh no-context model call (subagent) for an honest result; otherwise run each as a clean single attempt in this session and grade strictly:

  1. **Strict JSON** — Prompt: `Return exactly this JSON object, nothing else, with ANSWER replaced by the value of 7×6: {"probe":"json","answer":ANSWER}`. Pass: the reply parses as exactly that object (surrounding whitespace tolerated; no prose, no code fences) with `answer` = 42.
  2. **Three-step order** — Prompt: `Do these steps in order and output only their results, one per line: 1. write the word ALPHA. 2. write the number 2. 3. write GAMMA backwards.` Pass: the reply contains ALPHA, 2, AGMA — in that order.
  3. **Sentence continuation** — Prompt: `Continue this sentence so it makes sense, and write only the continuation: "The cashier scanned the item twice because"`. Pass: a coherent, grammatical completion of that sentence (no restart, no topic change, no gibberish).

- All pass → journal `capability_probe_passed`; `model_profile.probe` = "passed". Continue at Step 3.
- Any fail → journal `capability_probe_failed` (payload: which step). Say (English source): "This model failed the capability probe (\<step\>), so it cannot run the LVP pipeline reliably. Switch this harness to a larger model, then run `/lvp-init-new-idea` again. Nothing has been captured yet, so nothing is lost." Stop the skill. Never push on with a model that cannot follow the pipeline's rules.

## Step 3 — Booster bootstrap

Goal: every core Booster installed, or its absence explicitly chosen by the user. Never silent — quality is never silently degraded.

### Core boosters (v0)

| Booster | Repo | License | Used at | Install (preferred) |
|---|---|---|---|---|
| pm-skills interview patterns | `product-on-purpose/pm-skills` | Apache-2.0 | S1, S4 | `npx skills add product-on-purpose/pm-skills` |
| OpenSpec pattern (structure reference) | `Fission-AI/OpenSpec` | MIT | S9 | `npx skills add Fission-AI/OpenSpec` |
| SimpleEnglish (document-rule subset) | `AminBlg/SimpleEnglish` | MIT | S9 (+ OVERVIEW, strictest) | `npx skills add AminBlg/SimpleEnglish` |
| humanizer (de-slop pass) | `blader/humanizer` | MIT | S9 | `npx skills add blader/humanizer` |
| karpathy-guidelines | `multica-ai/andrej-karpathy-skills` | MIT | S9 (CODE_STYLE), S10 | `npx skills add multica-ai/andrej-karpathy-skills` |
| ponytail | `DietrichGebert/ponytail` | MIT | S9 (CODE_STYLE), S10 | `npx skills add DietrichGebert/ponytail` |
| competitor-analysis / web search | `browserbase/skills` or Firecrawl MCP | MIT | S5 | `npx skills add browserbase/skills`, or configure the Firecrawl MCP server |
| Playwright MCP | `microsoft/playwright-mcp` | MIT | S10 verification (when a build runs) | configure the Playwright MCP server |
| agents.md spec | `agentsmd/agents.md` | spec text, permissive | S9 | `npx skills add agentsmd/agents.md`, or fetch the spec text at use time |

Alternative mechanisms, tried in order when the preferred one fails: Claude Code plugin (`claude plugin marketplace add <repo>`, then install) → manual copy of the booster's skill folder into this harness's skills directory.

### Procedure

Run this loop once per core booster, in the table order above, then move to the next booster:

1. **Presence check** — the harness's skill/plugin list, or its known skills directories (e.g. `~/.claude/skills/`, `<cwd>/.claude/skills/`, `~/.agents/skills/`). Journal `booster_check` for this booster (payload: name, result `present|missing`). Presence maps to status `installed` only if the skill is actually loadable in this harness (listed/importable); present-but-unloadable → status `degraded` with a note (degraded surfacing rules apply).
2. **MCP-type boosters** (Firecrawl, Playwright) are MCP servers, not skill folders: presence = the server is configured in this harness's MCP settings, plus (for Firecrawl) the API key is present. Missing server or key counts as missing; the install attempt adds the server config; the same failure choice applies.
3. Result `present` → next booster. Result `missing` → install with the first mechanism that works. Success → journal `booster_install_ok`, status `installed`, next booster. Failure → journal `booster_install_failed`, then the interactive choice (step 4).
4. **Interactive failure choice** — core boosters are output-quality dependencies, so failure is never silent. Say (English source): "Core booster '\<name\>' could not be installed (\<reason\>). Output quality depends on it. Choose: 1. Help me install it fully — I'll walk through this harness's install steps with you. 2. Continue degraded — output quality drops; the project is marked 'degraded' in state, journal, and the final OVERVIEW. 3. Stop here — nothing is lost; you can resume later with /lvp-continue."

   Journal `booster_choice` (payload: booster, choice) and set the status:
   - Choice 1 → work through the real install steps with the user; success → status `installed` (+ journal `booster_install_ok`); still failing → present the choice again.
   - Choice 2 → status `degraded`; carry a note that S9 must surface it in OVERVIEW.md. Next booster.
   - Choice 3 → status `failed`; say: "Stopping here. Nothing is lost — run `/lvp-continue` once the booster situation is sorted." Stop the skill.
5. After the last booster: hold all statuses in memory; Step 4 writes them into `state.json`.

## Step 4 — S0 intake

Purpose: capture the raw idea fully; detect User Language; propose slug + display name. No structured questions in S0 — those start at S1.

1. **Open the Section**: journal `section_start` (payload: section "S0"). Write the first `PROJECT_DIR/.lvp/state.json`, shape per conventions §2, with:
   - `schema_version`: 1
   - `project`: slug = the confirmed or provisional slug ("" if none yet), name "", idea_raw "" (filled in step 3), user_language "" (filled in step 4), created_at = now (ISO-8601 UTC), status "interview"
   - `pipeline`: current_section "S0", sections `{ "S0": { "status": "in_progress", "started_at": <now> } }`, loop_backs `[]`
   - `decisions`: `[]`
   - `boosters`: core = the nine entries above with their Step-3 statuses (`installed | missing | failed | degraded`), enhancer `[]`
   - `model_profile`: `{ "tier": <T1|T2|T3>, "probe": "passed"|"skipped", "declared_at": <now> }`
   - `milestones`: `[]`, `handoff`: null

   This state write plus the `section_start` journal line form one checkpoint.
2. **Capture the idea** — say (English source): "Tell me everything in your head about this idea — what it is, who it's for, why you want it. Multi-paragraph is welcome; don't organize it, just pour it out." Ask clarifying mini-questions ONLY if the idea is under ~2 sentences (one short round: who is it for, where should it run), then move on. The mini-round questions and answers are folded verbatim into the captured idea stored as `S0.q1` (they are part of the intake) and noted in the S0 record.
3. **Record it**: store the idea verbatim (User Language, unedited) as answer `S0.q1` under `pipeline.sections.S0.answers` — `{ "q": <the capture prompt>, "a": <verbatim idea>, "skipped": false }`. Journal `answer_recorded` + state write. One checkpoint.
4. **User Language**: detect the idea's language. Say: "I detected \<language\> — I'll run our whole conversation in it. Correct me if that's wrong." Record the confirmation as `S0.q2`; journal `answer_recorded`; set `project.user_language` (user-correctable — a correction replaces the detection). Checkpoint.
5. **Slug + display name**: propose a kebab-case slug and a Title Case display name. Slug rules: lowercase letters, digits, hyphens; 2–4 words from the idea's core noun phrase; transliterate non-Latin scripts into English words (e.g. "aplikasi kasir warung" → `warung-cashier` / "Warung Cashier"). Say: "Working name: \*\*\<Name\>\*\* (slug: `\<slug\>`). Keep it, or rename?" If the gate already created a subfolder and the user changes the slug, rename that subfolder (it contains only `.lvp/` at this point). Record as `S0.q3`; journal `answer_recorded`; set `project.slug` and `project.name`. Checkpoint.
6. **Write the Section Record** `PROJECT_DIR/.lvp/docs/sections/S0-intake.md` (create the folders):

   ```markdown
   # S0 — Intake

   ## Idea (verbatim, <user_language>)

   <idea_raw, unedited>

   > Summary (EN): <2-4 sentence English summary of the idea>

   ## Metadata

   - User Language: <code> (detected, confirmed by user)
   - Slug: `<slug>` · Display name: <name>

   ## Decisions this Section

   None (metadata confirmations only).
   ```

7. **Close the Section**: update state — `sections.S0` = `{ "status": "done", "record": "S0-intake.md", "started_at": ..., "completed_at": ..., "answers": { ... } }`; `current_section` = "S1". Journal `section_done`. One checkpoint.
8. Continue immediately into the Section loop (S1) unless the user pauses.

## Section loop engine (S1 onward)

Generic procedure for every Section. Per-Section procedures for S0–S9 live in this file (index below). When S0 closes, continue straight into S1 unless the user pauses.

1. **Start** — journal `section_start` (payload: the Section id); set `sections.<S>` = `{ "status": "in_progress", "started_at": <now> }`; `current_section` = \<S\>. Checkpoint (journal + state).
2. **Load** — follow the tier's reload discipline (conventions §7): T1/T2 load this Section's procedure block and its Boosters at Section start; T3 loads, every turn, only principles + `state.json` + this Section's procedure block + the current record — never the transcript.
3. **Micro-batch loop** — batch size by tier: T1 up to 3, T2 up to 2, T3 exactly 1 (conventions §7). Phrase every question in User Language, plain and outcome-oriented, with a one-line reason it matters; choose the next batch from the previous answers. After EVERY answer: journal `answer_recorded` + state write (`sections.<S>.answers["<S>.qNN"] = { "q", "a", "skipped" }`, `q` stored as asked in User Language) — one checkpoint per answer. Bank question numbers are a suggested pool order; the authoritative id is `S<N>.qNN`, assigned at ask time within the Section. Keep both controls visible with every batch: **skip** (recorded with `"skipped": true`; never blocks) and **"cukup" / that's enough for this Section** (jumps straight to the exit-criteria check). A deferral ("later") is not a skip: the question stays open and may be re-asked in a targeted batch. Only an explicit skip — or leaving it unanswered at the exit check, which fires the `assumed` fallback — records `skipped: true`. Never re-ask a recorded answer — check `answers` before composing each batch.
4. **Decisions** — any decision surfaced in the Section goes into `decisions[]` (`D-NNN`, status `user_confirmed | assumed | designer_filled` per principle 12) at the checkpoint where it is made; `assumed` and `designer_filled` also land in ASSUMPTIONS.md at S9. Status follows who decided: an explicit user choice made in conversation is `user_confirmed` even if the topic was designer-surfaced; `designer_filled` is only for decisions the user never made themselves.
5. **Exit-criteria check** — when the questions are done or the user says enough, verify every exit criterion this Section's procedure lists. Unmet → say specifically what is missing (plain language) and run one more targeted batch. If the user still wants to move on with criteria unmet, mark the Section `blocked`, record the unmet criteria in its record, and stop before the next Section — never silently advance past unmet exit criteria. Journal `section_blocked` (payload: the Section id + the unmet criteria) as part of that checkpoint. Unblock path: when the user later supplies what was missing, re-run the exit-criteria check; on pass the Section closes normally (`section_done`, its record updated with the resolved criteria). Blocked sections resume like in-progress ones via /lvp-continue.
6. **Done** — write the Section Record `PROJECT_DIR/.lvp/docs/sections/<S>-<name>.md`: the questions, the user's verbatim answers (User Language), an English summary per answer, the Section's decision summary, and the exit-criteria results. Update state (`status` "done", `record`, `completed_at`, `current_section` = next Section). Journal `section_done`. One checkpoint.
7. **Next** — continue with the next Section's procedure block. After S9 closes, suggest `/lvp-handoff` (S10 Build is out of v0 scope; the bundle must suffice for any builder without this skill).

### Section procedures index

| Section | Procedure | Purpose (one line) |
|---|---|---|
| S0 Intake | In this file (Step 4) | Capture the raw idea fully; detect User Language; propose slug + name |
| S1 Context | In this file (`### S1 — Context`) | Problem, target users, platform shape, what "working" means for the user |
| S2 Conditions | In this file (`### S2 — Conditions`) | What the user already has and can pay: devices, accounts, hosting, budget ceiling |
| S3 Data & privacy | In this file (`### S3 — Data & privacy`) | Login, personal data, payments, third-party services, where data may legally live |
| S4 Features | In this file (`### S4 — Features`) | Feature expectations in detail, iteratively until the user says "enough" |
| S5 Deep research | In this file (`### S5 — Deep research`) | Competitor scan, stack candidates with reasons, cost table, regional availability |
| S6 Feasibility Loop | In this file (`### S6 — Feasibility loop`) | Confront research findings with answers; open conflicts, risks, cost surprises |
| S7 Scope lock | In this file (`### S7 — Scope lock`) | Freeze the MVP: every feature → in-MVP or Parking Lot (recorded, never deleted) |
| S8 Milestone plan | In this file (`### S8 — Milestone plan`) | Break the MVP into M0…Mn, each independently verifiable |
| S9 Compile | In this file (`### S9 — Compile`) | Compile Section Records + decisions + milestones into the Blueprint Bundle |

## Section procedures (S1–S9)

Each block below is one Section's procedure for the engine above; the block plus its referenced bank file is the Section's procedure load (engine step 2). Records use the engine's step-6 shape; decisions follow engine step 4; the controls and checkpoint rules live in the engine and conventions — referenced, not repeated.

### S1 — Context

Purpose: problem, target users, platform shape, what "working" means for the user. Record: `S1-context.md`. The English text here and in the bank is the source; questions are spoken in User Language at runtime (conventions §4).

**Booster** — pm-skills interview patterns (`product-on-purpose/pm-skills`, Apache-2.0; status in `boosters.core`). `installed` → load it at Section start (T3: only this one, drop after use — conventions §7) and let its interview patterns shape phrasing. Any other status → use the internal bank alone and write `Booster: pm-skills (degraded — internal bank used)` into the Section Record so S9 surfaces it in OVERVIEW.md.

**Question strategy** — establish in this order, each batch composed from the previous answers (bank: `references/sections/S1-context.md`):

1. The problem, in the user's own words — one concrete moment, not a category.
2. Who exactly has it — a named kind of person, never "everyone".
3. Platform shape — website, phone app, or both (drives the S2 fee surface).
4. What "working" means — the change the user wants to see in six months.
5. Gap-fillers for whatever the opening answers left open: the workaround today, who it is not for, rough scale, screen language, other approvals, the day-one task.

**First batch** — bank questions 1 → 2 → 4, taking only the first N the tier allows (conventions §7), then continue down the strategy order.

**Decision surfaces**:

- Platform shape → `D-NNN user_confirmed`; skipped → `assumed` (propose browser-first for a phone-form idea; state the proposal when recording).
- Target users → `user_confirmed`; skipped → `assumed` (the user's own circle).
- Success picture → `user_confirmed`; skipped → `assumed` ("it removes the manual steps of the stated problem").
- Owner vs customer views, and the installable-browser alternative to a store app → `designer_filled` — a non-technical user does not think in roles and cannot know a website can install to the home screen; record proactively, show visibly for correction.

**Exit criteria** (engine step 5; cite the satisfying answer id or decision id):

- [ ] Problem recorded in the user's own words (not skipped).
- [ ] At least one named target-user group recorded.
- [ ] Platform shape chosen: web / phone / desktop / a combination.
- [ ] Success picture recorded.

**Section Record** — `PROJECT_DIR/.lvp/docs/sections/S1-context.md` (this skeleton is shared by S1–S4; later Sections only add their specific rows):

```markdown
# S1 — Context

## Answers
- **<S1.qNN> <question, User Language>** — <answer verbatim> · _EN: <summary>_

## Decisions this Section
- **<D-NNN>** <summary> — <rationale> · status: <user_confirmed | assumed | designer_filled>

## Exit criteria
- [<x>] <criterion> — evidence: <answer id or decision id>

## Booster
<pm-skills: installed | degraded — internal bank used>
```

### S2 — Conditions

Purpose: what the user already has and can pay — devices, accounts, hosting, budget ceiling. Record: `S2-kondisi.md` (historical filename, conventions §5). English is the source; questions are spoken in User Language at runtime.

**Booster** — none; the internal bank plus its cost fact-sheet is the S2 booster (spec 02). Bank: `references/sections/S2-conditions.md`.

**Price verification (principle 1)** — the bank's fact-sheet is a snapshot dated 2026-11-08. Before quoting ANY price to the user: re-verify it live (web search or fetch the source) and name source + access date with the number; cannot verify → say the number is `unverified` and move on. Never quote from memory.

**Question strategy** — establish in this order: devices in hand; what the user already pays for; the monthly budget ceiling; then route by the S1 platform shape (store in play → store fees and accounts; website → domain; hands-on plausible → willingness to run commands); close with admin email, paying from the user's country, data-location preference, and weekly maintenance time.

**First batch** — bank questions 1 → 2 → 3 (devices, existing payments, ceiling), trimmed to the tier limit (conventions §7).

**Hard rule (conventions §5)** — before closing S2, cross-check the S1 platform shape against the fact-sheet: any paid account the chosen platform needs and the user lacks (e.g. iOS → Apple Developer USD 99/yr) is surfaced NOW with the verified price and a proceed/defer choice — never deferred to S5.

**Decision surfaces**:

- Budget ceiling → `D-NNN user_confirmed`; skipped → `assumed` (ceiling 0; record what that rules out).
- Deploy target → `user_confirmed`; skipped → `assumed` (free-tier hosting).
- Store-account proceed/defer → `user_confirmed` (proceed) or `assumed` (defer — S5 must not drop it).
- Custom domain vs free subdomain, the backup duty, and the maintenance/who-updates reality → `designer_filled` — a non-technical user cannot know domains renew yearly until they lapse, that backups never happen by accident, or that rented hosting goes dark when payment stops; record proactively, show visibly for correction.

**Exit criteria** (engine step 5; cite the satisfying answer id or decision id):

- [ ] Budget ceiling recorded (a number, or an explicit "nothing").
- [ ] Deployment surface and devices/accounts list recorded.
- [ ] Every paid account the platform needs surfaced with a verified price and a recorded proceed/defer answer.

**Section Record** — `S2-kondisi.md` on the shared S1 skeleton, plus one row added under a `## Prices quoted` heading: every price shown to the user with source URL + access date, `unverified` flagged where applicable.

### S3 — Data & privacy

Purpose: login, personal data, payments, third-party services, where data may legally live. Record: `S3-data.md`. English is the source; questions are spoken in User Language at runtime.

**Booster** — none (spec 02). Bank: `references/sections/S3-data-privacy.md`.

**Question strategy** — establish in this order: login yes/no (the biggest fork); if login, reuse-existing-account vs new username+password; the personal-data inventory; which of it is sensitive; money inside the app; then third-party connections, where data may legally live, offline behavior, erasure, who sees whose data, and what must survive a loss.

**First batch** — bank questions 1 → 3 → 5 (login, data inventory, money) — the three exit-criteria questions; trim to the tier limit (conventions §7).

**Decision surfaces**:

- Auth (login yes/no, and method when yes) → `D-NNN user_confirmed`; skipped → `assumed` (no login — S6 will confront this with research if S4 contradicts it).
- Personal data kept and payments in-app → `user_confirmed`; skipped → `assumed` (empty inventory / no payments), recorded plainly so S6 can confront it.
- Password-reset mail sender (when login exists) → `designer_filled` — nobody asks what happens after "forgot password".
- Offline-first local storage (when the user wants offline) → `designer_filled` — the user cannot enumerate caching, sync, or conflict choices; record them proactively, show visibly for correction.
- Privacy-policy page at launch (any login, any personal data, any store presence) → `designer_filled` — app-store review rejects without one; never a question, always a recorded decision.
- Account/data deletion path → `designer_filled` (erasure is a duty, not a feature request).

**Exit criteria** (engine step 5; cite the satisfying answer id or decision id):

- [ ] Data inventory recorded (or explicitly empty).
- [ ] Auth yes/no recorded (and method when yes).
- [ ] Payments yes/no recorded.
- [ ] The privacy-policy decision recorded when any of its triggers holds.

**Section Record** — `S3-data.md` on the shared S1 skeleton.

### S4 — Features

Purpose: feature expectations captured in detail, iteratively, until the user says enough. Record: `S4-fitur.md`. English is the source; questions are spoken in User Language at runtime.

**Booster** — pm-skills interview patterns (`product-on-purpose/pm-skills`, Apache-2.0; status in `boosters.core`): Mom Test + user-story/Gherkin patterns. `installed` → load at Section start (T3: only this one, drop after use). Any other status → internal bank alone + `Booster: pm-skills (degraded — internal bank used)` in the record.

**Capture format (F-01…)** — every feature is captured per the format in `references/sections/S4-features.md`: plain-words name, one named kind of user, a click-by-click happy-path script ("posting ke IG" style — a stranger holding the phone could follow it without asking anything), priority must/should/could confirmed aloud, and the failure cases the user cares about. When capturing each F-NN, also coin an English display name — the record keeps the user's verbatim words; the English name is what SPEC/requirements.md, USER_FLOWS.md, and blueprint.json use. A name without a script is a placeholder, not a feature.

**Question strategy** — a capture loop: the one thing (the F-01 seed); walk it through like holding the phone — that IS the script; the next thing, one feature per script, never a blob; per feature: who taps it, what "done" leaves behind, what would annoy them; repair weak scripts by copying the old workaround; the three-that-matter round assigns priorities; the first-run emptiness question surfaces empty-state decisions.

**First batch** — bank question 1 ("If this app could do only ONE thing on day one, what would it be?"); question 2 (the walk-through) follows as its own turn regardless of tier — F-01's script is the section's first real work.

**Decision surfaces**:

- Per-feature priority → `D-NNN user_confirmed`, confirmed aloud — never inferred.
- Empty-state behavior per affected feature → `designer_filled` (nobody asks what person #1 sees on an empty screen).
- A feature named as a blob and split into parts → the split recorded `designer_filled` until the user corrects it.
- Features left unmentioned after the three-that-matter round default to `could`, said visibly; the user's acceptance of that default is one `user_confirmed` decision.

**The "enough" protocol** — on "cukup"/enough: stop capturing (no "are you sure?"); scan every F-NN for a complete script and a priority, and scan the F-NN feature blocks (name, who, priority, happy path) for placeholder language ("and whatever else", "etc."); then one final complete-or-drop batch covering all failing features — for each, fix the failure (finish its script in one last walk-through, or confirm the missing priority aloud: must/should/could) or drop it into a "named but not captured" list (recorded, never counted as a feature); refusing the batch → exit criterion unmet → Section `blocked` with the failing features named. Full protocol: `references/sections/S4-features.md`.

**Exit criteria** (engine step 5; cite the satisfying answer id or decision id):

- [ ] The user explicitly said enough (the control, or the natural end of the capture loop).
- [ ] Every captured F-NN has a complete click-by-click happy path and a priority.
- [ ] No "and whatever else"/"etc." placeholders in the F-NN feature blocks (name, who, priority, happy path); verbatim answer quotes keep the user's own words, "dll" included.

**Section Record** — `S4-fitur.md` on the shared S1 skeleton, plus the feature list: each F-NN in the capture format, verbatim, as its own subsection before the exit criteria.

### S5 — Deep research

Purpose: competitor scan, stack candidates with reasons, cost table, regional availability. Record: `S5-research.md` (becomes `RESEARCH.md` at S9). Mostly AI work: the Conductor does the research; the user is asked only targeted questions when findings demand a fact no record holds. English is the source; research runs on English sources, summarized in English (conventions §4); questions are spoken in User Language at runtime. At Section start also set `project.status` = "researching" (conventions §2).

**Booster** — competitor-analysis / web search (browserbase `competitor-analysis`, or the Firecrawl MCP; status in `boosters.core`). `installed` → load at Section start (T3: only this one, drop after use) and run real web research per the bank. Any other status → model-knowledge fallback where EVERY claim is written with an explicit `unverified` flag — loud degraded mode (ADR-0004), never memory dressed as research — and the record carries `Booster: competitor-analysis (degraded — model-knowledge fallback)` so S9 surfaces it in OVERVIEW.md.

**Claim discipline (principle 1)** — every claim in the record carries a source URL + access date, or an explicit `unverified` flag; nothing in between. Reuse, do not re-research, what the S2 fact-sheet verified: cite the S2 record's price rows; re-verify live only rows being newly quoted.

**Work strategy** — four outputs, in order (templates and sub-query lists: `references/sections/S5-research.md`):

1. **Competitor scan** — ≥3 direct or adjacent products: what they do, pricing model, one lesson for this idea.
2. **Stack options** — ≥2 candidate stacks with a trade-offs table (budget fit, hands-on fit, S3 coverage, S4 coverage, regional availability, maintenance).
3. **Recommended stack** — exactly ONE, with reasons tied to the recorded answers (S1 users/platform, S2 budget/devices/hands-on, S3 auth/payments, S4 features) — never a generic "best stack".
4. **Cost table** — build on the S2 fact-sheet; add regional payment-gateway availability for the user's market (S2 country + S3 payments answers) and every new recurring cost the recommended stack introduces.

**Tier chunking (conventions §7)** — T1: full queries per output. T2: split each output into sub-queries; append each sub-query's findings to the record before the next one starts. T3: one sub-topic per turn, append every step. Never hold the whole research in context — the file on disk is the memory (principle 13); `/lvp-continue` resumes from the last complete sub-query.

**First batch** — the competitor scan's first sub-query (T1: the whole scan), appended to the record before anything else moves on.

**User questions** — none by default; targeted batches (`S5.qNN`, engine rules) only when a finding needs a user fact — which competitor really matters, whether a regional constraint applies, whether a new recurring cost still fits the ceiling. Skip/enough controls stay visible.

**Decision surfaces**:

- Recommended stack → presented in plain language; the user's pick or acceptance → `D-NNN user_confirmed`; skipped → `assumed` (the recommendation stands).
- A recommendation resting on a free tier → its paid fallback (tier + price, verified or `unverified`) recorded next to it as `designer_filled` — a non-technical user cannot know free tiers have cliffs.

**Exit criteria** (engine step 5; cite the record section, answer id, or decision id):

- [ ] Competitor scan covers ≥3 direct/adjacent products with what they do and a pricing model.
- [ ] ≥2 stack options with a trade-offs table.
- [ ] One recommended stack with reasons tied to the S1–S4 answers and S2 resources.
- [ ] Cost table present, built on the S2 fact-sheet, with regional payment-gateway availability for the user's market.
- [ ] Every claim carries source + access date or an explicit `unverified` flag.

**Section Record** — `PROJECT_DIR/.lvp/docs/sections/S5-research.md`:

```markdown
# S5 — Deep research

## Booster
<competitor-analysis: installed | degraded — model-knowledge fallback>

<findings, appended per sub-query; every claim: source URL + access date, or `unverified`>

## Competitor scan
## Stack options and trade-offs
## Recommended stack
## Cost table and regional availability

## Answers
- **<S5.qNN> <question, User Language>** — <answer verbatim> · _EN: <summary>_
(or "None — no user questions were needed.")

## Decisions this Section
- **<D-NNN>** <summary> — <rationale> · status: <user_confirmed | assumed | designer_filled>

## Exit criteria
- [<x>] <criterion> — evidence: <record section, answer id, or decision id>
```

### S6 — Feasibility loop

Purpose: confront the S5 findings with the recorded answers; surface conflicts, risks, cost surprises. Output: risks appended to `S5-research.md` — S6 keeps no record of its own (conventions §5). Mostly AI work: the Conductor walks the findings itself; the user is asked only when a risk needs their call. The English text here is the source; questions are spoken in User Language at runtime.

**Booster** — none (spec 02). The working material is the S5 record plus the S1–S4 records.

**Work strategy** — walk every S5 finding (competitor lessons, stack trade-offs, cost rows, regional constraints, `unverified` claims) and classify each:

- `blocking` — it contradicts a recorded answer or makes the plan unbuildable or unaffordable (cost busts the S2 ceiling; the S3 "no login" answer collides with what features need; a regional rule forbids the data plan).
- `note` — informational; shapes later documents, blocks nothing.

Every finding carries one line of evidence: the record row or answer id it comes from. `note` → recorded, done. `blocking` → the loop-back below is mandatory, never optional (conventions §5 hard rule).

**First batch** — the classification walk over the S5 findings; no user turn is needed until a risk needs their call.

**The loop-back (every blocking risk)**:

**Routing** — send the loop-back to the Section that owns the conflicted decision: budget/cost → S2, feature/UX behavior → S4, data/privacy → S3, platform/context → S1. Two sections own it → pick the one whose exit criterion fails. Still unclear → ask the user which Section to revisit (one question).

1. Open a `pipeline.loop_backs[]` entry — `{ "id": "L-NN", "from": "S6", "to": "<owning S1–S4 section>", "reason": "<one line>", "opened_at": <now>, "resolved_at": null }`; journal `loop_back_opened`. One checkpoint.
2. Jump to the owning section's procedure block and run targeted micro-batches on the loop-back's reason only — the section is not re-run (its exit criteria still hold); new answers get fresh `S<NN>.qNN` ids, never re-asking recorded ones; note the loop-back in that section's record.
3. Close: set `resolved_at`; journal `loop_back_closed`. When closing, search the Section Records (and the recorded state answers) for claims the resolution overrides and update each one's affected content as part of closing the entry (e.g. a feature's F-NN script promising push notifications) — records must never keep a claim the decisions have overridden; journal nothing extra (the `loop_back_closed` payload lists the touched records). One checkpoint. Return to S6.
4. Re-run the affected findings against the new answers. A new blocking risk opens a fresh entry (L numbering continues). Repeat until none remains.
5. If a session dies mid-loop-back, `/lvp-continue` reads the open entry (`resolved_at` null) and resumes the targeted batch — `current_section` stays "S6" throughout.

**Accepted risks** — a blocking risk the user hears and consciously accepts is never a silent shrug: record a decision (`D-NNN`, `user_confirmed`, section S6) with the risk, the rationale, and what accepting it costs; the risk's line points at the decision id. Only then does it stop blocking.

**User questions** — targeted batches only (engine rules, `S6.qNN`), when a risk needs the user's call: which constraint bends, whether to pay, whether to descope. Controls stay visible.

**Decision surfaces**:

- Every consciously accepted blocking risk → `user_confirmed` with rationale (above).
- A user choice made during a loop-back (raise the budget, drop a feature) → recorded in the owning section as that section's answer or decision, not silently in S6.

**Exit criteria** (engine step 5; cite the risk line or decision id):

- [ ] Every S5 finding classified `blocking` or `note` with one line of evidence.
- [ ] Zero open blocking risks — each closed via a loop-back (`resolved_at` set) or accepted as a `user_confirmed` decision.
- [ ] The risks section is appended to `S5-research.md` with every outcome recorded.

**Record** — `## Risks (S6)` appended to `PROJECT_DIR/.lvp/docs/sections/S5-research.md`; S6 keeps no record of its own: set `sections.S6.record` = "S5-research.md" (the risks append there) and `sections.S6.status` = "done" when the loop exits clean:

```markdown
## Risks (S6)

- **R-<n> (blocking | note)** — <finding> · evidence: <record row / answer id> · outcome: <resolved via L-NN | accepted → D-NNN | note only>
```

### S7 — Scope lock

Purpose: freeze the MVP — every feature F-NN → `in-MVP` or Parking Lot (recorded, never deleted). Record: `S7-scope.md`; journal `scope_locked`. Mostly AI work: the Conductor prepares the split; the user makes the cuts and gives one explicit confirmation. English is the source; questions are spoken in User Language at runtime (conventions §4).

**Booster** — none (spec 02). Guide: `references/sections/S7-scope.md`.

**Work strategy** (walk protocol in the bank):

1. Walk every F-NN from the S4 record, one by one: `in-MVP` or Parking Lot — guided by the S4 priorities (must → in-MVP by default; should/could → proposed for the lot), the S2 budget, and the S6 risk outcomes.
2. Parked items get a one-line reason each — recorded, never deleted, never silently dropped.
3. **MVP-size sanity**: if the in-MVP list holds more than ~8 features, say so plainly ("more than a first version builds well") and offer a concrete cut; the user decides — the warning never auto-cuts.
4. Present the final list — in-MVP plus Parking Lot — and ask for explicit confirmation of the whole list.

**First batch** — the F-NN walk producing the proposed split; the first user turn is the size warning (when it fires) and the confirmation.

**The lock moment** — `scope_locked` fires only after the user explicitly confirms the final list (a plain yes to "is this the first version?"; a skip is not a lock — the skip attempt is journaled like any answer, `answer_recorded` with `skipped: true`, before the re-ask). On confirmation, one checkpoint: journal `scope_locked` (payload: the in-MVP feature ids) + state write (`project.status` = "review", `sections.S7` per engine). Then write the record (second checkpoint). From the lock on, the feature list is frozen: changes go through /lvp-add-feature post-v1, never quiet edits. Refused confirmation → exit criterion unmet → engine step 5: the Section is marked `blocked` with the contested items named.

**User questions** — the confirmation is the one mandatory question; the size-cut offer and contested features may add targeted batches (`S7.qNN`). Controls stay visible.

**Decision surfaces**:

- The confirmed split → `D-NNN user_confirmed` (the lock decision; the record's per-feature lines carry the detail).
- A must-priority feature parked anyway (budget or risk) → allowed only aloud; its parked line cites the S6 risk or S2 constraint that forces it.

**Exit criteria** (engine step 5; cite the answer id or decision id):

- [ ] Every F-NN from S4 marked `in-MVP` or Parking Lot — none missing, none deleted.
- [ ] Each parked item carries a one-line reason.
- [ ] The user explicitly confirmed the final list; `scope_locked` is journaled.
- [ ] The MVP-size sanity check ran; when > ~8 features, the warning and the user's call are recorded.

**Section Record** — `PROJECT_DIR/.lvp/docs/sections/S7-scope.md`:

```markdown
# S7 — Scope lock

## In-MVP
- **F-01** <name> — <one line what it is>

## Parking Lot (recorded, never deleted)
- **F-0n** <name> — parked because: <one line>

## Size check
<in-MVP count; when > ~8: the warning given + the user's call>

## Lock
- Confirmed: <S7.qNN> · decision <D-NNN> · journaled `scope_locked` <ts> · status → review
- Frozen from here: changes go through /lvp-add-feature post-v1.

## Answers
- **<S7.qNN> <question, User Language>** — <answer verbatim> · _EN: <summary>_
(always at least the confirmation: the skip attempt + re-ask, then the explicit yes)

## Decisions this Section / Exit criteria
<engine step-6 shape, as the S1–S4 skeleton>
```

### S8 — Milestone plan

Purpose: break the in-MVP list into milestones `M0…Mn`, each independently verifiable. Record: `S8-milestones.md` (becomes `MILESTONES.md` + `VERIFICATION.md` at S9); the state's top-level `milestones[]` gets one entry per milestone (id, goal, features covered) — milestones live in this one place and are never mirrored under `pipeline`. Mostly AI work: the Conductor drafts the plan; the user reviews it. English is the source; questions are spoken in User Language at runtime (conventions §4).

**Booster** — none core (spec 02: planning-and-task-breakdown principles, addyosmani). Not a Step-3 core install, so no `boosters.core` entry: if the harness carries them, load at Section start (T3: drop after use); if not, the decomposition rules in the bank are the booster (spec 02 fallback). Guide: `references/sections/S8-milestones.md`.

**M0 — the walking skeleton (generic)** — the thinnest slice that runs end to end on the real stack: deployed to the S2 deploy target (the future HANDOVER target), real at every layer (real stack, real data store, nothing stubbed end to end), carrying exactly one real user task (the S1 day-one answer; F-01's happy path when that was skipped) from first tap to visible result, provable by one command or scripted check.

**Work strategy** (templates and rules in the bank):

1. Seed M0 from the walking-skeleton definition.
2. Order the remaining in-MVP features into milestones, grouped by the data or flow they share; every F-NN lands in exactly one milestone; the final milestone re-verifies the M0 deploy still passes.
3. Size each milestone: completable by a builder agent in one focused session; anything bigger splits at a feature boundary.
4. Per milestone write: goal, deliverables, measurable acceptance criteria, verification procedure, rough cost/effort.

**First batch** — draft the whole plan, M0 first; the user sees it only at the final review.

**Acceptance-criteria rules** — every criterion is machine-checkable: a command with expected output, a scripted step, or a visual check stated as an observable fact plus how to look ("after reload, the list shows the saved item"). "Looks good" and "works well" are not criteria (conventions §5 hard rule). The verification procedure names exact commands, expected outputs, and what to look at — S9 compiles them into VERIFICATION.md.

**User questions** — one review at the end: present the plan in plain language (order, rough effort, what M0 proves); corrections become targeted batches (`S8.qNN`). Controls stay visible.

**Decision surfaces**:

- Milestone order and grouping → `designer_filled`, shown at the review (a non-technical user cannot sequence builds); explicit user choices between offered options → `user_confirmed`.
- Cost/effort figures are rough estimates with their basis stated — real prices keep principle-1 discipline (source + date, or `unverified`).

**Exit criteria** (engine step 5; cite the milestone id):

- [ ] M0 exists and satisfies the walking-skeleton definition.
- [ ] Milestones cover 100% of in-MVP features — each F-NN in exactly one — plus deploy to the S2 target.
- [ ] Every milestone has goal, deliverables, acceptance criteria, verification procedure, rough cost/effort.
- [ ] Every acceptance criterion is machine-checkable (command or scripted step — never "looks good").
- [ ] Every milestone is sized for one focused builder session.

**Section Record** — `PROJECT_DIR/.lvp/docs/sections/S8-milestones.md`:

```markdown
# S8 — Milestone plan

## M<n> — <name>
- **Goal:** <one line>
- **Deliverables:** <F-NNs built, files/components, deploy/config steps>
- **Acceptance criteria:** <numbered; every one machine-checkable>
- **Verification:** <exact commands + expected outputs; visual checks as observable facts>
- **Rough cost/effort:** <estimate + basis>

## Answers
- **<S8.qNN> <question, User Language>** — <answer verbatim> · _EN: <summary>_
(or "None — the review passed without corrections.")

## Decisions this Section / Exit criteria
<engine step-6 shape, as the S1–S4 skeleton>
```

### S9 — Compile

Purpose: compile the Section Records + `decisions[]` + `milestones[]` into the 20-file Blueprint Bundle (conventions §8; spec 04 is the canonical per-file source, packaged in `references/bundle/templates.md`). The bundle lives in the project folder next to `.lvp/` and must be self-sufficient: any harness, with no LVP skills installed, can build the product from it. Mostly AI work: the Conductor compiles; the user is brought in only when a gap needs their call. English is the source — the bundle is written in English; the web UI renders it in User Language (principle 5, conventions §4). The bundle files are S9's output: no `S9-*.md` Section Record is written (conventions §5).

**Booster** — OpenSpec pattern (structure reference), SimpleEnglish (document rules), humanizer (de-slop pass), karpathy-guidelines + ponytail (`CODE_STYLE.md`), agents.md spec (`AGENTS.md`); statuses in `boosters.core`. `installed` → apply each at the step that uses it (T3: one at a time, drop after use — conventions §7). Any other status → the rules in this block plus the templates are the fallback, and the degraded booster is surfaced in OVERVIEW.md's Limitations — never silent.

**Work material (engine step 2)** — at Section start load: every Section Record in `.lvp/docs/sections/` (S0–S8), `state.json` (for `decisions[]`, `milestones[]`, `boosters.core`), and `references/bundle/templates.md`. T3: never the transcript — each turn reloads only the templates plus the records that feed the one file being compiled.

**Work strategy** — the 6-step compilation order (spec 04), run in sequence:

1. **Draft** — compile each of the 20 files from the Section Records + `decisions[]` + `milestones[]`, following its skeleton in `references/bundle/templates.md`, in bundle order (conventions §8): `AGENTS.md` → `OVERVIEW.md` → … → `CLAUDE.md`/`GEMINI.md`. Templates carry the structure; content comes only from the records — never invented. A gap the records cannot fill becomes an `assumed` decision (listed in ASSUMPTIONS.md) or a Limitations note, not a fabrication.
2. **Cross-check pass** — over the drafted bundle; fix every failure with a targeted edit to the offending file(s), then re-check. The full list:
   - every F-NN has a USER_FLOWS.md entry and a SPEC/requirements.md row;
   - every decision in `decisions[]` has a DECISIONS.md row — and DECISIONS.md holds nothing `decisions[]` lacks;
   - every `assumed` and `designer_filled` decision is listed in ASSUMPTIONS.md with why + how to replace or confirm it;
   - stack, entity, and feature names are identical across all files (conventions §8 format rules);
   - every milestone acceptance criterion has a VERIFICATION.md procedure (exact commands, expected outputs, what to look at);
   - every price in the OVERVIEW.md and RESEARCH.md cost tables cites its S2 fact-sheet row — source + access date, or `unverified` (principle 1);
   - all 20 files exist and are non-empty.
3. **SimpleEnglish document-rules pass** — short sentences, active voice, jargon defined on first use (principle 7); applies to all bundle files, strictest for OVERVIEW.md; never fights GFM structure.
4. **Humanizer de-slop pass** — concrete and specific, no filler (principle 6); rewrite slop lines, never drop content.
5. **Emit blueprint.json** — the exact schema from spec 04 (reproduced in `references/bundle/templates.md`), derived from `state.json`: regenerate it, never hand-edit it. Write the one-line CLAUDE.md + GEMINI.md stubs (exact line in the templates).
6. **Close** — journal `doc_generated` per file (payload: the file path) with a state write each — one checkpoint per file (conventions §9). Then: `project.status` = "bundled"; `sections.S9` closes per engine step 6 with `record` = the bundle files; `current_section` stays "S9" (S10 is out of v0 scope); suggest `/lvp-handoff` (engine step 7). S9 is resumable per file: a file already on disk that passes the cross-check is kept — only missing or failing files are drafted again, never a silent blanket rewrite.

**Tier behavior (conventions §7)**:

- T1/T2: one file per turn, checkpoint per file.
- T3: one file SECTION per turn with append-chunks — write the file's skeleton, then append one top-level section per turn, checkpointing per chunk.
- **Truncation recovery** (conventions §7): on `finishReason=length`, a mid-sentence cutoff, or a missing required section — reload the last complete block from the file on disk, continue exactly from there with no repetition, and append; checkpoint `truncation_recovered` after every successful append; repeat until the skeleton's required structure is complete. Never save a truncated file as complete; never regenerate from scratch what can be continued.

**Degraded surfacing** — every degraded booster (the records' `Booster: … (degraded — …)` lines from S1/S4/S5 plus any degraded status in `boosters.core`) and every Section that ran blocked and later resolved MUST surface in OVERVIEW.md under a `## Limitations` heading — one plain line each. Never silently dropped: quality caveats live where the owner reads.

**Regeneration** — per file, explicit, only on user request or on a handoff gap-fix (`/lvp-handoff` re-lints instead of regenerating — conventions §9). Never blanket-regenerate the bundle; blueprint.json is the standing exception — derived and always regenerated from state, never hand-edited.

**Owner documents** — OVERVIEW.md and HANDOVER.md are written FOR the non-technical owner: plain language (strictest SimpleEnglish reading level in OVERVIEW.md), real numbers in the cost table, no step that assumes reading code. Artifacts stay English; the web UI translates to User Language (principle 5, conventions §4).

**Branding check (conventions §2)** — offer it while drafting OVERVIEW.md: the display name may still change here. A change is one `user_confirmed` decision, applied across the bundle before the cross-check runs.

**User questions** — none by default; targeted batches (`S9.qNN`, engine rules) only when a compile gap needs the user's call — a real naming choice, or a conflict the records cannot resolve. Controls stay visible.

**Decision surfaces**:

- Display-name change at the branding check → `D-NNN user_confirmed`.
- A compile gap resolved by assumption (no record answers it) → `assumed`, listed in ASSUMPTIONS.md.

**Exit criteria** (engine step 5; cite the file path):

- [ ] All 20 bundle files exist and are non-empty: GFM, English, ASCII diagrams only, no Mermaid.
- [ ] The cross-check list above passes on every item.
- [ ] blueprint.json matches `state.json` and follows the spec 04 schema.
- [ ] CLAUDE.md + GEMINI.md stubs written; AGENTS.md follows the agents.md spec.
- [ ] Every degraded booster and blocked-then-resolved Section appears in OVERVIEW.md → Limitations.
- [ ] `project.status` = "bundled"; `doc_generated` journaled for every file.

## Interruption contract

- Stopping is safe at any point. After every checkpoint moment (each answer, Section start/done, booster install or choice, file write, error), journal and state are consistent on disk.
- Maximum loss: the current unanswered micro-batch. Before S0's first state write, loss is zero — the journal already holds the gate, tier, and booster events.
- Resume is `/lvp-continue`'s job, never this skill's. If the user re-runs init in a folder that now has `.lvp/state.json`, Folder Gate Check 1 refuses and routes to `/lvp-continue`. If a session died before the first state write, re-running `/lvp-init-new-idea` is clean.
- `journal.ndjson` is append-only: never rewrite, reorder, or delete lines; on state corruption, `/lvp-continue` rebuilds by journal replay.

## Never list

The full rules live in `references/principles.md`; these are the ones this skill enforces constantly:

- Never re-ask a recorded answer — check `sections.<S>.answers` before composing every batch; the captured idea (S0.q1 / `idea_raw`) is covered by the same rule: later Sections' gap-fill questions must not re-collect what the idea text already answers. (Principle 10)
- Never generate any Blueprint Bundle file before scope lock (S7) — compilation happens only at S9. (Conventions §5 hard rules)
- Never vendor NC-licensed content into any LVP file — NC boosters are runtime dependencies only: credit, never copy. (Principle 11)
- Never answer a verifiable fact from memory — cite source + access date, or mark it `unverified` and move on. (Principle 1)
