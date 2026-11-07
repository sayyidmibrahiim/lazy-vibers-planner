# Code style

Conventions for the chosen stack (Next.js + TypeScript on Vercel, Supabase backend — D-019), with karpathy-guidelines and ponytail distilled for this product: build the minimal sufficient solution; every abstraction must earn its place by removing real duplication or enabling a real F-NN behavior.

## Language and framework conventions

- **TypeScript, strict mode.** No `any`; types flow from the entities in `SPEC/data-model.md` (one `types.ts` mirrors the four tables).
- **Next.js App Router.** Route handlers under `app/api/` own all data access; UI components never call Supabase directly — they call the API in `SPEC/api.md`.
- **Server-side money math.** `dp_amount` (30%) and `total_amount` are computed in route handlers from `slots_config.hourly_price`, never on the client and never accepted from client payloads (M2).
- **Naming.** Tables and columns snake_case as in the data model; TypeScript fields camelCase; feature names, entity names, and status labels use exactly the strings in this bundle (`menunggu_dp`, `menunggu_konfirmasi`, `diterima`, `ditolak`).
- **UI strings** live in one constants file; they are casual Bahasa Indonesia (S1.q7 — e.g. "Booking", "Kirim Bukti Transfer", "DP Diterima", "Belum ada jadwal — hubungi admin"). Code comments and this documentation are English.
- **File layout** follows `SPEC/architecture.md` — one route file per endpoint, `lib/supabase.ts` the only place that builds Supabase clients.
- **The D-004 rule is code law:** create bookings with a plain INSERT against the UNIQUE `(court_id, booking_date, slot)` constraint and map the database error to HTTP 409. No pre-check ("select then insert"), no upsert, no `ignoreDuplicates` — those reintroduce double-booking.
- **RLS first.** Every table gets row-level security policies in the migration; the service-role key is used only inside route handlers, never in browser code.

## Error handling

- Every route handler returns the single envelope `{"error": "<message>"}` with a casual-Bahasa-Indonesia message (see `SPEC/api.md` → Error format); status codes follow that file's table (400 validation, 401 no admin session, 404 unknown id, 409 state conflict).
- Map, do not leak: a Postgres unique-violation becomes 409 with "Slot ... sudah dibooking..."; a Supabase/network failure becomes 502 with a plain "Coba lagi sebentar." — never a stack trace or an English error string in the UI.
- Validate at the boundary: one small `validate` helper per endpoint checks fields, slot alignment, opening hours, and blocked ranges before touching the database (400 on the first failure).
- The player-visible rule: an error message must tell the player what to do next ("Pilih jam lain ya."), never what module failed.
- Log server-side (route handler + request id); never log player phone numbers or proof URLs (PII, `SECURITY.md`).

## Testing expectations

- No formal test runner is required for v1; the verification procedures in `VERIFICATION.md` are the test suite — they are exact curl commands and scripted taps with expected outputs, run against the deployed URL.
- Every bug fix that touches the slot lock (D-004), the DP state machine, or money math must re-run the relevant milestone procedure from `VERIFICATION.md` verbatim and pass it.
- The global smoke test in `VERIFICATION.md` (booking → DP → report, one pass) runs before calling any build session done.
- Keep a `scripts/` folder for the curl sequences if repeating them by hand gets old; the scripts must match `VERIFICATION.md` command-for-command.

## Simplicity rules

- Minimal sufficient solution: no state management library, no component library, no ORM — Next.js server components + a few client components + `@supabase/supabase-js` cover all four features.
- No speculative abstraction: do not build for multiple venues, multiple admins, payment gateways, or notification systems — the scope lock (D-020) and the Parking Lot (`SCOPE.md`) own those futures; rebuild from the bundle when they are unparked.
- No feature beyond F-01…F-04 in the codebase. If a build session wants to "helpfully" add reminders or auth for players, it is violating the locked scope — stop it.
- Prefer one SQL query + one constraint over application logic; the database is the concurrency authority (D-004).
- Delete dead code immediately; this codebase is small enough that anything unused is noise the next builder will misread.
