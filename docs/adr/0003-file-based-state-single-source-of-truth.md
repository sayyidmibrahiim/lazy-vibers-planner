# File-based state sebagai sumber kebenaran tunggal

Pipeline LVP menyimpan seluruh state sesi sebagai file di folder project user — `.lvp/state.json` (snapshot), `.lvp/journal.ndjson` (log append-only), `.lvp/docs/sections/` (section record per Section) — bukan di database. Skill CLI dan web UI membaca/menulis file yang sama, sehingga "sinkronisasi" bersifat struktural, bukan replikasi; checkpoint dan resume lintas sesi/harness menjadi properti gratis dari format ini. Web app yang sudah ada (SQLite) berubah peran menjadi client; SQLite hanya cache/index bila diperlukan.

## Considered options

- SQLite sebagai sumber kebenaran: harness lain tidak bisa membaca state tanpa web app; menyalahi syarat portabilitas — ditolak.
- State hanya di memori sesi chat: mati saat token habis — ditolak (syarat checkpoint pemilik).
