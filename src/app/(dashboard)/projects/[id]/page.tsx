import { getProject } from "@/app/actions/projects";
import { ProjectDetailClient } from "./project-detail-client";
import { notFound } from "next/navigation";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const project = await getProject(resolvedParams.id);
  
  if (!project) {
    notFound();
  }

  return <ProjectDetailClient project={project} />;
}
