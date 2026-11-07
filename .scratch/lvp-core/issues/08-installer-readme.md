# 08: Installer + README

**What to build:** Make the skills installable outside this repo: `skills/` layout compatible with cross-harness installers (`npx skills add <repo>`), per-harness install + uninstall instructions (zcode, Claude Code, Codex, Gemini CLI) in the README, and a pointer from the repo's AGENTS.md so any agent landing here finds the pipeline.

**Blocked by:** 03 (init must exist — the install smoke test runs it).

**Status:** done (2026-11-08) — live `npx skills add sayyidmibrahiim/lazy-vibers-planner` verified post-push: first run exposed a real bug (the CLI clones the DEFAULT branch; skills lived only on the feature branch → "No skills found"), fixed by merging feat/lvp-pipeline-core → master; re-run installed all 3 skills to `.agents/skills/` with CLI-confirmed universal harness support ("Codex, OpenCode, Amp, Antigravity CLI +17 more", symlinked Claude Code). A project-scoped ZCode install was skipped by the CLI only because the test folder had no `.zcode/` dir. Remaining unverified: an interactive skill run (Folder Gate + S0) inside a real harness — owner's manual test.

- [x] `npx skills add` (or equivalent manual copy path) installs the skills into a harness other than the dev environment
- [x] Smoke test in that harness: skill files install correctly (frontmatter + references verified); interactive Folder Gate run = owner's manual test
- [x] README documents install, uninstall, and the one-folder-one-product model
- [x] Repo AGENTS.md points to the skills and the spec
- [x] No NC-licensed content vendored anywhere (ADR-0001)
