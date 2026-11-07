# API

REST endpoints served by the Next.js app (route handlers), talking to Supabase (Postgres + Auth + Storage). Endpoint shapes follow the F-01…F-04 happy paths and the entities in `SPEC/data-model.md`; the M0–M3 verification commands in `VERIFICATION.md` call these endpoints verbatim.

## Conventions

- Base URL: `https://futsal-court-booking.vercel.app` (free subdomain, D-007).
- Auth: two tiers (D-010) — player-facing endpoints need no session (players are accountless, identified by name + phone in the payload); admin endpoints (config, confirm, reject, report) require the Supabase Auth session of the single admin. Login/password-reset run through the Supabase Auth SDK, not custom endpoints (D-010, D-012).
- Booking IDs are unguessable uuid4s; a player's access to a booking (detail, proof upload) is scoped by that id — no player session exists.
- Dates are `YYYY-MM-DD`; times are `HH:00` 24-hour slot starts; money is integer rupiah.
- JSON bodies only (`content-type: application/json`), except proof upload (multipart/form-data).
- Error envelope: every failure returns `{"error": "<message>"}` — see Error format.

## Endpoints

| Method | Path | Purpose | Auth |
|---|---|---|---|
| GET | `/api/health` | Liveness check used by M0 verification | none |
| GET | `/api/courts` | List courts (M0 criterion 2 reads real rows from Supabase) | none |
| GET | `/api/slots?court={name}&date={YYYY-MM-DD}` | Slot grid for one court/day with availability (free/taken/blocked) | none |
| POST | `/api/bookings` | Create a booking (F-01 step 7; M0 criteria 3–4) | none |
| GET | `/api/bookings/{id}` | Booking detail incl. `dp_status` (M2 criterion 3) | booking id / admin |
| POST | `/api/bookings/{id}/proof` | Upload DP transfer-proof photo to Supabase Storage (F-02 step 3) | booking id |
| POST | `/api/bookings/{id}/confirm` | Admin confirms the DP (F-02 step 6; M2 criteria 3, 5) | admin |
| POST | `/api/bookings/{id}/reject` | Admin rejects the proof with a reupload reason (F-02, "Tolak") | admin |
| PUT | `/api/courts/{id}/config` | Update opening hours, hourly price, blocked ranges, bank account (F-03; M1 criterion 2) | admin |
| GET | `/api/report?date={YYYY-MM-DD}` | Daily report: booking count, used/empty slots, DP-received total, chase list (F-04; M3 criterion 2) | admin |

## Critical endpoints

### POST /api/bookings

Request:

```json
{ "court": "Lapangan A", "date": "2026-11-14", "slot": "19:00",
  "player_name": "Rizky Pratama", "player_phone": "081234567890" }
```

`201 Created` — the slot is now taken for everyone (D-004):

```json
{ "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", "court": "Lapangan A",
  "date": "2026-11-14", "slot": "19:00", "dp_status": "menunggu_dp",
  "total_amount": 150000, "dp_amount": 45000 }
```

`409 Conflict` — a second player grabbed the same slot first (D-004, M0 criterion 4):

```json
{ "error": "Slot jam 19.00 sudah dibooking. Pilih jam lain ya." }
```

### GET /api/slots?court=Lapangan%20A&date=2026-11-14

`200 OK` — the color-coded grid's data source; taken and blocked slots are marked (M0 criterion 4, M1 criterion 2):

```json
{ "court": "Lapangan A", "date": "2026-11-14",
  "slots": [
    { "slot": "08:00", "status": "tersedia" },
    { "slot": "19:00", "status": "terbooking" },
    { "slot": "20:00", "status": "terbooking" }
  ] }
```

### POST /api/bookings/{id}/confirm

Request: empty JSON body `{}`; the session identifies the admin.

`200 OK` (M2 criterion 3):

```json
{ "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", "dp_status": "diterima" }
```

`409 Conflict` — no proof uploaded yet (M2 criterion 5):

```json
{ "error": "Bukti transfer belum ada. Tidak bisa konfirmasi." }
```

## Status codes

- `200` — successful read or state change.
- `201` — booking created.
- `400` — validation failure: missing/invalid fields, slot outside opening hours, slot inside a blocked range (M1 criterion 2), malformed payload.
- `401` — admin endpoint called without a valid Supabase Auth session.
- `404` — unknown court or booking id.
- `409` — state conflict: slot already booked (D-004), confirm without proof, or a duplicate submission from a double-tap (F-01's slow-connection concern).
- `500` — unexpected server failure (same envelope).
- `502` — an upstream service (Supabase, the email sender) is unreachable; same envelope, plain "try again" wording (see `CODE_STYLE.md` → Error handling).

## Error format

Every failure uses one envelope; messages are casual Bahasa Indonesia for on-screen display (S1.q7 — no English technical jargon in the UI):

```json
{ "error": "<pesan dalam Bahasa Indonesia sehari-hari>" }
```

Examples: `"Slot jam 19.00 sudah dibooking. Pilih jam lain ya."` (409), `"Jam itu lagi ditutup admin."` (400), `"Bukti transfer belum ada. Tidak bisa konfirmasi."` (409), `"Nama dan nomor HP wajib diisi."` (400). Builders render `error` verbatim; they never parse it.
