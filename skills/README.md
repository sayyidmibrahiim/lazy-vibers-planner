# LVP Pipeline Skills

Installable agent skills for the **Lazy Vibe Planner (LVP)** pipeline: a model-agnostic interview flow that turns a raw product idea from a non-technical owner into a verified Blueprint Bundle (spec, data model, milestones, costs) — through Sections S0–S9 with disk-based state, evidence-first research, and anti-yes-man questioning. Any harness that can read a `SKILL.md` can run it.

## The one-folder-one-product model

One project folder = one idea = one product. An installed LVP skill never writes outside the folder it was run in: it creates `.lvp/` (state, append-only journal, Section Records) inside the project folder and refuses to mix two ideas into one folder. Installing the skills does not touch your projects; it only teaches the agent the pipeline.

## Repo layout

```
skills/
├── lvp-init-new-idea/        The installable skill (one folder per skill)
│   ├── SKILL.md              Skill entrypoint (YAML frontmatter: name + description)
│   └── references/           Self-contained reference material the skill loads
│       ├── principles.md     The 13 LVP principles (the Constitution)
│       ├── conventions.md    Operational manual (state schema, journal, tiers)
│       └── sections/         Question banks: S1-context.md, S2-conditions.md,
│                             S3-data-privacy.md, S4-features.md
├── lvp-principles.md         Canonical source copy (NOT installed — see note)
└── lvp-conventions.md        Canonical source copy (NOT installed — see note)
```

The loose `lvp-*.md` files at the top of `skills/` are the repo's canonical copies, mirrored verbatim into each skill's `references/`. Only the `lvp-*/` folders (a folder with a `SKILL.md`) are skills and get installed. More pipeline skills (`/lvp-continue`, `/lvp-handoff`, …) will appear here as additional `lvp-<name>/` folders.

## Install (preferred): `npx skills add`

The [skills CLI](https://github.com/vercel-labs/skills) discovers skills at `skills/<name>/SKILL.md` in a repo — this repo already matches that layout, no flags or config needed:

```bash
npx skills add <owner>/lazy-vibers-planner
```

- It walks the repo's `skills/` directories, finds every `lvp-<name>/SKILL.md`, and installs those skill folders (including their `references/`) into the coding agent(s) it detects — you pick the agent(s) interactively.
- Scope: installed into the current project by default; add `-g` to install globally (available in every project).
- To install one skill only or pick an agent explicitly: `npx skills add <owner>/lazy-vibers-planner --skill lvp-init-new-idea -a claude-code`.
- It does not install the loose top-level `lvp-*.md` source copies and does not create `.lvp/` anywhere — project folders are created by the skill at runtime.

## Manual install (any harness)

A skill is just a folder — copy it into the harness's skills directory. Copy the whole `lvp-init-new-idea/` folder (with `references/`), never just the `SKILL.md`:

```bash
cp -r skills/lvp-init-new-idea <destination>/
```

| Harness | Project scope | Global scope |
|---|---|---|
| ZCode | `.zcode/skills/` | `~/.zcode/skills/` |
| Claude Code | `.claude/skills/` | `~/.claude/skills/` |
| Codex | `.agents/skills/` | `~/.agents/skills/` |
| Gemini CLI | `.agents/skills/` (alias) or `.gemini/skills/` | `~/.agents/skills/` (alias) or `~/.gemini/skills/` |

Project scope = only inside that project (put the folder in the project repo); global scope = every session of that harness. Gemini CLI has no config line to set for skills — it discovers `SKILL.md` folders natively (its `.agents/skills/` alias takes precedence over `.gemini/skills/` within the same tier). The unrelated `contextFileName` setting in `.gemini/settings.json` only renames GEMINI.md context files, not skills. Codex reads the shared `.agents/skills/` location used by several harnesses, so one manual copy there can serve multiple tools.

## What a correct install looks like

After installing, the skill folder at the destination must contain exactly:

```
lvp-init-new-idea/
├── SKILL.md
└── references/
    ├── principles.md
    ├── conventions.md
    └── sections/
        ├── S1-context.md
        ├── S2-conditions.md
        ├── S3-data-privacy.md
        └── S4-features.md
```

The skill is self-contained: it references only paths inside its own folder (`references/…`) and, at runtime, the `.lvp/` folder of the project it is run in. Smoke test: open the harness in an empty folder, ask for a new product idea, and confirm the skill runs the Folder Gate and starts S0 intake.

## Uninstall

Delete the skill folder from the harness's skills directory (the destinations in the table above). For a manual install, remove what you copied, e.g.:

```bash
rm -r ~/.claude/skills/lvp-init-new-idea    # or .claude/skills/, .agents/skills/, .gemini/skills/, .zcode/skills/ …
```

For a `npx skills add` install, remove the same folder from the harness directory it reported, or use `npx skills list` in the project to see what was installed. Skills do not add config lines or hooks anywhere, so folder removal is the complete uninstall. Project folders created by the pipeline (`.lvp/`) are your data — the skills never remove them.

## License

LVP skill files in this repo are permissive (permissive-first policy, [ADR-0001](../docs/adr/0001-permissive-first-license-policy.md)): no non-commercial (NC) content is copied or derived into any skill file. NC-licensed Boosters the pipeline depends on are **runtime dependencies**: installed separately at runtime by the skill's booster bootstrap, credited, and never vendored into this repo, the skill folders, or any generated artifact. Add a top-level `LICENSE` file to this repo before public distribution.
