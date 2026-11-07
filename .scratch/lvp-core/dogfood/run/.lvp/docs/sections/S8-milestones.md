# S8 — Milestone plan

Stack and deploy target from the locked decisions: Next.js on Vercel Hobby at the free `*.vercel.app` subdomain (D-007, D-019), Supabase free tier as the real store (D-019), zero owner commands (D-006). Every acceptance criterion is machine-checkable — a command with expected output, a scripted tap with an observable result, or a database check; "looks good" appears nowhere (conventions §5 hard rule). `<APP>` below = the deployed URL, e.g. `https://futsal-court-booking.vercel.app`.

## M0 — Walking skeleton (deploy + F-01 end to end)
- **Goal:** a stranger holding a phone can book a real slot at the real URL on the real stack — the slot locks in the real database and a second tap on the same slot fails — nothing stubbed end to end.
- **Deliverables:** Next.js app (player slot grid + booking form + confirmation screen); Supabase project with `courts`, `slots_config`, `bookings` tables and the (court, date, slot) uniqueness rule (D-004); deployed to Vercel Hobby (D-019); health endpoint; seed of Lapangan A/B with the S1.q6 hours (08.00–23.00, 1-hour slots). The S1.q9 day-one task's booking core runs first-tap-to-visible-result; its DP part deliberately waits for M2 (F-02's own milestone).
- **Acceptance criteria:**
  1. `curl -s <APP>/api/health` prints `{"status":"ok"}`.
  2. `curl -s <APP>/api/courts` returns JSON listing Lapangan A and Lapangan B read from the real Supabase database (not a hardcoded array).
  3. Scripted tap: open `<APP>` on a phone-sized viewport → Lapangan A → next Saturday → the 19.00–20.00 slot shows as available (green) → tap it → fill name "Tes Manual" + phone "081200000001" → tap "Booking" → the confirmation screen shows the name, court, date, slot, and status "Menunggu DP".
  4. Immediately after: `curl -s "<APP>/api/slots?court=Lapangan%20A&date=<that Saturday>"` lists 19.00–20.00 as unavailable; `curl -s -X POST <APP>/api/bookings -H 'content-type: application/json' -d '<same court/date/slot, different name>'` returns HTTP 409 with a JSON error body (first booking wins — D-004).
  5. The booking row exists in Supabase: `select count(*) from bookings where booking_date='<date>' and slot='19:00'` returns `1` (run via the Supabase dashboard SQL editor or `psql $DATABASE_URL`).
- **Verification:** commands 1, 2, 4, 5 verbatim above; command 3 as a scripted tap with the stated observable screen. All five pass at the deployed URL, not on localhost.
- **Rough cost/effort:** Rp 0 — free tiers (S5 cost table); ~1 focused builder session.

## M1 — F-03: admin login + court & schedule management
- **Goal:** the owner can log in and self-manage opening hours, hourly prices, and blocked slots — and players see the effect immediately, with no deploy and no phone call.
- **Deliverables:** admin login (username + password per D-010 — Supabase Auth + an admin profile table), password-reset email via the free email sender (D-012), admin "Lapangan" page (per-court opening hours, hourly price, blocked slots), the D-017 empty state ("Belum ada jadwal — hubungi admin") for players when a court has no schedule.
- **Acceptance criteria:**
  1. Scripted tap: login with a wrong password shows an error; with the correct one the admin dashboard opens.
  2. Scripted tap: set Lapangan A price to Rp 150.000/hour and block Tuesday 15.00–16.00, save → `curl -s "<APP>/api/slots?court=Lapangan%20A&date=<next Tuesday>"` reports 15.00–16.00 unavailable and `POST <APP>/api/bookings` for that slot returns HTTP 400 or 409.
  3. Scripted tap: a player opens a court with no schedule → the screen shows "Belum ada jadwal — hubungi admin" (observable fact, D-017).
  4. Request a password reset for the admin account → the reset email arrives at bookingfutsal.id@gmail.com (S2.q9) — observable in the inbox.
- **Verification:** the scripted taps above plus the two curl commands verbatim.
- **Rough cost/effort:** Rp 0; ~1 focused builder session.
- **Order note:** before M2 — the confirm queue (F-02) needs the admin login, and the DP amounts need the prices F-03 sets (see D-021).

