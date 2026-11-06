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
