# Katalog Agent Skills Eksternal untuk Pipeline LVP

Tanggal riset: 2026-11-07.
Metode: pencarian web (WebSearch) + verifikasi langsung ke halaman/API GitHub setiap repo (jumlah bintang dan tanggal aktivitas terakhir diambil dari GitHub API pada tanggal riset — angka dibulatkan).
Konteks: pipeline LVP (idea → blueprint → build) untuk user non-teknis, dengan skills `/lvp-init-new-idea`, `/lvp-continue`, `/lvp-recheck-plan`, `/lvp-handoff`, `/lvp-add-feature`, opsional `/lvp-build`.

Sudah terpasang / sudah dikenal (TIDAK diteliti ulang, dikecualikan dari katalog): skills Matt Pocock (wayfinder, research, grilling, to-spec, to-tickets, triage, implement, implement-spec, tdd, domain-modeling, handoff, retro, teach), github/spec-kit, miqdadbadjuber/anti-slop, petergyang/no-ai-slop, Nutlope/hallmark.

---

## Ringkasan eksekutif

- Ekosistem "agent skills" (format SKILL.md ala Anthropic) sudah matang dan lintas-harness: hampir semua repo kandidat menyatakan dukungan untuk Claude Code + Codex + Gemini CLI + Cursor sekaligus, pas dengan kebutuhan portabilitas LVP.
- Untuk interview/discovery non-teknis, kualitas terbaik ada di [deanpeters/Product-Manager-Skills](https://github.com/deanpeters/Product-Manager-Skills) (77 skill PM, termasuk `discovery-interview-prep` gaya Mom Test) — tapi lisensinya CC BY-NC-SA 4.0 (non-komersial); alternatif Apache 2.0: [product-on-purpose/pm-skills](https://github.com/product-on-purpose/pm-skills).
- Untuk riset kompetitor + naming/branding, satu repo resmi [browserbase/skills](https://github.com/browserbase/skills) menutup dua kebutuhan: `competitor-analysis` (riset kompetitor otomatis → laporan HTML) dan `ui-test` (QA UI adversarial). Untuk branding: [arnabbagxd/Brand-building-skills](https://github.com/arnabbagxd/Brand-building-skills) (28 skill brand, muda tapi aktif).
- Untuk spec/PRD di luar spec-kit: [Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec) (74k★, SDD ringan lintas-tool, pola folder change `proposal.md/specs/design.md/tasks.md` sangat mirip kebutuhan bundle LVP) dan [bmad-code-org/BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) (55k★, metodologi lengkap agentic agile; berat — cocok jadi referensi pola, bukan di-embed).
- Untuk per-platform build, vendor-vendor besar sekarang punya repo skills resmi: [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) (React/Next/Vercel), skills resmi [shadcn-ui](https://ui.shadcn.com/docs/skills), [supabase/agent-skills](https://github.com/supabase/agent-skills), [expo/skills](https://github.com/expo/skills), [flutter/agent-plugins](https://github.com/flutter/agent-plugins), [software-mansion-labs/skills](https://github.com/software-mansion-labs/skills) + [callstackincubator/agent-skills](https://github.com/callstackincubator/agent-skills) (React Native). Ini paling aman direkomendasikan karena versi-nya mengikuti framework-nya.
- Anti-slop terkuat saat ini: [blader/humanizer](https://github.com/blader/humanizer) (66k★, 26 pola tulisan AI berbasis panduan "Signs of AI writing" Wikipedia) — cocok dilapis di atas anti-slop yang sudah dipasang.
- Untuk handoff/portabilitas, standar [agents.md](https://github.com/agentsmd/agents.md) (25k★) + pola adapter multi-harness di [wshobson/agents](https://github.com/wshobson/agents) (42k★) dan [affaan-m/ECC](https://github.com/affaan-m/ECC) (299k★) adalah referensi rajutan utama.
- Dua koleksi "payung" paling layak dijadikan sumber skill satuan: [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) (113k★, 25 skill lifecycle: interview → spec → plan → build → verify → ship) dan [obra/superpowers](https://github.com/obra/superpowers) (313k★, metodologi disiplin: brainstorming, writing-plans, TDD, verification-before-completion).
- Threads (bahasa Indonesia) nyaris tak punya konten katalog skills; yang ketemu hanya rekomendasi umum (addyosmani/agent-skills, frontend-design + webapp-testing, Superpowers). Detail di bagian bawah.

---

## (a) Interview / discovery untuk user non-teknis

| Repo | Apa yang dilakukan | Kualitas | Cara rajut ke LVP | Prioritas |
|---|---|---|---|---|
| [deanpeters/Product-Manager-Skills](https://github.com/deanpeters/Product-Manager-Skills) | 77 skill PM (3 tier): `discovery-interview-prep` (menyiapkan wawancara gaya Mom Test), `discovery-process` (frame→research→synthesize→validate), `opportunity-solution-tree`, `pol-probe` (validasi murah), `prd-development`, `user-story` (format Mike Cohn + Gherkin), `epic-breakdown-advisor`, `press-release` (Working Backwards), plus 14 skill market intelligence | 7.9k★; rilis rutin, terakhir v0.84 Agu 2026; push Okt 2026 | Jadikan bank pertanyaan & pola wawancara untuk section "kondisi/resource user" dan "fitur" di `/lvp-init-new-idea`; adaptasi `press-release` jadi template ringkasan idea | **Wajib** (dengan catatan lisensi CC BY-NC-SA 4.0 — boleh dipakai/adaptasi untuk proyek pribadi, jangan di-repack komersial) |
| [product-on-purpose/pm-skills](https://github.com/product-on-purpose/pm-skills) | 68 skill PM Triple Diamond: `interview-synthesis` (transkrip riset → insight), `competitive-analysis`, `market-sizing`, `journey-map`, `persona`, `lean-canvas`, `deliver-prd`, OKR, design sprint | 790★; sangat aktif — rilis v2.35.0 30 Okt 2026 | Sumber pola `interview-synthesis` untuk merangkum jawaban interview LVP menjadi keputusan; lisensi Apache 2.0 (aman dimodifikasi) | Bagus |
| [borghei/Claude-Skills](https://github.com/borghei/Claude-Skills) | 385 skill lintas tim; berisi `customer-interview-script` dengan disiplin Mom Test (konversi pertanyaan buruk→baik, bank pertanyaan per tipe) dan skill competitor/market | 1.1k★; push Okt 2026 | Ambil skill satuan (pola Mom Test) untuk memperkaya question bank `/lvp-init-new-idea` | Bagus |
| [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) — skill `interview-me` & `idea-refine` | Wawancara terstruktur + penyempurnaan idea sebelum spec | 113.7k★; push 1 Nov 2026 | Referensi struktur section "context awal"; cek overlap dengan grill-me (Matt) yang sudah terpasang sebelum rajut | Bagus |

Catatan: [ORBWEVA/founder-discovery](https://github.com/ORBWEVA/founder-discovery) (Mom Test + JTBD) ditemukan tapi hanya 1★ dan hampir tidak ada aktivitas → tidak direkomendasikan.

## (b) Riset kompetitor & naming/branding

| Repo | Apa yang dilakukan | Kualitas | Cara rajut ke LVP | Prioritas |
|---|---|---|---|---|
| [browserbase/skills](https://github.com/browserbase/skills) | Koleksi resmi Browserbase; `competitor-analysis` (auto-discover + deep-research kompetitor → laporan HTML), `company-research` (ICP), `search`/`fetch` (riset web tanpa browser), `ui-test`, dll. (18 skill) | 3.8k★; push 27 Okt 2026; 50 PR terbuka | Skill `competitor-analysis` jadi mesin riset kompetitor di section deep research `/lvp-init-new-idea` dan `/lvp-recheck-plan`; butuh API key Browserbase (ada mode fallback `search`/`fetch`) | **Wajib** |
| [arnabbagxd/Brand-building-skills](https://github.com/arnabbagxd/Brand-building-skills) | ~28 skill brand: `brand-naming` (generate nama + rasional strategis / evaluasi nama existing, auto-detect mode), `brand-identity`, `brand-voice`, `brand-positioning`, `brand-audit`, `competitor-branding`, `aso`, dll. | 843★; push 6 Nov 2026; repo muda (8 commit) | Sumber bank pertanyaan naming/branding untuk output bundle LVP (nama produk + tagline + cek ketersediaan domain/sosial bisa ditambah sendiri); MIT | Bagus |
| [anthropics/skills](https://github.com/anthropics/skills) — skill `brand-guidelines` | Skill resmi Anthropic untuk konsistensi brand guideline | 188k★; push 6 Nov 2026 | Referensi struktur output "brand guideline singkat" pada doc generation | Opsional |

## (c) Spec/PRD generation (di luar spec-kit)

| Repo | Apa yang dilakukan | Kualitas | Cara rajut ke LVP | Prioritas |
|---|---|---|---|---|
| [Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec) | CLI SDD lintas-tool: `/opsx:explore` (thinking partner tanpa taruhan), `/opsx:propose` (folder change: proposal.md + specs/ + design.md + tasks.md), `/opsx:apply`, `/opsx:archive`, `/opsx:verify`, `/opsx:continue` | 74.2k★; push 7 Nov 2026; sangat aktif | Pola folder-change OpenSpec hampir identik dengan bundle LVP per fitur — jadikan referensi struktur spec + mekanisme "continue" untuk `/lvp-continue` dan tambahan fitur di `/lvp-add-feature` | **Wajib** (pola, bukan embed CLI) |
| [bmad-code-org/BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) | Metodologi agentic agile: agen analyst/PM/UX/architect/test, workflow yang membuat keputusan eksplisit dan dipreservasi sebagai konteks; v6 stabil, v7 alpha (ETA pertengahan Nov 2026) | 55.1k★; push 7 Nov 2026 | Referensi desain untuk `/lvp-recheck-plan` (adversarial review ala agen test-architect BMAD) dan format DECISIONS.md ala "decisions explicit" | Bagus (kajian pola; terlalu berat untuk di-embed utuh) |
| [deanpeters/Product-Manager-Skills](https://github.com/deanpeters/Product-Manager-Skills) — `prd-development` | PRD terstruktur: problem → personas → solution → metrics → stories | 7.9k★; Agu 2026 | Template PRD alternatif untuk doc generation LVP (di samping to-spec Matt) | Bagus |
| [product-on-purpose/pm-skills](https://github.com/product-on-purpose/pm-skills) — `deliver-prd` | PRD lengkap: problem, metrics, stories, scope, dependencies | 790★; Okt 2026 | Sumber checklist kelengkapan PRD untuk completeness check `/lvp-handoff` | Opsional |
| [SpillwaveSolutions/sdd-skill](https://github.com/SpillwaveSolutions/sdd-skill) | Skill pembimbing Spec-Kit (greenfield/brownfield), feature-status tracking | 111★; **push terakhir 17 Nov 2025 (~12 bulan stagnan)** | — | Tidak direkomendasikan (stagnan; overlap spec-kit yang sudah dikenal) |

## (d) Task/milestone planning & breakdown (di luar Matt Pocock)

| Repo | Apa yang dilakukan | Kualitas | Cara rajut ke LVP | Prioritas |
|---|---|---|---|---|
| [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) — `planning-and-task-breakdown` | Prinsip dekomposisi tugas agar bisa diselesaikan agent secara andal (tugas kecil, urutan jelas) | 113.7k★; push 1 Nov 2026 | Rajut prinsipnya ke section milestone plan (M0..Mn) — batas ukuran milestone & acceptance criteria | **Wajib** |
| [eyaltoledano/claude-task-master](https://github.com/eyaltoledano/claude-task-master) | Sistem manajemen tugas AI: PRD → tasks → dependency → tracking; ada MCP server | 28.3k★; push terakhir 28 Apr 2026 (~6 bulan, masih dirilis tapi melambat) | Referensi pola milestone+dependency untuk blueprint.json LVP; MCP-nya opsional | Bagus |
| [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents) — `project-manager` | 161+ subagent per kategori; `project-manager` mencakup milestone planning, WBS, risk register | 26.4k★; push 2 Nov 2026 | Ambil format risk register + WBS untuk verification.md / milestones | Bagus |
| [obra/superpowers](https://github.com/obra/superpowers) — `writing-plans`, `executing-plans`, `brainstorming` | Metodologi menulis & mengeksekusi rencana untuk agent | 313.7k★; push 3 Nov 2026 | Overlap parsial dengan wayfinder/to-tickets (Matt) — pakai sebagai pembanding pola, jangan dipasang dobel | Opsional |

## (e) Writing quality / anti-slop (di luar yang sudah dikenal)

| Repo | Apa yang dilakukan | Kualitas | Cara rajut ke LVP | Prioritas |
|---|---|---|---|---|
| [blader/humanizer](https://github.com/blader/humanizer) | Skill anti-slop paling populer: 26 pola tulisan AI (berbasis panduan "Signs of AI writing" Wikipedia), rewrite tanpa mengubah isi; blind test 16/16 disukai juri; jelas bukan alat evading detector | 65.7k★; push 28 Okt 2026; CHANGELOG aktif | Tambahkan daftar 26 polanya ke constitution `lvp-principles.md` (no-slop) dan jalankan sebagai pass akhir doc generation (khusus dokumen berbahasa manusia; prompt output GFM tetap) | **Wajib** |
| [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) — `writing-guidelines` | 80+ aturan dokumen/prose dari handbook Vercel | 33.6k★; push 28 Okt 2026 | Referensi aturan kejelasan untuk spec docs (versi Inggris; terjemahkan poinnya saat rajut) | Opsional |
| [kimhons/humanize](https://github.com/kimhons/humanize) | Kerangka anti-slop multi-layer (rule file, hook, subagent reviewer, scorer CLI); 38 pola | 4★; 2 commit; sangat muda | Ide arsitektur (hook PostToolUse + scorer) menarik, tapi repo terlalu kecil untuk diandalkan | Tidak direkomendasikan (ambil idenya saja bila perlu) |

## (f) Build skills per-platform

| Repo | Apa yang dilakukan | Kualitas | Cara rajut ke LVP | Prioritas |
|---|---|---|---|---|
| [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | Koleksi resmi Vercel: `react-best-practices` (40+ pola performa React/Next), `web-design-guidelines` (100+ aturan UI/a11y), `composition-patterns`, `react-native-guidelines`, `vercel-optimize`, `deploy-to-vercel`, `writing-guidelines` | 33.6k★; push 28 Okt 2026 | Rekomendasi skill per-stack di blueprint.json ketika stack = Next/React/Vercel; skill web-design-guidelines juga berguna untuk acceptance criteria UI | **Wajib** |
| Skills resmi [shadcn-ui](https://ui.shadcn.com/docs/skills) (di repo [shadcn-ui/ui](https://github.com/shadcn-ui/ui), install `npx shadcn add --skill`) | Konteks project-aware untuk mencari/menyusun komponen shadcn/ui | (shadcn-ui/ui) 127.5k★; push 6 Nov 2026 | Rekomendasi skill saat stack memakai shadcn + Tailwind | **Wajib** (jika stack cocok) |
| [supabase/agent-skills](https://github.com/supabase/agent-skills) | Skill resmi Supabase untuk pengembangan dengan AI agents (auth, DB, RLS, dll.) | 3.0k★; push 5 Nov 2026 | Rekomendasi skill untuk stack Supabase (login/database di section data & privasi) | **Wajib** (jika stack cocok) |
| [expo/skills](https://github.com/expo/skills) | Skill resmi Expo: build, deploy, upgrade, debug aplikasi Expo + EAS | 4.1k★; push 6 Nov 2026 | Rekomendasi skill untuk platform mobile (jalan pintas store build) | Bagus |
| [flutter/agent-plugins](https://github.com/flutter/agent-plugins) (dulu `flutter/skills`) | Skill/plugin resmi tim Flutter untuk agent coding | 3.2k★; push 5 Nov 2026 | Rekomendasi skill untuk platform Flutter | Bagus |
| [software-mansion-labs/skills](https://github.com/software-mansion-labs/skills) | Pola produksi React Native (New Architecture) sebagai Claude Code plugin, oleh Software Mansion | 302★; push 4 Nov 2026 | Rekomendasi skill RN saat stack React Native | Bagus |
| [callstackincubator/agent-skills](https://github.com/callstackincubator/agent-skills) | Koleksi skill React Native agent-optimized oleh Callstack | 1.7k★; push 8 Okt 2026 | Alternatif/pelengkap Software Mansion untuk RN | Opsional |
| [Jeffallan/claude-skills](https://github.com/Jeffallan/claude-skills) | 67 skill full-stack (frontend, backend, API, dll.) dengan referensi per-domain | 12.3k★; push 30 Okt 2026 | Tambakan umum per-platform (backend/API) saat tidak ada skill vendor resmi | Bagus |
| [laguagu/claude-code-nextjs-skills](https://github.com/laguagu/claude-code-nextjs-skills) | Skill Next.js 16 + AI SDK 7 + pgvector + bun | 72★; push 2 Nov 2026 | Kecil tapi aktif; opsional untuk stack Next+AI | Opsional |
| [zaferayan/skills](https://github.com/zaferayan/skills) | Skill Expo RN produksi + IAP StoreKit 2 (expo-iap) | 114★; push 5 Nov 2026 | Rekomendasi khusus fitur pembayaran in-app mobile | Opsional |
| [zakariaf/Flutter-Skills](https://github.com/zakariaf/Flutter-Skills) | Skill Flutter lintas-harness: arsitektur, Riverpod 3.x, testing | 65★; push 23 Sep 2026 | Alternatif komunitas Flutter | Opsional |

Catatan desktop (Electron/Tauri): tidak ditemukan repo skill yang layak (aktif + teruji) saat riset ini — dari sisi LVP, rekomendasikan skill generik full-stack (Jeffallan) + dokumentasi framework untuk desktop.

## (g) Verification / testing / QA

| Repo | Apa yang dilakukan | Kualitas | Cara rajut ke LVP | Prioritas |
|---|---|---|---|---|
| [browserbase/skills](https://github.com/browserbase/skills) — `ui-test` | "AI-powered adversarial UI testing": analisis git diff lalu uji perubahan, atau eksplorasi app untuk cari bug; dukung localhost | 3.8k★; push 27 Okt 2026 | Mesin verifikasi untuk `/lvp-build` (milestone executor): jalankan ui-test per acceptance criteria UI | **Wajib** |
| [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) — `browser-testing-with-devtools`, `debugging-and-error-recovery` | Pengujian browser via DevTools protocol + loop debug | 113.7k★; push 1 Nov 2026 | Rajut ke verification.md (checklist verifikasi manual + otomatis per milestone) | **Wajib** |
| [anthropics/skills](https://github.com/anthropics/skills) — `webapp-testing` | Skill resmi: uji web app tanpa perlu login/creds, mulai dari server | 188k★; push 6 Nov 2026 | Referensi prosedur smoke-test untuk verification.md | Bagus |
| [affaan-m/ECC](https://github.com/affaan-m/ECC) | 314 skill + 71 agent + 98 command lintas harness; skill `e2e-testing`, `tdd-workflow`, `verification-loop`, `security-review`; release mingguan (2.2.3, 1 Okt 2026) | 298.6k★; push 6 Nov 2026 | Sumber skill satuan; format adapter multi-harness-nya juga referensi untuk `/lvp-handoff` | Bagus (pilih skill satuan; jangan pasang seluruh paket) |
| [obra/superpowers](https://github.com/obra/superpowers) — `verification-before-completion`, `systematic-debugging` | Disiplin verifikasi sebelum klaim selesai | 313.7k★; push 3 Nov 2026 | Masukkan prinsip "verification-before-completion" ke `lvp-principles.md` (evidence-first) | **Wajib** (prinsip, bukan plugin penuh) |
| [microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp) | MCP resmi Playwright untuk otomasi browser | 39.3k★; push 6 Nov 2026 | MCP default verifikasi web di `/lvp-build` | **Wajib** (MCP) |
| [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) | MCP resmi Chrome DevTools untuk coding agent | 54.9k★; push 6 Nov 2026 | Alternatif/pelengkap Playwright untuk debug visual | Bagus (MCP) |

## (h) Deploy / DevOps

| Repo | Apa yang dilakukan | Kualitas | Cara rajut ke LVP | Prioritas |
|---|---|---|---|---|
| [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) — `deploy-to-vercel`, `vercel-optimize` | Deploy via git push/CLI/temp deploy; audit biaya+performa+caching | 33.6k★; push 28 Okt 2026 | Rekomendasi deploy skill di blueprint.json untuk stack Vercel; acceptance criteria deploy di milestone akhir | **Wajib** (jika stack Vercel) |
| [BretFisher/skills](https://github.com/BretFisher/skills) | Skill DevOps handcrafted (Bret Fisher): buat/audit GitHub Actions dengan default security (`/gha-audit`) | 21★; push 6 Nov 2026; kecil tapi dirawat aktif oleh praktisi dikenal | Sumber checklist CI/CD + keamanan untuk verification.md; rekomendasikan `/gha-audit` saat stack butuh CI | Bagus |
| [ruvnet/claude-flow (kini ruflo)](https://github.com/ruvnet/ruflo) | Framework harness multi-agent besar; berisi skill CI/CD di dalamnya | 81.1k★; push 6 Nov 2026 | Terlalu besar/overkill; hanya jadi inspirasi | Tidak direkomendasikan (overkill untuk LVP) |
| [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) — `ci-cd-and-automation`, `shipping-and-launch` | Skill fase ship: CI/CD + rilis | 113.7k★; push 1 Nov 2026 | Referensi checklist rilis untuk milestone terakhir | Opsional |

## (i) Handoff & portabilitas lintas harness

| Repo | Apa yang dilakukan | Kualitas | Cara rajut ke LVP | Prioritas |
|---|---|---|---|---|
| [agentsmd/agents.md](https://github.com/agentsmd/agents.md) (ex `openai/agents.md`) | Spesifikasi AGENTS.md ("README untuk agent"), dipakai 60 ribu+ proyek; satu file untuk Codex, Cursor, Gemini CLI, Copilot, Devin | 25.4k★; push 10 Sep 2026 | Bundle LVP wajib menghasilkan AGENTS.md sesuai spec ini — jadikan acuan format kanonik HANDOVER.md + AGENTS.md | **Wajib** |
| [wshobson/agents](https://github.com/wshobson/agents) | Plugins/agents/skills/commands untuk Claude Code, Codex CLI, Cursor, OpenCode, Antigravity CLI, Copilot — dengan pola adapter: sumber tunggal → format per-tool | 42.3k★; push 5 Nov 2026 | Pola adapter untuk `/lvp-handoff`: satu blueprint → entry prompt + konfigurasi per-harness | **Wajib** (pola adapter) |
| [vercel-labs/skills](https://github.com/vercel-labs/skills) (`npx skills`) | Installer/registry skill lintas-harness ("npm untuk agent skills") + skill `find-skills` | 38.4k★; push 6 Nov 2026 | Mekanisme rekomendasi "skill/plugin/MCP" di blueprint.json: sebutkan `npx skills add <repo>` agar bisa dipasang di harness manapun | Bagus |
| [affaan-m/ECC](https://github.com/affaan-m/ECC) | Dukungan multi-harness: Claude Code/Codex/Qoder native, adapter beta untuk Cursor/OpenCode/Copilot CLI | 298.6k★; push 6 Nov 2026 | Referensi daftar harness target + cara adaptasi per-harness untuk `/lvp-handoff` | Bagus |
| [obra/superpowers](https://github.com/obra/superpowers) | Framework skill yang eksplisit menjalankan di banyak harness (Codex, Cursor, Gemini CLI, dll.) | 313.7k★; push 3 Nov 2026 | Bukti pola "skills portabel lintas harness"; referensi konfigurasi multi-harness | Opsional |

---

## MCP servers yang layak direkomendasikan (sekunder)

Semua diverifikasi di GitHub, 2026-11-07:

| MCP | Repo | Kegunaan untuk LVP |
|---|---|---|
| Context7 | [upstash/context7](https://github.com/upstash/context7) (64.3k★, push 6 Nov 2026) | Dokumentasi library terkini saat agent build — mengurangi halusinasi API |
| Playwright MCP | [microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp) (39.3k★) | Verifikasi UI otomatis di `/lvp-build` |
| Chrome DevTools MCP | [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) (54.9k★) | Debug/performance/visual QA |
| GitHub MCP | [github/github-mcp-server](https://github.com/github/github-mcp-server) (34.3k★) | Issue/PR bila user punya repo GitHub |
| Supabase MCP | [supabase/mcp](https://github.com/supabase/mcp) (3.0k★) | Manajemen DB/auth untuk stack Supabase |
| Firecrawl MCP | [firecrawl/firecrawl-mcp-server](https://github.com/firecrawl/firecrawl-mcp-server) (7.8k★) | Scraping/riset web untuk deep research & competitor analysis |

---

## Top-10 rekomendasi rajutan prioritas

1. **blader/humanizer** — tambahkan daftar 26 pola anti-slop-nya ke `lvp-principles.md` dan pass akhir doc generation; kualitas terbukti (66k★, blind test 16/16), langsung memperkuat prinsip no-slop.
2. **Fission-AI/OpenSpec (pola)** — struktur folder change (proposal.md/specs/design.md/tasks.md) + perintah `continue`/`verify` adalah cetak biru terdekat untuk `/lvp-continue` dan `/lvp-add-feature`; aktif dan 74k★.
3. **deanpeters/Product-Manager-Skills** — bank skill discovery/PRD paling lengkap untuk user non-teknis (Mom Test, Working Backwards, user-story+Gherkin); perhatikan lisensi NC saat mengadaptasi.
4. **browserbase/skills** — satu repo dua kebutuhan: `competitor-analysis` (riset kompetitor di deep research) dan `ui-test` (verifikasi adversarial untuk `/lvp-build`); MIT.
5. **addyosmani/agent-skills** — 25 skill lifecycle yang sedikit-sedikit bisa diambil (`planning-and-task-breakdown`, `browser-testing-with-devtools`, `interview-me`); format mirip konsep conductor LVP.
6. **vercel-labs/agent-skills** — sumber rekomendasi skill resmi untuk stack React/Next/Vercel di blueprint.json; `web-design-guidelines` bagus untuk acceptance criteria UI.
7. **agentsmd/agents.md + wshobson/agents (pola adapter)** — dasar format AGENTS.md dan pola satu-sumber→banyak-harness untuk `/lvp-handoff` (Claude Code, Codex, Gemini CLI, Cursor, Antigravity).
8. **obra/superpowers (prinsip)** — "verification-before-completion" dan disiplin writing-plans masuk constitution LVP; jangan pasang plugin penuh karena overlap dengan Matt Pocock.
9. **Skills vendor resmi per-stack** (shadcn-ui/ui `npx shadcn add --skill`, supabase/agent-skills, expo/skills, flutter/agent-plugins, software-mansion-labs/skills) — daftar ini jadi isi "rekomendasi skill" di blueprint.json, dipilih sesuai stack hasil interview.
10. **upstash/context7 + microsoft/playwright-mcp** — dua MCP pertama yang direkomendasikan di setiap blueprint (dokumentasi terkini + verifikasi browser), karena bekerja di semua harness populer.

---

## Layak tapi TIDAK direkomendasikan

| Repo | Alasan tidak direkomendasikan |
|---|---|
| [SpillwaveSolutions/sdd-skill](https://github.com/SpillwaveSolutions/sdd-skill) (111★) | Push terakhir 17 Nov 2025 (~12 bulan stagnan) dan isinya hanya pembungkus Spec-Kit yang sudah dikenal. |
| [kimhons/humanize](https://github.com/kimhons/humanize) (4★, 2 commit) | Ide arsitektur bagus (hook + scorer), tapi terlalu kecil/muda untuk diandalkan; ambil idenya saja. |
| [ORBWEVA/founder-discovery](https://github.com/ORBWEVA/founder-discovery) (1★) | Konten sesuai kebutuhan (Mom Test/JTBD) tapi tanpa komunitas/aktivitas. |
| [ruvnet/claude-flow / ruflo](https://github.com/ruvnet/ruflo) (81.1k★) | Framework harness utuh, overkill untuk LVP; hanya skill CI/CD di dalamnya yang menarik. |
| [alexander-kastil/skills-collection](https://github.com/alexander-kastil/skills-collection) (19★) | Klaim "860+ skills" tapi komunitas hampir nol; koleksi vendor resmi sudah menutup kebutuhan. |
| [ducafecat/skills](https://github.com/ducafecat/skills) (6★) | Skill Flutter menarik tapi terlalu kecil; flutter/agent-plugins resmi lebih aman. |
| [travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills) (15.7k★) | Bukan "tidak layak", tapi push terakhir Apr 2026 — mulai kehilangan ritme; ComposioHQ dan hesreallyhim lebih segar. Pakai sebagai indeks, bukan sumber rajutan. |
| [eyaltoledano/claude-task-master](https://github.com/eyaltoledano/claude-task-master) (28.3k★) | Masih layak, tapi push terakhir Apr 2026 (~6 bulan); direkomendasikan sebagai referensi pola, bukan dependensi aktif. |
| Koleksi "150+ DevOps skills" tanpa repo jelas (muncul di artikel blog) | Tidak bisa diverifikasi ke repo GitHub yang jelas; skip. |

---

## Catatan temuan Threads

Ekspektasi rendah terbukti benar — hampir tidak ada konten katalog skills di Threads:

- Pencarian bahasa Indonesia ("claude skills rekomendasi", "agent skills kumpulan") menemukan:
  - Post berbahasa Indonesia "Buat kamu yang coding pakai Claude Code" yang merekomendasikan **addyosmani/agent-skills** (satu skill per tahap dari spec sampai rilis) dan **Graphify** (Graphify-Labs/graphify) — Graphify belum diverifikasi lebih lanjut karena di luar kategori katalog.
  - Post "5 Plugin Claude Code Rahasia" merekomendasikan paket resmi **frontend-design + webapp-testing** dari skills Anthropic (`/plugin install example-skills@anthropic-agent-skills`) dan **Superpowers** (obra) — konsisten dengan temuan GitHub di atas.
  - Post tentang tool "gstack" (kloning skill ke `~/.claude/skills/gstack`) — tidak bisa diverifikasi ke repo yang jelas.
- Tidak ada thread Threads yang merekomendasikan skill untuk discovery non-teknis, branding, atau portabilitas lintas harness secara spesifik.

---

## Lampiran: metode & keandalan angka

- Bintang dan tanggal aktivitas diambil dari GitHub API (`/repos/<owner>/<repo>`: `stargazers_count`, `pushed_at`) pada 2026-11-07, dibulatkan. Repo yang redirect (mis. `affaan-m/everything-claude-code` → `affaan-m/ECC`, `flutter/skills` → `flutter/agent-plugins`, `openai/agents.md` → `agentsmd/agents.md`) dilaporkan dengan nama baru.
- Isi skill tiap repo diverifikasi dari halaman GitHub (README/struktur folder) via WebFetch, bukan dari artikel pihak ketiga.
- Klaim "60 ribu+ proyek memakai AGENTS.md" berasal dari [agents.md](https://agents.md) dan liputan ekosistem 2026.
