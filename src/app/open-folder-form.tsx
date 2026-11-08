"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function OpenFolderForm() {
  const router = useRouter();
  const [folderPath, setFolderPath] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const path = folderPath.trim();
    if (!path) return;

    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/lvp/open", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folderPath: path }),
      });
      const data = (await response.json()) as { id?: string; error?: string };

      if (!response.ok || !data.id) {
        throw new Error(data.error ?? "Gagal membuka folder.");
      }

      router.push(`/p/${data.id}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Gagal membuka folder.");
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="mt-6 border border-line bg-card p-5 shadow-[4px_4px_0_0_rgba(25,24,18,0.04)]"
    >
      <div className="flex items-center justify-between border-b border-line pb-3">
        <label htmlFor="folderPath" className="label text-blueprint">
          Buka Folder LVP Lokal
        </label>
        <span className="label text-ink/65">.lvp/</span>
      </div>

      <p className="mt-3 text-xs leading-5 text-ink/65">
        Buka project yang dibuat lewat CLI (misal:{" "}
        <code className="bg-paper px-1 py-0.5">.scratch/lvp-core/dogfood/run</code> atau path folder lokal lain).
      </p>

      <div className="mt-3 flex gap-2">
        <input
          id="folderPath"
          type="text"
          value={folderPath}
          onChange={(event) => setFolderPath(event.target.value)}
          placeholder="Path folder project..."
          disabled={pending}
          className="flex-1 border border-line bg-paper px-3 py-2 font-mono text-xs outline-none transition-colors focus:border-ink/50"
        />
        <button
          type="submit"
          disabled={pending || !folderPath.trim()}
          className="bg-ink px-4 py-2 text-xs font-medium text-paper transition-colors hover:bg-blueprint disabled:opacity-50"
        >
          {pending ? "Membuka..." : "Buka"}
        </button>
      </div>

      {error ? <p className="mt-2 text-xs text-rust">{error}</p> : null}
    </form>
  );
}
