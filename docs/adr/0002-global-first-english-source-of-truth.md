# Global-first: English source of truth, AI-mediated translation

Repo ini berawal sebagai MVP lokal berbahasa Indonesia (konvensi AGENTS.md: copy UI, prompt, dan error message Bahasa Indonesia). Pemilik memutuskan (F0 grilling, 2026-11-07) bahwa produk pipeline LVP ditujukan untuk user global/public repo, sehingga: semua artefak pipeline (template interview, dokumen bundle, skill files, prompt) ditulis dalam **English** sebagai sumber kebenaran tunggal, dan penerjemahan ke bahasa user dilakukan **dinamis oleh AI saat runtime** (User Language), bukan lewat file terjemahan statis. Konvensi Bahasa Indonesia pada web app MVP yang sudah jadi tetap berlaku sampai rework F3; pekerjaan pipeline baru mengikuti keputusan ini.

## Considered options

- Indonesian-first (semua dokumen Bahasa Indonesia): menutup pasar global — ditolak.
- Bilingual (dokumen English + ringkasan terjemahan tersimpan): dua sumber kebenaran yang pasti tak sinkron — ditolak.
- English source + terjemahan runtime (dipilih): satu sumber kebenaran; kualitas terjemahan ditanggung model, bukan file.
