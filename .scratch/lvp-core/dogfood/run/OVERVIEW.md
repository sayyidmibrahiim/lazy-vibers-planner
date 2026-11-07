# Futsal Court Booking — plain-language overview

## What this is

This app replaces your booking notebook. Players open a link on their phone. They see your courts and free hours in real time. They tap a free hour, type a name and phone number, and book. No account needed.

After booking, the player sees the rent and the 30% down payment. "DP" means this down payment (uang muka). The player pays it by bank transfer and sends a photo of the proof. You check your m-banking and tap "Confirm". The slot is then fully theirs. Two teams can never grab the same hour anymore.

## What was decided

Each decision below was made with you during the planning sessions. The full list with reasons lives in `DECISIONS.md`.

- **A website, not a store app** (D-001, D-002). Players open a link — no Play Store, no install. You manage from your laptop.
- **Only you log in** (D-010). Players never make an account; a name and phone number is enough. This keeps the player side simple.
- **You manage everything yourself** (D-016, F-03). Opening hours, price per hour, and closed hours — you change them from the laptop, and players see it at once.
- **DP is paid by bank transfer in this first version** (D-011). The player transfers to your account number and uploads the proof. You confirm. No online payment inside the app yet — that waits until it gets busy (see "What is parked").
- **Everything runs on free services** (D-019, D-007). The app lives on Vercel, the data on Supabase, both free tiers. The address is a free one (`futsal-court-booking.vercel.app`). Your own `.com` name waits until the business runs.
- **Four features in the first version** (D-020): booking, DP with your confirmation, court and schedule management, daily report. Nothing else. Changes later go through a small planning step, not silent edits.
- **Build order in four steps** (D-021). First a working booking page at the real address (M0). Then your admin pages (M1). Then the DP flow (M2). Then the daily report (M3). Each step has a numeric check you can see pass.

## What it costs

You said you can spend at most Rp 100.000 per month (D-005). This plan spends Rp 0 of it.

| Item | Price | When | Source |
|---|---|---|---|
| Vercel Hobby (app hosting) | USD 0 (Rp 0) | monthly | vercel.com/pricing, checked 2026-11-07 |
| Supabase Free (database, login, photo storage) | USD 0 (Rp 0) | monthly | supabase.com/pricing, checked 2026-11-07 |
| Email sender for password reset | USD 0 (Rp 0) on a free tier | monthly | unverified — from the assistant's memory, not checked live |
| Own `.com` address | USD 0 now; USD 19.98 per year if you ever want it | yearly, deferred | namecheap.com, checked 2026-11-07 |
| Online payment gateway | not used in this version; about 2–3% of each payment if ever switched on | per payment, parked | unverified |

| | |
|---|---|
| **Total per month** | **Rp 0** |
| **Total one-time** | **Rp 0** |

## How you will use it

Your day-one picture (S1): a player books Saturday 8 pm, pays the DP, and you see it recorded — all before you touch a notebook.

For players: open the link from your WhatsApp. Choose Lapangan A or B. Pick a day. Tap a green (free) hour. Type a name and phone number. Tap "Booking". The hour turns grey for everyone else. Transfer the DP shown on screen. Upload the proof photo. Wait for "DP Diterima".

For you, on the laptop: log in → the "Menunggu Konfirmasi" list shows who sent DP proof → check your m-banking → tap "Konfirmasi". Open "Lapangan" to change hours, prices, or block a time (for example, Tuesday afternoon to fix lamps). Open "Laporan" each night. One screen shows today's bookings, money received, and who has not paid yet — with phone numbers, so you can chase them.

Six months from now: Saturday nights without the notebook, tomorrow's schedule clean on one screen, and a full week with no double bookings. That week is the success bar you set (S1).

## What is parked

Nothing in the Parking Lot is deleted. It is recorded and waits.

- **Automatic payment gateway (QRIS / virtual account)** — parked because you chose manual transfer first (D-011). Each automatic payment would also cost a fee (about 2–3%, unverified) that the Rp 0 budget does not cover. When bookings get busy — you called it "ramai" — this can be added.

## Limitations

You should know these before you rely on the app.

- The market research in this plan ran in a reduced mode: prices and competitor facts came from the assistant's memory, not live web checks. Every such number is marked "unverified". The hosting and domain prices above were checked live on 2026-11-07.
- The planning session's quality tools were recorded as present but were not actually loaded (a simulation in this test run). The plan was still checked against the same rules by hand.
- Vercel's free Hobby plan is officially for personal, non-commercial use, and this app serves a paying business. This is a known trade-off (D-018). If it ever becomes a problem, Vercel Pro costs USD 20 per month — over your ceiling, so it is a revisit-when-revenue trigger, not a cost today.
- The Supabase free tier pauses the app after one week with no visits. Your weekly backup routine (see `HANDOVER.md`) doubles as the weekly visit that keeps it awake.
- WhatsApp stays outside the app. There are no automatic reminders; you chase unpaid DP yourself, using the daily report's phone-number list.
