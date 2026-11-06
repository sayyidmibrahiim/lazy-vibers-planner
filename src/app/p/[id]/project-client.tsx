"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Markdown } from "@/components/markdown";
import { DOC_LIST } from "@/lib/doc-list";
import type { Doc, Project, Question } from "@/lib/types";

type Phase = "interview" | "generating" | "workspace";
type Progress = {
  kind: string;
  title: string;
  status: "pending" | "running" | "done";
};

type StreamEvent =
  | { type: "doc_start"; kind: string; title: string }
  | { type: "doc_done"; kind: string; title: string; skipped?: boolean }
  | { type: "done" }
  | { type: "error"; message: string };

export function ProjectClient({
  project: initialProject,
  questions: initialQuestions,
  docs: initialDocs,
}: {
  project: Project;
  questions: Question[];
  docs: Doc[];
}) {
  const router = useRouter();
  const [project, setProject] = useState(initialProject);
  const [questions, setQuestions] = useState(initialQuestions);
  const [docs, setDocs] = useState(initialDocs);

  const [phase, setPhase] = useState<Phase>(() => {
    if (initialProject.status === "ready" && initialDocs.length > 0) return "workspace";
    if (
      initialProject.status === "generating" ||
      (initialProject.status === "error" && initialDocs.length > 0)
    ) {
      return "generating";
    }
    return "interview";
  });

  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const start: Record<string, string> = {};
    for (const question of initialQuestions) {
      if (question.answer) start[question.id] = question.answer;
    }
    return start;
  });

  const [progress, setProgress] = useState<Progress[]>(() =>
    DOC_LIST.map((doc) => ({
      kind: doc.kind,
      title: doc.title,
      status: initialDocs.some((item) => item.kind === doc.kind) ? "done" : "pending",
    })),
  );

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(initialDocs[0]?.id ?? null);

  const answeredCount = useMemo(
    () => Object.values(answers).filter((value) => value.trim()).length,
    [answers],
  );

  const activeDoc = useMemo(
    () => docs.find((doc) => doc.id === activeId) ?? docs[0] ?? null,
    [activeId, docs],
  );

  function setAnswer(questionId: string, value: string) {
    setAnswers((current) => {
      const next = { ...current };
      if (value.trim()) next[questionId] = value;
      else delete next[questionId];
      return next;
    });
  }

  async function generate() {
    if (busy) return;
    setBusy(true);
    setError(null);
    setPhase("generating");
    setProgress(
      DOC_LIST.map((doc) => ({
        kind: doc.kind,
        title: doc.title,
        status: docs.some((item) => item.kind === doc.kind) ? "done" : "pending",
      })),
    );

    try {
      const response = await fetch(`/api/projects/${project.id}/blueprint`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok || !response.body) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Tidak bisa memulai generate.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let streamError: string | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          let event: StreamEvent;
          try {
            event = JSON.parse(line) as StreamEvent;
          } catch {
            continue;
          }

          if (event.type === "doc_start") {
            setProgress((current) =>
              current.map((item) =>
                item.kind === event.kind ? { ...item, status: "running" } : item,
              ),
            );
          }

          if (event.type === "doc_done") {
            setProgress((current) =>
              current.map((item) =>
                item.kind === event.kind ? { ...item, status: "done" } : item,
              ),
            );
          }

          if (event.type === "error") streamError = event.message;
        }
      }

      if (streamError) throw new Error(streamError);

      const refreshed = await fetch(`/api/projects/${project.id}`, {
        cache: "no-store",
      });
      if (!refreshed.ok) throw new Error("Blueprint selesai, tetapi gagal dimuat ulang.");
      const data = (await refreshed.json()) as {
        project: Project;
        questions: Question[];
        docs: Doc[];
      };

      setProject(data.project);
      setQuestions(data.questions);
      setDocs(data.docs);
      setActiveId(data.docs[0]?.id ?? null);
      setPhase("workspace");
      router.refresh();
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Generate gagal.";
      setError(message);
      setProject((current) => ({ ...current, status: "error" }));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-dvh">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-4">
          <div className="flex min-w-0 items-center gap-4">
            <Link
              href="/"
              className="label shrink-0 text-ink/65 transition-colors hover:text-ink"
            >
              &lt;- Arsip
            </Link>
            <span className="hidden h-4 w-px bg-line sm:block" />
            <span className="truncate text-sm font-medium tracking-[-0.01em]">
              {project.name}
            </span>
          </div>
          <StatusChip phase={phase} status={project.status} />
        </div>
      </header>

      {phase === "interview" ? (
        <InterviewView
          project={project}
          questions={questions}
          answers={answers}
          answeredCount={answeredCount}
          error={error}
          onAnswer={setAnswer}
          onGenerate={generate}
        />
      ) : null}

      {phase === "generating" ? (
        <GeneratingView
          project={project}
          progress={progress}
          error={error}
          hasDocs={progress.some((item) => item.status === "done")}
          busy={busy}
          onRetry={generate}
        />
      ) : null}

      {phase === "workspace" ? (
        <WorkspaceView
          key={activeDoc?.id ?? "empty"}
          project={project}
          docs={docs}
          activeDoc={activeDoc}
          activeId={activeId}
          onSelect={setActiveId}
          onDocsChange={setDocs}
        />
      ) : null}
    </div>
  );
}

