# S8 milestone guide — Milestone plan

Work guide for Section S8. The English text is the source; questions are spoken in User Language at runtime (conventions §4). Record: `PROJECT_DIR/.lvp/docs/sections/S8-milestones.md`; top-level `milestones[]` in state gets one entry per milestone (id, goal, features covered). Mostly Conductor work: draft the whole plan, then one review with the user.

Booster note: planning-and-task-breakdown principles (addyosmani) when the harness carries them — load at Section start, drop after use (T3: only this one). Not a core install, so no `boosters.core` entry. Absent → the decomposition rules below are the booster (spec 02 fallback).

## M0 — the walking skeleton (generic definition)

M0 is the thinnest slice that runs end to end on the real stack:

- **Deployed** to the S2 deploy target (the future HANDOVER target) — reachable at its real address, whatever that target is.
- **Real at every layer** — real stack, real data store, real deploy; nothing stubbed end to end. A button that does nothing is not a layer.
- **One task** — exactly one real user task (the S1 day-one answer; F-01's happy path when that question was skipped) runs from first tap to visible result.
- **Provable** — one command or scripted check demonstrates the whole chain working.

Everything else — accounts, secondary features, polish — is M1 and later.

## Milestone template

```markdown
## M<n> — <name>
- **Goal:** <one line — what becomes true when this milestone is verified>
- **Deliverables:** <F-NNs built, files/components, deploy/config steps>
- **Acceptance criteria:** <numbered; every one machine-checkable>
- **Verification:** <exact commands + expected outputs; visual checks as observable facts>
- **Rough cost/effort:** <estimate + basis, e.g. "0 — free tier; ~1 builder session">
```

## Acceptance-criteria rules

Every criterion is machine-checkable — a command with expected output (`curl -s https://<address>/health` prints `ok`), a scripted step, or a visual check phrased as an observable fact plus how to look ("after reload, the list shows the saved item"). Banned: "looks good", "works well", "is nice" (conventions §5 hard rule).

Derive criteria from the F-NN happy paths: the "Done:" step of each script is a criterion waiting for its check. Every milestone's Verification section names exact commands, expected outputs, and what to look at — S9 compiles them into VERIFICATION.md.

## Sizing and splitting

One milestone = completable by a builder agent in one focused session. Split signals: more than ~3 features, two unrelated subsystems, or any single criterion that needs more than one session to verify. Split at feature boundaries, never mid-feature.

## The coverage check

Before exit: every in-MVP F-NN appears in exactly one milestone, and deploy to the S2 target is inside M0 — the final milestone re-verifies the deploy still passes after everything built on top of it. 100% coverage or the plan is not done.

## The review (the user's turn)

Present the finished plan in plain language: what gets built in what order, what M0 proves, rough effort. Corrections become targeted batches (`S8.qNN`, engine rules; controls visible). The plan's order and grouping are recorded `designer_filled` (a non-technical user cannot sequence builds) and shown for correction; explicit user choices between offered options are `user_confirmed`.
