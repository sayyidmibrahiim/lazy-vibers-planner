# Verification

Per-milestone procedures from the S8 record, verbatim: exact commands with expected outputs; visual checks stated as observable facts plus how to look. `<APP>` = the deployed URL, e.g. `https://futsal-court-booking.vercel.app`. All procedures run at the deployed URL, not on localhost.

## M0 — Walking skeleton (deploy + F-01 end to end)

Commands 1, 2, 4, 5 verbatim below; command 3 as a scripted tap with the stated observable screen. All five pass at `<APP>`.

1. `curl -s <APP>/api/health` → prints `{"status":"ok"}`.
2. `curl -s <APP>/api/courts` → returns JSON listing Lapangan A and Lapangan B read from the real Supabase database (not a hardcoded array).
3. Scripted tap: open `<APP>` on a phone-sized viewport → Lapangan A → next Saturday → the 19.00–20.00 slot shows as available (green) → tap it → fill name "Tes Manual" + phone "081200000001" → tap "Booking" → the confirmation screen shows the name, court, date, slot, and status "Menunggu DP". (How to look: watch the phone-sized viewport in the browser; the confirmation screen's fields are the observable fact.)
4. Immediately after: `curl -s "<APP>/api/slots?court=Lapangan%20A&date=<that Saturday>"` → lists 19.00–20.00 as unavailable; `curl -s -X POST <APP>/api/bookings -H 'content-type: application/json' -d '<same court/date/slot, different name>'` → HTTP 409 with a JSON error body (first booking wins — D-004).
5. `select count(*) from bookings where booking_date='<date>' and slot='19:00'` → returns `1` (run via the Supabase dashboard SQL editor or `psql $DATABASE_URL`).

## M1 — F-03: admin login + court & schedule management

The scripted taps below plus the two curl commands verbatim.

1. Scripted tap: login with a wrong password → an error shows; with the correct one → the admin dashboard opens. (Observable: the error message on wrong password, the dashboard on success.)
2. Scripted tap: set Lapangan A price to Rp 150.000/hour and block Tuesday 15.00–16.00, save → `curl -s "<APP>/api/slots?court=Lapangan%20A&date=<next Tuesday>"` reports 15.00–16.00 unavailable, and `POST <APP>/api/bookings` for that slot returns HTTP 400 or 409.
3. Scripted tap: a player opens a court with no schedule → the screen shows "Belum ada jadwal — hubungi admin" (observable fact, D-017; how to look: open the empty court's page in a logged-out browser).
4. Request a password reset for the admin account → the reset email arrives at bookingfutsal.id@gmail.com (S2.q9) — observable in the inbox.

## M2 — F-02: DP 30% + admin confirmation (manual transfer — D-011/L-01)

The scripted taps with stated observables plus the two curl commands verbatim.

1. Scripted tap: open a fresh booking → the page shows DP = exactly 30% of the court's hourly price (e.g. Rp 45.000 for Rp 150.000/hour — computed from the M1 data, never hardcoded).
2. Scripted tap: upload a photo as proof → the booking appears in the admin queue with the photo visible; both sides observe it in their own view.
3. Scripted tap: admin taps "Konfirmasi" → after reload the player's booking shows "DP Diterima" (observable); `curl -s <APP>/api/bookings/<id>` → returns `"dp_status":"diterima"` persisted in the database.
4. Scripted tap: on a second booking, admin taps "Tolak" with a reason → the player's screen shows the rejected state and the reupload path (observable).
5. `curl -s -X POST <APP>/api/bookings/<id>/confirm` without proof → HTTP 400/409 (a booking with no proof upload cannot reach "DP Diterima" via the API).

## M3 — F-04: daily report + final deploy re-verification

The curl command and SQL count verbatim; the seeded-screen comparison as scripted taps; the M0 command list re-run.

1. Seed via the app itself (not SQL): 3 bookings for today on Lapangan A, confirm DP on one → the report screen shows exactly: 3 bookings; 3 used slots and 12 empty (08:00–23:00 = 15 slots); DP received = the one confirmed amount; the chase list names the 2 unpaid bookings with their phone numbers.
2. `curl -s "<APP>/api/report?date=<today>"` → returns the same four numbers as the screen, and they equal a direct database count (`select count(*), ... from bookings where booking_date='<today>'`) — run both, compare, expected: identical.
3. The chase list rows each show name + phone number (observable; the owner "bisa kejar" — how to look: read the unpaid list on the report screen).
4. Browser print preview of the report fits one page (observable in print preview).
5. M0's verification commands (1, 2, 4, 5) all still pass at `<APP>` — re-run verbatim, all pass.

## Global smoke test

One scripted pass over the whole product, end to end, at `<APP>`, after any build session:

1. Player side: open `<APP>` → Lapangan A → next Saturday → tap a green slot → book with name "Tes Asap" + phone "081200000002" → confirmation shows "Menunggu DP"; the slot is grey for a second visitor.
2. Admin side: log in → "Menunggu Konfirmasi" shows the booking → "Konfirmasi" it → the player's booking reads "DP Diterima" after reload.
3. Admin side: "Lapangan" → change Lapangan B's price → "Simpan" → the player-side DP math for Lapangan B reflects the new price on the next booking.
4. Admin side: "Laporan" for today → the booking count and DP-received total match what was just done (the smoke test's own booking appears).
5. Re-run M0 commands 1 and 4 (health + a 409 double-booking attempt) — both pass.

## Definition of verified

A milestone is verified when every one of its acceptance criteria's procedures was run at the deployed URL (`<APP>`, never localhost) and produced the expected result. A milestone with any unrun or failing criterion is not done — "looks good" and "works well" are not criteria. The whole product is verified when all milestones are verified and the global smoke test passes in one sitting.
