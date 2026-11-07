# Capabilities

The nine core boosters recommended for this project's pipeline and stack, from the Capability Registry (license-tagged). None are NC-licensed, so none are runtime-dependency-only; all may be vendored or installed outright. Boosters marked "used at" a pipeline Section shaped this bundle's rules; the ones marked "at build time" help the builder during S10 and after.

Note from this planning run: all nine were recorded as present but ran as a simulation (their content was not actually loadable in-session — see `OVERVIEW.md → Limitations`). Their rules were applied by hand from the pipeline's internal fallbacks; installing them for real makes future sessions and the build phase stronger.

| Name | Kind | License | Install | Notes |
|---|---|---|---|---|
| pm-skills interview patterns | skill | Apache-2.0 | `npx skills add product-on-purpose/pm-skills` | Interview phrasing patterns (Mom Test, user stories); used at S1/S4 question banks |
| OpenSpec pattern (structure reference) | skill | MIT | `npx skills add Fission-AI/OpenSpec` | Spec structure reference; used at S9 to shape the SPEC files |
| SimpleEnglish (document-rule subset) | skill | MIT | `npx skills add AminBlg/SimpleEnglish` | Document rules: short sentences, active voice, jargon defined on first use; used at S9, strictest on OVERVIEW.md |
| humanizer (de-slop pass) | skill | MIT | `npx skills add blader/humanizer` | De-slop editing pass: concrete and specific, no filler; used at S9 on every bundle file |
| karpathy-guidelines | skill | MIT | `npx skills add multica-ai/andrej-karpathy-skills` | Minimal-sufficient-solution coding guidance; used at S9 (CODE_STYLE.md) and at build time |
| ponytail | skill | MIT | `npx skills add DietrichGebert/ponytail` | No speculative abstraction; used at S9 (CODE_STYLE.md) and at build time |
| competitor-analysis / web search | skill or MCP | MIT | `npx skills add browserbase/skills`, or configure the Firecrawl MCP server | Live web research for competitor/pricing claims; the absence of a live path at S5 is why this bundle carries `unverified` flags — installing it makes future /lvp-recheck-plan research verify them |
| Playwright MCP | mcp | MIT | configure the Playwright MCP server | Browser automation; used at build time for the scripted-tap verifications in VERIFICATION.md |
| agents.md spec | skill | spec text, permissive | `npx skills add agentsmd/agents.md`, or fetch the spec text at use time | The AGENTS.md entry-point convention; used at S9 — this bundle's AGENTS.md follows it |
