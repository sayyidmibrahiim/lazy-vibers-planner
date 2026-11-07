# Assumptions

Every decision whose status is not `user_confirmed` — here, 13 `designer_filled` decisions (filled proactively by the planner because a non-technical owner could not have known to ask; each was shown for correction during its Section). `user_confirmed` decisions never appear here. Mirrors `decisions[]` in `.lvp/state.json` and the rows in `DECISIONS.md`.

## D-002 — v1 ships as an installable browser app (home-screen icon, no store) instead of a store app (designer_filled)
- **Why:** never surfaced — a non-technical user cannot know a website can install like an app; recorded proactively to avoid store accounts and the USD 99/yr Apple fee.
- **How to replace or confirm:** ask "Do you want players to install this from the Play Store/App Store instead of opening a link?" If yes, add store builds as a new decision (costs: Apple USD 99/yr, Google USD 25, one-time).

## D-003 — Two role views: player view (mobile) and admin/owner view (desktop) from the same web app (designer_filled)
- **Why:** never surfaced — non-technical users do not think in roles; derived from S1.q4's player-books-vs-admin-manages answer.
- **How to confirm:** the user already lives this split daily (phone vs laptop); confirm by asking "Is it right that the app looks different for you (laptop) and for players (phone)?" No build change unless corrected.

## D-004 — Concurrency: two players grabbing the same slot must not both succeed — first confirmed booking wins (designer_filled)
- **Why:** never surfaced — concurrency is invisible to non-technical users; the scale (80–150 players, 20–30 bookings/week) makes it real.
- **How to confirm:** already the owner's loudest requirement in other words — "nggak dobol" (S3.q8) and the M0 double-booking check emphasis (S8.q1). Confirm by demonstrating M0 criterion 4 to the owner; any change would require a new decision.

## D-007 — Free provider subdomain first (futsal-court-booking.vercel.app); own .com deferred until the business runs (designer_filled)
- **Why:** surfaced as a trade-off with the verified price; the user chose free after hearing it (S2.q4) — recorded designer_filled per the S2 decision surface.
- **How to replace or confirm:** when revenue starts, ask "Do you want your own address (.com, USD 12.08 first year / USD 19.98 renewal, verified 2026-11-07)?" — then buy, point it at Vercel, and update the base URL in `SPEC/api.md`.

## D-008 — Backup duty: provider-managed backups plus a simple scheduled export must be part of the stack choice (designer_filled)
- **Why:** never surfaced — a non-technical owner cannot know backups are a recurring job; the owner has max ~1 hr/week.
- **How to confirm:** verify the weekly export routine in `HANDOVER.md` actually runs for two consecutive weeks; if it is too heavy, ask the owner to choose between a lighter cadence and accepted risk.

## D-009 — Maintenance reality: max ~1 hour/week from the owner; rented hosting goes dark when payment stops; updates must be automatic (designer_filled)
- **Why:** never surfaced — the who-updates-this reality is invisible to non-technical owners; derived from S2.q8.
- **How to confirm:** stated to the owner in `OVERVIEW.md` (free tier, automatic updates); confirm by asking "Is the weekly ~10-minute check acceptable?" — the plan budgets ~1 hr/week max (S2.q8).

## D-012 — Password-reset by email for the admin account — requires an email-sending service (designer_filled)
- **Why:** never surfaced — nobody asks what happens after "forgot password"; surfaced with the login confirmation, user accepted.
- **How to confirm:** M1 criterion 4 tests it for real (reset email arrives at bookingfutsal.id@gmail.com). To replace: recover via Supabase dashboard instead and drop the email service.

## D-013 — Technical traces (IP addresses, error logs, device signals) count as personal data and join the PII inventory (designer_filled)
- **Why:** never surfaced — the user listed human-facing facts only (S3.q2); surfaced proactively, user accepted ("oke, setuju").
- **How to confirm:** check `SECURITY.md`'s PII table with the owner once at handover; if they want traces excluded, drop them from the policy page and log retention.

## D-014 — A plain-language privacy policy page exists at launch (designer_filled)
- **Why:** never surfaced — mandatory once a login + personal data exist; never a question a user would think to ask; user accepted.
- **How to confirm:** at handover, read the policy page (in casual Bahasa Indonesia) with the owner; it must match `SECURITY.md`'s inventory exactly.

## D-015 — A working "delete my data" path exists at launch: a player (or the admin) can erase a person completely (designer_filled)
- **Why:** never surfaced — erasure is a duty, not a feature request; the user supplied the behavior ("dihapus saja semuanya", S3.q10).
- **How to confirm:** test at handover: delete a test person and verify name, phone, bookings, and proof photo are all gone; nothing retained.

## D-017 — Empty-state behavior: admin seeds first courts/hours/prices via F-03; early player sees "Belum ada jadwal — hubungi admin" (designer_filled)
- **Why:** never surfaced — nobody asks what person #1 sees on an empty screen (the bank question was cut by "cukup"); recorded proactively, user accepted.
- **How to confirm:** M1 criterion 3 shows the exact screen; confirm the wording with the owner when M1 is demonstrated.

## D-018 — Paid fallback recorded next to the recommendation: Supabase Pro ~USD 25/month unverified; Vercel Pro USD 20/month (verified) — revisit-when-revenue triggers (designer_filled)
- **Why:** never surfaced — a non-technical user cannot know free tiers have cliffs (inactivity pause, non-commercial terms, storage caps).
- **How to replace or confirm:** when revenue starts or a cliff bites, re-verify both prices live and decide which tier to buy; until then they are triggers, not costs.

## D-021 — Milestone order/grouping: M0 deploy + F-01, M1 F-03 before M2 F-02, M3 F-04 + re-verification (designer_filled)
- **Why:** never surfaced — a non-technical owner cannot sequence builds; the full plan was shown at the S8 review and passed without corrections (S8.q1).
- **How to confirm:** the review already happened (S8.q1: "Sip, urutannya masuk"); any re-ordering now is a new decision, and the only hard dependency is M1 before M2 (confirm queue needs login + prices).
