# S2 question bank — Conditions (resources & constraints)

Candidate questions for Section S2. The English text is the source: translate each question into User Language when asking (conventions §4). Bank order is not ask order — `S2.qNN` ids are assigned in the order actually asked. Compose batches adaptively; never ask what `answers` already holds. Controls (skip, "enough for this Section") follow the engine's micro-batch loop.

Booster note: no external booster — this bank plus the cost fact-sheet below is the booster (spec 02: "internal cost fact-sheets + web verification").

## Opening questions (establish first, in this order)

### 1. Devices in hand
- **Ask:** "What do you and the people using this already carry — iPhone or Android, Windows or Mac?"
- **Why it matters:** it decides which store accounts (and fees) are real, and what the product must be tested on.
- **Unlocks:** rows of the fact-sheet that apply; the S2 hard-rule check against the S1 platform shape.
- **designer_filled follow-ups:** "the product must work on the oldest phone your users actually own" — surface as `designer_filled` if the user only names their own devices.

### 2. What you already pay for
- **Ask:** "Do you already pay for anything connected to this idea — a website, a server, a domain name, an app-store account?"
- **Why it matters:** existing subscriptions are the cheapest deploy target and reveal prior commitments.
- **Unlocks:** deploy-target decision; `HANDOVER.md` deploy section.
- **designer_filled follow-ups:** none typical.

### 3. Monthly budget ceiling
- **Ask:** "What is the most you could spend on this each month before it starts to hurt?"
- **Why it matters:** the ceiling decides which stack candidates survive S5; conflicts with platform choice surface NOW, not at research.
- **Unlocks:** the budget-ceiling decision (`DECISIONS.md`); the free-vs-paid routing below.
- **designer_filled follow-ups:** if the answer is "nothing", say plainly what that rules out (no Apple app — USD 99/yr is unavoidable) and record the consequence as part of the decision.

### 4. One-time vs monthly
- **Ask:** "Would you rather pay once up front, or a small amount every month?"
- **Why it matters:** a VPS is rent; an app-store fee is a toll; the user's taste here prunes stack candidates fast.
- **Unlocks:** VPS vs managed-hosting routing for S5.
- **designer_filled follow-ups:** "rent never stops — if you stop paying, the product goes dark" — surface as `designer_filled` when the user prefers monthly without realizing it is forever.

### 5. Willingness to run commands
- **Ask:** "If fixing or updating this meant typing a command into a black window, would that be OK — or should updates just happen?"
- **Why it matters:** a VPS is cheaper and needs hands; managed hosting costs more and runs itself.
- **Unlocks:** deploy-target decision; `HANDOVER.md` "who does what" section.
- **designer_filled follow-ups:** who updates when the owner is on holiday — record as `designer_filled` if hands-on hosting is chosen.

### 6. Store presence
- **Ask:** "Do people need to find this in the App Store or Play Store, or is opening a link in the browser fine?"
- **Why it matters:** store presence has unavoidable fees (fact-sheet below); the S2 hard rule forces the price on the table now.
- **Unlocks:** Apple/Google account rows; proceed-or-defer decision when the user lacks the account.
- **designer_filled follow-ups:** an installable browser app covers many "I need an app" cases without any store — surface as a decision if the user's need is the icon, not the store.

### 7. Own address on the internet
- **Ask:** "Do you want your own address like `myidea.com`, or is a free address like `myidea.vercel.app` fine?"
- **Why it matters:** a domain is a yearly bill that dies if unpaid — the user must choose it knowingly.
- **Unlocks:** domain row of the fact-sheet; renewal-warning note in `HANDOVER.md`.
- **designer_filled follow-ups:** "the free address must mention the provider's name and cannot be moved later" — surface as `designer_filled` if the user picks free without knowing the trade-off.

### 8. Admin email
- **Ask:** "Which email address should receive the bills and password resets for these services?"
- **Why it matters:** the owner document must say where the keys to the kingdom live.
- **Unlocks:** `HANDOVER.md` secrets/accounts section.
- **designer_filled follow-ups:** a dedicated email for the project beats a personal one — suggest it if the user hesitates.

### 9. Paying from your country
- **Ask:** "Can you pay online with a card from your bank, and which country is that bank in?"
- **Why it matters:** some services do not accept cards from some countries — better to learn before S5 crowns one.
- **Unlocks:** regional availability notes for S5 research.
- **designer_filled follow-ups:** none typical.

