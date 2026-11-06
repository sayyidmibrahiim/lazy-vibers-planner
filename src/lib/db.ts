import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import type { Doc, Project, ProjectStatus, Question } from "./types";

const globalForDb = globalThis as unknown as { __lvpDb?: DatabaseSync };

function openDb(): DatabaseSync {
  const file = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "planner.db");
  mkdirSync(path.dirname(file), { recursive: true });

  const db = new DatabaseSync(file);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      idea TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'interview',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      position INTEGER NOT NULL,
      question TEXT NOT NULL,
      options TEXT NOT NULL,
      answer TEXT,
      UNIQUE(project_id, position)
    );

    CREATE TABLE IF NOT EXISTS docs (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      kind TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      position INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      UNIQUE(project_id, kind)
    );

    CREATE INDEX IF NOT EXISTS idx_docs_project ON docs(project_id, position);
  `);

  return db;
}

export function getDb(): DatabaseSync {
  if (!globalForDb.__lvpDb) globalForDb.__lvpDb = openDb();
  return globalForDb.__lvpDb;
}

type ProjectRow = {
  id: string;
  name: string;
  idea: string;
  status: ProjectStatus;
  created_at: number;
  updated_at: number;
};

type QuestionRow = {
  id: string;
  project_id: string;
  position: number;
  question: string;
  options: string;
  answer: string | null;
};

type DocRow = {
  id: string;
  project_id: string;
  kind: string;
  title: string;
  content: string;
  position: number;
  updated_at: number;
};

function toProject(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    idea: row.idea,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toQuestion(row: QuestionRow): Question {
  return {
    id: row.id,
    projectId: row.project_id,
    position: row.position,
    question: row.question,
    options: JSON.parse(row.options) as string[],
    answer: row.answer,
  };
}

function toDoc(row: DocRow): Doc {
  return {
    id: row.id,
    projectId: row.project_id,
    kind: row.kind,
    title: row.title,
    content: row.content,
    position: row.position,
    updatedAt: row.updated_at,
  };
}

export function createProject(name: string, idea: string): string {
  const id = randomUUID();
  const now = Date.now();
  getDb()
    .prepare("INSERT INTO projects (id, name, idea, status, created_at, updated_at) VALUES (?, ?, ?, 'interview', ?, ?)")
    .run(id, name, idea, now, now);
  return id;
}

export function addQuestions(
  projectId: string,
  questions: Array<{ question: string; options: string[] }>,
): void {
  const db = getDb();
  const insert = db.prepare(
    "INSERT INTO questions (id, project_id, position, question, options) VALUES (?, ?, ?, ?, ?)",
  );
  db.exec("BEGIN");
  try {
    questions.forEach((q, index) => {
      insert.run(randomUUID(), projectId, index, q.question, JSON.stringify(q.options));
    });
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function listProjects(): Project[] {
  const rows = getDb()
    .prepare("SELECT * FROM projects ORDER BY updated_at DESC")
    .all() as unknown as ProjectRow[];
  return rows.map(toProject);
}

export function getProject(id: string): Project | null {
  const row = getDb().prepare("SELECT * FROM projects WHERE id = ?").get(id) as
    | ProjectRow
    | undefined;
  return row ? toProject(row) : null;
}

export function getQuestions(projectId: string): Question[] {
  const rows = getDb()
    .prepare("SELECT * FROM questions WHERE project_id = ? ORDER BY position ASC")
    .all(projectId) as unknown as QuestionRow[];
  return rows.map(toQuestion);
}

export function getDocs(projectId: string): Doc[] {
  const rows = getDb()
    .prepare("SELECT * FROM docs WHERE project_id = ? ORDER BY position ASC")
    .all(projectId) as unknown as DocRow[];
  return rows.map(toDoc);
}

export function getDoc(id: string): Doc | null {
  const row = getDb().prepare("SELECT * FROM docs WHERE id = ?").get(id) as
    | DocRow
    | undefined;
  return row ? toDoc(row) : null;
}

export function saveAnswers(projectId: string, answers: Record<string, string>): void {
  const db = getDb();
  const update = db.prepare("UPDATE questions SET answer = ? WHERE id = ? AND project_id = ?");
  db.exec("BEGIN");
  try {
    for (const [questionId, answer] of Object.entries(answers)) {
      update.run(answer.trim() || null, questionId, projectId);
    }
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function setStatus(projectId: string, status: ProjectStatus): void {
  getDb()
    .prepare("UPDATE projects SET status = ?, updated_at = ? WHERE id = ?")
    .run(status, Date.now(), projectId);
}

export function touchProject(projectId: string): void {
  getDb().prepare("UPDATE projects SET updated_at = ? WHERE id = ?").run(Date.now(), projectId);
}

export function upsertDoc(input: {
  projectId: string;
  kind: string;
  title: string;
  content: string;
  position: number;
}): Doc {
  const db = getDb();
  const now = Date.now();
  const existing = db
    .prepare("SELECT * FROM docs WHERE project_id = ? AND kind = ?")
    .get(input.projectId, input.kind) as DocRow | undefined;

  if (existing) {
    db.prepare("UPDATE docs SET content = ?, title = ?, updated_at = ? WHERE id = ?").run(
      input.content,
      input.title,
      now,
      existing.id,
    );
    return { ...toDoc(existing), content: input.content, title: input.title, updatedAt: now };
  }

  const id = randomUUID();
  db.prepare(
    "INSERT INTO docs (id, project_id, kind, title, content, position, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
  ).run(id, input.projectId, input.kind, input.title, input.content, input.position, now);

  return {
    id,
    projectId: input.projectId,
    kind: input.kind,
    title: input.title,
    content: input.content,
    position: input.position,
    updatedAt: now,
  };
}

export function updateDocContent(id: string, content: string): Doc | null {
  const db = getDb();
  db.prepare("UPDATE docs SET content = ?, updated_at = ? WHERE id = ?").run(
    content,
    Date.now(),
    id,
  );
  return getDoc(id);
}
