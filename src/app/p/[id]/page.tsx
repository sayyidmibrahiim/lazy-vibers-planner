import { notFound } from "next/navigation";
import { getDocs, getProject, getQuestions } from "@/lib/db";
import { ProjectClient } from "./project-client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProject(id);

  if (!project) notFound();

  return (
    <ProjectClient
      project={project}
      questions={getQuestions(id)}
      docs={getDocs(id)}
    />
  );
}
