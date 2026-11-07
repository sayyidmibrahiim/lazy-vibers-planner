# AGENTS.md

Local-only Next.js 16 app: idea -> 4 interview questions -> 5 generated markdown docs (PRD, requirements, data model, API contract, architecture) via an OpenAI-compatible LLM proxy. Single user, no auth, no tests, no CI.

## Commands

- Node 24+ required (`node:sqlite`); verified on 24.18.1.
- `npm install` then `npm run dev` (port 3000). Copy `.env.example` to `.env.local` only to override defaults.
- `npm run lint` = bare `eslint` (flat config, whole repo). No Prettier, no fix script.
- Typecheck: `npx tsc --noEmit`. In a fresh checkout run `npm run build` (or `next dev`) once first: `next-env.d.ts` imports generated `.next/types/routes.d.ts`, so `tsc` fails before those exist.
- `npm run build` then `npm start` for production. The build runs TypeScript itself.
- No test runner installed. Verify manually: `curl -sN -X POST localhost:3000/api/projects/<id>/blueprint -H 'content-type: application/json' -d '{"answers":{}}'` prints the NDJSON progress stream.
- The LLM proxy at `127.0.0.1:17070` must be up to exercise project creation or generation; failures surface as 502.

## Hard constraints

- Any page or route touching SQLite needs `export const runtime = "nodejs"`; data pages/routes also need `export const dynamic = "force-dynamic"`. Missing either breaks the build (`node:sqlite` unavailable, or DB read during prerender).
- Tailwind v4 is wired as a Turbopack loader rule in `next.config.ts` (`@tailwindcss/turbopack`); there is no postcss or tailwind config. Keep Turbopack (default in Next 16) and do not add a PostCSS setup.
- Use theme tokens from `@theme inline` in `src/app/globals.css` (`paper`, `card`, `ink`, `line`, `blueprint`, `rust`) via classes like `text-ink/65`, `border-line`. No raw hex or default gray palette.
- `src/lib/llm.ts` reads `LLM_BASE_URL`, `LLM_MODEL`, `LLM_API_KEY` at module load: restart the dev server after changing `.env.local`. `DATABASE_PATH` is read on first DB access.
- `src/lib/db.ts` is a `globalThis.__lvpDb` singleton, WAL mode, schema created inline with `CREATE TABLE IF NOT EXISTS`. No migration system: a schema change does not reach an existing `data/planner.db` (gitignored, holds real local projects). Add an idempotent migration rather than telling users to delete it.
- DB columns are snake_case, JSON is camelCase; timestamps are epoch ms. Row converters in `db.ts` own that mapping.

## Blueprint pipeline invariants

- A doc kind lives in three files: `src/lib/kinds.ts` (union type), `src/lib/doc-list.ts` (array order becomes `position`), `src/lib/blueprint.ts` (`BRIEFS` is an exhaustive `Record<DocKind, string>`). Add all three or TypeScript fails.
- `POST /api/projects/[id]/blueprint` streams NDJSON events (`doc_start`, `doc_done`, `done`, `error`); the only consumer is `src/app/p/[id]/project-client.tsx`. Change both sides together.
- Generation is resumable and idempotent per kind: existing docs are skipped, `upsertDoc` overwrites by `(project_id, kind)`. Do not "regenerate all" to retry a partial run.
- Truncation handling is duplicated (blueprint and revise routes): on `finishReason === "length"` retry once with a compaction prompt, then throw. Keep both copies in sync.
- Pass model output through `cleanMarkdown` (strips fences) and `ensureTitle` (forces H1 to the stored title) before saving; prompt rules assume GFM and no Mermaid.
- `chatDetailed` retries 3x with backoff on any failure including 4xx; `chatJson` retries once by re-prompting after invalid JSON. Requests set `stream: false` but the proxy may still answer with SSE, which `readSse` handles.

## Conventions

- User-facing copy, validation/error messages, and LLM prompts are Bahasa Indonesia (`<html lang="id">`, Indonesian README). Prompts require output language to match the user's idea language. Do not translate UI strings, prompts, or error text to English when editing them.
- Route error mapping: 400 validation, 404 missing record, 502 LLM or parse failure. Error bodies are `{ error: string }` in Indonesian.
- No auth by design; this is a local tool. Do not add auth or multi-user state unless asked. README documents loopback binding for exposure.
- Route handler `params` are Promises in Next 16 (`await params`); layouts use the generated global `LayoutProps<"/">` type.

## Agent skills

### Issue tracker

Issues live as local markdown files under `.scratch/<feature-slug>/` (spec + one file per ticket). See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary used as-is: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `GLOSSARY.md` at the repo root + `docs/adr/`. See `docs/agents/domain.md`.

### LVP pipeline

The skills under `skills/` (entry: `skills/lvp-init-new-idea/SKILL.md`) are the LVP interview pipeline; their contracts and constitution are specified in `docs/spec/` (start at `00-overview.md`, skill contracts in `03-skills.md`). Install/uninstall docs live in `skills/README.md`; do not edit skill folders without syncing their `references/` snapshots with `docs/spec/`.
