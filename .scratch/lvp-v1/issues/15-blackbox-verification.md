# 15: Black-box verification on dogfood bundle

**What to build:** Run each v1 skill contract against a copy of `.scratch/lvp-core/dogfood/run/` in `/tmp/opencode`; fix contract gaps found.

**Blocked by:** 14

**Status:** done

- [x] Recheck on dogfood copy produces findings report and applies one mechanical fix
- [x] Add-feature on the copy appends one F-NN + decision + milestone without renumbering
- [x] Build executes one verification procedure and records real output
- [x] Personal-brand refuses before live gate, passes with a stubbed live check in the fixture
- [x] v0 skills unchanged; local `npx skills add` discovers seven folders
- [x] `npm run lint`, `npx tsc --noEmit`, `npm run build` green
