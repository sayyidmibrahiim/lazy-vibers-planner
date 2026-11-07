# Security

Security rules compiled from the S3 record and its decisions. The sensitivity bar is the owner's own words (S3.q7): the money fields — DP status and amounts — are what "paling harus dijaga"; a leak or a wrong record means a dispute with players.

## Auth model

- **Admin-only login (D-010).** One credential set: username + password, app-specific, stored and verified by Supabase Auth — never in the app's own tables as plaintext. The owner logs in from the laptop.
- **Players have no accounts (D-010).** They book with a name and phone number; their access to a booking runs through the unguessable booking id (uuid4). There are no player sessions, no player passwords, no tokens to leak.
- **Admin endpoints** (`PUT /api/courts/{id}/config`, `POST .../confirm`, `POST .../reject`, `GET /api/report`) require a valid Supabase Auth session; without it they answer `401`.
- **Password reset (D-012)** by email to bookingfutsal.id@gmail.com (S2.q9) through Supabase Auth + the email-sender service. The reset flow is the reason the email service exists; test it after any key change.
- **No OAuth** (user's explicit choice, S3.q4 — "biar sederhana"): no Google sign-in dependency to break.

## PII inventory and protection

The inventory is exactly what S3.q2 recorded, plus the technical-traces decision (D-013). Nothing else may be collected; adding a field here requires a new decision.

| Data | Where it lives | Protection |
|---|---|---|
| Player name | `bookings.player_name` (Postgres) | Row-level security: readable by the admin session; the player-side UI shows it only on that player's own booking screen (S3.q9) |
| Player phone | `bookings.player_phone` (Postgres) | Same as name; appears in the admin chase list by design (F-04, "biar bisa saya kejar"); never logged |
| Booking schedule (court/date/slot) | `bookings` rows | Players see the slot grid (free/taken only) and their own booking; the grid exposes no names (S3.q9) |
| DP status + amounts | `bookings.dp_status`, `dp_amount`, `total_amount` | The must-protect money fields (S3.q7): server-computed only, admin-only state transitions, never client-supplied |
| Transfer-proof photos | Supabase Storage bucket `dp-proofs` | Private bucket; access via short-lived signed URLs keyed to the booking — never a public bucket (the photo shows bank transfer details) |
| Technical traces: IP addresses, error logs, device signals | Server/Vercel logs | Treated as personal data (D-013): logs carry no player names or phone numbers; retention follows the hosting provider's default log rotation |
| Admin credential | Supabase Auth | App-specific username + password (D-010); reset via email (D-012) |

- **Erasure (D-015):** deleting a person removes their `bookings` rows and their proof photos completely — name, phone, schedule, DP state; nothing retained ("dihapus saja semuanya", S3.q10). The path is available to the admin from launch.

## Secrets handling

- Secrets live in Vercel environment variables, set once by the builder: `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_*` (public by design), `EMAIL_API_KEY`. They never enter the git repository — `.env.local` is gitignored.
- The service-role key is used only inside route handlers, never in browser code.
- The account owner of record for Vercel, Supabase, and the email service is the project email bookingfutsal.id@gmail.com (S2.q9) — see `HANDOVER.md`.
- The bank account number shown to players is admin-configured product data (F-02), not a secret — but it is editable only by the admin session.

## Dependencies policy

- Minimal by rule (`CODE_STYLE.md`): add a dependency only when a feature needs it; no component libraries, no ORMs.
- Updates ride the managed platforms (D-006, D-009): `npm` packages update in the normal build; Vercel and Supabase patch their own infrastructure.
- Before adding any package: check it is maintained and MIT/BSD/Apache-licensed; never vendor NC-licensed content into the app.
- No payment SDK is ever added while the gateway is parked (D-011) — that is the scope lock's security boundary: no card data can enter a codebase that has no card code.

## Compliance notes

- **Data location:** no residency requirement was recorded — "Nggak ada syarat negara. Yang penting datanya aman dan tidak hilang" (S2.q7, spontaneously reconfirmed in S3). Supabase's nearest region (Singapore, unverified) is acceptable; safety and non-loss are the owner's bar.
- **Privacy policy (D-014):** a plain-language privacy policy page exists at launch, in casual Bahasa Indonesia, listing exactly the inventory above (name, phone, schedule, DP status, proof photos, technical traces).
- **Erasure (D-015):** the "delete my data" path is a launch requirement, not a backlog item.
- **Payments:** no card data is stored, processed, or transmitted by the app (D-011) — the player pays the bank directly; the app records only that a DP was confirmed. If the gateway is ever unparked, its provider's terms and onboarding documents apply afresh (S5 regional availability, unverified).
- **No regulator was recorded** (S1.q8): the obligations above come from the owner's decisions, not from a named legal regime; revisit if the business grows beyond one venue.
