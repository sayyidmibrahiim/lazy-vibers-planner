# Glossary

Konteks tunggal: pipeline LVP — mengubah ide mentah menjadi blueprint lengkap yang bisa dikerjakan agent harness manapun, lalu menjadi produk jadi.

## Language

**LVP**:
Lazy Vibe Planner. Nama proyek/pipeline ini. Semua skill memakai prefix `lvp-`.
_Avoid_: lazy-vibers, LVP tools, planner

**Section**:
Tahap interview/pipeline yang berurutan dan bernomor (S0 intake, S1 context awal, S2 kondisi, S3 data & privasi, S4 fitur, S5 deep research, S6 feasibility loop, S7 scope lock, S8 milestone plan, S9 doc generation, S10 build). Satu Section punya satu tujuan keputusan.
_Avoid_: step, fase, tahapan (pakai "Section" + nomor)

**Section Record**:
File `.lvp/docs/sections/SN-*.md` hasil satu Section — checkpoint materi mentah yang nanti dikompilasi S9 menjadi dokumen bundle final.
_Avoid_: notes, draft, log

**Conductor**:
Model orkestrasi `/lvp-init-new-idea`: skill eksternal di-load saat Section yang membutuhkannya mulai, ditutup saat selesai. Skill tidak pernah menumpuk di konteks.
_Avoid_: router, orchestrator, loader

**Checkpoint**:
Penulisan state ke disk pada batas peristiwa (jawaban tercatat, Section selesai, research selesai). Jaminan: sesi apapun yang mati bisa dilanjutkan tanpa kehilangan keputusan.
_Avoid_: save, autosave

**State**:
Snapshot kondisi pipeline pada satu titik waktu, tersimpan sebagai `.lvp/state.json`. Satu-satunya sumber kebenaran; CLI dan UI adalah pembaca/penulisnya.
_Avoid_: database (sebagai istilah untuk state), session

**Journal**:
Log kejadian append-only `.lvp/journal.ndjson`. Tidak pernah ditimpa; State bisa direkonstruksi darinya.
_Avoid_: history, log (sendirian)

**Blueprint Bundle**:
Folder output akhir pipeline yang siap dikerjakan harness manapun: AGENTS.md, dokumen spek, DECISIONS.md, milestones + acceptance criteria, verification.md, assumptions.md, HANDOVER.md, RINGKASAN.md, blueprint.json, rekomendasi skill/plugin/MCP.
_Avoid_: blueprint (sendirian), docs, output

**Builder Kit**:
Subset Blueprint Bundle yang ditujukan untuk agent builder: AGENTS.md, DECISIONS.md, milestones, verification.md, assumptions.md, salinan lvp-principles.md.
_Avoid_: builder docs, scaffold

**Feasibility Loop**:
Mekanisme S6: hasil deep research yang menemukan konflik/risiko membuka kembali sesi klarifikasi ke user sebelum scope lock. Pipeline tidak garis lurus.
_Avoid_: backtracking, retry

**Parking Lot**:
Daftar fitur yang sengaja TIDAK masuk MVP dan ditunda setelah rilis, tercatat eksplisit di State dan bundle.
_Avoid_: backlog, wishlist, later

**Milestone**:
Satuan pekerjaan build bernomor (M0, M1, ...) dengan acceptance criteria dan cara verifikasi yang bisa dijalankan agent. Satu milestone = satu unit yang bisa dibuktikan selesai.
_Avoid_: task (untuk satuan besar), phase

**Acceptance Criteria**:
Daftar kondisi terukur yang harus benar agar Milestone dinyatakan selesai, beserta perintah/prosedur verifikasinya.
_Avoid_: definition of done, checklist (sendirian)

**Constitution**:
File `lvp-principles.md`: prinsip wajib yang di-load semua skill LVP (evidence-first, anti-yes-man, recheck sebelum setuju, no-slop, boleh bilang tidak tahu).
_Avoid_: rules, policy, system prompt

**Capability Registry**:
Katalog skill/plugin/MCP eksternal yang sudah diverifikasi (kualitas, lisensi, aktivitas), sumber rekomendasi per-stack dan per-Section. Contoh isi: docs/research/agent-skill-catalog.md.
_Avoid_: skill list, marketplace

**Booster**:
Skill eksternal terverifikasi yang menjadi dependensi LVP, dua tier: **core** (wajib — menjamin kualitas output) dan **enhancer** (menambah kualitas). Di-install otomatis di awal sesi bila belum ada; kalau terhalang (harness melarang install, offline, API key tidak ada), pipeline menawarkan pilihan ke user: dibantu install penuh, lanjut dengan output ditandai terbatas, atau berhenti. Konten skill berlisensi NC dipakai sebagai dependensi runtime, tidak pernah di-vendor ke repo LVP.
_Avoid_: plugin, add-on, optional skill

**Designer-filled**:
Status keputusan yang diambil proaktif oleh Conductor karena penting tetapi tidak mungkin diketahui user untuk ditanyakan. Selalu terlihat (state + ASSUMPTIONS.md) dan selalu bisa dikoreksi user — tidak pernah senyap.
_Avoid_: silent default, auto-assume, best practice (sebagai alasan)

**Handoff**:
Proses dan skill (`/lvp-handoff`): memverifikasi Blueprint Bundle bebas gap, memastikan kompatibilitas lintas harness, dan menyusun entry prompt untuk builder.
_Avoid_: deliver, export

**Folder Gate**:
Pemeriksaan wajib di awal `/lvp-init-new-idea`: folder kosong → lanjut di tempat; folder berisi project lain → buat subfolder baru bernama slug ide; folder project existing → tolak init dan rekomendasikan skill yang tepat.
_Avoid_: safety check, preflight

**User Language**:
Bahasa yang user pakai saat berinteraksi. Sumber kebenaran semua artefak adalah English; AI menerjemahkan output ke User Language secara dinamis saat runtime, bukan lewat file terjemahan yang disimpan.
_Avoid_: locale, setting bahasa, RINGKASAN.md (istilah lama)

**Overview**:
Dokumen dalam bundle (`OVERVIEW.md`, English) untuk pemilik produk: apa yang diputuskan, biaya, dan cara memakai produknya. Ditampilkan UI dalam User Language.
_Avoid_: RINGKASAN.md (istilah lama), readme user
