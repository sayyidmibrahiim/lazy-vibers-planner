# LVP Pipeline Core — Spec Overview

Version: v0 draft (F1). Date: 2026-11-08. Decisions referenced: ADR-0001..0005, `GLOSSARY.md`.

## What LVP is

LVP (Lazy Vibe Planner) is a pipeline that turns a raw idea from a **non-technical user** into a complete, industry-grade blueprint bundle that **any AI agent harness** (Claude Code, Codex, Gemini CLI, zcode, Antigravity, Cursor) can execute to build the product. One folder = one idea = one product.

## Actors

| Actor | Description |
|---|---|
| **Owner** | The non-technical user. Speaks any language (User Language). Cannot read technical specs unaided. |
| **Conductor** | The LVP skill running in a harness (`/lvp-init-new-idea` or `/lvp-continue`). Loads boosters per Section, drives the interview, writes state. |
| **Builder** | Any agent harness that later consumes the Blueprint Bundle. Has no LVP skills; relies on bundle files only. |
| **Web UI** | Optional read-only client (MVP) that reads the same `.lvp/` files. Two-way editing is F3. |

## v0 scope

Shipped: `/lvp-init-new-idea`, `/lvp-continue`, `/lvp-handoff` (Sections S0–S9, bundle generation).
Not in v0 (stub contracts only): `/lvp-recheck-plan`, `/lvp-add-feature`, optional `/lvp-build`, `/lvp-personal-brand`.

## Spec files

1. `01-state.md` — `.lvp/` layout, `state.json` schema, journal events, section records, Folder Gate, checkpoint/resume semantics
2. `02-sections.md` — S0–S10 definitions, question strategy, routing table (Section → booster → output)
3. `03-skills.md` — contracts for the three v0 skills + v1 stubs + Constitution (`lvp-principles.md`)
4. `04-bundle.md` — Blueprint Bundle file specs, compilation order, `blueprint.json` schema
5. `05-boosters.md` — dependency model, tiers, bootstrap check, installers, failure UX

## Ground rules (from ADRs — summarized)

- State lives in **files** in the project folder; the web app is a client (ADR-0003).
- All pipeline artifacts are **English source of truth**; AI translates interaction into the user's language at runtime (ADR-0002).
- Boosters are **essential dependencies**, never optional garnish; NC-licensed skills are runtime dependencies only, never vendored into the repo (ADR-0001, ADR-0004).
- Skill external loading is **per Section** via the Conductor; every Section boundary produces a section record + checkpoint (ADR-0005).
- The pipeline is **honest**: evidence-first, anti-yes-man, assumptions flagged, "I don't know → research" allowed (Constitution).

## Non-goals for v0

- Two-way web UI, multi-user, auth.
- Version history of documents (state journal is audit log, not doc versioning).
- Executing the build (S10) — the bundle must be sufficient for any builder without LVP skills.
