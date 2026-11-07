# S5 — Deep research

> Booster: competitor-analysis (degraded — model-knowledge fallback). Everything below is model knowledge, unverified; prices and availability especially may be stale. This session had no live web access, so the degraded path (ADR-0004) ran: the four outputs keep their structure, the certainty does not. Exception: rows already verified at S2 are cited from the S2 record (`S2-kondisi.md`, Prices quoted, verified 2026-11-07) and marked accordingly — they were reused, not re-researched.

## Competitor scan

Scope: products that solve the S1 problem statement (single-venue futsal booking + down-payment tracking) and the adjacent manual workflows players and owners tolerate today (S1.q5).

| Product | What it does | Pricing model | Lesson for this idea | Source (accessed) |
|---|---|---|---|---|
| Playtomic (global, ex-Playven-style venue apps) | Player-facing marketplace for padel/futsal court booking + venue manager tools (calendar, recurring games) | Venue-side commission per booking or subscription; player pays no fee unverified | Discovery marketplaces pull players in, but a single-venue owner's real need is operational: slot locking + DP tracking, not lead flow — a v1 must win on the notebook-replacement job, not on discovery unverified | model knowledge, no live check (2026-11-07) |
| Vamos (Indonesia, court booking app for badminton/futsal) | Indonesian app to find and book sports courts, pay in-app | Commission/booking-fee per transaction; venue onboarding free unverified | Indonesian players are already used to tapping a slot grid on a phone — the interaction model of F-01 is familiar, no behavior change to teach unverified | model knowledge, no live check (2026-11-07) |
| Futsalnesia (Indonesia, futsal court directory/community; status unclear, may be defunct) | Directory of futsal venues + community content; booking mostly redirected to the venue by phone/DM | Free directory; monetization unclear unverified | A directory alone did not keep this problem solved — the durable pain is the owner's daily operations (schedule + DP + chasing unpaid teams), exactly S1.q1/S1.q3 unverified | model knowledge, no live check (2026-11-07) |
| Adjacent manual workflow: Instagram/WhatsApp DM + notebook (S1.q5 — the incumbent to beat) | Player DMs the admin, admin writes name/date/hour in a paper notebook, checks m-banking one transfer at a time, crosses off when paid | Rp 0 cash, but costs owner time and produces double-bookings and lost proof screenshots (S1.q1) | The competitor is free and familiar: the app must be visibly less effort than the notebook in week one, or the notebook wins. This is the bar for every M-milestone scope cut unverified | S1 record, S1.q5 + S1.q1 (2026-11-07) |

## Stack options and trade-offs

Candidates screened against the recorded answers: S1.q4 (web, mobile player + desktop admin), S2.q3 (ceiling Rp 100.000/month, D-005), S2.q5 (zero commands, D-006), S3.q1/S3.q4 (admin-only login, username+password), S3.q5 (manual transfer + proof upload in v1, D-011), S4 musts F-01..F-03 with D-004 (double-booking must be impossible).

**Option A — Next.js on Vercel Hobby + Supabase free tier** (Postgres + Auth + Storage + Realtime). Framework hosted free; database/auth/photo storage in one managed service.

**Option B — No-code app builder on a spreadsheet backend (Glide- or Softr-class, data in Google Sheets)**. Visual builder, no code anywhere.

| Dimension | Option A: Next.js + Vercel + Supabase | Option B: no-code builder + Google Sheets |
|---|---|---|
| Fits the S2 budget ceiling (D-005, Rp 100.000/mo) | USD 0/month on both free tiers (Vercel Hobby USD 0 verified S2; Supabase Free USD 0 verified S2) | Builder free tiers exist but per-user pricing kicks in early; typical paid tier USD 25-60/month unverified — likely busts the ceiling at 80-150 players (S1.q6) |
| Fits the S2 hands-on/maintenance answer (S2.q5, D-006, D-009) | Deploy = push code, updates automatic, zero owner commands; owner never touches a terminal | Zero code by definition; builder updates itself |
| Covers the S3 auth/payments answers (D-010, D-011) | Auth library included (admin-only login fits); no gateway needed in v1 — proof upload + admin confirm is plain app logic; card data never touches the app (S3.q5) | Admin login possible but options are builder-dependent; username+password (not email-first, S3.q4) is awkward; proof upload + confirm queue is exactly what no-code does worst unverified |
| Carries the S4 must-features (F-01..F-03, D-004) | Slot locking under two simultaneous taps is a database transaction/constraint — the one thing F-01 absolutely needs (D-004); real-time slot grid supported | Sheets has no row-level locking; two players tapping the same slot can both succeed — double-booking, the exact problem from S1.q1, likely returns unverified |
| Regional availability (S2.q10, Indonesian cards) | Vercel + Supabase sign-up works with an Indonesian BCA debit card unverified; both are global self-serve products | Builders bill in USD on foreign cards unverified; same card works unverified |
| Maintenance burden (D-008, D-009) | Provider-managed; needs the D-008 weekly export routine (see cost table + risk R-2) | Provider-managed; export trivial (it is a spreadsheet) |
| Vendor lock / portability | Standard Postgres + standard code — portable if the bill must shrink to zero | Entire app lives inside the builder's format — rebuild from scratch if it no longer fits unverified |

