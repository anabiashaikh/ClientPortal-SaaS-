import { getProjects } from "@/app/actions/projects";
import { getAssets, getFolders } from "@/app/actions/assets";
import { AssetsClient } from "./assets-client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AssetsPage() {
  const projects = await getProjects();
  const assets = await getAssets();
  
  // Get all folders from all projects
  const folders = await prisma.folder.findMany({
    include: {
      _count: { select: { assets: true } }
    },
    orderBy: { name: "asc" }
  });

  return (
    <AssetsClient 
      initialAssets={assets} 
      initialFolders={folders} 
      projects={projects} 
    />
  );
}
