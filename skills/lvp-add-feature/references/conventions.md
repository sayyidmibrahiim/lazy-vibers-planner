# LVP Conventions

Canonical source: `docs/spec/*` in the LVP repository. This file is the packaged snapshot for installed skills; drift is checked at dogfood.

schema_version: 1 · date: 2026-11-08

Companion file: `lvp-principles.md` — the Constitution, loaded before any LVP work. The Conductor (the model running the pipeline) applies the rules below.

## 1. Folder model

One folder = one idea = one product. Never mix two ideas or two products in one folder.

```
<project-folder>/
├── .lvp/
│   ├── state.json        State: authoritative snapshot (rewritable)
│   ├── journal.ndjson    Journal: append-only event log (never rewritten)
│   ├── docs/
│   │   └── sections/     Section Records: S0-intake.md, S1-context.md, ...
│   └── recheck/          Recheck reports: RECHECK-<date>.md (audit artifacts)
└── (after Handoff: Blueprint Bundle files + builder code live here)
```

`state.json` is the single source of truth for "where are we". `journal.ndjson` is the audit trail: if the State is corrupted or missing, rebuild it by journal replay. Section Records are the raw material S9 compiles.

## 2. State schema (`state.json`, v1)

```json
{
  "schema_version": 1,
  "project": {
    "slug": "warung-cashier",
    "name": "Warung Cashier",
    "idea_raw": "...",
    "user_language": "id",
    "created_at": "2026-11-08T09:00:00Z",
    "status": "interview"
  },
  "pipeline": {
    "current_section": "S4",
    "sections": {
      "S0": { "status": "done", "record": "S0-intake.md",
              "answers": { "S0.q1": { "q": "...", "a": "...", "skipped": false } } },
      "S1": { "status": "in_progress" }
    },
    "loop_backs": [
      { "id": "L-01", "from": "S6", "to": "S2", "reason": "research found cost conflict",
        "opened_at": "...", "resolved_at": null }
    ]
  },
  "decisions": [
    { "id": "D-001", "section": "S2",
      "summary": "Deploy on the VPS the user already owns",
      "rationale": "owner pays nothing extra", "status": "user_confirmed" }
  ],
  "boosters": {
    "core": [ { "name": "simple-english", "repo": "AminBlg/SimpleEnglish",
                "license": "MIT", "tier": "core", "status": "installed" } ],
    "enhancer": []
  },
  "model_profile": { "tier": "T1", "probe": "passed", "declared_at": "..." },
  "milestones": [],
  "handoff": null
}
```

Field notes:

- `project.slug`: kebab-case, used as the folder name. `project.name`: display name, locked at S1 (may still change at the S9 branding step). `idea_raw`: verbatim user input in User Language. `user_language`: detected at S0, user-correctable.
- `pipeline.sections`: one entry per Section with `status`, `record`, timestamps, and recorded answers. Section status enum: `pending | in_progress | done | blocked`.
- `answers[].q` is stored exactly as asked, in User Language; the English summary lives in the Section Record.
- `pipeline.loop_backs`: open Feasibility Loop entries (S6); `resolved_at` is set when the entry closes.
- `decisions[].status`: `user_confirmed | assumed | designer_filled`. `assumed` = asked, user skipped or deferred. `designer_filled` = never surfaced — the user couldn't have known to ask. Both `assumed` and `designer_filled` decisions are also listed in ASSUMPTIONS.md.
- `boosters`: two arrays, `core` (Booster required for output quality) and `enhancer` (Booster that adds quality). Booster status enum: `installed | missing | failed | degraded`.
- `model_profile.tier`: `T1 | T2 | T3` — behavior rules in section 7.
- `milestones`: top-level only — filled at S8, one entry per milestone; never mirrored under `pipeline`. `handoff`: filled by /lvp-handoff.

Project status enum: `interview` → `researching` (S5–S6) → `review` (S7–S8) → `bundled` (S9 done) → `building` → `complete`; `error` can occur at any point (recoverable via /lvp-continue, with an `error` event in the Journal).

