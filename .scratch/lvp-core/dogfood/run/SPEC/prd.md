# PRD — Futsal Court Booking

## Problem

The owner's own words (S1.q1, translated): "Two teams booked the same Saturday 8 pm slot. One had already transferred the DP (30% down payment) and sent the proof to my WhatsApp, one had not. I lost track of who had paid, because the marks in my notebook lag behind the chats. On Saturday night both teams showed up. One team went home angry — they had even brought their shoes. Embarrassing, and a double loss."

The underlying workflow (S1.q5): players ask for slots in WhatsApp chats; the owner writes name, date, and hour into a paper notebook; DP payments arrive as manual bank transfers checked one by one in m-banking; the crossing-off is forgotten and transfer proofs get buried in hundreds of group-chat messages. The result is double-booked slots, lost proofs, and no-shows the 30% DP was meant to prevent (S0 idea statement).

## Context

A small futsal venue with 2 courts, a small canteen, and one employee who doubles as cashier. Everything is run manually today (S1.q2). Scale: 80–150 returning players, 20–30 bookings per week, busiest Friday–Saturday; 1-hour slots from 08:00 to 23:00 (S1.q6). The owner is non-technical: no command line, no maintenance time beyond ~1 hour/week, a hard budget ceiling of Rp 100.000/month (S2.q3, S2.q5, S2.q8 — D-005, D-006, D-009). No data-residency requirement; "somewhere safe, not lost" is the bar (S2.q7).

## Target users

- **Small futsal-venue owners** like the user: 1–2 courts, non-technical, one part-cashier employee, running bookings from a notebook and WhatsApp today. They need the notebook replaced, not a discovery marketplace (S1.q2, S5 competitor scan).
- **Regular players**, 20–35 years old, who play weekly and arrange everything from an Android phone (a few iPhones); they are already used to tapping a slot grid (S1.q2, S5 Vamos row).

## Value proposition

For the owner: the notebook and the chat archaeology are gone. Slots cannot be double-booked — the database rejects the second booking (D-004). DP status is recorded in one place, with a confirmation queue and a daily chase list with phone numbers. Cost stays at Rp 0/month, inside the D-005 ceiling.

For players: open a link (no install, D-001), see real-time free slots, book in a few taps with just a name and phone number (no account, D-010), see the DP amount and get a "DP Diterima" confirmation on the phone.

## Goals

- A stranger with a phone can book a real slot at the real URL, and a second tap on the same slot fails (M0 walking skeleton, D-004).
- The owner retires the notebook: schedule, DP status, and the daily report come from one truthful source (S1.q3 success picture, F-04).
- Zero owner commands: updates happen by themselves; the owner never types terminal commands (D-006).
- Total recurring cost Rp 0/month (D-019), inside the D-005 ceiling.

## Non-goals

- **Automatic payment gateway** — the headline parked item (D-011, D-020): v1 is manual bank transfer + admin confirmation; no card data ever enters the app.
- No store app (D-001, D-002) — the web app installs to the home screen as a browser app at most.
- No player accounts (D-010) and no offline mode (S3.q8 — online-only is acceptable).
- No WhatsApp automation or notifications in v1 (S3.q6 — WhatsApp stays outside the app; chasing unpaid DP is manual, R-3).
- No own domain in v1 (D-007 — free subdomain first).
- No discovery/marketplace features (S5: the product wins on operations, not lead flow).

## Success metrics

From the owner's success picture (S1.q3) and the milestone criteria:

- A full week with zero double-booked slots — "kalau seminggu penuh tanpa bentrok, itu berhasil" (the bar; verified by M0 criteria 4–5 and the M3 re-run).
- Saturday nights without the notebook or chat search: tomorrow's schedule visible on one screen, DP auto-recorded (F-03, F-04).
- The daily report's numbers equal a direct database count — one source of truth, never a parallel estimate (M3 criterion 2).
- The owner's maintenance stays within ~1 hour/week (S2.q8, D-009), and the monthly bill stays at Rp 0 (D-005, D-019).