Both options fit "no commands for the owner" (D-006). Only Option A makes the double-booking failure mode (D-004, S1.q1) structurally impossible rather than "unlikely".

## Recommended stack

**Next.js on Vercel Hobby + Supabase free tier** — accepted by the user (S5.q1, D-019). Tied to the recorded answers:

- **S1.q4 / D-001 / D-003** — one Next.js app serves both shapes: mobile player view, desktop admin view.
- **S2.q3 / D-005** — total recurring cost Rp 0/month (see cost table); the Rp 100.000 ceiling is untouched.
- **S2.q5 / D-006 / D-009** — hosting is fully managed: deploys happen on code push, updates automatic, owner types nothing.
- **S2.q8 / D-008** — backups: provider snapshots plus the weekly scheduled export routine recorded in HANDOVER at S9; owner cost is the ~1 hr/week they already budgeted.
- **S3.q1 / S3.q4 / D-010** — Supabase Auth covers the single admin credential set; players stay accountless (name + phone on the booking).
- **S3.q5 / D-011** — v1 payment flow needs no gateway at all: proof photo goes to Supabase Storage (1 GB free, verified S2 row), admin confirms from a queue. Card data never enters the system.
- **S3.q7** — DP status + amounts (the must-protect fields) live in Postgres with row-level security, not in a spreadsheet tab.
- **S4 / D-004** — the double-booking guarantee is a database unique-constraint/transaction on (court, date, slot) — first confirmed booking wins, the second attempt is rejected at the database, not by UI politeness.
- **S1.q6 scale** — 20-30 bookings/week and 80-150 players is far inside both free tiers' limits (Supabase Free 500 MB DB / 50k MAU, verified S2 row).

Rejected: Option B (no-code + Sheets) — cannot guarantee the D-004 slot lock, and its pricing at 80-150 users likely busts the ceiling (both rows unverified).

## Cost table and regional availability

Built on the S2 fact-sheet rows (S2-kondisi.md, Prices quoted, verified 2026-11-07) — reused, not re-researched. New rows are marked `unverified` per the degraded mode.

| Item | Price | Type | Source (accessed) | Status |
|---|---|---|---|---|
| Vercel Hobby (app hosting, deploy, TLS) | USD 0/month — Hobby terms say personal, non-commercial use (caveat → R-4) | monthly | S2 row: vercel.com/pricing (2026-11-07) | verified (S2) |
| Supabase Free (Postgres 500 MB, Auth, Storage 1 GB, 50k MAU) | USD 0/month — pauses after 1 week of inactivity (caveat → R-2) | monthly | S2 row: supabase.com/pricing (2026-11-07) | verified (S2) |
| Email sender for admin password reset (D-012) | USD 0 on a free tier (e.g. Resend-class ~3.000 emails/month) | monthly | model knowledge, no live check (2026-11-07) | unverified |
| Custom domain (.com) | deferred — free `*.vercel.app` subdomain first (D-007); renewal USD 19.98/yr if ever needed | yearly | S2 row: namecheap.com (2026-11-07) | verified (S2) |
| Payment gateway (Midtrans/Xendit-class: QRIS, virtual account) | parked with the gateway (D-011): MDR ~2-3% per transaction when unparked | per-transaction | model knowledge, no live check (2026-11-07) | unverified |
| Vercel Pro / Supabase Pro (paid fallback, D-018) | USD 20/month per seat / ~USD 25/month | monthly | S2 row (Vercel, verified) / model knowledge (Supabase, unverified) | mixed — see D-018 |

**v1 total recurring: USD 0 ≈ Rp 0/month** — inside the D-005 ceiling with the full Rp 100.000 untouched.

### Regional availability

- Market: Indonesia (S2.q10 — owner pays with a BCA debit card, GoPay available). Vercel and Supabase are global self-serve signups that accept Indonesian cards unverified (2026-11-07).
- Supabase region closest to Indonesia is Singapore (ap-southeast-1) unverified — adequate latency for a booking grid; S2.q7 sets no data-residency constraint.
- Payment gateways that work in Indonesia: Midtrans, Xendit, Duitku-class providers (QRIS + virtual accounts) unverified — relevant only when the gateway is unparked; most require business/identity documents at onboarding unverified. None are needed in v1 (D-011).
- Store fees: none — the platform is web-only (D-001, D-002); no Apple/Google store account ever enters the plan (S2 "Not quoted" row).

