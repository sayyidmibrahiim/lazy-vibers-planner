import { NextResponse } from "next/server";
import { interviewPrompt, parseInterview } from "@/lib/blueprint";
import { addQuestions, createProject } from "@/lib/db";
import { chatJson } from "@/lib/llm";
import { errorMessage } from "@/lib/text";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { idea?: unknown } | null;
  const idea = typeof body?.idea === "string" ? body.idea.trim() : "";

  if (idea.length < 15) {
    return NextResponse.json(
      { error: "Ceritakan idemu minimal satu kalimat utuh." },
      { status: 400 },
    );
  }
  if (idea.length > 6000) {
    return NextResponse.json(
      { error: "Ide terlalu panjang. Ringkas di bawah 6000 karakter." },
      { status: 400 },
    );
  }

  try {
    const raw = await chatJson<unknown>(
      [
        {
          role: "system",
          content: "Kamu membalas hanya dengan JSON ketat. Tidak ada markdown, tidak ada penjelasan.",
        },
        { role: "user", content: interviewPrompt(idea) },
      ],
      { maxTokens: 1400, temperature: 0.5 },
    );

    const interview = parseInterview(raw);
    const id = createProject(interview.name, idea);
    addQuestions(id, interview.questions);
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 502 });
  }
}
