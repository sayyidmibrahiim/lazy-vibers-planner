"use client";

import Link from "next/link";
import { useState } from "react";
import { Markdown } from "@/components/markdown";
import type { LvpDocItem, LvpProjectDetail } from "@/lib/lvp-fs";

type Tab = "ringkasan" | "bundle" | "pipeline" | "audit_brand";

export function LvpProjectClient({
  detail,
}: {
  detail: LvpProjectDetail;
}) {
  const [tab, setTab] = useState<Tab>("ringkasan");
  const [activeDocId, setActiveDocId] = useState<string>(
    detail.docs[0]?.id ?? "",
  );
  const [copied, setCopied] = useState(false);

  const activeDoc = detail.docs.find((d) => d.id === activeDocId) ?? detail.docs[0] ?? null;

  async function copyDoc() {
    if (!activeDoc) return;
    try {
      await navigator.clipboard.writeText(activeDoc.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard not allowed
    }
  }

  const { state } = detail;
  const verifiedMilestonesCount = state.milestones.filter((m) => m.verified).length;
  const totalMilestonesCount = state.milestones.length;

  return (
    <div className="min-h-dvh">
      {/* Top Header */}
      <header className="border-b border-line bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-ink/65 hover:text-ink"
            >
              <span>&larr;</span> Semua project
            </Link>
            <span className="text-line">/</span>
            <span className="font-semibold tracking-tight">{state.project.name}</span>
            <span className="label rounded border border-blueprint/30 bg-blueprint/5 px-2 py-0.5 text-blueprint">
              {state.project.status}
            </span>
          </div>

          <div className="hidden items-center gap-6 font-mono text-xs text-ink/65 md:flex">
            <span>{detail.docs.length} dokumen</span>
            <span>
              Milestone: {verifiedMilestonesCount}/{totalMilestonesCount}
            </span>
            <span>{detail.journalCount} events</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mx-auto flex max-w-6xl gap-1 px-6">
          <button
            type="button"
            onClick={() => setTab("ringkasan")}
            className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === "ringkasan"
                ? "border-blueprint text-blueprint"
                : "border-transparent text-ink/65 hover:text-ink"
            }`}
          >
            Ringkasan
          </button>
          <button
            type="button"
            onClick={() => setTab("bundle")}
            className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === "bundle"
                ? "border-blueprint text-blueprint"
                : "border-transparent text-ink/65 hover:text-ink"
            }`}
          >
            Dokumen Bundle ({detail.docs.filter((d) => d.category !== "recheck" && d.category !== "brand").length})
          </button>
          <button
            type="button"
            onClick={() => setTab("pipeline")}
            className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === "pipeline"
                ? "border-blueprint text-blueprint"
                : "border-transparent text-ink/65 hover:text-ink"
            }`}
          >
            Pipeline & Keputusan ({state.decisions.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("audit_brand")}
            className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === "audit_brand"
                ? "border-blueprint text-blueprint"
                : "border-transparent text-ink/65 hover:text-ink"
            }`}
          >
            Audit & Brand ({detail.docs.filter((d) => d.category === "recheck" || d.category === "brand").length})
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        {tab === "ringkasan" && (
          <OverviewTab
            detail={detail}
            onSelectDoc={(id) => {
              setActiveDocId(id);
              setTab("bundle");
            }}
          />
        )}

        {tab === "bundle" && (
          <BundleDocsTab
            docs={detail.docs.filter((d) => d.category !== "recheck" && d.category !== "brand")}
            activeDoc={activeDoc}
            onSelectDoc={setActiveDocId}
            onCopy={copyDoc}
            copied={copied}
          />
        )}

        {tab === "pipeline" && <PipelineTab detail={detail} />}

        {tab === "audit_brand" && (
          <AuditBrandTab
            docs={detail.docs.filter((d) => d.category === "recheck" || d.category === "brand")}
            activeDoc={activeDoc}
            onSelectDoc={setActiveDocId}
            onCopy={copyDoc}
            copied={copied}
          />
        )}
      </main>
    </div>
  );
}

