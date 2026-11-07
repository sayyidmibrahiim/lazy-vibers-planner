# Spec 05 — Boosters (dependency model)

Boosters are external, verified skills/MCPs treated as **essential dependencies** (ADR-0004). The Conductor guarantees their presence before the work that needs them — quality is never silently degraded.

## Tiers

| Tier | Meaning | On failure (harness forbids install, offline, missing API key) |
|---|---|---|
| **core** | Output quality guarantee depends on it | **Never silent.** Pipeline stops the affected step and offers the user explicit options: (a) help me install fully (guided, per-harness), (b) continue with output marked `degraded` in state + journal + OVERVIEW note, (c) stop here |
| **enhancer** | Makes output better | Continue, mark `degraded`, note in journal and final OVERVIEW |

## Core boosters (v0)

| Booster | Repo | License | Used at |
|---|---|---|---|
| pm-skills interview patterns | `product-on-purpose/pm-skills` | Apache-2.0 | S1, S4 |
| OpenSpec pattern (structure reference) | `Fission-AI/OpenSpec` | MIT | S9 |
| SimpleEnglish (document-rule subset) | `AminBlg/SimpleEnglish` | MIT | S9 (+OVERVIEW strictest) |
| humanizer (de-slop pass) | `blader/humanizer` | MIT | S9 |
| karpathy-guidelines | `multica-ai/andrej-karpathy-skills` | MIT | S9 (CODE_STYLE), S10 |
| ponytail | `DietrichGebert/ponytail` | MIT | S9 (CODE_STYLE), S10 |
| competitor-analysis / web search | `browserbase/skills` or Firecrawl MCP | MIT | S5 |
| Playwright MCP | `microsoft/playwright-mcp` | MIT | S10 verification (when build runs) |
| agents.md spec | `agentsmd/agents.md` | (spec text, permissive) | S9 |

NC-licensed candidates (e.g. `deanpeters/Product-Manager-Skills`, CC BY-NC-SA 4.0) are **allowed as runtime dependencies only** (install at runtime, credit, never copy content into LVP files) and are flagged in CAPABILITIES.md with the commercialization reminder (ADR-0001).

## Bootstrap check (start of `/lvp-init-new-idea`, after Folder Gate)

1. Read `boosters[]` from `state.json` (fresh project → all `missing`).
2. For each core booster: detect presence (harness skill list, known install paths). Missing → install:
   - Preferred: `npx skills add <repo>` (cross-harness installer).
   - Claude Code: `claude plugin marketplace add <repo>` + install.
   - Fallback: copy the skill folder into the harness's skills directory.
3. Journal `booster_check` + `booster_install_ok|failed` per booster.
4. Failure → **interactive choice** (see tiers). User choice → journal `booster_choice`, booster status `installed|failed|degraded`.
5. MCP-type boosters need runtime keys (e.g. Firecrawl): check config presence the same way; missing key → same interactive choice.

## Maintenance

- The Capability Registry (`docs/research/agent-skill-catalog.md`) is the source of candidates; re-verify quarterly (stars, activity, license).
- Adding a core booster = spec change (this file + `02-sections.md` routing) + registry entry; never a silent skill-file edit.
- Removal/deprecation: keep the old entry listed as deprecated for one minor version so existing bundles' CAPABILITIES.md stay explainable.