## Answers

- **S5.q1 Rekomendasi tumpukan: Next.js + Supabase + Vercel, semuanya paket gratis — Rp 0/bulan, tanpa perintah, slot anti-dobol. Pakai rekomendasi ini, atau mau lewati/diskusikan dulu?** — Oke pakai yang gratisan itu dulu. Yang penting nanti saya nggak disuruh ketik perintah dan slot nggak dobol. · _EN: Stack recommendation accepted (D-019) with the two conditions that matter to this owner: no commands ever (D-006) and no double bookings (D-004). The degraded-research caveat was stated before the ask; the paid fallback was recorded alongside (D-018)._

Bank items not fired, recorded deliberately (D1-notes follow-up): bank question 1 (which competitor matters) — no finding required a user fact; the incumbent to beat is the owner's own manual workflow (S1.q5), not a named product. Bank question 2 (regional constraint) — no regional rule surfaced that the records do not already cover (S2.q7, S2.q10). Bank question 3 (does a new cost fit) — folded into S5.q1: the recommendation adds Rp 0/month.

## Decisions this Section

- **D-018** Paid fallback for the free-tier stack recorded next to the recommendation: Supabase Pro ~USD 25/month unverified; Vercel Pro USD 20/month (verified S2 row) — both above the D-005 ceiling, revisit-when-revenue triggers only — designer_filled: a non-technical user cannot know free tiers have cliffs (inactivity pause, non-commercial terms, storage caps); recorded proactively, shown for correction · status: designer_filled
- **D-019** Recommended stack accepted: Next.js on Vercel Hobby + Supabase free tier, total Rp 0/month — User accepted aloud (S5.q1) after the recommendation was tied to the recorded answers; no-code alternative rejected on the D-004 slot-locking failure · status: user_confirmed

## Exit criteria

- [x] Competitor scan covers ≥3 direct/adjacent products with what they do and a pricing model. — evidence: Competitor scan table (4 rows: Playtomic, Vamos, Futsalnesia, manual-workflow incumbent)
- [x] ≥2 stack options with a trade-offs table. — evidence: Stack options table (Option A vs Option B, 7 dimensions)
- [x] One recommended stack with reasons tied to the S1–S4 answers and S2 resources. — evidence: Recommended stack; D-019 (S5.q1)
- [x] Cost table present, built on the S2 fact-sheet, with regional payment-gateway availability for the user's market. — evidence: Cost table (4 S2 rows reused + 2 new unverified rows) + Regional availability
- [x] Every claim carries source + access date or an explicit `unverified` flag. — evidence: degraded banner + per-row Source/Status columns throughout

## Risks (S6)

Classification walk over every S5 finding (competitor rows, stack trade-offs, cost rows, regional constraints, unverified flags), each confronted with the S1–S4 records:

- **R-1 (blocking)** — DP expectation gap: the captured wording still promises online payment (S1.q9 day-one task "bayar DP 30% online"; S3.q3 "DP-nya online langsung") while D-011 locked manual transfer + admin confirmation for v1 — a builder would read the records as promising an unbuilt gateway, and the "gateway otomatis" expectation implies future per-transaction fees the D-005 ceiling excludes. · evidence: D-011 rationale FLAG, S1.q9, S3.q3 · outcome: resolved via L-01 — targeted batch S4.q14 re-anchored v1 aloud (DP tercatat + upload bukti + tombol konfirmasi admin itu cukup; gateway nanti); touched records updated on close: S4-fitur.md (F-02 locked v1 method, no online payment in v1) and S1-context.md (S1.q9 "online" wording corrected inline)
- **R-2 (note)** — Supabase Free pauses after 1 week of inactivity (S2 verified row): a quiet week would take the booking link down. At 20-30 bookings/week (S1.q6) activity is near-daily, but the pause risk joins D-008: the weekly backup/export routine doubles as the anti-pause routine and goes into HANDOVER/OVERVIEW at S9. · evidence: S2 Prices quoted row (supabase.com/pricing, 2026-11-07) · outcome: note only
- **R-3 (note)** — WhatsApp notifications stay manual in v1 (S3.q6 keeps WhatsApp outside the app): the admin chases unpaid DP by phone/WhatsApp using F-04's chase list (name + phone); no automated reminders exist — USER_FLOWS and HANDOVER must say so plainly. · evidence: S3.q6, F-04 script · outcome: note only
- **R-4 (note)** — Vercel Hobby terms are personal/non-commercial-only (S2 verified row) while this app serves a paying business; treated as a revisit-when-revenue trigger with the documented fallback Vercel Pro USD 20/month (S2 verified; D-018) — above the D-005 ceiling, same deferral family as D-007's domain decision. · evidence: S2 Prices quoted row (vercel.com/pricing, 2026-11-07) · outcome: note only → D-018


