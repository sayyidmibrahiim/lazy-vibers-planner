# Handover (owner guide)

Written for you, the owner — no code knowledge needed. Your whole maintenance job fits in the ~1 hour per week you budgeted (S2.q8), and most weeks it is about 10 minutes.

## How to run it

There is nothing to install and nothing to start. The app runs on the internet, all the time.

- Players use the link: `https://futsal-court-booking.vercel.app` (the free address, D-007). Share it in your WhatsApp groups as you always did.
- You use the same link on your laptop and log in with your username and password (only you have an account, D-010).
- If the page will not open: wait a minute and try again. If it stays down a whole day, the most likely cause is the weekly pause (see "How to back up") — the fix is in there.

## How to deploy and update

You never deploy anything and never type commands (D-006). Updates happen by themselves:

- The builder pushes code; the new version is live on the real address in minutes, with no downtime.
- Vercel and Supabase update their own systems automatically (D-009).
- Your only rhythm: once a week, open the app and click around for a minute (look at "Laporan"). That visit keeps the free database awake (the Supabase free tier pauses after 1 week with no visits — R-2) and doubles as your weekly check that everything works.
- If you ever stop wanting the app, do nothing: at Rp 0 per month there is no bill to cancel (D-005, D-019). Data stays for a while, then the free tier pauses it; ask the builder to delete everything properly if you want it gone.

## How to back up

Backups never happen by accident (D-008), so the plan gives you two layers:

1. **Automatic:** Supabase keeps its own backups of the database. You do nothing for this layer.
2. **Your weekly export (about 5 minutes):** once a week, download the data export (the builder shows you the button/page in the Supabase dashboard — no commands) and save the file somewhere safe (your laptop plus a Google Drive folder is enough). The same visit keeps the app awake, so one habit covers two duties.

What you are protecting: the bookings list with names, phone numbers, and DP status — the thing your notebook used to hold. If a week's export is ever missed, the automatic layer still has you covered.

## Where secrets and API keys live

- **Your project email is the key to everything:** bookingfutsal.id@gmail.com (S2.q9). It owns the Vercel account, the Supabase account, and the email-sender account. Keep its password safe and turn on two-step verification. All bills (none today — Rp 0), password resets, and warnings go there.
- **Your admin username + password** for the app itself: yours alone; the reset link arrives at bookingfutsal.id@gmail.com (D-012). If you suspect someone knows it, reset it from the login page.
- **Technical keys** (Supabase service key, email API key) live inside Vercel's settings, set once by the builder. You never touch them; they never appear in the app or in any file you keep.
- **Your bank account number** for DP transfers is set in the admin "Lapangan" settings (F-02). Change it there if the account ever changes.
- Never paste any key or password into WhatsApp, email, or a document. Nobody legitimate will ever ask for them.

## Who to ask what

- **The app's behavior, changes, new features, anything broken** → your builder (the person or agent who built from this bundle). This bundle is their complete briefing; point them at `AGENTS.md`.
- **Vercel (the app hosting) problems** → Vercel support/help pages; sign in with bookingfutsal.id@gmail.com. Billing questions should never exist (free tier); if a paid plan is ever proposed, that is a decision for you first (D-018) — pause and ask your builder.
- **Supabase (the database) problems** → Supabase support/help pages, same email account. If the project is paused, the weekly visit fixes it.
- **Password-reset emails not arriving** → check the inbox's spam folder first; then ask the builder to check the email service.
- **A player demands their data deleted** → you can erase a person from the admin side (name, phone, bookings, proof photo — everything, D-015). Do it the same day they ask.
- **Money disputes with a player** → the app shows the recorded DP status and proof photo; that record is the truth the app keeps (one source, F-04). The app's record is what you both agreed to.
