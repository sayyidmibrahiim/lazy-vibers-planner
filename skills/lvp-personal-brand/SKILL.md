---
name: lvp-personal-brand
description: Builds a separate personal-brand kit (positioning, LinkedIn profile, content plan) for the owner of a finished, live LVP product. Machine-gates on every milestone verified plus a live deployment check. Use when the user wants to market themselves or the product, write a LinkedIn profile, or plan content after the product ships. Never posts, never invents traction, and never touches the Blueprint Bundle.
---

# lvp-personal-brand

The post-build branding skill of the LVP pipeline. It turns a verified, deployed product into an honest personal-brand kit: what the owner built, who it helps, what proof exists, and what to say next. It is a separate output — deliberately outside the product pipeline and outside the Blueprint Bundle.

The gate is machine-checkable because branding before proof produces fiction. No verified milestones, no live product, no brand run.

## Load first

Before any check or file write:

1. Read `references/principles.md` (the Constitution). Principles 1, 2, 6, 7, and 11 bind this skill hardest.
2. Read `references/conventions.md` (the operational manual): state schema, journal events, bundle list.
3. Read `references/brand-templates.md`: the three output templates and the evidence table rules.
4. Interact in `state.project.user_language`. Brand artifacts are English source of truth; a localized variant is a separate file, never a replacement.

## Flow at a glance

1. **Gate** — every milestone verified; deployment live; live URL checked now. Any failure → refuse with the exact unmet gate.
2. **Open** — journal `brand_started`; load product evidence.
3. **Owner facts** — ask only what the bundle cannot answer.
4. **Evidence table** — every claim `verified`, owner-approved `(claimed)`, or forbidden.
5. **Draft** — `brand/BRAND.md`, `brand/LINKEDIN-PROFILE.md`, `brand/CONTENT-PLAN.md`, one file per turn.
6. **Self-check + close** — evidence rule, link check, journal `brand_done`; nothing posted.

## Step 1 — Gate

`TARGET` = cwd (or the folder the user named). Run in order; the first failure stops with plain guidance. Nothing is written on a refusal.

1. **Project exists** — `TARGET/.lvp/state.json` exists and parses. Missing/unreadable → `/lvp-init-new-idea` or `/lvp-continue`.
2. **Milestones verified** — `state.milestones[]` is non-empty and every entry has `verified: true`. Any unverified → name the first one and say: "The product is not finished yet. Run `/lvp-build` to execute and verify milestone `<M>` first."
3. **Deployment live** — `state.deployment.status` = "live" with a URL. Missing or `pending` → "There is no verified live product yet. Run `/lvp-build` through the deployment milestone first."
4. **Live check now** — fetch the deployment URL with the harness's HTTP tool. Require a 2xx status and one expected product fact (the product name or a user-visible string from `OVERVIEW.md`). Check fails, tool unavailable, or the page needs credentials → refuse: "The live check did not pass (`<reason>`), so the brand gate is not met. Fix the deployment, then re-run." Never accept the state field alone as proof; it records a past check, not the current one.
5. **Bundle present** — `AGENTS.md`, `OVERVIEW.md`, `DECISIONS.md`, `VERIFICATION.md` exist. Missing → `/lvp-handoff` or S9 is incomplete.

No handoff requirement: the brand kit needs the product evidence, not the builder prompt.

## Step 2 — Open and load evidence

1. Journal `brand_started` (payload: deployment URL, live-check result) + a state write (no field change). One checkpoint.
2. Load, in this order: `OVERVIEW.md` (owner-visible truth), `DECISIONS.md` (why it is shaped this way), `SCOPE.md` (what is in and parked), `VERIFICATION.md` (what is proven), `RESEARCH.md` (market context with sources), `HANDOVER.md` (how it runs), `state.json` (milestones, deployment, user language).
3. Extract a one-screen product brief: name, one line, audience, problem, in-MVP features, verified milestones, live URL, parked items, stack. No transcript, no invented context (principle 13).

## Step 3 — Owner facts

Ask only what the bundle cannot answer, in one micro-batch per tier:

- owner display name and current role/title;
- goal of the brand: job, consulting, product users, community;
- audience priority when the product serves several groups;
- tone preference and language for the actual profile copy;
- links to include (repo, portfolio, product, none);
- anything the owner refuses to mention.

Skip and enough controls stay visible. A skipped fact becomes a visible `Open questions for the owner` line in the output, never a silent guess.

## Step 4 — Evidence table

Build the table from `references/brand-templates.md` before drafting. Walk every claim the kit might make:

- product capability → `VERIFICATION.md` result or live-page fact;
- owner experience → recorded answers or journal dates;
- market claim → `RESEARCH.md` source + date;
- anything else → `unverified` (needs owner approval + `(claimed)`) or `forbidden`.

No metric, user count, revenue, award, or endorsement enters the kit without evidence. An honest kit with three proof points beats a fictional one with thirty.

## Step 5 — Draft the three files

Create `brand/` in the project folder (beside the bundle, never inside it). One file per turn (T3: one top-level section per turn, append-chunks):

1. `brand/BRAND.md` — one line, audience, problem, positioning, three message pillars with proof, voice, boilerplate bio, links.
2. `brand/LINKEDIN-PROFILE.md` — headline options, About, experience entry, featured links, skills, open questions.
3. `brand/CONTENT-PLAN.md` — 10–15 post ideas tied to pillars and real evidence, cadence, posting rules, repurpose ideas.

Rules:

- Use the templates verbatim in structure; content comes from the evidence table.
- Same product name, one line, and audience names as `OVERVIEW.md` and `blueprint.json`.
- English source. When the owner asked for another language, write `brand/<FILE>.<lang>.md` as a variant and keep the English source intact.
- No Mermaid; ASCII diagrams only if one helps.
- After each file: journal `brand_file_generated` (payload: path, claims count, unverified count) + state write. One checkpoint per file.

## Step 6 — Self-check and close

Run the checklist in `references/brand-templates.md`:

- every product claim `verified` or approved `(claimed)`;
- no invented traction;
- names consistent with the bundle;
- links resolve; the live URL check from Step 1 still holds;
- files under `brand/`, not in the bundle;
- nothing posted, scheduled, or sent anywhere.

Then journal `brand_done` (payload: files, verified claims, claimed claims, open questions) + state write. One checkpoint.

Close in plain language: what exists, what each file is for, what the owner must fill or approve, and the one next action (review `BRAND.md` first, then the profile copy). Never offer to post on the owner's behalf.

## Journal events added by this skill

`brand_started`, `brand_file_generated`, `brand_done`. Payloads are named above.

## Idempotency

- Re-running re-checks the gate from disk and the live URL every time.
- Existing brand files are never overwritten wholesale: show the drift, then regenerate one file on explicit request.
- Files already generated and unchanged are skipped, not duplicated.

## Never list

- Never run before every milestone is verified and the live check passes. (Principles 1, 9)
- Never write a metric, user count, revenue, award, or endorsement without evidence.
- Never post, schedule, message, or create an account on any platform.
- Never put brand files inside the Blueprint Bundle or modify bundle files.
- Never replace the English source with a localized variant.
- Never guess a skipped owner fact; list it as an open question. (Principle 12)