ID conventions: questions `S<NN>.q<NN>` · features `F-01…` · decisions `D-001…` · milestones `M0, M1, …` · loop-backs `L-01…`.

## 3. Journal (`journal.ndjson`)

Append-only; never rewritten. Every state mutation emits at least one event; `answer_recorded` fires per answer (that is the Checkpoint granularity). Each line:

```json
{"ts": "2026-11-08T09:00:00Z", "seq": 1, "type": "answer_recorded", "payload": { }}
```

Event types: `session_start`, `folder_gate_passed`, `folder_gate_rejected`, `folder_gate_subfolder_created`, `tier_declared`, `capability_probe_passed`, `capability_probe_failed`, `context_guard_triggered`, `truncation_recovered`, `tier_changed`, `booster_check`, `booster_install_ok`, `booster_install_failed`, `booster_choice`, `section_start`, `section_done`, `section_blocked`, `answer_recorded`, `loop_back_opened`, `loop_back_closed`, `scope_locked`, `doc_generated`, `handoff_started`, `gap_found`, `handoff_done`, `recheck_started`, `recheck_finding`, `recheck_research_refresh`, `recheck_fix_applied`, `recheck_done`, `feature_started`, `feature_captured`, `feature_research`, `impact_analysis`, `feature_scope_decision`, `feature_applied`, `feature_done`, `error`, `resume`.

## 4. Language rules

- English is the source of truth for all artifacts. There are no stored translation files; output is translated to User Language dynamically at runtime.
- All interaction with the user happens in User Language.
- Section Records keep the user's answers verbatim in User Language; the Conductor adds an English summary per answer.
- Feature names: the S4 record keeps the user's verbatim words; each F-NN also carries a coined English display name — that English name is what SPEC/requirements.md, USER_FLOWS.md, and blueprint.json use.
- S9 compiles English documents from the summaries; OVERVIEW.md additionally reflects the verbatim intent.
- Deep research (S5) runs on English sources; results are summarized in English.

## 5. Section map

Sections run strictly in order, except loop-backs opened by the Feasibility Loop (S6). Questions come in micro-batches (size by tier, section 7), phrased in User Language with a one-line reason why each question matters. Controls are always visible: skip (recorded, does not block) and "that's enough for this Section" (jump to the exit-criteria check). Recorded answers are never re-asked.

| Section | Purpose (one line) | Output record | Bundle contribution |
|---|---|---|---|
| S0 Intake | Capture the raw idea fully; detect User Language; propose slug + name | `S0-intake.md` | project metadata (`idea_raw`, `user_language`) |
| S1 Context | Problem, target users, platform shape, what "working" means for the user | `S1-context.md` | `SPEC/prd.md` |
| S2 Conditions | What the user already has and can pay: devices, accounts, hosting, budget ceiling | `S2-kondisi.md` | `DECISIONS.md` (platform, budget), `HANDOVER.md` (deploy target) |
| S3 Data & privacy | Login, personal data, payments, third-party services, where data may legally live | `S3-data.md` | `SPEC/data-model.md`, `SPEC/api.md`, `SECURITY.md` |
| S4 Features | Feature expectations in detail, iteratively until the user says "enough" | `S4-fitur.md` | `SPEC/requirements.md`, `USER_FLOWS.md` |
| S5 Deep research | Competitor scan, stack candidates with reasons, cost table, regional availability | `S5-research.md` | `RESEARCH.md` |
| S6 Feasibility Loop | Confront research findings with answers; open conflicts, risks, cost surprises | risks appended to `S5-research.md` | risk list in `RESEARCH.md`; accepted risks become decisions |
| S7 Scope lock | Freeze the MVP: every feature → `in-MVP` or Parking Lot (recorded, never deleted) | `S7-scope.md` | `SCOPE.md` |
| S8 Milestone plan | Break the MVP into M0…Mn, each independently verifiable | `S8-milestones.md` | `MILESTONES.md`, `VERIFICATION.md` |
| S9 Compile | Compile Section Records + decisions + milestones into the Blueprint Bundle | (bundle files) | all bundle files (section 8) |
| S10 Build | Out of v0 scope; the bundle must be sufficient for any builder | — | — |

