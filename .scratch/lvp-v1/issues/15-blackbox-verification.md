# 15: Black-box verification on dogfood bundle

**What to build:** Run each v1 skill contract against a copy of `.scratch/lvp-core/dogfood/run/` in `/tmp/opencode`; fix contract gaps found.

**Blocked by:** 14

**Status:** ready-for-agent

- [ ] Recheck on dogfood copy produces findings report and applies one mechanical fix
- [ ] Add-feature on the copy appends one F-NN + decision + milestone without renumbering
- [ ] Build executes one verification procedure and records real output
- [ ] Personal-brand refuses before live gate, passes with a stubbed live check in the fixture
- [ ] v0 skills unchanged; local `npx skills add` discovers seven folders
- [ ] `npm run lint`, `npx tsc --noEmit`, `npm run build` green
