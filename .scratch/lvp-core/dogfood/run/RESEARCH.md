# Research

Compiled from the S5 record (deep research) and the S6 risk appendix. Nothing new was researched at S9; every claim keeps its S5 flag. **Research ran in degraded mode:** the session had no live web access, so new claims are model knowledge marked `unverified`; the exceptions are the price rows verified live at S2 (cited from the S2 fact-sheet, verified 2026-11-07) — reused, not re-researched.

## Competitor scan

| Product | What it does | Pricing model | Lesson for this idea | Source (accessed) |
|---|---|---|---|---|
| Playtomic (global venue apps) | Player-facing marketplace for padel/futsal court booking + venue manager tools | Venue-side commission per booking or subscription; player-side fee unverified | Discovery marketplaces pull players in, but a single-venue owner's need is operational: slot locking + DP tracking — v1 must win on the notebook-replacement job, not on lead flow (unverified) | model knowledge, no live check (2026-11-07) |
| Vamos (Indonesia, court booking app) | Indonesian app to find and book sports courts, pay in-app | Commission/booking-fee per transaction; venue onboarding free unverified | Indonesian players already tap a slot grid on a phone — F-01's interaction model is familiar, no behavior change to teach (unverified) | model knowledge, no live check (2026-11-07) |
| Futsalnesia (Indonesia, futsal directory; status unclear, may be defunct) | Directory of futsal venues + community content; booking redirected to the venue by phone/DM | Free directory; monetization unclear unverified | A directory alone did not keep this problem solved — the durable pain is the owner's daily operations (schedule + DP + chasing unpaid teams), exactly S1.q1/S1.q3 (unverified) | model knowledge, no live check (2026-11-07) |
| Manual incumbent: Instagram/WhatsApp DM + paper notebook (S1.q5) | Player DMs the admin; admin writes name/date/hour in the notebook, checks m-banking transfer by transfer, crosses off when paid | Rp 0 cash, but owner time; produces double-bookings and lost proof screenshots (S1.q1) | The competitor is free and familiar: the app must be visibly less effort than the notebook in week one, or the notebook wins — the bar for every milestone scope cut (unverified) | S1 record, S1.q5 + S1.q1 (2026-11-07) |

## Comparable products

The scan above is the comparable set; the true incumbent is the owner's own manual workflow (last row). No named product surfaced that a record required a user fact about, so the S5 bank's "which competitor matters" question never fired (recorded in the S5 record as deliberately not asked).

## Stack comparison and trade-offs

Screened against the recorded answers: S1.q4 (web, mobile player + desktop admin), D-005 (Rp 100.000 ceiling), D-006 (zero commands), D-010 (admin-only login), D-011 (manual transfer v1), D-004 with F-01..F-03 (double-booking must be impossible).

| Dimension | Option A: Next.js + Vercel + Supabase | Option B: no-code builder + Google Sheets |
|---|---|---|
| Fits the budget ceiling (D-005) | USD 0/month on both free tiers (Vercel Hobby USD 0 verified S2; Supabase Free USD 0 verified S2) | Builder free tiers exist but per-user pricing kicks in early; typical paid tier USD 25–60/month unverified — likely busts the ceiling at 80–150 players (S1.q6) |
| Fits zero-commands maintenance (D-006, D-009) | Deploy = push code, updates automatic; owner never touches a terminal | Zero code by definition; builder updates itself |
| Covers auth/payments answers (D-010, D-011) | Auth library included (admin-only login fits); no gateway needed in v1 — proof upload + admin confirm is plain app logic; card data never touches the app | Admin login builder-dependent; username+password (not email-first, S3.q4) is awkward; proof upload + confirm queue is what no-code does worst unverified |
| Carries the must-features (F-01..F-03, D-004) | Slot locking under two simultaneous taps is a database transaction/constraint — the one thing F-01 absolutely needs; real-time slot grid supported | Sheets has no row-level locking; two players tapping the same slot can both succeed — double-booking, the exact problem from S1.q1, likely returns unverified |
| Regional availability (S2.q10, Indonesian cards) | Vercel + Supabase sign-up works with an Indonesian BCA debit card unverified; both are global self-serve products | Builders bill in USD on foreign cards unverified |
| Maintenance burden (D-008, D-009) | Provider-managed; needs the D-008 weekly export routine (see Risks, R-2) | Provider-managed; export trivial (it is a spreadsheet) |
| Vendor lock / portability | Standard Postgres + standard code — portable if the bill must shrink to zero | Entire app lives inside the builder's format — rebuild from scratch if it no longer fits unverified |

