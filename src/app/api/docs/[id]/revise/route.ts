import { NextResponse } from "next/server";
import { revisePrompt } from "@/lib/blueprint";
import { getDoc, getProject, touchProject, updateDocContent } from "@/lib/db";
import { chatDetailed, type ChatMessage } from "@/lib/llm";
import { cleanMarkdown, ensureTitle, errorMessage } from "@/lib/text";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const doc = getDoc(id);

  if (!doc) {
    return NextResponse.json({ error: "Dokumen tidak ditemukan." }, { status: 404 });
  }

  const project = getProject(doc.projectId);
  if (!project) {
    return NextResponse.json({ error: "Proyek tidak ditemukan." }, { status: 404 });
  }

  const body = (await request.json().catch(() => null)) as { instruction?: unknown } | null;
  const instruction = typeof body?.instruction === "string" ? body.instruction.trim() : "";

  if (instruction.length < 3) {
    return NextResponse.json({ error: "Tulis instruksi revisinya." }, { status: 400 });
  }
  if (instruction.length > 2000) {
    return NextResponse.json({ error: "Instruksi terlalu panjang." }, { status: 400 });
  }

  try {
    const messages: ChatMessage[] = [
      {
        role: "system",
        content:
          "Kamu merevisi dokumen teknis. Balas hanya markdown lengkap, tanpa pagar kode dan tanpa penjelasan. Jangan mengubah bahasa dokumen kecuali diminta secara eksplisit.",
      },
      {
        role: "user",
        content: revisePrompt({
          projectName: project.name,
          idea: project.idea,
          kind: doc.kind,
          title: doc.title,
          content: doc.content,
          instruction,
        }),
      },
    ];

    let outcome = await chatDetailed(messages, { maxTokens: 6000, temperature: 0.3 });

    if (outcome.finishReason === "length") {
      outcome = await chatDetailed(
        [
          ...messages,
          { role: "assistant", content: outcome.text },
          {
            role: "user",
            content:
              "Jawaban sebelumnya terpotong karena batas token. Tulis ulang hasil revisi secara lengkap dan lebih ringkas, maksimal 650 kata, tanpa menghilangkan instruksi yang sudah diterapkan. Pastikan kalimat terakhir selesai.",
          },
        ],
        { maxTokens: 6000, temperature: 0.3 },
      );
    }

    if (outcome.finishReason === "length") {
      throw new Error("Model memotong hasil revisi karena batas token. Coba lagi.");
    }

    const content = ensureTitle(cleanMarkdown(outcome.text), doc.title);

    const updated = updateDocContent(id, content);
    touchProject(doc.projectId);
    return NextResponse.json({ doc: updated });
  } catch (error) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 502 });
  }
}