### 10. Where the server lives
- **Ask:** "Any reason the data must sit in a particular country — company policy, school rules, or law? Or is 'somewhere safe' fine?"
- **Why it matters:** data-residency rules prune hosting choices harder than price does.
- **Unlocks:** deploy-target decision; feeds S3's where-data-may-live question.
- **designer_filled follow-ups:** none typical (S3 owns the legal side).

### 11. Time, the hidden budget
- **Ask:** "How much time could you personally spend each week keeping this alive — minutes, an hour, more?"
- **Why it matters:** maintenance is a cost too; near-zero time forces managed hosting regardless of money.
- **Unlocks:** deploy-target decision; `HANDOVER.md` update rhythm.
- **designer_filled follow-ups:** "backups are a weekly job unless automated" — surface as `designer_filled` if the user picks self-managed hosting.

## Cost fact-sheet (verified 2026-11-08)

Every number below was read from the linked source on **2026-11-08**. Prices move: re-verify each row you are about to quote, at S2 start, by opening the source. Never quote a price from memory (principle 1); anything you cannot verify live → mark `unverified` next to the number and move on.

| Item | Price | Type | Source (accessed 2026-11-08) |
|---|---|---|---|
| Apple Developer Program | USD 99 / membership year | yearly, required for App Store distribution; fee waiver for eligible non-profits/education/government | <https://developer.apple.com/programs/enroll/> |
| Google Play Console developer account | USD 25 | one-time registration | <https://support.google.com/googleplay/android-developer/answer/6112435> |
| .com domain, Namecheap | USD 15.98/yr registration, USD 19.98/yr renewal (promos: first year from USD 6.48) | yearly | <https://www.namecheap.com/domains/registration/gtld/com/> |
| .com domain, Cloudflare Registrar | at-cost (registry + ICANN price, no markup; no figure published on the page) — typical .com ≈ USD 10–15/yr `unverified-figure` | yearly | <https://www.cloudflare.com/domains/> (model verified; figure must be read from their search at purchase) |
| Vercel Hobby | USD 0 / month — non-commercial use only | monthly | <https://vercel.com/pricing> |
| Vercel Pro | USD 20 / month per Developer seat (viewers free; overages extra) | monthly | <https://vercel.com/pricing> |
| Hetzner CX23 — cheapest cost-optimized shared-vCPU plan (2 vCPU, 4 GB RAM, 40 GB NVMe) | EUR 5.99 / month excl. VAT | monthly | <https://www.hetzner.com/cloud/cost-optimized/> |
| DigitalOcean cheapest Basic Droplet (512 MiB, 1 vCPU, 10 GB SSD, 500 GiB transfer) | USD 4 / month | monthly | <https://www.digitalocean.com/pricing/droplets> |
| Supabase Free tier | USD 0 — 500 MB database, 50k monthly active users, 1 GB file storage, 5 GB egress (+5 GB cached), 2 active projects; **paused after 1 week of inactivity** | monthly | <https://supabase.com/pricing> |

Routing notes:

- Free tier fits (Supabase limits comfortably above the S1 scale answer) and budget ≈ 0 → recommend free-tier hosting; record the inactivity pause as a visible consequence.
- Budget > 0 and hands-on OK (question 5) → VPS row is the cheap floor; managed hosting rows are the hands-off floor.
- Platform shape includes iOS (S1) and no Apple Developer account → hard rule: surface USD 99/yr NOW, ask proceed/defer, record the answer as a decision. Never defer to S5.
- Google Play on a **personal** account: new personal accounts must run a closed test (12 testers, 14 days) before production — mention it as a time cost, verify the current rule when relevant.

## Batch composition guidance

- Opening batch: 1 → 2 → 3 (devices, existing payments, ceiling); trim to the tier limit.
- Then route by platform shape from S1: store in play → 6 next; website-only → 7 next; VPS plausible → 5 next.
- Questions 4, 10, 11 arrive once money-shape is known; 8 and 9 close the section (one batch together).
- Exit when all three exit criteria in the S2 procedure block are satisfiable from recorded answers, and every paid account the chosen platform needs has been surfaced with a verified price.
