# Architecture

## Stack

Primary stack (D-019, accepted aloud by the user): **Next.js on Vercel Hobby + Supabase free tier** (Postgres + Auth + Storage). Every reason cites its `DECISIONS.md` row:

- **Next.js** — one codebase serves both role views: the mobile player view and the desktop admin view (D-001, D-003).
- **Vercel Hobby hosting** — USD 0/month, inside the D-005 ceiling; managed deploys on code push, automatic updates, zero owner commands (D-006, D-009); free `*.vercel.app` subdomain (D-007).
- **Supabase Postgres** — the `(court, date, slot)` UNIQUE constraint makes double-booking structurally impossible (D-004); row-level security guards the must-protect money fields (S3.q7).
- **Supabase Auth** — covers the single admin credential set; players stay accountless (D-010).
- **Supabase Storage (1 GB free)** — holds DP proof photos; the manual-transfer flow needs no payment gateway (D-011).
- **Email sender (Resend-class free tier)** — admin password-reset mail (D-012); the only third-party service besides Supabase/Vercel (S3.q6).
- Provider-managed backups plus the weekly scheduled export (D-008); the export routine also keeps the Supabase free tier awake (R-2).

## Components

- **Player web view (mobile)** — court picker, date picker, color-coded slot grid (green free / grey taken), booking form, confirmation screen, DP status ("Menunggu DP" → "DP Diterima").
- **Admin web view (desktop)** — login, "Lapangan" schedule editor, "Menunggu Konfirmasi" queue with proof photos, "Laporan" daily report with chase list.
- **Next.js route handlers (`/api/*`)** — the REST layer in `SPEC/api.md`; all money math (30% DP) happens here, server-side.
- **Supabase Postgres** — `courts`, `slots_config`, `bookings`, `admin_profiles` (`SPEC/data-model.md`); the UNIQUE constraint enforces D-004.
- **Supabase Auth** — the single admin credential + password-reset email flow (D-010, D-012).
- **Supabase Storage** — DP proof photos (F-02).
- **Email sender service** — password-reset mail only (D-012).

## Data flow

```text
Player (phone)                         Admin (laptop)
     |                                      |
     | opens link (D-001, no install)       | logs in (Supabase Auth, D-010)
     v                                      v
+---------------------------------------------------+
|  Next.js on Vercel (Hobby, D-019)                 |
|  - player UI: slot grid, booking form, DP status  |
|  - admin UI: Lapangan / Konfirmasi / Laporan      |
|  - route handlers /api/* (money math server-side) |
+----+---------------+------------------+-----------+
     |               |                  |
     v               v                  v
Supabase        Supabase            Supabase
Postgres        Storage             Auth
(bookings,      (DP proof           (admin session,
courts,         photos, F-02)       password reset,
slots_config,                        D-012)
admin_profiles)
     ^
     | UNIQUE(court_id, booking_date, slot)  <- D-004: second booking loses
     |
     +--> weekly scheduled export (D-008, anti-pause R-2)

Route handler --reset email--> Email sender (Resend-class, D-012) --> admin inbox
(WhatsApp stays OUTSIDE the app: chasing unpaid DP is manual, R-3)
```

## Folder structure

```text
futsal-court-booking/
├── app/
│   ├── page.tsx                  # player: courts -> date -> slot grid -> form (F-01)
│   ├── booking/[id]/page.tsx     # player: DP amount, proof upload, status (F-02)
│   ├── admin/
│   │   ├── page.tsx              # admin dashboard (post-login)
│   │   ├── lapangan/page.tsx     # court & schedule editor (F-03)
│   │   ├── konfirmasi/page.tsx   # "Menunggu Konfirmasi" queue (F-02)
│   │   └── laporan/page.tsx      # daily report (F-04)
│   └── api/
│       ├── health/route.ts
│       ├── courts/route.ts
│       ├── courts/[id]/config/route.ts
│       ├── slots/route.ts
│       ├── bookings/route.ts
│       ├── bookings/[id]/route.ts
│       ├── bookings/[id]/proof/route.ts
│       ├── bookings/[id]/confirm/route.ts
│       ├── bookings/[id]/reject/route.ts
│       └── report/route.ts
├── lib/
│   ├── supabase.ts               # Supabase clients (anon + service role)
│   ├── slots.ts                  # slot generation, blocked-range checks
│   └── dp.ts                     # 30% DP math (server-side only)
├── db/
│   └── schema.sql                # tables + UNIQUE constraint (SPEC/data-model.md)
├── supabase/
│   └── migrations/               # schema + RLS policies
├── AGENTS.md                     # builder entry point
└── (the other bundle files)
```

## Local run

Builder-only — the owner never runs commands (D-006). Commands:

1. `npm install`
2. Create a Supabase project (free tier); copy the URL and keys.
3. `cp .env.example .env.local`, then fill: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `EMAIL_API_KEY`.
4. Run `db/schema.sql` in the Supabase SQL editor (creates the four tables, the UNIQUE constraint, RLS policies).
5. Seed: one admin profile + Lapangan A/B with `slots_config` rows (08:00–23:00, 60-minute slots, a price) — mirrors D-017 seeding.
6. `npm run dev` → `http://localhost:3000`.

## Failure points

What breaks first, and what it looks like:

- **Supabase free-tier pause (R-2)** — after 1 week with no visits the API returns connection errors and the booking link is down. Prevention: the weekly export routine doubles as the weekly visit (D-008, `HANDOVER.md`).
- **The D-004 regression** — if a builder replaces the INSERT with an upsert/`ignoreDuplicates` or checks-then-writes in app code, two players can both succeed again. The UNIQUE constraint on `(court_id, booking_date, slot)` is the guarantee; keep the insert plain and map the DB error to HTTP 409.
- **Storage cap** — proof photos beyond the 1 GB free quota start failing uploads (F-02). Watch the Supabase usage page; photos are small but endless.
- **Vercel Hobby terms (R-4)** — the free tier is documented for personal, non-commercial use while this serves a paying business. If Vercel ever flags it: Vercel Pro USD 20/month (D-018) — a revisit-when-revenue trigger, above the D-005 ceiling.
- **Email sender quota** — the free tier (~3.000 emails/month, unverified) is far above one admin's resets; if the key expires, password reset silently stops arriving (D-012). Test the reset flow after any key change.
- **Hosting bill lapse (D-009)** — rented hosting goes dark when payment stops; at Rp 0 there is no bill, which is also why paid tiers are recorded as revisit-triggers only.
