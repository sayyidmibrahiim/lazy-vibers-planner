import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

export interface LvpState {
  schema_version: number;
  project: {
    slug: string;
    name: string;
    idea_raw: string;
    user_language: string;
    created_at: string;
    status: string;
  };
  pipeline: {
    sections: Record<
      string,
      {
        status: "pending" | "in_progress" | "done" | "blocked";
        record?: string;
        started_at?: string;
        completed_at?: string;
        answers?: Array<{ q: string; a: string; ts: string }>;
      }
    >;
    loop_backs?: Array<{
      id: string;
      reason: string;
      target_section: string;
      opened_at: string;
      resolved_at?: string;
    }>;
  };
  decisions: Array<{
    id: string;
    section: string;
    summary: string;
    rationale: string;
    status: "user_confirmed" | "assumed" | "designer_filled";
    recorded_at: string;
  }>;
  milestones: Array<{
    id: string;
    goal: string;
    features: string[];
    verified?: boolean;
    verified_at?: string | null;
  }>;
  deployment?: {
    status: "live" | "pending";
    url?: string;
    verified_at?: string;
  } | null;
  handoff?: {
    status: string;
    verified_at?: string;
  } | null;
}

export interface LvpDocItem {
  id: string;
  title: string;
  category: "overview" | "spec" | "bundle" | "recheck" | "brand";
  content: string;
  relativePath: string;
}

export interface LvpProjectDetail {
  folderPath: string;
  state: LvpState;
  blueprint: Record<string, unknown> | null;
  overviewMarkdown: string | null;
  docs: LvpDocItem[];
  journalCount: number;
}

const BUNDLE_FILES: Array<{ path: string; title: string; category: LvpDocItem["category"] }> = [
  { path: "OVERVIEW.md", title: "Overview (Owner View)", category: "overview" },
  { path: "SPEC/prd.md", title: "PRD", category: "spec" },
  { path: "SPEC/requirements.md", title: "Requirements", category: "spec" },
  { path: "SPEC/data-model.md", title: "Data Model", category: "spec" },
  { path: "SPEC/api.md", title: "API Contract", category: "spec" },
  { path: "SPEC/architecture.md", title: "Architecture", category: "spec" },
  { path: "USER_FLOWS.md", title: "User Flows", category: "bundle" },
  { path: "AGENTS.md", title: "Agents Guide", category: "bundle" },
  { path: "DECISIONS.md", title: "Decisions Log", category: "bundle" },
  { path: "SCOPE.md", title: "Scope & Parking Lot", category: "bundle" },
  { path: "MILESTONES.md", title: "Milestones", category: "bundle" },
  { path: "VERIFICATION.md", title: "Verification Procedures", category: "bundle" },
  { path: "ASSUMPTIONS.md", title: "Assumptions", category: "bundle" },
  { path: "RESEARCH.md", title: "Market & Stack Research", category: "bundle" },
  { path: "CODE_STYLE.md", title: "Code Style & Simplicity", category: "bundle" },
  { path: "SECURITY.md", title: "Security & Privacy", category: "bundle" },
  { path: "HANDOVER.md", title: "Handover & Ops", category: "bundle" },
  { path: "CAPABILITIES.md", title: "Capabilities & Boosters", category: "bundle" },
  { path: "HANDOFF-PROMPT.md", title: "Handoff Prompt", category: "bundle" },
];

export function readLvpProject(targetDir: string): LvpProjectDetail | null {
  const resolved = path.isAbsolute(targetDir)
    ? targetDir
    : path.resolve(/*turbopackIgnore: true*/ process.cwd(), targetDir);
  const statePath = path.join(resolved, ".lvp", "state.json");

  if (!existsSync(statePath)) return null;

  try {
    const rawState = readFileSync(statePath, "utf-8");
    const state = JSON.parse(rawState) as LvpState;

    // Blueprint JSON
    let blueprint: Record<string, unknown> | null = null;
    const bpPath = path.join(resolved, "blueprint.json");
    if (existsSync(bpPath)) {
      try {
        blueprint = JSON.parse(readFileSync(bpPath, "utf-8")) as Record<string, unknown>;
      } catch {
        blueprint = null;
      }
    }

    // Overview
    let overviewMarkdown: string | null = null;
    const overviewPath = path.join(resolved, "OVERVIEW.md");
    if (existsSync(overviewPath)) {
      overviewMarkdown = readFileSync(overviewPath, "utf-8");
    }

    const docs: LvpDocItem[] = [];

    // Bundle files
    for (const item of BUNDLE_FILES) {
      const filePath = path.join(resolved, item.path);
      if (existsSync(filePath)) {
        docs.push({
          id: item.path.replace(/\//g, "-").replace(/\.md$/, ""),
          title: item.title,
          category: item.category,
          content: readFileSync(filePath, "utf-8"),
          relativePath: item.path,
        });
      }
    }

    // Recheck reports (.lvp/recheck/*.md)
    const recheckDir = path.join(resolved, ".lvp", "recheck");
    if (existsSync(recheckDir)) {
      const files = readdirSync(recheckDir).filter((f) => f.endsWith(".md")).sort().reverse();
      for (const file of files) {
        docs.push({
          id: `recheck-${file.replace(/\.md$/, "")}`,
          title: `Audit: ${file.replace(/\.md$/, "")}`,
          category: "recheck",
          content: readFileSync(path.join(recheckDir, file), "utf-8"),
          relativePath: `.lvp/recheck/${file}`,
        });
      }
    }

    // Brand docs (brand/*.md)
    const brandDir = path.join(resolved, "brand");
    if (existsSync(brandDir)) {
      const files = readdirSync(brandDir).filter((f) => f.endsWith(".md")).sort();
      for (const file of files) {
        docs.push({
          id: `brand-${file.replace(/\.md$/, "")}`,
          title: `Brand: ${file.replace(/\.md$/, "")}`,
          category: "brand",
          content: readFileSync(path.join(brandDir, file), "utf-8"),
          relativePath: `brand/${file}`,
        });
      }
    }

    // Journal count
    let journalCount = 0;
    const journalPath = path.join(resolved, ".lvp", "journal.ndjson");
    if (existsSync(journalPath)) {
      const lines = readFileSync(journalPath, "utf-8").trim().split("\n");
      journalCount = lines.filter((line) => line.trim().length > 0).length;
    }

    return {
      folderPath: resolved,
      state,
      blueprint,
      overviewMarkdown,
      docs,
      journalCount,
    };
  } catch {
    return null;
  }
}
