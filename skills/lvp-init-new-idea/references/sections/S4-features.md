# S4 question bank — Features

Candidate questions for Section S4. The English text is the source: translate each question into User Language when asking (conventions §4). Bank order is not ask order — `S4.qNN` ids are assigned in the order actually asked. S4 is a capture loop, not a list to walk: most batches react to the feature being captured. Controls (skip, "enough for this Section") follow the engine's micro-batch loop; the "enough" protocol at the bottom of this file defines what happens when the user pulls it.

Booster note: pm-skills interview patterns (`product-on-purpose/pm-skills`, Apache-2.0) — Mom Test and user-story/Gherkin patterns. Status `installed` → let them shape phrasing. Any other status → use this bank alone and mark the Section Record `Booster: pm-skills (degraded — internal bank used)` so S9 surfaces it in OVERVIEW.md.

## Feature capture format (F-01…)

Every feature is captured in this exact shape, one per feature, ids `F-01, F-02, …` in capture order (conventions §2). A feature does not exist until its happy path is a script; a name without a script is a placeholder, not a feature. Alongside the verbatim name, coin an English display name per F-NN (the `**English name:**` field): the record keeps the user's verbatim words; the English name is what SPEC/requirements.md, USER_FLOWS.md, and blueprint.json use.

```markdown
### F-01 — <Name in plain words, the way the user would say it>
- **English name:** <coined English display name — the name SPEC/requirements.md, USER_FLOWS.md, and blueprint.json use>
- **Who uses it:** <one named kind of person from S1 — owner, customer, …>
- **Happy path (click-by-click script):**
  1. Open <the screen it starts on>.
  2. Tap <the control>, exactly like telling a friend "posting ke IG" step by step.
  3. Enter/choose <what>.
  4. … continue until …
  5. Done: <what the person ends up with — a screen, a saved record, a sent message>.
- **Priority:** must | should | could  (the user's call, confirmed aloud)
- **When it goes wrong (what the user cares about):** <e.g. "no internet — don't lose the photo">
```

The script standard: someone holding the phone could follow it without asking you anything. "Posting ke IG" style — every step is a tap, a field, or what appears next. If a step cannot be phrased that way, the feature is not understood yet; ask one more question.

## Question pool

### 1. The one thing
- **Ask:** "If this app could do only ONE thing on day one, what would that be?"
- **Why it matters:** it is the seed feature; everything else is ordered against it.
- **Unlocks:** F-01; the M0 walking-skeleton shape in S8.
- **designer_filled follow-ups:** none typical — capture straight into the F-format ("walk me through it", question 2).

### 2. Walk me through it
- **Ask:** "Pretend I'm holding the phone. Walk me through it step by step — what do I tap first?"
- **Why it matters:** this IS the happy-path script; asked per feature, not once.
- **Unlocks:** the click-by-click script in the F-format; the raw material of `USER_FLOWS.md`.
- **designer_filled follow-ups:** screens the user skips because they are "obvious" (opening screen, save confirmation) — fill them as `designer_filled` decisions and show for correction.

### 3. The next thing
- **Ask:** "After that, what's the second thing people will want to do? And a third?"
- **Why it matters:** S4 is iterative; each answer spawns one more F-capture with its own walk-through.
- **Unlocks:** F-02…Fn; the shape of `SPEC/requirements.md`.
- **designer_filled follow-ups:** features the user names as one blob ("and then the reports stuff") — split and re-capture, one feature per script.

### 4. Who taps it
- **Ask:** "Who does this one — the owner, the customer, or both?"
- **Why it matters:** per feature; the answer decides which view it lives in and links back to the S1 role decision.
- **Unlocks:** the "Who uses it" field; role separation in the data model.
- **designer_filled follow-ups:** none typical.

### 5. What "done" leaves behind
- **Ask:** "When that feature works, what does the person end up with — a saved list, a sent message, a receipt, a number on a screen?"
- **Why it matters:** the end-state makes the script testable (S8 acceptance criteria grow from it).
- **Unlocks:** the "Done:" step of the script; later VERIFICATION.md checks.
- **designer_filled follow-ups:** none typical.

### 6. What would annoy you
- **Ask:** "What could go wrong here that would annoy you most — no internet, a wrong number typed, two people saving at once?"
- **Why it matters:** the user's own worries pick which edge cases get built, instead of the Conductor guessing.
- **Unlocks:** the "When it goes wrong" field; risk hints for S6.
- **designer_filled follow-ups:** none typical.

### 7. Copy the old way
- **Ask:** "Show me how you'd do this today without the app — which of those steps should the app copy, and which should it kill?"
- **Why it matters:** old habits are free usability research; copying the good steps makes the product feel familiar.
- **Unlocks:** script corrections; sometimes a whole missing feature.
- **designer_filled follow-ups:** none typical.

### 8. The three that matter
- **Ask:** "If we could only build three of these first, which three?"
- **Why it matters:** priority must/should/could is decided by the user, confirmed aloud per feature — not inferred.
- **Unlocks:** the Priority field on every captured feature; pre-triage for S7 scope lock.
- **designer_filled follow-ups:** everything unmentioned defaults to `could` — say so visibly and record it as a decision if the user accepts.

### 9. First-run emptiness
- **Ask:** "The very first person opens this app — the screen is empty because nothing exists yet. What do they see, and what do they do?"
- **Why it matters:** empty states are where real users stumble first, and nobody ever asks about them.
- **Unlocks:** a `designer_filled` decision per affected feature (empty-state behavior), shown for correction; often F-0n "seed/create the first item" features.
- **designer_filled follow-ups:** whether the OWNER or the product creates the first content — record as `designer_filled` when unclear.

## The "enough" protocol

The user may say "cukup" / "that's enough" at any moment. The control never blocks; this is what running it means:

1. Stop capturing immediately. Do not ask "are you sure?" — one acknowledgment, then the exit check.
2. Scan every captured F-NN against two requirements: it has a complete click-by-click happy path, and it has a priority. Also scan the F-NN feature blocks (name, who, priority, happy path) for placeholder language: "and whatever else", "etc.", "…", "some kind of report". Verbatim answer quotes may keep the user's own words, "dll" included.
3. Complete-or-drop, one final batch: for each failing feature — missing script or missing priority — offer exactly two options: fix the failure (finish its script in one last walk-through, or confirm the missing priority aloud: must/should/could), or drop it into a "named but not captured" list in the record (recorded, never deleted, never counted as a feature). No third "leave it vague" option.
4. If the user refuses even that batch, the exit criterion "no placeholders, every feature has a happy path" is unmet → the Section is marked `blocked` per the engine's exit-criteria step, with the failing features named in the record. Never advance with a vague feature pretending to be done.
5. Run the full exit-criteria check (the S4 procedure block) and report the results before closing.

## Batch composition guidance

- Opening batch: question 1 alone if the tier allows only one; with 2 as the follow-up turn regardless of tier — capturing F-01's script is the section's first real work.
- While a feature is being captured: batch = the missing F-fields (typically 4 + 5, or 5 + 6). Never open a new feature before the current script is complete.
- Between captures: question 3 to open the next feature, or question 7 to repair a weak one.
- Closing: question 8 (priorities), then 9, then the "enough" protocol when the user pulls it or the pool runs dry.
- Exit when the S4 procedure block's criteria are satisfiable: the user has said enough, no placeholders, every feature scripted and prioritized.
