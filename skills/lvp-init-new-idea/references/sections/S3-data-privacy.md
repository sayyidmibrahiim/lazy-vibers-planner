# S3 question bank — Data & privacy

Candidate questions for Section S3. The English text is the source: translate each question into User Language when asking (conventions §4). Bank order is not ask order — `S3.qNN` ids are assigned in the order actually asked. Compose batches adaptively; never ask what `answers` already holds. Controls (skip, "enough for this Section") follow the engine's micro-batch loop.

Booster note: no booster — spec 02 assigns none. This bank is the question source.

## Opening questions (establish first, in this order)

### 1. Login, yes or no
- **Ask:** "Does a person need their own account before they can use it, or can anyone who has the link just start?"
- **Why it matters:** login is the single biggest fork in data model, API, and security work.
- **Unlocks:** the auth yes/no exit criterion; `SPEC/data-model.md` auth entities; `SECURITY.md` auth model.
- **designer_filled follow-ups:** "accounts mean someone must be able to reset a forgotten password — that needs a way to send email" — surface the mail-sender decision as `designer_filled` when login is confirmed.

### 2. If login: whose key opens the door
- **Ask:** "Should people sign in with something they already have — like their Google or Apple account — or with a new username and password just for this?"
- **Why it matters:** reusing existing accounts removes password storage but adds a provider dependency; this choice is cheaper to make now than to reverse.
- **Unlocks:** auth model in `SECURITY.md`; third-party service list (question 6).
- **designer_filled follow-ups:** even "sign in with Google" apps must show a privacy policy link on the consent screen — fold into the privacy-policy decision below.

### 3. Personal data inventory
- **Ask:** "What facts about a person does the app keep — names, phone numbers, photos, locations, anything about them?"
- **Why it matters:** every kept fact is a duty (protect it, be able to delete it); the inventory drives the data model and the security posture.
- **Unlocks:** the PII inventory in `SECURITY.md`; entity fields in `SPEC/data-model.md`; the data-inventory exit criterion.
- **designer_filled follow-ups:** technical traces (IP addresses, device ids, crash logs) count as personal data too — record as `designer_filled` when the inventory lists human-facing facts only.

### 4. Sensitivity check
- **Ask:** "Would any of those facts feel like a betrayal if a stranger saw them — health things, money things, children, ID numbers?"
- **Why it matters:** sensitivity, not volume, sets the security bar; a leak of one field can end the product.
- **Unlocks:** protection level per field in `SECURITY.md`; encryption-at-rest decisions.
- **designer_filled follow-ups:** "even non-sensitive fields combine into a sensitive profile" — note it when the inventory is long but each field looks harmless.

### 5. Money inside the app
- **Ask:** "Does money change hands inside the app — selling things, subscriptions, tips, or nothing at all?"
- **Why it matters:** payments add providers, fees, and sometimes regulation; "nothing" is a huge simplification worth confirming explicitly.
- **Unlocks:** the payments yes/no exit criterion; S5 regional payment-gateway research.
- **designer_filled follow-ups:** app stores tax digital sales and take a cut for in-app purchases — surface as `designer_filled` when the product sells digital goods and will live in a store.

### 6. Other services it talks to
- **Ask:** "Besides money, will it connect to anything else — maps, WhatsApp, email sending, delivery tracking, AI services?"
- **Why it matters:** every connection means an API key to protect and someone else's terms to obey.
- **Unlocks:** third-party service inventory in `SECURITY.md`; API-key handling in `HANDOVER.md`.
- **designer_filled follow-ups:** each third-party service needs an account and often a card — cross-link to the S2 budget decision.

### 7. Where the data may legally live
- **Ask:** "Are there rules about where this data may sit — company policy, school rules, or country law? Or is 'somewhere reputable' fine?"
- **Why it matters:** some data (customer records, student data, health notes) may be legally required to stay in-country; discovering this after S5 forces rework.
- **Unlocks:** hosting-region constraint for S5; compliance notes in `SECURITY.md`.
- **designer_filled follow-ups:** none typical — the user either knows a rule exists or honestly does not; "don't know" is a fine answer (principle 4) and S5 researches it.

### 8. Offline behavior
- **Ask:** "Must it keep working when the internet drops — at all, or a little, or no?"
- **Why it matters:** "keep working offline" is a feature with real design weight, not a setting.
- **Unlocks:** offline-first routing: if yes, the Conductor records a `designer_filled` decision covering the local-storage choices the user cannot enumerate (what is cached, what happens to unsent changes, how devices re-sync).
- **designer_filled follow-ups:** two people editing the same thing offline then both coming online — record the conflict rule as `designer_filled` and show it for correction.

### 9. Erasing a person
- **Ask:** "If someone asks you to erase everything you have about them, what should happen?"
- **Why it matters:** erasure is both a feature (a delete flow) and often a legal duty; retrofitting it is painful.
- **Unlocks:** deletion flow in `SPEC/api.md`; erasure section of `SECURITY.md`.
- **designer_filled follow-ups:** privacy laws in many jurisdictions grant erasure rights even to tiny products — record a `designer_filled` decision that the product will have a working "delete my account and data" path unless the user declines.

### 10. Who sees whose data
- **Ask:** "Who is allowed to see whose information — only its owner, everyone in a group, or the whole world?"
- **Why it matters:** visibility rules shape the data model (ownership fields) and the API surface.
- **Unlocks:** access model in `SPEC/data-model.md`; authorization section of `SECURITY.md`.
- **designer_filled follow-ups:** an owner-only "see everything" view (support/admin) is almost always needed and never requested — record as `designer_filled` when roles exist.

### 11. What must survive
- **Ask:** "If a phone is lost or a server dies tomorrow, what absolutely must not be lost?"
- **Why it matters:** the answer defines the backup duty, which lands in the owner document.
- **Unlocks:** backup section of `HANDOVER.md`; the S2 time-budget cross-check.
- **designer_filled follow-ups:** "nothing is backed up unless something does it on purpose" — record as `designer_filled` when the user assumes safety by default.

## The privacy-policy decision (surface regardless of answers)

When ANY of these hold — any login, any personal data, any store presence — the Conductor records one `designer_filled` decision: **the product needs a plain-language privacy policy page at launch** (app stores reject submissions without one; consent screens need its URL). Show it visibly for correction; S9 writes its placeholder into the bundle's SECURITY/HANDOVER sections.

## Batch composition guidance

- Opening batch: 1 → 3 → 5 (login, data inventory, money) — the three exit-criteria questions; trim to the tier limit.
- Route by answers: login yes → 2 next; inventory non-empty → 4 next; payments yes → fold providers into 6.
- 7, 8, 10 form the middle rounds; 9 and 11 close the section.
- The privacy-policy decision is recorded before exit, never asked as a question (the user could not have known to ask for it).
- Exit when all three exit criteria in the S3 procedure block are satisfiable from recorded answers.
