# Lazy Vibe Planner

Turn a raw idea into a verified Blueprint Bundle that any AI agent can build.

## What it is

This repo holds two related things.

The LVP skills are portable agent skills for the LVP pipeline. The pipeline interviews a non-technical owner through sections S0 to S9. The result is a verified Blueprint Bundle of 20 files that any AI agent can build from.

The web MVP is a local Next.js app. You write an idea and answer four interview questions. The app then generates five markdown documents: PRD, requirements, data model, API contract, and architecture. Generation runs through an OpenAI-compatible LLM proxy. The app is single-user and has no auth.

The web MVP is an early prototype. The LVP skills are the complete pipeline, and they run on any harness that reads a SKILL.md file.

## How the pipeline works

Each skill is one folder with a SKILL.md file and its own references. The table is the short map. The full catalog is in [skills/README.md](skills/README.md).

| Skill | What it does | Result |
|---|---|---|
| `/lvp-init-new-idea` | Runs the Folder Gate and the interview S0–S9 (intake, context, conditions, data and privacy, features, deep research, feasibility loop, scope lock, milestone plan, compile) | A Blueprint Bundle of 20 files in the project folder |
| `/lvp-continue` | Resumes a run or rebuilds the state from the journal | A restored state and an offer of the next step |
| `/lvp-handoff` | Lints all 20 bundle files, emits `blueprint.json`, and writes the builder stubs | A bundle ready for any builder harness |
| `/lvp-recheck-plan` | Runs the adversarial audit R1–R6 | A RECHECK report and applied fixes |
| `/lvp-add-feature` | Adds one post-lock feature through a mini-pipeline | An updated bundle, append-only |
| `/lvp-build` | Executes the milestones and runs each verification procedure | A build log with verified milestones |
| `/lvp-personal-brand` | Builds a brand kit after the milestones are verified | Three files in `brand/` |

## State and rebuild guarantee

One folder is one product. Every project folder holds a `.lvp/` folder. It stores `state.json`, the append-only `journal.ndjson`, and the Section Records. The journal records every answer with its verbatim question and answer text. If `state.json` is damaged, `/lvp-continue` rebuilds it by replaying the journal. The skills never degrade in silence.

## Install the skills

The preferred install is the skills CLI:

```bash
npx skills add <owner>/lazy-vibers-planner
```

You can also copy a skill folder into the skills directory of your harness. Supported harnesses include ZCode, Claude Code, Codex, and Gemini CLI. See [skills/README.md](skills/README.md) for the full install table and the uninstall steps.

## Web MVP quick start

The web app needs Node.js 24 or newer. It stores data in SQLite through `node:sqlite`.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Generation needs the LLM proxy at `127.0.0.1:17070`. If the proxy is down, generation fails with a 502 error.

All settings are optional. Copy `.env.example` to `.env.local` only to override defaults.

For production, run:

```bash
npm run build
npm start
```

The app has no auth. To limit access to loopback, run:

```bash
npm start -- -H 127.0.0.1
```

## Language note

The skill files and the spec docs are English. The web app UI, its prompts, and its error messages are Bahasa Indonesia by design.

## Docs

- [docs/spec/00-overview.md](docs/spec/00-overview.md): the spec overview. Read it first. The spec continues through 06.
- [GLOSSARY.md](GLOSSARY.md): the domain glossary.
- [docs/adr/](docs/adr/): the architecture decision records.
- [AGENTS.md](AGENTS.md): the contract for contributors and agents.
- [skills/README.md](skills/README.md): the skill catalog and install details.

## License

The repo is licensed under MIT. See [LICENSE](LICENSE). The skills follow a permissive-first policy ([ADR-0001](docs/adr/0001-permissive-first-license-policy.md)): boosters with NC licenses are runtime dependencies, credited and never vendored.
