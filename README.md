# Lazy Vibe Planner

Ubah ide mentah menjadi blueprint software: interview singkat, lalu lima dokumen teknis yang bisa langsung dipakai membangun.

Alur produk:

1. Tulis ide.
2. Jawab empat pertanyaan interview.
3. Generate lima dokumen secara berurutan: PRD, functional requirements, data model, API contract, architecture.
4. Baca, edit, salin, atau revisi tiap dokumen lewat AI assistant.

Semua data tersimpan lokal. Tidak ada akun, pembayaran, atau layanan pihak ketiga.

## Stack

- Next.js 16 (App Router, React 19, TypeScript)
- Tailwind CSS v4
- SQLite lewat `node:sqlite` (tanpa server database terpisah)
- `react-markdown` + `remark-gfm` untuk preview dokumen
- Endpoint LLM OpenAI-compatible (proxy lokal)

## Menjalankan

Butuh Node.js 24 atau lebih baru karena memakai `node:sqlite`.

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

Mode produksi:

```bash
npm run build
npm start
```

## Konfigurasi

Semua pengaturan opsional. Salin `.env.example` menjadi `.env.local` kalau perlu diubah.

| Variabel | Default | Keterangan |
|---|---|---|
| `LLM_BASE_URL` | `http://127.0.0.1:17070/v1` | Endpoint OpenAI-compatible, tanpa `/chat/completions`. |
| `LLM_MODEL` | `deepseek-v4.1-flash-free` | Nama model yang dikirim ke endpoint. |
| `LLM_API_KEY` | kosong | Diisi kalau proxy membutuhkan bearer token. |
| `DATABASE_PATH` | `./data/planner.db` | Lokasi file SQLite. |

Proxy yang dipakai harus mendukung `POST /chat/completions` dengan format OpenAI. Respons streaming SSE juga diterima.

## Data

Database dibuat otomatis di `data/planner.db` saat pertama kali dipakai. Folder `data/` diabaikan git.

Tabel:

- `projects`: ide, nama, status.
- `questions`: pertanyaan interview dan jawabannya.
- `docs`: isi markdown tiap dokumen.

Menghapus `data/planner.db` menghapus semua proyek.

## Keamanan

Tidak ada autentikasi. Siapa pun yang bisa menjangkau port aplikasi bisa membaca dan mengubah semua proyek. Jalankan di mesin lokal, atau di belakang reverse proxy yang punya autentikasi.

Untuk membatasi akses ke loopback saja:

```bash
npm start -- -H 127.0.0.1
```

## API

| Method | Path | Fungsi |
|---|---|---|
| `POST` | `/api/projects` | Membuat proyek dan interview dari sebuah ide. |
| `GET` | `/api/projects/[id]` | Mengambil proyek, pertanyaan, dan dokumen. |
| `POST` | `/api/projects/[id]/blueprint` | Generate dokumen, respons NDJSON. |
| `PATCH` | `/api/docs/[id]` | Menyimpan hasil edit manual. |
| `POST` | `/api/docs/[id]/revise` | Merevisi dokumen dengan instruksi bahasa biasa. |

Generate bersifat idempoten per dokumen: dokumen yang sudah ada dilewati, jadi permintaan ulang melanjutkan sisa dokumen tanpa menimpa yang selesai.

## Batasan MVP

- Tanpa autentikasi dan tanpa multi-user.
- Tanpa riwayat versi dokumen.
- Satu permintaan LLM per dokumen, berurutan. Tidak ada queue atau worker terpisah.
- Kualitas dan bahasa keluaran bergantung pada model di balik proxy.

## LVP Pipeline Skills

This repo also ships the skills behind the next iteration of the product: the LVP (Lazy Vibe Planner) pipeline, a model-agnostic interview flow that turns a raw idea from a non-technical owner into a verified Blueprint Bundle. Each skill lives in its own folder under `skills/` (`skills/<name>/SKILL.md` plus self-contained `references/`), runs anywhere a harness can read the Agent Skills format, and works on a one-folder-one-product model: every project gets its own folder with disk-based state under `.lvp/`. Install with `npx skills add <owner>/lazy-vibers-planner` (or follow the per-harness manual-copy paths), and uninstall by deleting the skill folder — full instructions, including the file list that a correct install must produce and the license note (NC boosters stay runtime dependencies, never vendored), are in [skills/README.md](skills/README.md).

## License & Credits

**License:** MIT — see [LICENSE](LICENSE). Free to use, modify, and distribute with attribution. (The owner chose MIT over Apache-2.0 for simplicity; the pipeline's own dependency policy toward NC-licensed boosters is stricter and is documented in [ADR-0001](docs/adr/0001-permissive-first-license-policy.md).)

This pipeline stands on the shoulders of open source — deep thanks to the projects that shaped it, feed it, or were distilled into it (full catalog with verification dates: [docs/research/agent-skill-catalog.md](docs/research/agent-skill-catalog.md)):

**Methodology & inspiration**
- [github/spec-kit](https://github.com/github/spec-kit) — the spec-driven development pipeline this project set out to reimagine for non-technical users
- [obra/superpowers](https://github.com/obra/superpowers) — verification-before-completion and plan-writing discipline
- Matt Pocock's engineering skills (wayfinder, research, grilling, to-spec, to-tickets) — the decision-grilling and tracer-bullet ticketing workflow used to design this very pipeline
- [storytold/craft-anything](https://github.com/storytold/craft-anything) — the Study → Build → Check → Ready loop pattern

**Quality rulebooks** (distilled into LVP's Constitution and its compile passes)
- [blader/humanizer](https://github.com/blader/humanizer) · [miqdadbadjuber/anti-slop](https://github.com/miqdadbadjuber/anti-slop) · [AminBlg/SimpleEnglish](https://github.com/AminBlg/SimpleEnglish) · [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) · [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail)

**Patterns & boosters** (runtime dependencies — credited, never vendored)
- [product-on-purpose/pm-skills](https://github.com/product-on-purpose/pm-skills) (Apache-2.0) · [Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec) · [browserbase/skills](https://github.com/browserbase/skills) · [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) · [vercel-labs/skills](https://github.com/vercel-labs/skills) · [agentsmd/agents.md](https://github.com/agentsmd/agents.md) · [anthropics/skills](https://github.com/anthropics/skills)

**MCP servers the pipeline recommends**
- [microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp) · [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) · [upstash/context7](https://github.com/upstash/context7) · [firecrawl/firecrawl-mcp-server](https://github.com/firecrawl/firecrawl-mcp-server) · [supabase/mcp](https://github.com/supabase/mcp)