function OverviewTab({
  detail,
  onSelectDoc,
}: {
  detail: LvpProjectDetail;
  onSelectDoc: (id: string) => void;
}) {
  const { state, blueprint, overviewMarkdown } = detail;
  const stack = (blueprint?.stack as { components?: string[] })?.components ?? [];
  const costs = blueprint?.costs as { monthly_usd?: number; one_time_usd?: number } | undefined;
  const features = (blueprint?.features as Array<{ id: string; name: string; in_mvp?: boolean }>) ?? [];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <div className="border border-line bg-card p-6">
          <p className="label text-blueprint">Ide awal</p>
          <p className="mt-3 text-base leading-relaxed text-ink/85">{state.project.idea_raw}</p>
          <p className="mt-4 font-mono text-xs text-ink/65">
            Path folder: <code className="bg-paper px-1.5 py-0.5">{detail.folderPath}</code>
          </p>
        </div>

        {overviewMarkdown ? (
          <div className="border border-line bg-card p-6">
            <div className="mb-4 flex items-center justify-between border-b border-line pb-3">
              <span className="label text-ink/65">OVERVIEW.md</span>
              <button
                type="button"
                onClick={() => onSelectDoc("OVERVIEW")}
                className="text-xs text-blueprint hover:underline"
              >
                Lihat di bundle &rarr;
              </button>
            </div>
            <Markdown content={overviewMarkdown} />
          </div>
        ) : (
          <div className="border border-line bg-card p-6 text-sm text-ink/65">
            Dokumen OVERVIEW.md belum tersedia. Selesaikan pipeline sampai S9.
          </div>
        )}
      </div>

      {/* Aside Summary */}
      <aside className="space-y-6">
        {blueprint ? (
          <div className="border border-line bg-card p-5">
            <p className="label text-blueprint">Blueprint summary</p>

            {stack.length > 0 && (
              <div className="mt-4">
                <span className="text-xs font-medium text-ink/65">Stack:</span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {stack.map((c) => (
                    <span
                      key={c}
                      className="border border-line bg-paper px-2 py-0.5 font-mono text-xs"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {costs && (
              <div className="mt-4 border-t border-line pt-3 text-xs">
                <span className="font-medium text-ink/65">Estimasi Biaya:</span>
                <div className="mt-1 flex justify-between font-mono">
                  <span>Bulanan:</span>
                  <span className="font-semibold">${costs.monthly_usd ?? 0}</span>
                </div>
                <div className="mt-1 flex justify-between font-mono">
                  <span>Satu kali:</span>
                  <span className="font-semibold">${costs.one_time_usd ?? 0}</span>
                </div>
              </div>
            )}

            {features.length > 0 && (
              <div className="mt-4 border-t border-line pt-3">
                <span className="text-xs font-medium text-ink/65">
                  Fitur ({features.filter((f) => f.in_mvp).length} in-MVP):
                </span>
                <ul className="mt-2 space-y-1 text-xs">
                  {features.slice(0, 6).map((f) => (
                    <li key={f.id} className="flex items-center gap-1.5">
                      <span className="font-mono text-blueprint">{f.id}</span>
                      <span className="truncate">{f.name}</span>
                    </li>
                  ))}
                  {features.length > 6 && (
                    <li className="font-mono text-[11px] text-ink/65">
                      +{features.length - 6} fitur lainnya di SCOPE.md
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        ) : null}

        {/* Milestone Card */}
        <div className="border border-line bg-card p-5">
          <p className="label text-ink/65">Milestones progress</p>
          <div className="mt-3 space-y-2">
            {state.milestones.map((m) => (
              <div
                key={m.id}
                className="flex items-start justify-between gap-2 border-b border-line/60 pb-2 text-xs"
              >
                <div>
                  <span className="font-mono font-semibold text-blueprint">{m.id}</span>
                  <p className="text-ink/80">{m.goal}</p>
                </div>
                <span
                  className={`label shrink-0 ${
                    m.verified ? "text-blueprint" : "text-ink/65"
                  }`}
                >
                  {m.verified ? "Verified" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

function BundleDocsTab({
  docs,
  activeDoc,
  onSelectDoc,
  onCopy,
  copied,
}: {
  docs: LvpDocItem[];
  activeDoc: LvpDocItem | null;
  onSelectDoc: (id: string) => void;
  onCopy: () => void;
  copied: boolean;
}) {
  const specDocs = docs.filter((d) => d.category === "spec");
  const otherDocs = docs.filter((d) => d.category !== "spec");

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      {/* Sidebar Doc List */}
      <aside className="border border-line bg-card p-3">
        <p className="label px-3 py-2 text-blueprint">SPEC Documents</p>
        <nav className="space-y-0.5">
          {specDocs.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => onSelectDoc(d.id)}
              className={`w-full text-left px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeDoc?.id === d.id
                  ? "bg-blueprint text-paper"
                  : "text-ink/75 hover:bg-paper"
              }`}
            >
              {d.title}
            </button>
          ))}
        </nav>

        <p className="label mt-4 px-3 py-2 text-ink/65">Bundle Files</p>
        <nav className="space-y-0.5">
          {otherDocs.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => onSelectDoc(d.id)}
              className={`w-full text-left px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeDoc?.id === d.id
                  ? "bg-blueprint text-paper"
                  : "text-ink/75 hover:bg-paper"
              }`}
            >
              {d.title}
            </button>
          ))}
        </nav>
      </aside>

      {/* Doc Viewer */}
      <div className="border border-line bg-card p-6">
        {activeDoc ? (
          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">{activeDoc.title}</h2>
                <p className="font-mono text-xs text-ink/65">{activeDoc.relativePath}</p>
              </div>
              <button
                type="button"
                onClick={onCopy}
                className="inline-flex items-center gap-1.5 border border-line bg-paper px-3 py-1.5 text-xs font-medium text-ink hover:border-ink/40"
              >
                {copied ? "Tersalin!" : "Salin markdown"}
              </button>
            </div>
            <Markdown content={activeDoc.content} />
          </div>
        ) : (
          <p className="text-sm text-ink/65">Pilih dokumen untuk membaca.</p>
        )}
      </div>
    </div>
  );
}

function PipelineTab({ detail }: { detail: LvpProjectDetail }) {
  const { state } = detail;
  const sections = [
    { key: "S0", name: "Intake", desc: "Penerimaan ide & verifikasi Folder Gate" },
    { key: "S1", name: "Context", desc: "Masalah, target pengguna, bentuk platform" },
    { key: "S2", name: "Kondisi", desc: "Perangkat, akun, hosting, batas budget" },
    { key: "S3", name: "Data & Privasi", desc: "Login, data pribadi, payment, legalitas" },
    { key: "S4", name: "Fitur", desc: "Katalog fitur interaktif & ekspektasi" },
    { key: "S5", name: "Deep Research", desc: "Scan kompetitor, opsi stack, tabel biaya" },
    { key: "S6", name: "Feasibility Loop", desc: "Uji kelayakan, mitigasi risiko & konflik" },
    { key: "S7", name: "Scope Lock", desc: "Pembekuan MVP vs Parking Lot" },
    { key: "S8", name: "Milestone Plan", desc: "Pembagian M0..Mn & verifikasi" },
    { key: "S9", name: "Doc Generation", desc: "Kompilasi 20 dokumen bundle" },
  ];

  return (
    <div className="space-y-8">
      {/* Sections Grid */}
      <section className="border border-line bg-card p-6">
        <h3 className="label text-blueprint">Sections S0–S9 Progress</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {sections.map((s) => {
            const secState = state.pipeline.sections[s.key];
            const status = secState?.status ?? "pending";
            return (
              <div
                key={s.key}
                className="border border-line/60 bg-paper p-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-semibold text-blueprint">{s.key}</span>
                  <span
                    className={`label text-[9px] ${
                      status === "done"
                        ? "text-blueprint"
                        : status === "in_progress"
                          ? "text-rust"
                          : "text-ink/65"
                    }`}
                  >
                    {status}
                  </span>
                </div>
                <p className="mt-1 font-medium text-ink">{s.name}</p>
                <p className="mt-0.5 text-[11px] text-ink/65 leading-tight">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Decisions Log */}
      <section className="border border-line bg-card p-6">
        <h3 className="label text-blueprint">Decisions Log ({state.decisions.length})</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-line font-mono text-ink/65">
              <tr>
                <th className="py-2 pr-3">ID</th>
                <th className="py-2 pr-3">Sec</th>
                <th className="py-2 pr-4">Summary</th>
                <th className="py-2 pr-4">Rationale</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {state.decisions.map((d) => (
                <tr key={d.id}>
                  <td className="py-2.5 pr-3 font-mono text-blueprint font-medium">{d.id}</td>
                  <td className="py-2.5 pr-3 font-mono text-ink/65">{d.section}</td>
                  <td className="py-2.5 pr-4 font-medium text-ink">{d.summary}</td>
                  <td className="py-2.5 pr-4 text-ink/75 leading-relaxed">{d.rationale}</td>
                  <td className="py-2.5">
                    <span
                      className={`label text-[10px] ${
                        d.status === "user_confirmed"
                          ? "text-blueprint"
                          : "text-rust"
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function AuditBrandTab({
  docs,
  activeDoc,
  onSelectDoc,
  onCopy,
  copied,
}: {
  docs: LvpDocItem[];
  activeDoc: LvpDocItem | null;
  onSelectDoc: (id: string) => void;
  onCopy: () => void;
  copied: boolean;
}) {
  const recheckDocs = docs.filter((d) => d.category === "recheck");
  const brandDocs = docs.filter((d) => d.category === "brand");

  if (docs.length === 0) {
    return (
      <div className="border border-line bg-card p-12 text-center">
        <p className="label text-ink/65">Belum Ada Artefak Audit atau Brand</p>
        <p className="mt-3 text-sm text-ink/75">
          Jalankan <code>/lvp-recheck-plan</code> untuk audit adversarial atau <code>/lvp-personal-brand</code> untuk brand kit setelah produk live.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      {/* Sidebar Doc List */}
      <aside className="border border-line bg-card p-3">
        {recheckDocs.length > 0 && (
          <>
            <p className="label px-3 py-2 text-blueprint">Recheck Audits</p>
            <nav className="space-y-0.5">
              {recheckDocs.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => onSelectDoc(d.id)}
                  className={`w-full text-left px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    activeDoc?.id === d.id
                      ? "bg-blueprint text-paper"
                      : "text-ink/75 hover:bg-paper"
                  }`}
                >
                  {d.title}
                </button>
              ))}
            </nav>
          </>
        )}

        {brandDocs.length > 0 && (
          <>
            <p className="label mt-4 px-3 py-2 text-rust">Personal Brand Kit</p>
            <nav className="space-y-0.5">
              {brandDocs.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => onSelectDoc(d.id)}
                  className={`w-full text-left px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    activeDoc?.id === d.id
                      ? "bg-blueprint text-paper"
                      : "text-ink/75 hover:bg-paper"
                  }`}
                >
                  {d.title}
                </button>
              ))}
            </nav>
          </>
        )}
      </aside>

      {/* Doc Viewer */}
      <div className="border border-line bg-card p-6">
        {activeDoc ? (
          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">{activeDoc.title}</h2>
                <p className="font-mono text-xs text-ink/65">{activeDoc.relativePath}</p>
              </div>
              <button
                type="button"
                onClick={onCopy}
                className="inline-flex items-center gap-1.5 border border-line bg-paper px-3 py-1.5 text-xs font-medium text-ink hover:border-ink/40"
              >
                {copied ? "Tersalin!" : "Salin markdown"}
              </button>
            </div>
            <Markdown content={activeDoc.content} />
          </div>
        ) : (
          <p className="text-sm text-ink/65">Pilih dokumen untuk membaca.</p>
        )}
      </div>
    </div>
  );
}
