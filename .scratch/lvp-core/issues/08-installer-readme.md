# 08: Installer + README

**What to build:** Make the skills installable outside this repo: `skills/` layout compatible with cross-harness installers (`npx skills add <repo>`), per-harness install + uninstall instructions (zcode, Claude Code, Codex, Gemini CLI) in the README, and a pointer from the repo's AGENTS.md so any agent landing here finds the pipeline.

**Blocked by:** 03 (init must exist — the install smoke test runs it).

**Status:** ready-for-agent

- [ ] `npx skills add` (or equivalent manual copy path) installs the skills into a harness other than the dev environment
- [ ] Smoke test in that harness: skill loads, Folder Gate runs, S0 completes
- [ ] README documents install, uninstall, and the one-folder-one-product model
- [ ] Repo AGENTS.md points to the skills and the spec
- [ ] No NC-licensed content vendored anywhere (ADR-0001)
