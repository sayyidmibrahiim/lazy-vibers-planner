# Requirements

One block per feature captured in S4. Priorities were confirmed aloud by the user (D-016, S4.q10–q13); all four features are in-MVP per the scope lock (D-020) — F-04 was promoted from `should` to in-MVP aloud by the user during the S7 walk. The parked payment gateway is not an F-NN (D-020); it lives in `SCOPE.md` → Parking Lot.

## F-01 — Real-time slot booking

- **User:** players (regular players aged 20–35, booking from a phone, S1.q2) · **Priority:** must (S4.q10) · **Status:** in-MVP (D-020)
- **Behavior:** the player opens the app link, picks a court (Lapangan A or Lapangan B), picks a date, and sees the day's 1-hour slots (08:00–23:00) color-coded: free slots green, taken slots grey. Tapping a green slot opens a form for name and phone number. Tapping "Booking" records the booking and turns the slot grey for everyone else immediately (D-004: the database rejects a second booking for the same court/date/slot — the first confirmed booking wins). A slow connection must not let a double-tap create two bookings. The confirmation screen shows name, court, date, slot, and status "Menunggu DP".
- **Acceptance criteria:**
  - **Given** an available slot **when** the player completes the booking form and taps "Booking" **then** the confirmation screen shows the name, court, date, slot, and "Menunggu DP", and the slot is unavailable to other players immediately.
  - **Given** a slot already booked **when** a second player tries to book the same court/date/slot **then** the second booking is rejected (HTTP 409) and the player sees the slot as unavailable — first booking wins (D-004).
  - **Given** a court with no schedule seeded yet **when** a player opens it **then** the screen shows "Belum ada jadwal — hubungi admin" (D-017).

## F-02 — 30% down payment (DP) + admin confirmation

- **User:** players who have booked, and the admin (owner) who confirms · **Priority:** must (S4.q11) · **Status:** in-MVP (D-020)
- **Behavior (v1 method locked — D-011, loop-back L-01, S4.q14): manual bank transfer + admin confirmation. There is no online payment in v1; the app never stores card data and the player never pays inside the app.** After booking, the player's booking page shows the total rent and the DP amount (exactly 30% of the court's hourly price, computed from F-03 data — never hardcoded) and the bank account number to transfer to. The player taps "Kirim Bukti Transfer" and uploads a photo of the transfer proof. The booking appears in the admin's "Menunggu Konfirmasi" queue. The admin checks m-banking and taps "Konfirmasi" (or "Tolak" with a reupload reason); the player's status flips to "DP Diterima" (or the rejected/reupload state). Confirmed bookings count in the daily report's DP-received total (F-04).
- **Acceptance criteria:**
  - **Given** a fresh booking on a court priced Rp 150.000/hour **when** the player opens the booking page **then** it shows DP = Rp 45.000 (exactly 30%, computed from the stored hourly price).
  - **Given** a booking with no proof uploaded **when** the admin taps "Konfirmasi" (or the confirm API is called) **then** the request is rejected (HTTP 400/409) and the booking cannot reach "DP Diterima".
  - **Given** a proof uploaded **when** the admin taps "Konfirmasi" **then** the player's booking shows "DP Diterima" after reload and `"dp_status":"diterima"` is persisted in the database.
  - **Given** a blurry or wrong-amount proof **when** the admin taps "Tolak" with a reason **then** the player sees the rejected state and the reupload path.
  - **Given** a DP not received close to play time **when** the admin needs to chase it **then** the player's recorded phone number is available on the queue/report for a manual call or WhatsApp message (R-3 — no automated reminders).

## F-03 — Court & schedule management (admin)

- **User:** admin (owner), from the laptop · **Priority:** must (S4.q12) · **Status:** in-MVP (D-020)
- **Behavior:** the admin logs in with username and password (D-010). In the "Lapangan" menu, per court: set opening hours (e.g. 08:00–23:00), the hourly price, and block specific times (e.g. Tuesday 15:00–16:00 for lamp maintenance). Tapping "Simpan" makes the change live on the player side immediately — blocked slots cannot be booked, opened slots can (F-01). The admin seeds the first courts/hours/prices here before players use the app (D-017). The bank account number shown in F-02 is admin-configurable here.
- **Acceptance criteria:**
  - **Given** a wrong password **when** the admin logs in **then** an error shows; **given** the correct one **then** the admin dashboard opens.
  - **Given** Lapangan A's price set to Rp 150.000/hour and Tuesday 15:00–16:00 blocked **when** the admin saves **then** the slots API reports 15:00–16:00 unavailable that Tuesday and a booking attempt for it is rejected (HTTP 400/409), without any deploy or player-side action.
  - **Given** an empty court **when** the admin sets hours and price and saves **then** players see the schedule immediately (changes are live without a deploy).

## F-04 — Daily report (admin)

- **User:** admin (owner), from the laptop · **Priority:** should (S4.q13; promoted to in-MVP aloud by the user at S7 — D-020) · **Status:** in-MVP
- **Behavior:** the admin logs in and opens the "Laporan" menu. The date defaults to today (changeable). One screen shows: the booking count, used vs empty slots, the DP-received total in rupiah, and the list of bookings that have not paid the DP — with name and phone number (the chase list, "biar bisa saya kejar"). A "Cetak" action prints or saves the summary. All numbers are computed from the same `bookings` data as the schedule and queue — one source of truth, never a parallel count (S4 "angkanya cocok"; the notebook-retirement goal, S1.q3).
- **Acceptance criteria:**
  - **Given** 3 seeded bookings for today on Lapangan A with one DP confirmed **when** the admin opens the report for today **then** it shows exactly: 3 bookings; 3 used slots and 12 empty (08:00–23:00 = 15 slots); DP received = the one confirmed amount; the chase list names the 2 unpaid bookings with their phone numbers.
  - **Given** the report screen **when** its numbers are compared with the report API and a direct database count **then** all three are identical (one source of truth).
  - **Given** the report **when** the admin opens the browser print preview **then** the summary fits one page.
