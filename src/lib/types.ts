export type ProjectStatus = "interview" | "generating" | "ready" | "error";

export interface Project {
  id: string;
  name: string;
  idea: string;
  status: ProjectStatus;
  createdAt: number;
  updatedAt: number;
}

export interface Question {
  id: string;
  projectId: string;
  position: number;
  question: string;
  options: string[];
  answer: string | null;
}

export interface Doc {
  id: string;
  projectId: string;
  kind: string;
  title: string;
  content: string;
  position: number;
  updatedAt: number;
}
