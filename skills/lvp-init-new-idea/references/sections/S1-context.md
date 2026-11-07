# S1 question bank — Context

Candidate questions for Section S1. The English text is the source: translate each question into User Language when asking (conventions §4). Bank order is not ask order — `S1.qNN` ids are assigned in the order actually asked. Compose batches adaptively from the answers so far; never ask what `answers` already holds. Controls (skip, "enough for this Section") follow the engine's micro-batch loop — always visible, never repeated here.

Booster note: when pm-skills interview patterns are `installed`, they shape phrasing and follow-up style; this bank is the internal fallback and the gap-filler either way.

## Opening questions (establish first, in this order)

### 1. The problem, in their words
- **Ask:** "When you picture someone using this, what annoying thing just happened to them right before they opened the app?"
- **Why it matters:** the product exists to remove one concrete annoyance; a category ("project management") is not buildable, a moment is.
- **Unlocks:** the problem statement in `SPEC/prd.md`; every later question tests against this moment.
- **designer_filled follow-ups:** if the answer stays abstract after one retry, record the best concrete version as `designer_filled` (decision: interpreted problem) and show it for correction.

### 2. Who exactly has the problem
- **Ask:** "Who has this problem? Describe one real kind of person — what they do, not a job title."
- **Why it matters:** "everyone" designs for no one; a named kind of person decides screens, language, and features.
- **Unlocks:** target-user section of `SPEC/prd.md`; the "who uses it" field of every S4 feature.
- **designer_filled follow-ups:** is the owner also a user? Does a second kind of person exist (the one being managed, paid, or served)? Record both as one decision if they surface.

### 3. Platform shape
- **Ask:** "Where should this live — a website, a phone app, or both?"
- **Why it matters:** it decides store accounts and yearly fees (Apple USD 99/yr — verified, see S2 fact-sheet), and what devices must be tested.
- **Unlocks:** the deploy-surface rows of the S2 fact-sheet; the S2 hard rule (surface paid accounts now).
- **designer_filled follow-ups:** a website can install to the home screen and look like an app (no store, no fee) — a non-technical user cannot know to ask; surface "browser app that installs like an app" vs "store app" as a decision.

### 4. What "working" means
- **Ask:** "Six months after this exists, what has changed in your week that makes you say building it was worth it?"
- **Why it matters:** this is the success picture; without it, every feature argument is unresolvable later.
- **Unlocks:** goals and success metrics in `SPEC/prd.md`; the day-one test for the first milestone.
- **designer_filled follow-ups:** none typical — if skipped, record `assumed` ("it removes the manual steps from question 1").

## Gap-fillers (pull in when the opening answers leave a hole)

### 5. The workaround today
- **Ask:** "How do you handle this today — paper, chat messages, a spreadsheet, memory?"
- **Why it matters:** the current workaround is the competitor and the feature donor.
- **Unlocks:** baseline for `SPEC/prd.md`; concrete steps worth copying into S4 features.

### 6. Who it is not for
- **Ask:** "Who should the first version NOT try to serve?"
- **Why it matters:** non-goals are what keep the first version buildable.
- **Unlocks:** non-goals in `SPEC/prd.md`; pre-triage for S7 scope lock.

### 7. Rough scale
- **Ask:** "In the first months, would this be about five people, fifty, or five hundred?"
- **Why it matters:** free tiers fit tens; hundreds change hosting cost and design.
- **Unlocks:** fits the S2 fact-sheet free-tier rows against reality; feeds S5 stack candidates.
- **designer_filled follow-ups:** "can two people use it at the same moment?" — concurrency is never asked by non-technical users; record as `designer_filled` when scale is above a handful.

### 8. Screen language
- **Ask:** "What language will people see on the app's own screens?"
- **Why it matters:** UI language is a product decision, separate from our conversation language.
- **Unlocks:** UI-language decision; S9 plain-language rules for owner docs.
- **designer_filled follow-ups:** adding a second language later roughly doubles wording work — surface only if the audience from question 2 clearly spans languages.

### 9. Other approvals
- **Ask:** "Does anyone else's OK matter here — a boss, a partner, a community, a regulator?"
- **Why it matters:** a hidden approver can veto the finished product; better to meet them now.
- **Unlocks:** stakeholder risk; possible loop-back input for S6.

### 10. The day-one task
- **Ask:** "What is the first real task a person should finish on day one — start to end?"
- **Why it matters:** it names the seed of the feature list and the walking-skeleton milestone.
- **Unlocks:** the first S4 capture (F-01 candidate); M0 shape in S8.

## Batch composition guidance

- Opening batch (tier-permitting): 1 → 2 → 4. Question 3 (platform) rides with 1–2 or 4 if the tier allows a fourth — never stretch a batch past the tier limit.
- Then one gap-filler per batch, chosen by the biggest hole: no workaround named → 5; vague "everyone" → 6; numberless ambition → 7.
- Questions 8–10 close the section: 8 and 9 fit one batch; 10 alone, because its answer is usually a story.
- Exit when all four exit criteria in the S1 procedure block are satisfiable from recorded answers.
