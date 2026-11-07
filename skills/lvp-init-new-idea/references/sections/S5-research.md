# S5 research guide — Deep research

Work guide for Section S5. The English text is the source; research runs on English sources and findings are summarized in English (conventions §4). S5 is mostly Conductor work — the few user questions are at the bottom. Record: `PROJECT_DIR/.lvp/docs/sections/S5-research.md`; findings are appended to it per sub-query, never held whole in context (principle 13).

Booster note: competitor-analysis / web search (browserbase `competitor-analysis`, or the Firecrawl MCP; status in `boosters.core`). Present → real web research. Any other status → model-knowledge fallback with EVERY claim flagged `unverified` (ADR-0004 degraded mode), and the record opens with `Booster: competitor-analysis (degraded — model-knowledge fallback)` so S9 surfaces it in OVERVIEW.md.

## Claim discipline (principle 1)

- Every claim line is one of exactly two shapes:
  - `<claim> (source: <URL>, accessed <YYYY-MM-DD>)`
  - `<claim> unverified` — model knowledge, explicitly flagged, loud. Nothing in between.
- Reuse, do not re-research, what the S2 fact-sheet already verified: cite the S2 record's price rows instead of re-fetching them. Re-verify live only rows being newly quoted here.
- Any price shown to the user follows the S2 rule: verified with source + date, or `unverified` next to the number.

## Sub-query plan (chunking by tier, conventions §7)

T1 runs the four outputs as full queries. T2 splits each output into sub-queries and appends findings to the record before the next sub-query starts. T3 runs one sub-topic per turn and appends every step. The file on disk is the memory; `/lvp-continue` resumes from the last complete sub-query.

1. **Competitor scan**: (a) products that solve the S1 problem statement; (b) each one's pricing model; (c) adjacent tools and the workarounds people tolerate today (the S1 workaround answer names one).
2. **Stack options**: (a) hosting/deploy candidates against the S2 budget + hands-on answers; (b) data/auth layers against the S3 answers; (c) what the S4 must-features demand (files? background jobs? offline?).
3. **Recommended stack**: one pass tying candidates to the recorded answers — no new research, just the tie-break.
4. **Cost table**: (a) recurring costs of the recommended stack, built on the fact-sheet rows; (b) payment-gateway availability in the user's market (S2 country answer + S3 payments answer); (c) store fees when S1 puts a store in play.

## Output templates

Competitor scan — ≥3 rows; direct = solves the same problem, adjacent = the workaround users tolerate:

| Product | What it does | Pricing model | Lesson for this idea | Source (accessed) |
|---|---|---|---|---|

Stack trade-offs — ≥2 candidates; the recommendation is argued after the table, not inside it:

| Dimension | Option A | Option B |
|---|---|---|
| Fits the S2 budget ceiling | | |
| Fits the S2 hands-on/maintenance answer | | |
| Covers the S3 auth/payments answers | | |
| Carries the S4 must-features | | |
| Regional availability | | |
| Maintenance burden | | |

Cost table — build on the S2 fact-sheet; cite its rows, add what is new:

| Item | Price | Type | Source (accessed) | Status |
|---|---|---|---|---|

Plus a `## Regional availability` subsection: payment gateways that work in the user's market, store availability when a store is in play, and data-location constraints inherited from S2/S3.

## User questions (rare, targeted — `S5.qNN` ids in ask order)

Bank order is not ask order; ask only when a finding needs a fact no record holds. Controls (skip, "enough for this Section") follow the engine.

### 1. Which competitor matters
- **Ask:** "Of these, which one do people actually compare you against today?"
- **Why it matters:** the lesson rows rank against the rival in the user's head, not the biggest name.

### 2. Regional constraint check
- **Ask:** "<finding> — does this apply to you?" (when research surfaces a regional rule the records do not cover)
- **Why it matters:** regional rules prune stacks harder than price does.

### 3. Does the new cost fit
- **Ask:** "The stack I would recommend adds <X> per month. Does that still fit your ceiling?"
- **Why it matters:** a cost surprise belongs on the table now; one the user does not resolve lands in S6 as a blocking risk.

## Degraded mode (booster missing)

No live research happens. Every line carries `unverified`, and the record starts:

> Booster: competitor-analysis (degraded — model-knowledge fallback). Everything below is model knowledge, unverified; prices and availability especially may be stale.

Keep the four outputs and their structure — the shape survives, the certainty does not. S6 still runs; its confrontations simply cite `unverified` rows.