## M2 — F-02: DP 30% + admin confirmation (manual transfer — D-011/L-01)
- **Goal:** after booking, the player sees the DP amount, transfers manually, uploads proof; the owner confirms or rejects from a queue; the status flips on the player's phone. No online payment anywhere in v1.
- **Deliverables:** booking page shows total + 30% DP in rupiah + the bank account number (admin-configurable in M1's settings), proof-photo upload to Supabase Storage, admin "Menunggu Konfirmasi" queue with Konfirmasi and Tolak (with reupload reason), status flow "Menunggu DP" → "DP Diterima" (or rejected/reupload).
- **Acceptance criteria:**
  1. Scripted tap: open a fresh booking → the page shows DP = exactly 30% of the court's hourly price (e.g. Rp 45.000 for Rp 150.000/hour — computed from the M1 data, never hardcoded).
  2. Scripted tap: upload a photo as proof → the booking appears in the admin queue with the photo visible; both sides observe it in their own view.
  3. Scripted tap: admin taps "Konfirmasi" → after reload the player's booking shows "DP Diterima" (observable); `curl -s <APP>/api/bookings/<id>` returns `"dp_status":"diterima"` persisted in the database.
  4. Scripted tap: on a second booking, admin taps "Tolak" with a reason → the player's screen shows the rejected state and the reupload path (observable).
  5. A booking attempted with no proof upload cannot reach "DP Diterima" via the API: `curl -s -X POST <APP>/api/bookings/<id>/confirm` without proof returns HTTP 400/409.
- **Verification:** the scripted taps with stated observables plus the two curl commands verbatim.
- **Rough cost/effort:** Rp 0 (photos inside the 1 GB free Storage, S2 verified row); ~1 focused builder session.

## M3 — F-04: daily report + final deploy re-verification
- **Goal:** the owner retires the notebook — one truthful screen answers "how did today go" — and the M0 deploy still passes after everything built on top of it.
- **Deliverables:** admin "Laporan" page (date defaults to today, changeable): booking count, used vs empty slots, DP-received total in rupiah, unpaid-DP chase list with name + phone (printable). All numbers computed from the same `bookings` data (F-04's "angkanya cocok" — one source, not a parallel count). Final re-run of M0's verification at the live URL.
- **Acceptance criteria:**
  1. Seed via the app itself (not SQL): 3 bookings for today on Lapangan A, confirm DP on one → the report screen shows exactly: 3 bookings; 3 used slots and 12 empty (08.00–23.00 = 15 slots — *(dikoreksi saat kompilasi S9, 2026-11-07: tertulis "13 empty", aritmetika 15−3=12; dicatat di dogfood notes D4)*); DP received = the one confirmed amount; the chase list names the 2 unpaid bookings with their phone numbers.
  2. `curl -s "<APP>/api/report?date=<today>"` returns the same four numbers as the screen, and they equal a direct database count (`select count(*), ... from bookings where booking_date='<today>'`) — run both, compare, expected: identical.
  3. The chase list rows each show name + phone number (observable; the owner "bisa kejar").
  4. Browser print preview of the report fits one page (observable in print preview).
  5. M0's verification commands (1, 2, 4, 5) all still pass at `<APP>` — re-run verbatim, all pass.
- **Verification:** the curl command and SQL count verbatim; the seeded-screen comparison as scripted taps; the M0 command list re-run.
- **Rough cost/effort:** Rp 0; ~1 focused builder session.

## Coverage check
F-01 → M0, F-03 → M1, F-02 → M2, F-04 → M3: every in-MVP feature lands in exactly one milestone; deploy to the S2 target (Vercel, D-019/D-007) is inside M0 and re-verified in M3 (criterion 5). 100% coverage. Parking-Lot items (gateway otomatis) appear in no milestone — by design.

## Answers
- **S8.q1 Review: ini rencana bangunnya — M0 kerangka jalan di alamat asli (booking beneran, slot terkunci), M1 admin atur lapangan & jadwal, M2 alur DP + konfirmasi, M3 laporan harian + cek ulang deploy. Setiap tahap ada cara ceknya yang hitung-hitungan, masing-masing kira-kira satu sesi kerja. Sip, atau ada yang mau diubah?** — Sip, urutannya masuk. M0-nya jangan lupa yang dicheck itu slotnya beneran nggak bisa dobol. · _EN: Review passed; the user called out the double-booking check specifically — it is M0 criteria 4-5 (D-004), confirmed in place. No corrections to order or content._

## Decisions this Section
- **D-021** Milestone order and grouping: M0 = deploy + F-01 walking skeleton; M1 = F-03 (admin foundation) before M2 = F-02 (DP flow) because the confirm queue needs the admin login (D-010) and DP amounts need F-03's prices; M3 = F-04 + final deploy re-verification — designer_filled: a non-technical owner cannot sequence builds; the full plan was shown at the review (S8.q1) and passed without corrections · status: designer_filled

## Exit criteria
- [x] M0 exists and satisfies the walking-skeleton definition. — evidence: M0 (deployed at the real address, real stack + real Supabase store, one real user task from first tap to visible result, provable by command + scripted check)
- [x] Milestones cover 100% of in-MVP features — each F-NN in exactly one — plus deploy to the S2 target. — evidence: Coverage check section
- [x] Every milestone has goal, deliverables, acceptance criteria, verification procedure, rough cost/effort. — evidence: M0..M3 sections above
- [x] Every acceptance criterion is machine-checkable (command or scripted step — never "looks good"). — evidence: numbered criteria with exact commands/expected outputs/observables in every milestone
- [x] Every milestone is sized for one focused builder session. — evidence: Rough cost/effort lines (~1 session each, Rp 0)
