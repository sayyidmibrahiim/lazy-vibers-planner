# Scope

Locked by decision **D-020** (user_confirmed, journal `scope_locked` 2026-11-07T08:44:23Z, confirmed aloud at S7.q2 after a skip attempt was re-asked once: "Ya, ini dia versi pertamanya. Kunci."). Frozen from here: changes go through /lvp-add-feature post-v1. Nothing added, nothing dropped — verbatim from the S7 record.

## In MVP

- **F-01** Real-time slot booking — the player picks court → date → a green (free) slot → enters name + phone → books; the slot locks for everyone else (D-004).
- **F-02** 30% down payment (DP) + admin confirmation — total + DP shown, manual transfer to the listed account, proof upload, admin confirms from the "Menunggu Konfirmasi" queue (v1 method locked: D-011/L-01/S4.q14 — no online payment).
- **F-03** Court & schedule management (admin) — login, set opening hours + hourly price, block specific hours; changes appear on the player side immediately.
- **F-04** Daily report (admin) — one screen: booking count, used/empty slots, DP received, the unpaid-DP list with phone numbers; printable.

Size check: 4 features in-MVP — below the ~8 warning threshold, so the size warning did not fire (recorded in the S7 record). F-04 was promoted from `should` to in-MVP aloud by the user during the walk, overriding the default parking proposal ("datanya kan sudah ada semua, tinggal ditampilkan").

## Parking Lot (recorded, never deleted)

- **Automatic payment gateway (QRIS / virtual account)** — parked because: D-011 defers it until volume grows ("nanti kalau ramai baru gateway otomatis", reconfirmed aloud at S4.q14); it never was an F-NN — it was the rejected v1 method; unparking brings per-transaction MDR fees (unverified ~2–3%) that the D-005 ceiling does not budget, plus a third-party dependency and document requirements at onboarding (S5 regional availability, unverified). Revisit trigger: booking volume the owner calls "ramai", or the owner asks aloud.

No "named but not captured" items exist — the S4 enough-protocol scan found none.
