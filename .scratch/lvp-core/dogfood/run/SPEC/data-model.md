# Data model

Entities and fields from the S3 data inventory (name, phone, booking schedule, DP status — plus technical traces per D-013) and the S4 features. Supabase free tier = Postgres. Entity names are identical everywhere in the bundle. The `(court, date, slot)` uniqueness rule from S8/M0 lives on `bookings` and enforces D-004.

## Entities

### courts

| Field | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | PK | |
| name | text | NOT NULL, unique | "Lapangan A", "Lapangan B" (S4.q2 seed) |
| created_at | timestamptz | NOT NULL, default now() | |

### slots_config

One row per court: the schedule template F-03 edits. Holds opening hours, price, and blocked ranges.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | PK | |
| court_id | uuid | NOT NULL, FK → courts.id, UNIQUE | one config per court |
| open_time | time | NOT NULL, default 08:00 | S1.q6 hours |
| close_time | time | NOT NULL, default 23:00 | S1.q6 hours |
| slot_minutes | integer | NOT NULL, default 60 | 1-hour slots (S1.q6) |
| hourly_price | integer | NOT NULL, CHECK (hourly_price > 0) | rupiah, e.g. 150000; admin-editable (F-03) |
| blocked_ranges | jsonb | NOT NULL, default '[]' | array of {"weekday": 0–6, "start": "15:00", "end": "16:00"}; blocked times (F-03) |
| bank_account | text | NOT NULL | account number shown to players for the DP transfer (F-02, admin-configurable) |
| updated_at | timestamptz | NOT NULL | |

### bookings

The main entity — one row per booking. Holds the PII inventory (S3.q2) and the DP state machine.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | PK | |
| court_id | uuid | NOT NULL, FK → courts.id | |
| booking_date | date | NOT NULL | the play date |
| slot | time | NOT NULL | slot start, e.g. 19:00; must align to slot_minutes and sit inside open_time–close_time |
| player_name | text | NOT NULL, 1–100 chars | PII (S3.q2) |
| player_phone | text | NOT NULL, 9–16 chars, digits/+/− | PII (S3.q2); the chase-list contact (F-04, R-3) |
| total_amount | integer | NOT NULL, > 0 | rupiah = hourly_price × slot length; server-computed |
| dp_amount | integer | NOT NULL, > 0 | rupiah = exactly 30% of total_amount; server-computed, never client-supplied (M2) |
| dp_status | text | NOT NULL, enum: `menunggu_dp` \| `menunggu_konfirmasi` \| `diterima` \| `ditolak` | PII/money field — the must-protect field (S3.q7); default `menunggu_dp` |
| dp_proof_url | text | NULL | Supabase Storage URL of the uploaded proof photo (F-02) |
| dp_reject_reason | text | NULL | set on "Tolak" with reupload reason (F-02) |
| created_at | timestamptz | NOT NULL, default now() | technical trace (D-013) |

### admin_profiles

| Field | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | PK, references auth user id | Supabase Auth owns the credential (D-010) |
| username | text | NOT NULL, unique | login name (S3.q4) |
| email | text | NOT NULL | bookingfutsal.id@gmail.com (S2.q9) — receives password-reset mail (D-012) |
| display_name | text | NOT NULL | shown in the admin UI |

## Relations

- courts 1—1 slots_config — each court has exactly one schedule template; F-03 edits it, F-01 reads it.
- courts 1—N bookings — a court hosts many bookings over time; the unique constraint below keeps one booking per (court, date, slot).
- admin_profiles 1—1 Supabase Auth user — the single admin credential set (D-010); players have no rows here (accountless, D-010).

## Indexes

- bookings: UNIQUE (court_id, booking_date, slot) — makes double-booking impossible at the database, not the UI (D-004, S8/M0).
- bookings: INDEX (booking_date) — the daily report (F-04) queries one date.
- bookings: INDEX (dp_status) — the "Menunggu Konfirmasi" queue and the unpaid-DP chase list filter on it (F-02, F-04).
- bookings: INDEX (court_id) — the per-court slot grid (F-01).
- admin_profiles: UNIQUE (username) — login lookup (D-010).

## Validation rules

- A booking's slot must sit inside the court's open_time–close_time and align to slot_minutes; violations are rejected (HTTP 400).
- A booking's slot must not overlap any blocked_ranges entry for that court's weekday (M1: blocked slot → HTTP 400/409).
- player_name is required (1–100 chars); player_phone is required (9–16 chars, digits with optional +/−) — the only player identity (D-010).
- dp_amount = exactly 30% of total_amount, computed server-side from slots_config.hourly_price — never accepted from the client (M2 criterion 1).
- Confirming a booking requires a dp_proof_url first; without it the confirm is rejected (HTTP 400/409) (M2 criterion 5).
- dp_status moves only along `menunggu_dp` → `menunggu_konfirmasi` → `diterima` (or `ditolak` → back to `menunggu_konfirmasi` on reupload); no other transitions.
- UNIQUE (court_id, booking_date, slot) — the second insert for the same slot fails (HTTP 409) (D-004).
- Erasure (D-015): deleting a person deletes their bookings rows (name, phone, schedule, DP state) completely — nothing retained.

## Sample JSON

A confirmed booking (the main entity, realistic values from the S4/M2 scripts):

```json
{
  "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "court_id": "c1a5a7e0-6f2a-4f8b-9c3d-1e2f3a4b5c6d",
  "booking_date": "2026-11-14",
  "slot": "19:00",
  "player_name": "Rizky Pratama",
  "player_phone": "081234567890",
  "total_amount": 150000,
  "dp_amount": 45000,
  "dp_status": "diterima",
  "dp_proof_url": "https://<project>.supabase.co/storage/v1/object/sign/dp-proofs/9b1deb4d/bukti.jpg?token=<short-lived-signed-url>",
  "dp_reject_reason": null,
  "created_at": "2026-11-08T10:15:30Z"
}
```
