# Handoff: Grilling G1/G3 — ticket 16 (lazy-vibers-planner)

Peranmu sesi ini: **griller**, bukan executor. Keputusan produk = milik owner; tugasmu memaksa dia memilih dengan sadar, bukan mengiyakan.

## Konteks cepat

- Repo: `/home/ibrahim/projects/lazy-vibers-planner` — `master @ 646f0e7`, semua ter-push, tree bersih.
- Ticket 06 (`/lvp-continue`): done, E2E verified. Ticket 16: **9/11 done**, sisa G1 + G3 (status `ready-for-human`).
- Owner: non-teknis, single-user, local-only, bahasa Indonesia santai (gw/lu). Konstitusinya: minta dikoreksi, klaim harus terverifikasi, keputusan produk lewat grilling, pola `designer_filled` — isi detail yang belum dia sebut, tapi secara terlihat dan bisa dikoreksi. Delegasi eksekusi wajib full ecc (fixer → verifier → judge `ecc:agent-evaluator`).
- **Sebelum mulai grilling: TANYA DULU hasil test personal owner** — resep: `cp -r .scratch/lvp-core/dogfood/run /tmp/test-lvp && cd /tmp/test-lvp` lalu jalankan `/lvp-continue` di harness; plus `/lvp-init-new-idea` di folder kosong (menuntaskan catatan manual-test ticket 08). Pengalaman rebuild-nya (prosa jadi parafrasa, ~4 teks jawaban di-re-ask) adalah input utama keputusan G1.

## Baca dulu (urutan ini)

1. `.scratch/lvp-core/issues/16-skill-lvp-continue-minor-gaps.md` — definisi G1/G3 + 5 residual
2. `skills/lvp-continue/SKILL.md` — Step 2b (tabel rebuild: baris `answer_recorded`, booster, handoff), Step 3 (tier block + warning)
3. `skills/lvp-conventions.md` — §2 state schema, §3 event list, §9 checkpoint/rebuild
4. `docs/spec/01-state.md` — status enum, handoff shape
5. Bukti lossy rebuild: `.scratch/lvp-core/verify-06-continue/e2e-2-report.md` (12 kelas divergensi, 63 field), `report-corrupt-rebuild.md` (47 field, deterministik; healthy 34.761 B vs rebuilt 33.508 B), `ERRATA.md`

## Keputusan yang digrill

**G1** — payload `answer_recorded` sekarang hanya `{"section","answer_id","skipped"}` (~55 B/event × 50 event; journal total 17.4 KB). Teks q/a hidup hanya di `state.json` + section record. Tabel rebuild bilang "from the payload" — bohong sehat. Opsi:

- **A: journal teks q/a** (perluas payload `answer_recorded`) → rebuild verbatim, tidak ada parafrasa/re-ask; estimasi journal naik ~2–3× (17.4 KB → ~35–45 KB), schema change di spec + conventions + snapshot sync
- **B: reword tabel rebuild** → sumber = section record (+ S0 record untuk metadata), terima lossy + re-ask yang jujur ("loud degradation"); mekanis, tanpa schema change
- **C: hybrid** — journal teks hanya untuk record yang bisa berubah pasca-checkpoint (kasus nyata terdokumentasi: S1.q9 dimutasi inline oleh loop-back L-01; S9 rename tanpa event)

**G3** — `decisions[]` tidak ada di journal; rebuild menambang mirror `DECISIONS.md` yang belum dinamakan skill. Opsi: name-the-mirror (mekanis) vs journal decision payloads (schema change). **Putuskan SEKALIAN dengan G1** — satu baris tabel rebuild yang sama, satu keputusan mencakup keduanya.

## Pertanyaan grilling inti (jangan lompati)

1. Siapa yang benar-benar butuh kata-kata VERBATIM pasca korupsi state? (owner non-teknis — apakah "makna sama" sudah cukup?)
2. Seberapa realistis korupsi `state.json`? (local-only, single-user, WAL mode) — frekuensi fitur dipakai vs biaya kompleksitasnya?
3. Journal = event log murni, atau boleh jadi backup data? Prinsip pipeline mana yang menang?
4. Kasus S1.q9: record dimutasi inline saat loop-back — kalau rebuild ambil dari record SEKARANG, jawaban asli pra-loop-back hilang. Diterima?
5. S9 rename tanpa event journal: rebuild dari S0 record = nama lama yang balik. Diterima? (terkait `created_at` source, residual #5)
6. Kalau pilih journaling: perluas payload `answer_recorded`, atau event baru? (konsekuensi ke §3 event list + semua parser)

## Aturan sesi

- Tantang setiap jawaban owner dengan angka dari bukti. Kalau dia menjawab "yang enak aja", paksa pilih satu opsi utuh dengan tradeoff-nya diucapkan balik.
- Rekam keputusan akhir sebagai **user_confirmed** (bukan assumed/designer_filled) langsung di ticket 16 + rationale singkat.
- Setelah keputusan, delegasikan implementasi (wajib, full ecc): fixer → verifier black-box (fixture `.scratch/lvp-core/dogfood/run`, resep di `verify-06-continue/`, perhatikan ERRATA) → judge `ecc:agent-evaluator`. Sync `references/` snapshot per AGENTS.md; `npm run lint`; commit + push; **cp manual SKILL.md ke `~/.zcode/skills/lvp-continue/` DAN `~/.agents/skills/lvp-continue/` — wajib setiap fix**.
- Update ticket 16: centang G1/G3, status → done, residu yang tersisa pindah ke catatan atau ticket baru.
- **Definition of done**: ticket 16 done 11/11, ter-push, installed copies sinkron, owner tinggal re-test kalau mau.
