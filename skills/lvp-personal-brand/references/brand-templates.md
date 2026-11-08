# Brand Templates

Companion to `/lvp-personal-brand`. Three files, one evidence rule: every claim about the product or the owner traces to the bundle or the live product. Nothing is invented.

Output folder: `brand/` in the project folder, beside the Blueprint Bundle. These files are never part of the bundle and never change it.

## Evidence table first

Before drafting, build this table from the bundle + live check:

```
claim | evidence | status
"works with X" | VERIFICATION.md M2 PASS | verified
"handles N users" | none | forbidden
"built solo in N weeks" | journal timestamps | verified
"used by <company>" | none | forbidden
```

Rules:

- `verified` = a captured verification result, a live page fact, or a recorded user answer.
- `unverified` = the owner says it but no artifact proves it; it may appear only with the owner's explicit approval and a `(claimed)` marker.
- `forbidden` = invented metrics, users, revenue, awards, or endorsements. Never write them, even as a placeholder.

## 1. `brand/BRAND.md`

```markdown
# <Product> — Brand

## One line
<what the product does, for whom, and the change it creates — max 20 words>

## Audience
- Primary: <named kind of person> · evidence: <S1 record / decisions>
- Secondary: <named kind> · evidence: <...>

## Problem
<the concrete moment the audience has today; from S1, no category words>

## Positioning
For <audience> who <problem>, <product> is a <category> that <differentiator>.
Unlike <alternative>, it <proof-backed difference>.

## Message pillars
1. <pillar> — proof: <verified feature / milestone / live URL>
2. <pillar> — proof: <...>
3. <pillar> — proof: <...>

## Voice
- Tone: <plain | warm | technical | playful> · <why>
- Do: <short sentences, concrete verbs, real numbers only>
- Don't: <hype, superlatives, invented traction, em dash chains>

## Boilerplate bio (short / long)
- Short (25 words): <...>
- Long (60 words): <...>

## Links
- Product: <live URL, verified <date>>
- Source: <repo or none>
```

## 2. `brand/LINKEDIN-PROFILE.md`

```markdown
# LinkedIn Profile — <owner name>

## Headline options
1. <role + product + audience> (max 220 chars)
2. <outcome-led variant>
3. <builder-led variant>

## About
<first person, 3 short paragraphs: the problem seen, what was built, what it proves.
Every product claim carries the same evidence rule. No metrics without a source.>

## Experience entry
**<Title> — <Product>** · <start year> – Present
- Built <what>, verified by <milestone / live check>.
- <one user-visible outcome, evidence-backed>
- Stack: <from DECISIONS.md>

## Featured
- <live product URL> — verified <date>
- <repo / case study / none>

## Skills
<10–15, ordered by what the product proves>

## Open questions for the owner
- <anything the bundle cannot answer>
```

## 3. `brand/CONTENT-PLAN.md`

```markdown
# Content Plan — <Product>

Goal: <job / consulting / product users / community> · cadence: <n posts/week for <n> weeks>

| # | Pillar | Hook | Evidence | Format | CTA |
|---|---|---|---|---|---|
| 1 | <pillar> | <first line> | <verified feature / build log> | text / demo / screenshot | <...> |
| ... | | | | | |

## Posting rules
- Every post makes one point, backed by one piece of real evidence.
- No engagement bait, no invented numbers, no reposted AI slop.
- The owner posts manually; this plan never posts anything.

## Repurpose
- <one demo clip → 3 posts>
- <one build log → 1 carousel>
```

## Self-check before close

- [ ] Every product claim appears in the evidence table as `verified` or owner-approved `(claimed)`.
- [ ] No metric, user count, revenue, award, or endorsement without evidence.
- [ ] Product name and one-line match `OVERVIEW.md` and `blueprint.json`.
- [ ] Links resolve; the live URL check passed this run.
- [ ] Files live under `brand/`, not in the bundle.
- [ ] Nothing was posted, scheduled, or sent to a platform.
