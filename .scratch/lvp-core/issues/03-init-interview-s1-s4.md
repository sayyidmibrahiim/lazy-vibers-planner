# 03: Init — interview engine S1–S4

**What to build:** The interview engine: micro-batch adaptive questioning (1–3 per turn, plain language, outcome-oriented, in the user's language, each with a one-line "why this matters"), skip/cukup controls, and Sections S1 (context), S2 (kondisi/resources), S3 (data & privacy), S4 (features) with their internal question banks — per `docs/spec/02-sections.md`. Decisions recorded with status (`user_confirmed` | `assumed` | `designer_filled`); features captured as F-01… with step-by-step happy paths.

**Blocked by:** 02 (gate + bootstrap + S0 must exist to interview).

**Status:** done (2026-11-08) — author self-verification + literal black-box simulation PASS 7/7 checks (69-line journal seq-continuous, 47 answer_recorded, 21 decisions incl. 11 designer_filled + 1 assumed, blocked-section enforcement held, cukup-protocol fired without confirmation friction). S2 prices verified to primary sources same-day (Apple $99/yr, Play $25, Namecheap $15.98/yr, Vercel $0/$20, Hetzner €5.99/mo, DO $4/mo, Supabase free tier; Cloudflare figure flagged unverified). 6 procedure gaps found by the tester were fixed in a follow-up pass (section_blocked event + unblock path, enough-protocol remedy, final-batch conflict, evidence-id conflict, skip-vs-later, placeholder scope).

- [x] A real interview completes S1→S4 producing all four section records
- [x] Every answer journals `answer_recorded` (checkpoint granularity) and is never re-asked
- [x] At least one `assumed` and one `designer_filled` decision occur in a test run and are distinguishable in state
- [x] S2 cost fact-sheets carry source + access date; unverifiable numbers flagged
- [x] Section exit criteria enforced (no jumping ahead of S4's explicit "enough")
- [x] S4 captures click-by-click happy paths per feature (the USER_FLOWS raw material)
- [x] Micro-batch size adapts to the declared model tier per docs/spec/06-model-tiers.md