Hard rules: if the chosen platform needs a paid account the user lacks, surface it during S2 with the price (do not defer it to research); any blocking risk in S6 makes a loop-back mandatory; scope lock is mandatory before S8; every Acceptance Criterion from S8 must be machine-checkable or scripted (never "looks good").

Post-lock additions: `/lvp-add-feature` records captures in `.lvp/docs/sections/S4-additions.md` (append-only) and edits the bundle directly; done Section Records are never mutated, and S9 does not compile the additions file.

## 6. Folder Gate

Mandatory first step of idea init. Check in this order:

1. cwd contains `.lvp/state.json` → refuse init. Print the progress summary and recommend /lvp-continue.
2. cwd is empty (ignore OS junk: `.DS_Store`, `Thumbs.db`, `desktop.ini`) → proceed in place.
3. cwd has project markers (`.git`, `package.json`, `Cargo.toml`, `pubspec.yaml`, `pyproject.toml`, `go.mod`, `.solution`, `*.csproj`, …) and no `.lvp/` → refuse: an existing project lives here. Recommend running init in an empty or new folder; offer the generic audit skill (/lvp-recheck-plan) for that project.
4. cwd has at least one subdirectory with project markers (e.g. a projects root) → create the subfolder `./<slug>/` (slug from the idea, confirm with the user) and proceed there. Journal: `folder_gate_subfolder_created`.
5. cwd is non-empty with no markers (loose files) → ask the user: proceed here or create a subfolder (recommend the subfolder).

## 7. Model tiers

The pipeline must complete on any model the harness offers. Its memory lives on disk, never in the context window; the window is a workbench reloaded from disk, not a warehouse.

| Tier | Class | Input context | Max output | Examples |
|---|---|---|---|---|
| T1 | 1M-class APIs (frontier and flash) | 1M–1.05M | 64k–128k+ | Gemini 4 / 3.6 Flash, GPT-6 family, Claude 5.x, DeepSeek V4 |
| T2 | open-weight mid | 128k–262k | often unpublished | Qwen3.5, Llama 4, Gemma 3 27B |
| T3 | compact/local | 32k–128k | small | Mistral Small, small Gemma/Qwen |

Harness overhead (system prompt, tool definitions, skills) eats ~30k–85k tokens before any user content: T2/T3 budgets must subtract it. "Flash" no longer implies a small window; only Flash-Lite/nano and open small models are small.

Tier declaration and probe: the user declares the tier (or it is read from harness config) and it is stored in `model_profile.tier`. The capability probe is mandatory for T2/T3 and skipped for a declared T1: before S1, the model must produce a small strict-JSON object, follow a 3-step instruction in order, and continue an unfinished sentence correctly. Probe failure → refuse to run (the saved State stays safe) and journal `capability_probe_failed`.

Per-tier behavior rules:

| Behavior | T1 | T2 | T3 |
|---|---|---|---|
| Question micro-batch | up to 3 | up to 2 | 1 |
| Research (S5) | full queries | split into sub-queries; append RESEARCH.md incrementally | one sub-topic per turn; append every step |
| Bundle compile (S9) | one file per turn | one file per turn | one file section per turn (append-chunks) |
| Reload discipline | on Section start | on Section start | every turn: load only principles + `state.json` + the current Section's spec slice + the current record — never the transcript |
| Booster loading | per Section | per Section, one at a time | only the one in use; drop after use |

Context guard (input side): watch for repeated instruction-following failures, forgotten rules stated earlier, and tool-call confusion. Respond in order: checkpoint immediately (`context_guard_triggered`) → drop to a stricter reload discipline → if unresolved, stop cleanly and hand over to /lvp-continue (fresh window, disk intact). Never push through with degraded attention.

