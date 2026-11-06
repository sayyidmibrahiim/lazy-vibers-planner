import { NextResponse } from "next/server";
import { getDoc, touchProject, updateDocContent } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const doc = getDoc(id);

  if (!doc) {
    return NextResponse.json({ error: "Dokumen tidak ditemukan." }, { status: 404 });
  }

  const body = (await request.json().catch(() => null)) as { content?: unknown } | null;
  const content = typeof body?.content === "string" ? body.content : "";

  if (!content.trim()) {
    return NextResponse.json({ error: "Dokumen tidak boleh kosong." }, { status: 400 });
  }
  if (content.length > 200_000) {
    return NextResponse.json({ error: "Dokumen terlalu besar." }, { status: 400 });
  }

  const updated = updateDocContent(id, content);
  touchProject(doc.projectId);
  return NextResponse.json({ doc: updated });
}
