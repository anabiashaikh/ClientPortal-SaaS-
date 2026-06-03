"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ─── GET ASSETS ─────────────────────────────────────────────────────
export async function getAssets(projectId?: string) {
  const where: Record<string, unknown> = { deletedAt: null };
  if (projectId) where.projectId = projectId;

  const assets = await prisma.asset.findMany({
    where,
    include: {
      project: { select: { id: true, name: true } },
      folder: { select: { id: true, name: true } },
      versions: { orderBy: { version: "desc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  return assets;
}

// ─── CREATE ASSET RECORD ────────────────────────────────────────────
export async function createAsset(data: {
  name: string;
  url: string;
  size: number;
  type: string;
  projectId: string;
  folderId?: string;
}) {
  const asset = await prisma.asset.create({
    data: {
      name: data.name,
      url: data.url,
      size: data.size,
      type: data.type,
      projectId: data.projectId,
      folderId: data.folderId,
      versions: {
        create: {
          url: data.url,
          size: data.size,
          version: 1,
        },
      },
    },
  });

  revalidatePath("/assets");
  revalidatePath(`/projects/${data.projectId}`);
  return asset;
}

// ─── DELETE ASSET (SOFT) ────────────────────────────────────────────
export async function deleteAssetRecord(id: string) {
  const asset = await prisma.asset.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/assets");
  revalidatePath(`/projects/${asset.projectId}`);
}

// ─── CREATE FOLDER ──────────────────────────────────────────────────
export async function createFolder(data: {
  name: string;
  projectId: string;
  parentId?: string;
}) {
  const folder = await prisma.folder.create({
    data: {
      name: data.name,
      projectId: data.projectId,
      parentId: data.parentId,
    },
  });

  revalidatePath("/assets");
  return folder;
}

// ─── GET FOLDERS ────────────────────────────────────────────────────
export async function getFolders(projectId: string) {
  const folders = await prisma.folder.findMany({
    where: { projectId },
    include: {
      _count: { select: { assets: true, children: true } },
    },
    orderBy: { name: "asc" },
  });

  return folders;
}

// ─── UPLOAD NEW VERSION ─────────────────────────────────────────────
export async function createAssetVersion(data: {
  assetId: string;
  url: string;
  size: number;
}) {
  // Get the latest version number
  const latestVersion = await prisma.assetVersion.findFirst({
    where: { assetId: data.assetId },
    orderBy: { version: "desc" },
  });

  const nextVersion = (latestVersion?.version || 0) + 1;

  const version = await prisma.assetVersion.create({
    data: {
      assetId: data.assetId,
      url: data.url,
      size: data.size,
      version: nextVersion,
    },
  });

  // Update the main asset URL and size to the latest version
  await prisma.asset.update({
    where: { id: data.assetId },
    data: { url: data.url, size: data.size },
  });

  revalidatePath("/assets");
  return version;
}
