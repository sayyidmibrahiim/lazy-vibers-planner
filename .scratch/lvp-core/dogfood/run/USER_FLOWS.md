# User flows

One section per feature. Scripts are click-by-click ("posting ke IG" style — a stranger could follow them). On-screen labels are quoted as the app shows them (casual Bahasa Indonesia, S1.q7). All four features are in-MVP (D-020); the parked payment gateway has no flow by design (never an F-NN, D-020).

## F-01 — Real-time slot booking (in-MVP)

```text
[WhatsApp link] --> [pick court: Lapangan A | B] --> [pick date]
      --> [slot grid: green = free, grey = taken] --> [tap green slot]
      --> [form: name + phone] --> [tap "Booking"]
      --> [confirmation screen]          slot turns grey for everyone
```

1. Open the app link on the phone (the admin shares it in WhatsApp).
2. Pick a court: "Lapangan A" or "Lapangan B".
3. Pick a date on the calendar (for example, Saturday).
4. Look at the hour list: free hours are green, taken hours are grey.
5. Tap a green hour, for example "19.00–20.00".
6. Type your name and phone number.
7. Tap "Booking".
8. The confirmation screen appears: name, court, date, hour, status "Menunggu DP".
9. Done — the hour is now grey for everyone else, and the new booking shows up on the admin's laptop.

- **Alternatives:** two players tap the same slot almost together — the first confirmed booking wins; the second sees the slot as taken and picks another hour (D-004, the database rejects the second booking). The connection is slow and the player taps "Booking" twice — only one booking is created (duplicate submissions are rejected). The court has no schedule yet — the screen shows "Belum ada jadwal — hubungi admin" (D-017).

## F-02 — 30% down payment (DP) + admin confirmation (in-MVP)

```text
[booking page: total + DP 30% + account number]
      --> player: bank transfer (m-banking) --> tap "Kirim Bukti Transfer" --> upload photo
      --> admin laptop: "Menunggu Konfirmasi" list --> check m-banking
      --> tap "Konfirmasi"                    [or "Tolak" + reason]
      --> player phone: status "DP Diterima"  [or rejected/reupload]
```

1. After booking (F-01), the player opens the booking page: it shows the total rent and the 30% DP in rupiah, plus the bank account number to transfer to.
2. The player transfers the DP from m-banking to that account number.
3. On the same page, the player taps "Kirim Bukti Transfer", picks a photo of the transfer proof, and sends it.
4. On the laptop, the admin opens the "Menunggu Konfirmasi" list — the booking is there with its proof photo.
5. The admin checks m-banking: the money arrived.
6. The admin taps "Konfirmasi" on that booking.
7. On the player's phone, the status changes to "DP Diterima"; the booking is fully confirmed on the schedule.
8. Done — the daily report (F-04) counts the received DP automatically.

- **Alternatives:** the proof is blurry or the amount is wrong — the admin taps "Tolak" with a reason, and the player sees the rejected state plus the reupload path. The DP has not arrived close to play time — the admin contacts the player by phone/WhatsApp using the recorded number (no automated reminders in v1, R-3). There is no online payment anywhere in this flow — the app never touches card data (D-011, locked by L-01/S4.q14).

## F-03 — Court & schedule management (admin) (in-MVP)

```text
[login laptop] --> [menu "Lapangan"] --> [pick court]
      --> [set open hours + hourly price] --> [block hours (optional)]
      --> [tap "Simpan"] --> player side updates immediately
```

1. On the laptop, open the app and log in with username and password.
2. Open the "Lapangan" menu.
3. Pick a court (for example "Lapangan A"): set the open hours (08.00–23.00) and the rent per hour.
4. Block hours that cannot be used (for example Tuesday 15.00–16.00 to fix the lamps).
5. Tap "Simpan".
6. Done — players see the change immediately: blocked hours cannot be booked, open hours can (F-01).

- **Alternatives:** the admin blocked the wrong hour — open it again any time and save. The first-ever use: the admin seeds courts, hours, and prices here before any player opens the app (D-017). Changes need no deploy and no action on the player side.

## F-04 — Daily report (admin) (in-MVP)

```text
[login laptop] --> [menu "Laporan"] --> [date = today (changeable)]
      --> one screen: bookings | used/empty slots | DP received (Rp) | unpaid list (+ phone)
      --> [tap "Cetak" to print/save]
```

1. On the laptop, log in.
2. Open the "Laporan" menu.
3. The date fills itself with today (it can be changed).
4. Read the one-glance summary: how many bookings, used vs empty slots, the DP money received in rupiah, and every booking that has not paid the DP — with name and phone number.
5. Tap "Cetak" to print or save the summary if needed.
6. Done — the notebook stays closed tonight; the numbers match the booking list because they come from the same data.

- **Alternatives:** the admin picked the wrong date — change the date on the same screen. A player still has not paid — copy the phone number from the unpaid list and call/WhatsApp them manually (R-3).