function StatusChip({ phase, status }: { phase: Phase; status: string }) {
  const label =
    phase === "workspace" ? "Siap" : phase === "generating" ? "Menyusun" : status === "error" ? "Terhenti" : "Interview";
  const tone =
    phase === "workspace"
      ? "text-blueprint"
      : phase === "generating"
        ? "text-blueprint"
        : status === "error"
          ? "text-rust"
          : "text-rust";

  return (
    <span className={`label flex shrink-0 items-center gap-2 ${tone}`}>
      <span
        className={`size-1.5 rounded-full ${
          phase === "generating" ? "status-dot bg-current" : "bg-current"
        }`}
      />
      {label}
    </span>
  );
}

function InterviewView({
  project,
  questions,
  answers,
  answeredCount,
  error,
  onAnswer,
  onGenerate,
}: {
  project: Project;
  questions: Question[];
  answers: Record<string, string>;
  answeredCount: number;
  error: string | null;
  onAnswer: (questionId: string, value: string) => void;
  onGenerate: () => void;
}) {
  const percent = questions.length
    ? Math.round((answeredCount / questions.length) * 100)
    : 0;

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 sm:py-14">
      <p className="label text-blueprint">Interview / 01</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
        {questions.length} pertanyaan sebelum menulis.
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-ink/65">
        Jawaban dipakai untuk mengunci batas produk. Kosongkan yang belum pasti,
        model akan menandainya sebagai asumsi.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="self-start border border-line bg-card p-5 lg:sticky lg:top-8">
          <p className="label text-ink/65">Ide awal</p>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-ink/70">
            {project.idea}
          </p>

          <div className="mt-6 border-t border-line pt-4">
            <div className="flex items-baseline justify-between">
              <span className="label text-ink/65">Terjawab</span>
              <span className="font-mono text-xs text-ink/65">
                {answeredCount} / {questions.length}
              </span>
            </div>
            <div className="mt-2 h-1 bg-ink/10">
              <div
                className="h-1 bg-blueprint transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          <p className="mt-5 text-xs leading-5 text-ink/65">
            Semua berjalan lokal. Dokumen disimpan di SQLite di folder proyek.
          </p>
        </aside>

        <div>
          <div className="space-y-4">
            {questions.map((question, index) => {
              const answer = answers[question.id] ?? "";
              const selected = question.options.includes(answer);

              return (
                <section
                  key={question.id}
                  className="border border-line bg-card p-5 sm:p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="label text-blueprint">
                      Q{(index + 1).toString().padStart(2, "0")} /{" "}
                      {questions.length.toString().padStart(2, "0")}
                    </span>
                    <span className="label text-ink/65">
                      {answer ? "Terjawab" : "Kosong"}
                    </span>
                  </div>

                  <h2 className="mt-4 text-[17px] font-medium leading-7 tracking-[-0.01em]">
                    {question.question}
                  </h2>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {question.options.map((option) => {
                      const active = answer === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => onAnswer(question.id, active ? "" : option)}
                          aria-pressed={active}
                          className={`border px-3 py-2.5 text-left text-[13px] leading-5 transition-colors ${
                            active
                              ? "border-blueprint bg-blueprint text-paper"
                              : "border-line bg-paper hover:border-ink/40"
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  <label className="mt-4 block">
                    <span className="label text-ink/65">Atau tulis sendiri</span>
                    <input
                      value={selected ? "" : answer}
                      onChange={(event) => onAnswer(question.id, event.target.value)}
                      placeholder="Jawaban lain..."
                      className="mt-2 w-full border border-line bg-paper px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-ink/65 focus:border-ink/50"
                    />
                  </label>
                </section>
              );
            })}
          </div>

          {error ? (
            <p
              role="alert"
              className="mt-4 border border-rust/40 bg-rust/5 px-3 py-2 text-sm text-rust"
            >
              {error}
            </p>
          ) : null}

          <div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-line pt-5 sm:flex-row sm:items-center">
            <p className="text-xs leading-5 text-ink/65">
              Generate memakai satu panggilan model per dokumen. Butuh beberapa
              menit.
            </p>
            <button
              type="button"
              onClick={onGenerate}
              className="inline-flex items-center gap-3 bg-ink px-4 py-3 text-sm font-medium text-paper transition-colors hover:bg-blueprint"
            >
              Generate blueprint
              <span aria-hidden className="font-mono text-xs">
                -&gt;
              </span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function GeneratingView({
  project,
  progress,
  error,
  hasDocs,
  busy,
  onRetry,
}: {
  project: Project;
  progress: Progress[];
  error: string | null;
  hasDocs: boolean;
  busy: boolean;
  onRetry: () => void;
}) {
  const done = progress.filter((item) => item.status === "done").length;
  const percent = Math.round((done / progress.length) * 100);
  const stopped = Boolean(error) || project.status === "error";

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
      <p className="label text-blueprint">Generate / 02</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
        {stopped ? "Generate terhenti." : busy ? "Menyusun blueprint." : "Generate belum selesai."}
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-ink/65">
        {stopped
          ? "Dokumen yang sudah jadi tetap tersimpan. Lanjutkan untuk mengisi sisanya."
          : busy
            ? `Model menulis satu dokumen pada satu waktu untuk ${project.name}. Jangan tutup tab ini.`
            : "Tidak ada proses aktif di tab ini. Lanjutkan untuk mengisi dokumen yang tersisa."}
      </p>

      <div className="mt-8 border border-line bg-card">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <span className="label text-ink/65">Progres</span>
          <span className="font-mono text-xs text-ink/65">
            {done} / {progress.length}
          </span>
        </div>
        <div className="h-1 bg-ink/8">
          <div
            className="h-1 bg-blueprint transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>

        <ul className="divide-y divide-line">
          {progress.map((item, index) => (
            <li key={item.kind} className="flex items-center gap-4 px-5 py-4">
              <span className="label w-6 text-ink/65">
                {(index + 1).toString().padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1 text-sm">{item.title}</span>
              <span
                className={`label ${
                  item.status === "done"
                    ? "text-blueprint"
                    : item.status === "running"
                      ? "text-ink/65"
                      : "text-ink/65"
                }`}
              >
                {item.status === "done" ? "Selesai" : item.status === "running" ? "Menulis..." : "Menunggu"}
              </span>
              {item.status === "running" ? (
                <span className="size-1.5 rounded-full bg-blueprint status-dot" />
              ) : (
                <span
                  className={`size-1.5 rounded-full ${
                    item.status === "done" ? "bg-blueprint" : "bg-ink/15"
                  }`}
                />
              )}
            </li>
          ))}
        </ul>
      </div>

      {!busy ? (
        <div
          className={`mt-5 border p-4 ${
            stopped ? "border-rust/40 bg-rust/5" : "border-blueprint/25 bg-blueprint/5"
          }`}
        >
          <p className={`text-sm leading-6 ${stopped ? "text-rust" : "text-blueprint"}`}>
            {stopped
              ? error ?? "Proses sebelumnya terhenti. Dokumen yang sudah jadi tetap tersimpan."
              : "Proses tidak berjalan di tab ini. Lanjutkan untuk mengecek sisa dokumen."}
          </p>
          <p className={`mt-2 text-xs leading-5 ${stopped ? "text-rust" : "text-blueprint"}`}>
            {hasDocs
              ? "Dokumen yang sudah selesai tidak ditulis ulang."
              : "Belum ada dokumen yang selesai."}
          </p>
          <button
            type="button"
            onClick={onRetry}
            className={`mt-4 inline-flex items-center gap-2 border px-3 py-2 text-sm font-medium transition-colors ${
              stopped
                ? "border-rust/50 text-rust hover:bg-rust hover:text-paper"
                : "border-blueprint/40 text-blueprint hover:bg-blueprint hover:text-paper"
            }`}
          >
            Lanjutkan generate
          </button>
        </div>
      ) : null}

      {busy ? (
        <p className="mt-5 text-xs leading-5 text-ink/65">
          Waktu tergantung model. Satu dokumen biasanya 10 sampai 40 detik.
        </p>
      ) : null}
    </main>
  );
}

function WorkspaceView({
  project,
  docs,
  activeDoc,
  activeId,
  onSelect,
  onDocsChange,
}: {
  project: Project;
  docs: Doc[];
  activeDoc: Doc | null;
  activeId: string | null;
  onSelect: (id: string) => void;
  onDocsChange: (docs: Doc[]) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(activeDoc?.content ?? "");
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [instruction, setInstruction] = useState("");
  const [revising, setRevising] = useState(false);
  const [assistantError, setAssistantError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  async function saveEdit() {
    if (!activeDoc) return;
    setSaving(true);
    setAssistantError(null);
    try {
      const response = await fetch(`/api/docs/${activeDoc.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent }),
      });
      const data = (await response.json()) as { doc?: Doc; error?: string };
      if (!response.ok || !data.doc) throw new Error(data.error ?? "Gagal menyimpan.");
      onDocsChange(docs.map((doc) => (doc.id === data.doc!.id ? data.doc! : doc)));
      setEditContent(data.doc.content);
      setEditing(false);
      setNote("Dokumen disimpan.");
    } catch (caught) {
      setAssistantError(caught instanceof Error ? caught.message : "Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  }

  async function revise() {
    if (!activeDoc || instruction.trim().length < 3) return;
    setRevising(true);
    setAssistantError(null);
    setNote(null);
    try {
      const response = await fetch(`/api/docs/${activeDoc.id}/revise`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instruction }),
      });
      const data = (await response.json()) as { doc?: Doc; error?: string };
      if (!response.ok || !data.doc) throw new Error(data.error ?? "Gagal merevisi.");
      onDocsChange(docs.map((doc) => (doc.id === data.doc!.id ? data.doc! : doc)));
      setInstruction("");
      setEditing(false);
      setEditContent(data.doc.content);
      setNote("Revisi diterapkan.");
    } catch (caught) {
      setAssistantError(caught instanceof Error ? caught.message : "Gagal merevisi.");
    } finally {
      setRevising(false);
    }
  }

  async function copy() {
    if (!activeDoc) return;
    try {
      await navigator.clipboard.writeText(activeDoc.content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setAssistantError("Clipboard tidak tersedia di browser ini.");
    }
  }

  if (!activeDoc) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-16">
        <p className="text-sm text-ink/65">Belum ada dokumen untuk proyek ini.</p>
      </main>
    );
  }

  return (
    <div className="mx-auto max-w-[1500px] lg:grid lg:h-[calc(100dvh-61px)] lg:grid-cols-[220px_minmax(0,1fr)_330px] lg:overflow-hidden">
      <aside className="border-b border-line p-4 lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <div className="flex items-baseline justify-between px-1">
          <span className="label text-ink/65">Dokumen</span>
          <span className="font-mono text-[10px] text-ink/65">
            {docs.length.toString().padStart(2, "0")}
          </span>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {docs.map((doc, index) => {
            const active = doc.id === activeId;
            return (
              <button
                key={doc.id}
                type="button"
                onClick={() => onSelect(doc.id)}
                className={`flex w-[190px] shrink-0 items-start gap-3 border px-3 py-2.5 text-left transition-colors lg:w-full ${
                  active
                    ? "border-ink bg-ink text-paper"
                    : "border-transparent hover:border-line hover:bg-card"
                }`}
              >
                <span
                  className={`pt-0.5 font-mono text-[10px] ${
                    active ? "text-paper/70" : "text-ink/65"
                  }`}
                >
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                <span className="text-[13px] leading-5">{doc.title}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 hidden border-t border-line px-1 pt-4 lg:block">
          <p className="label text-ink/65">Proyek</p>
          <p className="mt-2 text-xs leading-5 text-ink/65">{project.name}</p>
          <p className="mt-1 text-[11px] leading-5 text-ink/65">
            Blueprint v0.1. Disimpan lokal.
          </p>
        </div>
      </aside>

      <main className="min-w-0 p-5 sm:p-8 lg:overflow-y-auto lg:p-10">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
          <div>
            <p className="label text-blueprint">{activeDoc.kind}</p>
            <h1 className="mt-2 text-xl font-semibold tracking-[-0.03em]">
              {activeDoc.title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEditing((value) => !value)}
              className="border border-line px-3 py-1.5 text-xs transition-colors hover:border-ink/40 hover:bg-card"
            >
              {editing ? "Preview" : "Edit"}
            </button>
            <button
              type="button"
              onClick={copy}
              className="border border-line px-3 py-1.5 text-xs transition-colors hover:border-ink/40 hover:bg-card"
            >
              {copied ? "Tersalin" : "Copy"}
            </button>
          </div>
        </div>

        {note ? (
          <p className="mt-4 border border-blueprint/25 bg-blueprint/5 px-3 py-2 text-xs text-blueprint">
            {note}
          </p>
        ) : null}

        {editing ? (
          <div className="mt-5">
            <textarea
              value={editContent}
              onChange={(event) => setEditContent(event.target.value)}
              spellCheck={false}
              className="min-h-[60vh] w-full resize-y border border-line bg-card p-5 font-mono text-[12.5px] leading-6 outline-none focus:border-ink/40"
            />
            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditContent(activeDoc.content);
                  setEditing(false);
                }}
                className="px-3 py-2 text-xs text-ink/65 hover:text-ink"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={saveEdit}
                disabled={saving}
                className="bg-ink px-4 py-2 text-xs font-medium text-paper transition-colors hover:bg-blueprint disabled:opacity-60"
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        ) : (
          <article className="mt-5 border border-line bg-card p-6 sm:p-10">
            <Markdown content={activeDoc.content} />
          </article>
        )}
      </main>

      <aside className="border-t border-line p-5 lg:overflow-y-auto lg:border-t-0 lg:border-l">
        <p className="label text-blueprint">AI assistant</p>
        <h2 className="mt-3 text-lg font-semibold tracking-[-0.02em]">
          Revisi dokumen aktif.
        </h2>
        <p className="mt-2 text-xs leading-5 text-ink/65">
          Instruksi diterapkan ke seluruh dokumen, bukan ditambahkan di akhir.
          Perubahan langsung disimpan.
        </p>

        <label className="mt-5 block">
          <span className="label text-ink/65">Instruksi</span>
          <textarea
            value={instruction}
            onChange={(event) => setInstruction(event.target.value)}
            rows={5}
            placeholder="Contoh: tambah acceptance criteria untuk setiap requirement, lalu ringkas bagian non-functional."
            className="mt-2 w-full resize-none border border-line bg-card p-3 text-[13px] leading-6 outline-none transition-colors placeholder:text-ink/65 focus:border-ink/45"
          />
        </label>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {[
            "Tambah acceptance criteria",
            "Persingkat 30%",
            "Tambah contoh request",
          ].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setInstruction(preset)}
              className="border border-line px-2 py-1 text-[11px] text-ink/65 transition-colors hover:border-ink/40 hover:text-ink"
            >
              {preset}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={revise}
          disabled={revising || instruction.trim().length < 3}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 bg-ink px-4 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-blueprint disabled:cursor-not-allowed disabled:opacity-40"
        >
          {revising ? (
            <>
              <span className="size-1.5 rounded-full bg-paper status-dot" />
              Merevisi...
            </>
          ) : (
            "Revisi dokumen"
          )}
        </button>

        {assistantError ? (
          <p
            role="alert"
            className="mt-3 border border-rust/40 bg-rust/5 px-3 py-2 text-xs leading-5 text-rust"
          >
            {assistantError}
          </p>
        ) : null}

        <div className="mt-6 border-t border-line pt-4">
          <p className="label text-ink/65">Catatan</p>
          <p className="mt-2 text-[11px] leading-5 text-ink/65">
            Tidak ada riwayat versi. Simpan salinan manual kalau perlu
            membandingkan revisi.
          </p>
        </div>
      </aside>
    </div>
  );
}
