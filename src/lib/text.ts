export function cleanMarkdown(text: string): string {
  return text
    .trim()
    .replace(/^```(?:markdown|md)?\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui.";
}

/** Pastikan H1 pertama selalu sama dengan judul yang disimpan di database. */
export function ensureTitle(markdown: string, title: string): string {
  const text = markdown.trim();
  const lines = text.split("\n");
  const index = lines.findIndex((line) => /^#\s+/.test(line));

  if (index === -1) return `# ${title}\n\n${text}`;

  lines[index] = `# ${title}`;
  return lines.join("\n");
}
