import { DOC_LIST } from "./doc-list";
import type { DocKind } from "./kinds";

export interface Interview {
  name: string;
  questions: Array<{ question: string; options: string[] }>;
}

export function interviewPrompt(idea: string): string {
  return `Kamu adalah software architect senior. Kamu memulai discovery interview singkat untuk sebuah ide produk.

IDE:
${idea}

Buat:
1. Nama proyek 2 sampai 4 kata. Judul, bukan kalimat.
2. Tepat 4 pertanyaan interview yang paling menentukan bentuk produk.
3. Tiap pertanyaan punya tepat 4 opsi jawaban pendek.

Aturan:
- Pertanyaan harus spesifik untuk ide ini, bukan pertanyaan generik.
- Opsi harus saling eksklusif, berada pada satu dimensi keputusan yang sama, dan berupa frasa pendek 2 sampai 5 kata. Jangan mencampur fitur dengan preferensi.
- Opsi harus saling berbeda dan langsung bisa dipilih.
- Jangan menomori pertanyaan atau opsi.
- Tulis seluruh pertanyaan dan opsi dalam bahasa yang sama dengan ide di atas. Jangan mencampur bahasa. Jika ide berbahasa Indonesia, semua pertanyaan dan opsi wajib Bahasa Indonesia.

Balas hanya JSON ketat dengan bentuk:
{"name":"...","questions":[{"question":"...","options":["...","...","...","..."]}]}`;
}

export function parseInterview(value: unknown): Interview {
  if (!value || typeof value !== "object") throw new Error("Format interview tidak valid.");
  const raw = value as { name?: unknown; questions?: unknown };

  const name = typeof raw.name === "string" ? raw.name.trim().slice(0, 80) : "";
  if (!name) throw new Error("Model tidak memberi nama proyek.");

  if (!Array.isArray(raw.questions) || raw.questions.length < 3) {
    throw new Error("Model tidak memberi cukup pertanyaan.");
  }

  const questions = raw.questions.slice(0, 4).map((item) => {
    if (!item || typeof item !== "object") throw new Error("Pertanyaan tidak valid.");
    const q = item as { question?: unknown; options?: unknown };
    const question = typeof q.question === "string" ? q.question.trim() : "";
    const options = Array.isArray(q.options)
      ? q.options.filter((option): option is string => typeof option === "string").map((option) => option.trim()).filter(Boolean)
      : [];
    if (!question || options.length < 2) throw new Error("Pertanyaan tidak lengkap.");
    return { question, options: options.slice(0, 4) };
  });

  return { name, questions };
}

const BRIEFS: Record<DocKind, string> = {
  prd: `Tulis PRD yang bisa dipakai membangun produk:
- Problem dan konteks
- Target pengguna dan kebutuhan utama
- Value proposition
- Tujuan dan non-tujuan (out of scope)
- Alur utama pengguna
- Metrik keberhasilan
- Risiko dan asumsi`,
  requirements: `Tulis requirement fungsional per modul:
- Kode requirement (FR-01, FR-02, ...)
- Deskripsi perilaku yang bisa diuji
- Prioritas (must/should/could)
- Acceptance criteria ringkas
- Bagian non-functional: performa, keamanan, aksesibilitas, batas data`,
  "data-model": `Tulis model data:
- Daftar entitas dengan tujuan masing-masing
- Tabel field: nama, tipe, constraint, keterangan
- Relasi antar entitas dan kardinalitas
- Index dan alasan
- Aturan validasi dan retensi data
- Contoh record JSON untuk entitas utama`,
  api: `Tulis kontrak API:
- Konvensi: base path, format error, autentikasi (atau tanpa auth jika belum perlu)
- Tabel endpoint: method, path, tujuan, input, output
- Contoh request dan response untuk 2 endpoint terpenting
- Status code yang dipakai
- Batasan rate, ukuran payload, dan idempotensi`,
  architecture: `Tulis arsitektur:
- Stack dan alasan singkat
- Komponen utama dan tanggung jawabnya
- Diagram alur data dalam ASCII
- Struktur folder yang disarankan
- Cara menjalankan secara lokal
- Titik kegagalan dan rencana mitigasi
- Batas MVP: apa yang sengaja belum dibuat`,
};

export const DOC_KINDS = DOC_LIST.map((doc) => ({ ...doc, brief: BRIEFS[doc.kind] }));

/** Ringkas dokumen yang sudah jadi agar dokumen berikutnya tidak bertentangan. */
export function previousDocsContext(docs: Array<{ title: string; content: string }>): string {
  if (docs.length === 0) return "";

  let budget = 3200;
  const parts: string[] = [];

  for (const doc of docs) {
    if (budget <= 0) break;
    const slice = doc.content.trim().slice(0, Math.min(700, budget));
    budget -= slice.length;
    parts.push(`### ${doc.title}\n${slice}`);
  }

  return parts.join("\n\n");
}

export function docPrompt(input: {
  projectName: string;
  idea: string;
  answers: string;
  kind: DocKind;
  title: string;
  brief: string;
  context?: string;
}): string {
  const context = input.context?.trim();

  return `Kamu menulis satu dokumen blueprint untuk proyek software.

Nama proyek: ${input.projectName}
Ide: ${input.idea}

Jawaban interview:
${input.answers || "(tidak ada, gunakan asumsi paling masuk akal dan tandai sebagai asumsi)"}
${
  context
    ? `\nDokumen yang sudah ditulis sebelumnya (wajib konsisten dengan ini):\n${context}\n`
    : ""
}
Dokumen yang harus ditulis: ${input.title}

${input.brief}

Aturan:
- Markdown GitHub-flavored, diawali "# ${input.title}".
- Konkret dan spesifik untuk proyek ini. Tanpa basa-basi.
- Gunakan tabel bila membandingkan banyak field atau endpoint.
- Jangan pakai Mermaid. Diagram ASCII boleh.
- 450 sampai 750 kata. Jangan melebihi 750 kata; selesaikan dokumen, jangan berhenti di tengah kalimat.
- Pakai stack, nama entitas, istilah, dan keputusan yang sama dengan dokumen sebelumnya. Jika ada konflik, ikuti dokumen sebelumnya.
- Tulis seluruh prosa dan judul bagian dalam bahasa yang sama dengan ide pengguna. Jangan mencampur bahasa. Istilah teknis standar (API, endpoint, cache, deploy) boleh tetap bahasa Inggris.
- Balas hanya isi markdown, tanpa pagar kode dan tanpa komentar lain.`;
}

export function revisePrompt(input: {
  projectName: string;
  idea: string;
  kind: string;
  title: string;
  content: string;
  instruction: string;
}): string {
  return `Kamu merevisi satu dokumen blueprint.

Nama proyek: ${input.projectName}
Ide: ${input.idea}
Dokumen: ${input.title} (${input.kind})

Isi sekarang:
---
${input.content}
---

Instruksi revisi:
${input.instruction}

Aturan:
- Terapkan instruksi pada seluruh dokumen, bukan hanya menambahkan catatan di akhir.
- Pertahankan bagian yang tidak diminta berubah.
- Markdown GitHub-flavored, tetap diawali "# ${input.title}".
- Jangan pakai Mermaid.
- Jangan mengubah bahasa dokumen. Jika isi dokumen berbahasa Indonesia, seluruh isi dan judul bagian tetap Bahasa Indonesia; jangan menerjemahkan judul ke bahasa Inggris. Istilah teknis standar boleh tetap bahasa Inggris.
- Balas hanya markdown lengkap hasil revisi, tanpa pagar kode dan tanpa penjelasan.`;
}
