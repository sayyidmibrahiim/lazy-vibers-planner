# Spec 06 — Model Tiers, Context Guards, Self-Recovery

LVP must complete the full pipeline on **any** model the harness offers — frontier, flash, open-weight, or local small. The pipeline's memory lives in `.lvp/` (disk), never in the context window; the window is a workbench that gets reloaded from disk, not a warehouse (ADR-0006).

## Verified context landscape (2026-11-08, primary sources)

| Tier | Class | Input context | Max output | Examples |
|---|---|---|---|---|
| **T1** | 1M-class APIs (frontier AND flash) | 1M–1.05M | 64k–128k+ | Gemini 4/3.6 Flash, GPT-6 family, Claude 5.x, DeepSeek V4 |
| **T2** | open-weight mid | 128k–262k | often unpublished | Qwen3.5, Llama 4, Gemma 3 27B |
| **T3** | compact/local | 32k–128k | small | Mistral Small, small Gemma/Qwen |

Caveats baked into rules: harness overhead (system prompt + tool defs + skills) eats ~30k–85k tokens before user content — T2/T3 budgets must subtract it; "flash" no longer implies a smaller window (only Flash-Lite/nano and open small models do).

## Tier declaration (bootstrap, after Folder Gate)

1. **Declared first**: the skill asks the user (one plain question: "model di harness ini besar, sedang, atau kecil?") or reads it from harness config where available. Stored as `model_profile.tier` (T1|T2|T3).
2. **Capability probe (mandatory for T2/T3, skipped for declared T1 — T1 stores `probe: "skipped"`)**: before S1 and **before the booster bootstrap** (fail-fast: an incapable model is refused before any install work), the model must pass a mini-probe — produce a small strict-JSON object, follow a 3-step instruction in order, and continue an unfinished sentence correctly. Fail → the pipeline **refuses** with guidance ("use a larger model"; before S0 nothing is captured, so nothing is lost) — journals `capability_probe_failed`. A pipeline that limps on an incapable model would produce silently bad bundles; refusing is the honest gate.
3. Journal: `tier_declared`, `capability_probe_passed|failed`.

## Per-tier behavior rules

| Behavior | T1 | T2 | T3 |
|---|---|---|---|
| Question micro-batch size | up to 3 | up to 2 | 1 |
| Research (S5) | full queries | split into sub-queries, append RESEARCH.md incrementally | single sub-topic per turn, append every step |
| Bundle compile (S9) | one file per turn | one file per turn | one file **section** per turn (append-chunks) |
| Reload discipline | on section start | on section start | on **every** turn: load only principles + `state.json` + current section spec slice + current record — never the transcript |
| Booster loading | per Section (ADR-0005) | per Section, one at a time | only the one in use, drop after use |

## Context guard (input side)

Signals the Conductor watches: repeated instruction-following failures, forgetting rules stated earlier, tool-call confusion. Response, in order: (1) checkpoint immediately (`context_guard_triggered`), (2) drop to stricter reload discipline, (3) if unresolved → stop cleanly and hand to `/lvp-continue` (fresh window, disk intact). Never push through with degraded attention — silent quality loss is worse than stopping.

## Truncation self-recovery (output side)

Small max-output is the more common failure (long bundle files on T2/T3).

1. Detect: `finishReason=length`, mid-sentence cutoff, missing required section of a file.
2. Recover: **append-continue** — reload the last complete block from the file on disk, instruct "continue exactly from there, no repetition", append. Repeat until the file's required structure is complete.
3. Every successful append → checkpoint (`truncation_recovered`). A file is `done` only when its required structure (per `04-bundle.md`) is present.
4. Never regenerate from scratch what can be continued; never save a truncated file as complete.

## Cross-model resume

`model_profile.tier` lives in `state.json`. On `/lvp-continue`, a tier change (bigger model resumed a small-model session or vice versa) → journal `tier_changed`, re-apply this spec's rules for the new tier, warn the user if downgrading (probe re-runs). Any model finishes what any model started — that is the contract.
