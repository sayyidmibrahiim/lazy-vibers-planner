# Spec 01 — State, Folders, Checkpoints

All paths are relative to the **project folder** (created by `/lvp-init-new-idea`, see Folder Gate). One folder = one idea = one product.

## `.lvp/` layout

```
<project-folder>/
├── .lvp/
│   ├── state.json          authoritative snapshot (rewritable)
│   ├── journal.ndjson      append-only event log (never rewritten)
│   ├── docs/
│   │   └── sections/       section records: S0-intake.md, S1-context.md, ...
│   └── recheck/            recheck reports: RECHECK-<date>.md (audit artifacts)
└── (after handoff: bundle files + builder code live here)
```

`state.json` is the source of truth for "where are we". `journal.ndjson` is the audit trail; if `state.json` is corrupted or missing, it is rebuilt by replaying the journal. Section records are the raw material compiled by S9.

## `state.json` schema (v1)

```jsonc
{
  "schema_version": 1,
  "project": {
    "slug": "warung-cashier",            // kebab-case, folder name
    "name": "Warung Cashier",            // display name (locked at S1)
    "idea_raw": "...",                   // verbatim user input, User Language
    "user_language": "id",               // detected at S0, user-correctable
    "created_at": "2026-11-08T09:00:00Z",
    "status": "interview"                // see status enum
  },
  "pipeline": {
    "current_section": "S4",
    "sections": {
      "S0": { "status": "done", "record": "S0-intake.md",
              "started_at": "...", "completed_at": "...",
              "answers": { "q1": { "q": "...", "a": "...", "skipped": false } } },
      "S1": { "status": "in_progress" }  // pending | in_progress | done | blocked
    },
    "loop_backs": [
      { "id": "L-01", "from": "S6", "to": "S3", "reason": "research found cost conflict",
        "opened_at": "...", "resolved_at": null }
    ]
  },
  "decisions": [
    { "id": "D-001", "section": "S2", "summary": "Deploy on VPS user already owns",
      "rationale": "owner pays nothing extra", "status": "user_confirmed" }
    // status: user_confirmed | assumed | designer_filled
    //   assumed         = asked, user skipped/deferred
    //   designer_filled = never surfaced — the user couldn't have known to ask
    // assumed + designer_filled => also listed in ASSUMPTIONS.md
  ],
  "boosters": {
    "core": [
      { "name": "simple-english", "repo": "AminBlg/SimpleEnglish",
        "license": "MIT", "tier": "core", "status": "installed" }
      // status: installed | missing | failed | degraded
    ],
    "enhancer": [ /* same shape */ ]
  },
  "model_profile": { "tier": "T1", "probe": "skipped", "declared_at": "..." },
  // tier: T1 | T2 | T3 — rules in docs/spec/06-model-tiers.md
  // probe: "passed" | "skipped" (T1 skips the probe) | "failed"
  "milestones": [                          // filled at S8
    { "id": "M0", "goal": "...", "features": ["F-01"],
      "verified": false, "verified_at": null }   // verified by /lvp-build
  ],
  "deployment": null,                      // { status: "live|pending", url, verified_at }
  "handoff": null                          // filled at /lvp-handoff
}
```

### Project status enum

`interview` → `researching` (S5–S6) → `review` (S7–S8) → `bundled` (S9 done) → `building` (builder active) → `complete` · `error` (with `error` entry in journal; recoverable via `/lvp-continue`).

### ID conventions

Questions `S<NN>.q<NN>` · Decisions `D-001…` · Milestones `M0, M1, …` · Loop-backs `L-01…`

## `journal.ndjson` event types

Each line: `{"ts": "...", "seq": 1, "type": "...", "payload": { ... }}`

`session_start` · `folder_gate_passed|folder_gate_rejected|folder_gate_subfolder_created` · `tier_declared` · `capability_probe_passed|failed` · `context_guard_triggered` · `truncation_recovered` · `tier_changed` · `booster_check` · `booster_install_ok|failed` · `booster_choice` (user decision on failure) · `section_start|section_done` · `answer_recorded` · `loop_back_opened|closed` · `scope_locked` · `doc_generated` · `handoff_started|gap_found|handoff_done` · `recheck_started|recheck_finding|recheck_research_refresh|recheck_fix_applied|recheck_done` · `feature_started|feature_captured|feature_research|impact_analysis|feature_scope_decision|feature_applied|feature_done` · `build_started|milestone_started|milestone_verified|milestone_failed|build_blocked|deployment_verified|build_done` · `error` · `resume`

Rules: append-only; never rewrite; every state mutation emits at least one event; `answer_recorded` fires **per answer** (checkpoint granularity).

## Section records

File: `.lvp/docs/sections/S<N>-<name>.md` (e.g. `S3-data.md`). Content: the section's questions, the user's verbatim answers (User Language), and the section's decision summary (English, written by the Conductor). These are the **only** inputs S9 compiles, plus `decisions[]` and `milestones[]`.

Language rule: records keep answers verbatim in User Language; the Conductor adds an English summary per answer. S9 compiles English documents from the summaries; OVERVIEW.md additionally reflects the verbatim intent.

## Folder Gate (mandatory first step of `/lvp-init-new-idea`)

1. `cwd` contains `.lvp/state.json` → **refuse init**; print progress summary; recommend `/lvp-continue`.
2. `cwd` is empty (ignore OS junk: `.DS_Store`, `Thumbs.db`, `desktop.ini`) → **proceed in place**.
3. `cwd` has project markers (`.git`, `package.json`, `Cargo.toml`, `pubspec.yaml`, `pyproject.toml`, `go.mod`, `.solution`, `*.csproj`, …) and no `.lvp/` → **refuse**: existing project detected. Recommend running init in an empty/new folder; mention `/lvp-recheck-plan` as the generic audit option for that project.
4. `cwd` has ≥1 subdirectory with project markers (e.g. `~/projects/`) → **create subfolder** `./<slug>/` (slug from idea, confirm with user), proceed there. Journal: `folder_gate_subfolder_created`.
5. `cwd` non-empty, no markers (loose files) → **ask the user**: proceed here or create subfolder (recommend subfolder).

Web UI variant: the UI supplies an absolute path via a folder picker; the same checks run before interview start. UI surfaces the gate result as a screen, not a log line.

## Checkpoint & resume semantics

- **Checkpoint moments** (journal write + state save): every answer, every Section start/done, every booster install/choice, every generated file, every error, handoff steps.
- Interruption-safe: any session that dies leaves a consistent `state.json` (last checkpoint) — work loss is at most the current unanswered micro-batch.
- `/lvp-continue` rebuild: load `state.json`; if unreadable → replay journal; report what was reconstructed.
- Idempotency: sections marked `done` are never re-run; re-running `/lvp-handoff` re-lints instead of regenerating everything (regeneration is explicit, per file).
