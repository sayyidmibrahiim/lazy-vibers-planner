import { NextResponse } from "next/server";
import { getDocs, getProject, getQuestions } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const project = getProject(id);

  if (!project) {
    return NextResponse.json({ error: "Proyek tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({
    project,
    questions: getQuestions(id),
    docs: getDocs(id),
  });
}
