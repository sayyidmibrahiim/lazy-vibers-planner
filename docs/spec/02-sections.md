# Spec 02 — Sections S0–S10

Each Section has: **purpose**, **question strategy**, **booster routing**, **output** (section record + state effects), **exit criteria**. Sections run strictly in order, except loop-backs (S6).

## Interview mechanics (all question Sections)

- **Micro-batch adaptive**: 1–3 questions per turn. The Conductor chooses the next batch from the previous answers; batches never exceed 3.
- Every question is phrased in **plain language oriented to the outcome** ("Do you already pay for a server somewhere?" not "Do you have VPS infrastructure?"), spoken in **User Language**, with a one-line reason why it matters.
- Controls always visible: **skip** (recorded, does not block), **cukup/that's enough for this Section** (jump to exit criteria check).
- Every answer → `answer_recorded` (checkpoint). Answers are never re-asked once recorded.

## S0 — Intake

- Purpose: capture the raw idea fully, detect User Language.
- Questions: none structured — free-form "tell me everything in your head", multi-paragraph encouraged. Ask clarifying mini-questions only if the idea is under ~2 sentences.
- Booster: none.
- Output: `S0-intake.md` (verbatim idea + language + working slug); `project.idea_raw`, `user_language`.
- Exit: idea recorded, slug + display name proposed and confirmed (name can still change at S9 branding step).

## S1 — Context awal (what & for whom)

- Purpose: problem, target users, platform shape (web / mobile / desktop / multiple), what "working" means for the user.
- Booster: pm-skills interview patterns (Apache 2.0; `product-on-purpose/pm-skills`). Fallback: internal question bank.
- Output: `S1-context.md`; feeds `SPEC/prd.md`.
- Exit: problem + audience + platform + success picture recorded.

## S2 — Kondisi (resources & constraints)

- Purpose: what the user already has and can pay: devices, accounts (Apple Developer, Play Console, domains), hosting/VPS, monthly budget ceiling, willingness to run commands at all.
- Booster: internal cost fact-sheets + web verification of current prices (each price recorded with source + date; unverifiable → flagged).
- Output: `S2-kondisi.md`; feeds `DECISIONS.md` (platform/budget) and `HANDOVER.md` (deploy target).
- Exit: budget ceiling + deployment surface + accounts list recorded. **Hard rule**: if the chosen platform needs a paid account the user lacks (e.g. iOS → Apple Developer), surface it NOW with price and ask to proceed/defer — do not defer to research.

## S3 — Data & privasi

- Purpose: login? personal data? payments/money? third-party services? where data may legally live.
- Booster: none.
- Output: `S3-data.md`; feeds `SPEC/data-model.md` (auth, PII), `SPEC/api.md`, `SECURITY.md`.
- Exit: data inventory + auth yes/no + payments yes/no recorded.

## S4 — Fitur

- Purpose: feature expectations in detail, iteratively until the user says "enough".
- Booster: Mom Test + user-story/Gherkin patterns (pm-skills). Fallback: internal bank.
- Mechanics: per feature — name, who uses it, step-by-step happy path (the "klik tombol ini → selesai" script), edge cases the user cares about. Features get IDs `F-01…`.
- Output: `S4-fitur.md`; feeds `SPEC/requirements.md` + `USER_FLOWS.md`.
- Post-lock additions: recorded by `/lvp-add-feature` in `S4-additions.md` (append-only); S4 itself is never re-run.
- Exit: user explicitly says enough; feature list has no "and whatever else" placeholders.

## S5 — Deep research

- Purpose: competitor scan, comparable products, tech stack candidates with **reasons**, cost table, availability in the user's region (payment gateways, app stores).
- Booster: browserbase `competitor-analysis` or Firecrawl MCP + web search. Fallback: model knowledge, **every claim flagged `unverified`**.
- Rules: every claim carries source + access date (journal + RESEARCH.md). Research happens in English sources; results summarized in English.
- Output: `S5-research.md`; becomes `RESEARCH.md`.
- Exit: ≥2 stack options with trade-offs + a recommended stack with reasons + cost table.

## S6 — Feasibility loop

- Purpose: confront research findings with answers; open conflicts, risks, cost surprises.
- Mechanics: each finding → `risk` (blocks) or `note` (informational). Any risk → **loop-back is mandatory, not optional**: open `loop_backs[]` entry, jump to the affected earlier Section (S1–S4), ask targeted questions, close the entry on resolution, return to S6. Repeat until no blocking risks.
- Output: risk list appended to `S5-research.md`; loop-backs in state.
- Exit: zero blocking risks (or risk consciously accepted by user → becomes a decision with rationale).

## S7 — Scope lock

- Purpose: freeze MVP. Every feature F-01… → `in-MVP` or `parking-lot`. Parking lot is recorded, never deleted.
- Output: `S7-scope.md`; becomes `SCOPE.md`. Journal: `scope_locked`.
- Exit: user explicitly confirms the MVP list; status → `review`.

## S8 — Milestone plan

- Purpose: break the MVP into `M0…Mn`, each independently verifiable.
- Booster: `planning-and-task-breakdown` principles (addyosmani). Fallback: internal decomposition rules.
- Rules: **M0 is a walking skeleton** (thinnest end-to-end slice that runs). Every milestone: goal, deliverables, measurable acceptance criteria, verification procedure (commands/visual checks), rough cost/effort. Milestone sizes: completable by an agent in one focused session.
- Output: `S8-milestones.md`; becomes `MILESTONES.md` + `VERIFICATION.md`.
- Exit: every acceptance criterion is checkable by a machine or a scripted step (not "looks good").

## S9 — Doc generation (compilation)

- Purpose: compile section records + decisions + milestones into the Blueprint Bundle (file specs in `04-bundle.md`).
- Booster: OpenSpec pattern (structure), SimpleEnglish document rules, humanizer pass, karpathy+ponytail principles for `CODE_STYLE.md`.
- Mechanics: see compilation order in `04-bundle.md`. Every generated file → `doc_generated` + checkpoint.
- Exit: all bundle files exist and pass the internal consistency check (same stack names, same entity names, no contradictions with `decisions[]`).

## S10 — Build (out of v0)

Not executed by v0. The bundle must be sufficient for any builder: `/lvp-handoff` produces the entry prompt; MILESTONES.md + VERIFICATION.md drive the loop. An optional `/lvp-build` skill (v1) may execute it; the pipeline never *requires* it.
