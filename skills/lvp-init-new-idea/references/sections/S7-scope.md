# S7 scope guide — Scope lock

Work guide for Section S7. The English text is the source; questions are spoken in User Language at runtime (conventions §4). Record: `PROJECT_DIR/.lvp/docs/sections/S7-scope.md`; journal `scope_locked` at the lock. Mostly Conductor work: one walk, one warning when it fires, one explicit confirmation.

Booster note: none (spec 02) — this guide is the procedure.

## The walk

Walk every F-NN from the S4 record, in id order, and mark exactly one of:

- **in-MVP** — the default for `must` features: the first version is broken without it.
- **parking-lot** — the default for `should` and `could`: wanted later, not first.

The defaults are proposals; the user can pull any feature either way, aloud. Two rules hold during the walk:

- A `must` feature parked anyway (budget ceiling, an S6 accepted risk) is allowed only aloud — its parked line cites the S6 risk or S2 constraint that forces it.
- A `should`/`could` promoted into the MVP is fine — the size check below is what keeps that honest.

Nothing is ever deleted: every feature not in-MVP lands in the Parking Lot with a one-line reason. "Named but not captured" items from the S4 record are listed in the Parking Lot too, marked as never captured.

## MVP-size sanity

Count the in-MVP list. Above ~8 features, say plainly (User Language): "This is more than a first version builds well — every extra feature pushes back the day you can actually use it. Want to cut to the <n> that matter most, or keep all <m>?" Offer a concrete cut (the `should`/`could` rows are the candidates) and let the user decide. The warning never auto-cuts, and it fires even when the user is enthusiastic — that is the anti-yes-man duty (principle 2). Record the warning and the user's call in the record's Size check section.

## The lock protocol

1. Present the final list — in-MVP with a one-line description each, then the Parking Lot with its reasons.
2. Ask for explicit confirmation of the whole list (User Language): "Is this the first version? Once you say yes, this list is frozen."
3. A skip or silence is not a lock — re-ask once, plainly. A change request → apply it, re-present, ask again.
4. On an explicit yes: one checkpoint — journal `scope_locked` (payload: the in-MVP feature ids) + state write (`project.status` = "review", `sections.S7` per the engine).
5. Write the record (second checkpoint). From here the feature list is frozen: changes go through /lvp-add-feature post-v1, never through quiet edits.
6. Refused at the exit check → engine step 5: mark the Section `blocked`, journal `section_blocked` with the contested items named. Unblock path per the engine.

## Record template

```markdown
# S7 — Scope lock

## In-MVP
- **F-01** <name> — <one line what it is>

## Parking Lot (recorded, never deleted)
- **F-0n** <name> — parked because: <one line>
- **<named-but-not-captured item>** — never captured (S4), kept visible

## Size check
<in-MVP count; when > ~8: the warning given + the user's call>

## Lock
- Confirmed: <S7.qNN> · decision <D-NNN> · journaled `scope_locked` <ts> · status → review
- Frozen from here: changes go through /lvp-add-feature post-v1.

## Answers
- **<S7.qNN> <question, User Language>** — <answer verbatim> · _EN: <summary>_
(always at least the confirmation: the skip attempt + re-ask, then the explicit yes)

## Decisions this Section
- **<D-NNN>** <summary> — <rationale> · status: <user_confirmed | assumed | designer_filled>

## Exit criteria
- [<x>] <criterion> — evidence: <answer id or decision id>
```