Truncation self-recovery (output side): detect `finishReason=length`, a mid-sentence cutoff, or a missing required section of a file. Recover by append-continue: reload the last complete block from the file on disk, continue exactly from there with no repetition, and append; repeat until the file's required structure is complete. Checkpoint `truncation_recovered` after every successful append. Never regenerate from scratch what can be continued; never save a truncated file as complete.

Cross-model resume: on /lvp-continue, a tier change compared to `model_profile.tier` → journal `tier_changed`, re-apply this section's rules for the new tier, and warn the user when downgrading (probe re-runs). Any model finishes what any model started.

## 8. Blueprint Bundle file list

The bundle lives in the project folder next to `.lvp/` and must be self-sufficient: any harness, with no LVP skills installed, can build the product from it. Files are compiled at S9 (content for RESEARCH.md originates at S5, SCOPE.md at S7). 20 entries; CLAUDE.md and GEMINI.md share the last line.

| File | One-line purpose |
|---|---|
| `AGENTS.md` | Builder entry point: what the product is, how to load context (read DECISIONS → SPEC → MILESTONES), working rules, pointers to all other files |
| `OVERVIEW.md` | Owner document (strictest plain-language rules): what was decided, total cost table, how the product is used, what is parked |
| `DECISIONS.md` | Append-only decision log D-001… with summary, rationale, alternatives considered, date; mirrors `decisions[]` |
| `SPEC/prd.md` | Problem, context, target users, value proposition, goals/non-goals, success metrics |
| `SPEC/requirements.md` | Per feature F-01…: behavior, priority (must/should/could), acceptance criteria |
| `SPEC/data-model.md` | Entities, fields, relations + cardinality, indexes + why, validation rules, sample JSON |
| `SPEC/api.md` | Conventions, endpoint table, request/response examples for critical endpoints, status codes, error format |
| `SPEC/architecture.md` | Stack + reasons (mirrors DECISIONS), components, ASCII data-flow diagram, folder structure, local run instructions, failure points |
| `USER_FLOWS.md` | Per feature: ASCII flow diagram + numbered click-by-click script, happy path and key alternatives |
| `CODE_STYLE.md` | Language/framework conventions, naming, testing expectations, error handling, simplicity rules for the chosen stack |
| `SECURITY.md` | Auth model, PII inventory + protection, secrets handling, dependencies policy, compliance notes (region-appropriate) |
| `RESEARCH.md` | Competitor scan, comparable products, stack comparison with trade-offs, cost table; every claim with source + date |
| `SCOPE.md` | MVP list (F-01…) + Parking Lot, explicit |
| `MILESTONES.md` | M0…Mn: goal, deliverables, Acceptance Criteria, estimate |
| `VERIFICATION.md` | Per milestone: verification procedure (commands, expected outputs, visual checks); global smoke test; "definition of verified" |
| `ASSUMPTIONS.md` | Every decision not `user_confirmed`, each with why + how to replace or confirm it |
| `HANDOVER.md` | Owner document: run, deploy, update, back up; where secrets and API keys live; who to ask what |
| `CAPABILITIES.md` | Recommended Boosters for this stack (from the Capability Registry), license-tagged; NC items marked runtime-dependency-only |
| `blueprint.json` | Machine snapshot for UI and harnesses; derived file — regenerate it, never hand-edit |
| `CLAUDE.md`, `GEMINI.md` | One-line stubs pointing to AGENTS.md |

Format rules for all files: GitHub-flavored Markdown · English · no Mermaid (ASCII diagrams only) · plain-language rules · identical stack, entity, and feature names everywhere.

## 9. Checkpoint rules

A Checkpoint = one Journal write + one State write, together.

Checkpoint moments: every answer · every Section start and done · every Booster install or choice · every generated file · every error · each Handoff step.

- Interruption-safe: a session that dies leaves a consistent `state.json` at the last checkpoint; work loss is at most the current unanswered micro-batch.
- Rebuild: load `state.json`; if it is unreadable, replay the Journal and report what was reconstructed.
- Idempotency: Sections marked `done` are never re-run; re-running the Handoff re-lints instead of regenerating; regeneration is explicit and per file.
