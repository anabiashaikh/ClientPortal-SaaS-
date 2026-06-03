"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ─── GET ALL USERS ──────────────────────────────────────────────────
export async function getUsers() {
  const users = await prisma.user.findMany({
    where: { deletedAt: null },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return users;
}

// ─── GET USER BY ID ─────────────────────────────────────────────────
export async function getUser(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      organizations: { include: { organization: true } },
      projects: { include: { project: true } },
      _count: { select: { tasks: true, comments: true } },
    },
  });

  return user;
}

// ─── UPDATE USER PROFILE ────────────────────────────────────────────
export async function updateUser(
  id: string,
  data: {
    name?: string;
    email?: string;
    image?: string;
    role?: "SUPER_ADMIN" | "ADMIN" | "TEAM_MEMBER" | "CLIENT";
  }
) {
  const user = await prisma.user.update({
    where: { id },
    data,
  });

  revalidatePath("/settings");
  return user;
}

// ─── CREATE ORGANIZATION ────────────────────────────────────────────
export async function createOrganization(data: {
  name: string;
  userId: string;
}) {
  const org = await prisma.organization.create({
    data: {
      name: data.name,
      users: {
        create: {
          userId: data.userId,
        },
      },
    },
  });

  return org;
}

// ─── GET ORGANIZATIONS ──────────────────────────────────────────────
export async function getOrganizations() {
  const orgs = await prisma.organization.findMany({
    include: {
      _count: { select: { users: true, projects: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return orgs;
}

// ─── AUDIT LOG ──────────────────────────────────────────────────────
export async function createAuditLog(data: {
  action: string;
  entity: string;
  entityId: string;
  userId: string;
  details?: any;
}) {
  await prisma.auditLog.create({
    data: {
      action: data.action,
      entity: data.entity,
      entityId: data.entityId,
      userId: data.userId,
      details: data.details || {},
    },
  });
}

// ─── GET RECENT ACTIVITY ────────────────────────────────────────────
export async function getRecentActivity(limit = 20) {
  const logs = await prisma.auditLog.findMany({
    include: { user: { select: { id: true, name: true, image: true } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return logs;
}
