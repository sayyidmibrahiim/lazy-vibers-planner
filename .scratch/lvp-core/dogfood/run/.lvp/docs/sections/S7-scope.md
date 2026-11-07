# S7 — Scope lock

## In-MVP
- **F-01** Booking slot jadwal real-time — pemain pilih lapangan → tanggal → slot hijau → isi nama + HP → booking; slot terkunci untuk orang lain (D-004).
- **F-02** DP 30% + konfirmasi admin — total + DP tampil, transfer manual ke rekening tertera, upload bukti, admin konfirmasi dari daftar "Menunggu Konfirmasi" (v1 method locked: D-011/L-01/S4.q14 — tanpa pembayaran online).
- **F-03** Kelola lapangan & jadwal (admin) — login, atur jam buka + harga per jam, blokir jam tertentu; perubahan langsung tampil di sisi pemain.
- **F-04** Laporan harian (admin) — satu layar: jumlah booking, slot terpakai/kosong, DP masuk, daftar belum-bayar-DP lengkap dengan nomor HP; bisa dicetak.

## Parking Lot (recorded, never deleted)
- **Gateway pembayaran otomatis (QRIS/virtual account)** — parked because: D-011 defers it until volume grows ("nanti kalau ramai baru gateway otomatis", reconfirmed aloud at S4.q14); it never was an F-NN — it was the rejected v1 method; unparking brings per-transaction MDR fees (unverified ~2-3%) that the D-005 ceiling does not budget, plus a third-party dependency and document requirements at onboarding (S5 regional availability, unverified). Revisit trigger: booking volume the owner calls "ramai", or the owner asks aloud.
- *(No "named but not captured" items exist — the S4 enough-protocol scan found none.)*

## Size check
4 features in-MVP — below the ~8 warning threshold, so the size warning did not fire. The check ran and its result is recorded here. (F-04 was promoted from `should` to in-MVP aloud by the user during the walk, overriding the default parking proposal: "datanya kan sudah ada semua, tinggal ditampilkan".)

## Lock
- Confirmed: S7.q2 · decision D-020 · journaled `scope_locked` 2026-11-07T08:44:23Z · status → review
- Frozen from here: changes go through /lvp-add-feature post-v1.

## Answers
- **S7.q1 Daftar final versi pertama: F-01, F-02, F-03, F-04 masuk; Parked: gateway pembayaran otomatis (nanti kalau ramai, D-011). Ini dia versi pertamanya? Begitu Anda bilang ya, daftar ini beku.** — Skip dulu deh. · _EN: Skip attempt on the confirmation — recorded, never blocks; a skip is not a lock, so the protocol re-asked once, plainly._
- **S7.q2 Skip bukan kunci — saya tanya sekali lagi: apakah F-01, F-02, F-03, F-04 inilah versi pertama, dan sisanya parkir?** — Ya, ini dia versi pertamanya. Kunci. · _EN: Explicit confirmation of the whole list — the lock moment (D-020, `scope_locked`)._

## Decisions this Section
- **D-020** Scope lock: F-01..F-04 in-MVP; Parking Lot holds the automatic payment gateway (per D-011, revisit trigger recorded); nothing deleted — Explicit confirmation after a skip attempt was re-asked (S7.q2); F-04's promotion from `should` was spoken aloud during the walk · status: user_confirmed

## Exit criteria
- [x] Every F-NN from S4 marked `in-MVP` or Parking Lot — none missing, none deleted. — evidence: In-MVP list F-01..F-04; Parking Lot (gateway; no never-captured items exist)
- [x] Each parked item carries a one-line reason. — evidence: gateway row (D-011 deferral + MDR cost + dependency)
- [x] The user explicitly confirmed the final list; `scope_locked` is journaled. — evidence: S7.q2, D-020, journal seq 81
- [x] The MVP-size sanity check ran; when > ~8 features, the warning and the user's call are recorded. — evidence: Size check section (4 in-MVP — below threshold; check ran, warning not fired)
