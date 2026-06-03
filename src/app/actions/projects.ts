"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ─── GET ALL PROJECTS ───────────────────────────────────────────────
export async function getProjects() {
  const projects = await prisma.project.findMany({
    where: { deletedAt: null },
    include: {
      team: {
        include: { user: true },
      },
      tags: true,
      _count: {
        select: { tasks: true, assets: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return projects;
}

// ─── GET SINGLE PROJECT ─────────────────────────────────────────────
export async function getProject(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      team: { include: { user: true } },
      tasks: {
        where: { deletedAt: null },
        include: { assignee: true },
        orderBy: { updatedAt: "desc" },
      },
      assets: {
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
      },
      meetings: {
        include: { attendees: { include: { user: true } } },
        orderBy: { date: "desc" },
      },
      timelineUpdates: { orderBy: { createdAt: "desc" } },
      milestones: { orderBy: { date: "asc" } },
      tags: true,
      organization: true,
    },
  });

  return project;
}

// ─── CREATE PROJECT ─────────────────────────────────────────────────
export async function createProject(data: {
  name: string;
  description?: string;
  budget?: number;
  startDate?: string;
  endDate?: string;
  organizationId: string;
}) {
  const project = await prisma.project.create({
    data: {
      name: data.name,
      description: data.description,
      budget: data.budget,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      organizationId: data.organizationId,
    },
  });

  revalidatePath("/projects");
  return project;
}

// ─── UPDATE PROJECT ─────────────────────────────────────────────────
export async function updateProject(
  id: string,
  data: {
    name?: string;
    description?: string;
    status?: "ACTIVE" | "ON_HOLD" | "COMPLETED" | "AT_RISK";
    progress?: number;
    budget?: number;
    budgetUsed?: number;
  }
) {
  const project = await prisma.project.update({
    where: { id },
    data,
  });

  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
  return project;
}

// ─── DELETE (SOFT) PROJECT ──────────────────────────────────────────
export async function deleteProject(id: string) {
  await prisma.project.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/projects");
}

// ─── DASHBOARD STATS ────────────────────────────────────────────────
export async function getDashboardStats() {
  const [
    totalProjects,
    activeProjects,
    totalTasks,
    completedTasks,
    upcomingMeetings,
  ] = await Promise.all([
    prisma.project.count({ where: { deletedAt: null } }),
    prisma.project.count({ where: { deletedAt: null, status: "ACTIVE" } }),
    prisma.task.count({ where: { deletedAt: null } }),
    prisma.task.count({ where: { deletedAt: null, status: "DONE" } }),
    prisma.meeting.count({
      where: { date: { gte: new Date() }, status: "SCHEDULED" },
    }),
  ]);

  return {
    totalProjects,
    activeProjects,
    totalTasks,
    completedTasks,
    taskCompletionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    upcomingMeetings,
  };
}

// ─── MILESTONES ───────────────────────────────────────────────────────
export async function createMilestone(data: {
  name: string;
  date: string;
  projectId: string;
}) {
  const milestone = await prisma.milestone.create({
    data: {
      name: data.name,
      date: new Date(data.date),
      projectId: data.projectId,
    },
  });

  revalidatePath(`/projects/${data.projectId}`);
  revalidatePath("/timeline");
  return milestone;
}

export async function updateMilestone(id: string, data: { completed: boolean }) {
  const milestone = await prisma.milestone.update({
    where: { id },
    data: { completed: data.completed },
  });

  revalidatePath(`/projects/${milestone.projectId}`);
  revalidatePath("/timeline");
  return milestone;
}

export async function deleteMilestone(id: string) {
  const milestone = await prisma.milestone.delete({
    where: { id },
  });

  revalidatePath(`/projects/${milestone.projectId}`);
  revalidatePath("/timeline");
  return milestone;
}

// ─── ADD TEAM MEMBER ────────────────────────────────────────────────
export async function addTeamMember(data: {
  projectId: string;
  userId: string;
  role?: string;
}) {
  const member = await prisma.projectTeam.create({
    data: {
      projectId: data.projectId,
      userId: data.userId,
      role: data.role,
    },
    include: { user: true },
  });

  revalidatePath(`/projects/${data.projectId}`);
  revalidatePath("/projects");
  return member;
}

// ─── REMOVE TEAM MEMBER ─────────────────────────────────────────────
export async function removeTeamMember(id: string, projectId: string) {
  await prisma.projectTeam.delete({
    where: { id },
  });

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/projects");
}