**Chosen: Option A** — accepted by the user (D-019). Only Option A makes the D-004 double-booking failure structurally impossible rather than "unlikely"; Option B was rejected on the slot lock and the pricing risk.

## Cost table

Built on the S2 fact-sheet (verified 2026-11-07) plus S5 additions. v1 total recurring: **USD 0 ≈ Rp 0/month** — inside the D-005 ceiling with the full Rp 100.000 untouched.

| Item | Price | Type | Source (accessed) | Status |
|---|---|---|---|---|
| Vercel Hobby (app hosting, deploy, TLS) | USD 0/month — Hobby terms say personal, non-commercial use (caveat → R-4) | monthly | S2 row: vercel.com/pricing (2026-11-07) | verified (S2) |
| Supabase Free (Postgres 500 MB, Auth, Storage 1 GB, 50k MAU) | USD 0/month — pauses after 1 week of inactivity (caveat → R-2) | monthly | S2 row: supabase.com/pricing (2026-11-07) | verified (S2) |
| Email sender for admin password reset (D-012) | USD 0 on a free tier (Resend-class, ~3.000 emails/month) | monthly | model knowledge, no live check (2026-11-07) | unverified |
| Custom domain (.com) | deferred — free `*.vercel.app` subdomain first (D-007); renewal USD 19.98/yr if ever needed (first year USD 12.08 on sale) | yearly | S2 row: namecheap.com (2026-11-07) | verified (S2) |
| Payment gateway (Midtrans/Xendit-class: QRIS, virtual account) | parked with the gateway (D-011): MDR ~2–3% per transaction when unparked | per-transaction | model knowledge, no live check (2026-11-07) | unverified |
| Vercel Pro / Supabase Pro (paid fallback, D-018) | USD 20/month per seat / ~USD 25/month | monthly | S2 row (Vercel, verified) / model knowledge (Supabase, unverified) | mixed — see D-018 |

### Regional availability

- Market: Indonesia (S2.q10 — the owner pays with a BCA debit card; GoPay available). Vercel and Supabase are global self-serve signups that accept Indonesian cards unverified (2026-11-07).
- Supabase region closest to Indonesia is Singapore (ap-southeast-1) unverified — adequate latency for a booking grid; S2.q7 sets no data-residency constraint.
- Payment gateways that work in Indonesia: Midtrans, Xendit, Duitku-class providers (QRIS + virtual accounts) unverified — relevant only when the gateway is unparked; most require business/identity documents at onboarding unverified. None are needed in v1 (D-011).
- Store fees: none — the platform is web-only (D-001, D-002); no Apple/Google store account ever enters the plan (S2 "Not quoted" row).

## Risks (from S6)

- **R-1 (blocking → resolved via L-01):** the DP expectation gap — captured wording promised online payment (S1.q9 "bayar DP 30% online"; S3.q3 "DP-nya online langsung") while D-011 locked manual transfer + admin confirmation; a builder would read the records as promising an unbuilt gateway, and "gateway otomatis" implies future per-transaction fees the D-005 ceiling excludes. Outcome: resolved via L-01 — targeted batch S4.q14 re-anchored v1 aloud (recorded DP + proof upload + admin confirm button is enough; gateway later); S4 and S1 records were corrected on close. F-02's locked v1 method in `SPEC/requirements.md` is the result.
- **R-2 (note → accepted, folded into D-008):** Supabase Free pauses after 1 week of inactivity (S2 verified row) — a quiet week would take the booking link down. At 20–30 bookings/week (S1.q6) activity is near-daily; the weekly backup/export routine doubles as the anti-pause visit and is written into `HANDOVER.md` and `OVERVIEW.md → Limitations`. Outcome: note, accepted.
- **R-3 (note → accepted):** WhatsApp notifications stay manual in v1 (S3.q6 keeps WhatsApp outside the app): the admin chases unpaid DP by phone/WhatsApp using F-04's chase list (name + phone); no automated reminders exist. `USER_FLOWS.md` and `HANDOVER.md` say so plainly. Outcome: note, accepted.
- **R-4 (note → accepted → D-018):** Vercel Hobby terms are personal/non-commercial-only (S2 verified row) while this app serves a paying business. Treated as a revisit-when-revenue trigger with the documented fallback Vercel Pro USD 20/month (S2 verified; D-018) — above the D-005 ceiling, the same deferral family as D-007's domain decision. Outcome: note, accepted as D-018.
