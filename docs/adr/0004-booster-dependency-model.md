# Booster: skill eksternal sebagai dependensi essential, bukan pelengkap opsional

Kualitas output LVP digaransi oleh Booster — skill eksternal terverifikasi yang diperlakukan sebagai dependensi. Dua tier: **core** (wajib) dan **enhancer** (menambah kualitas). LVP melakukan bootstrap check di awal sesi dan meng-install yang belum ada; kegagalan install (harness melarang, offline, API key tidak ada) tidak pernah diputuskan diam-diam: pipeline menawarkan user pilihan — dibantu install penuh, lanjut dengan output ditandai terbatas, atau berhenti. Konten NC hanya boleh masuk sebagai dependensi runtime, bukan di-vendor (lihat ADR-0001).

Boosters core awal: pm-skills interview patterns (Apache 2.0), OpenSpec pattern, humanizer, SimpleEnglish (document-rule subset), karpathy-guidelines, ponytail, competitor-analysis (browserbase) / Firecrawl MCP, Playwright MCP, agents.md spec.

## Considered options

- Standalone-first (LVP jalan tanpa skill eksternal, booster opsional): ditolak pemilik — kualitas dan kenyamanan baca user adalah janji produk.
- Hard stop untuk semua kegagalan: offline membuat user macet total — ditolak; diganti pilihan eksplisit ke user.
