import Link from "next/link";
import { listProjects } from "@/lib/db";
import type { ProjectStatus } from "@/lib/types";
import { NewProjectForm } from "./new-project-form";
import { OpenFolderForm } from "./open-folder-form";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const STATUS_LABEL: Record<ProjectStatus, string> = {
  interview: "Interview",
  generating: "Menyusun",
  ready: "Siap",
  error: "Terhenti",
};

const STATUS_TONE: Record<ProjectStatus, string> = {
  interview: "text-rust",
  generating: "text-blueprint",
  ready: "text-blueprint",
  error: "text-rust",
};

function formatDate(value: number): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

const STEPS = [
  ["01", "Interview", "Empat pertanyaan untuk menutup celah terbesar."],
  ["02", "Generate", "Lima dokumen teknis disusun berurutan."],
  ["03", "Revisi", "Ubah satu dokumen dengan instruksi biasa."],
];

export default function Home() {
  const projects = listProjects();

  return (
    <div className="min-h-dvh">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-7 place-items-center border border-ink/70 font-mono text-[10px] font-medium">
              LV
            </span>
            <span className="text-sm font-semibold tracking-tight">Lazy Vibe Planner</span>
          </Link>
          <span className="label text-ink/65">Local workbench / v0.1</span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        <section className="grid gap-14 border-b border-line py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:py-24">
          <div className="lg:pt-2">
            <p className="label text-blueprint">Blueprint generator / 01</p>
            <h1 className="mt-6 text-[clamp(2.7rem,6.2vw,4.7rem)] font-semibold leading-[0.96] tracking-[-0.05em]">
              Ide mentah.
              <br />
              Blueprint siap.
            </h1>
            <p className="mt-7 max-w-md text-[15px] leading-7 text-ink/65">
              Tulis idemu. Jawab empat pertanyaan. Dapatkan lima dokumen teknis yang
              bisa langsung dipakai untuk membangun.
            </p>

            <div className="mt-10 grid max-w-lg grid-cols-1 gap-px border border-line bg-line sm:grid-cols-3">
              {STEPS.map(([number, title, body]) => (
                <div key={number} className="bg-paper p-4">
                  <span className="label text-blueprint">{number}</span>
                  <p className="mt-3 text-sm font-medium">{title}</p>
                  <p className="mt-1.5 text-xs leading-5 text-ink/65">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:pt-10">
            <NewProjectForm />
            <OpenFolderForm />
          </div>
        </section>

        <section className="py-14">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="label text-ink/65">Arsip / 02</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">Proyek</h2>
            </div>
            <span className="label pb-1 text-ink/65">
              {projects.length.toString().padStart(2, "0")} blueprint
            </span>
          </div>

          {projects.length === 0 ? (
            <div className="blueprint-grid mt-8 border border-line px-6 py-14 text-center">
              <p className="text-sm text-ink/65">
                Belum ada blueprint. Mulai dari ide di atas.
              </p>
            </div>
          ) : (
            <div className="mt-8 border-t border-line">
              {projects.map((project, index) => (
                <Link
                  key={project.id}
                  href={`/p/${project.id}`}
                  className="group grid grid-cols-[2rem_1fr_auto] items-start gap-4 border-b border-line py-5 transition-colors hover:bg-card sm:grid-cols-[2.5rem_1fr_8rem_2rem] sm:items-center"
                >
                  <span className="label pt-1 text-ink/65 sm:pt-0">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-[15px] font-medium tracking-[-0.01em]">
                        {project.name}
                      </span>
                      {project.folderPath ? (
                        <span className="label rounded border border-blueprint/30 bg-blueprint/5 px-1.5 py-0.2 text-[9px] text-blueprint">
                          LVP
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-1 block truncate text-xs text-ink/65">
                      {project.folderPath ? project.folderPath : project.idea}
                    </span>
                  </span>
                  <span className="hidden sm:block">
                    <span className={`label ${STATUS_TONE[project.status]}`}>
                      {STATUS_LABEL[project.status]}
                    </span>
                    <span className="mt-1.5 block font-mono text-[10px] text-ink/65">
                      {formatDate(project.updatedAt)}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="pt-0.5 text-right font-mono text-xs text-ink/65 transition-colors group-hover:text-blueprint sm:pt-0"
                  >
                    -&gt;
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <span className="label text-ink/65">Lazy Vibe Planner</span>
          <span className="label text-ink/65">Berjalan lokal</span>
        </div>
      </footer>
    </div>
  );
}
