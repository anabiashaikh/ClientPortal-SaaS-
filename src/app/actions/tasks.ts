"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ─── GET TASKS (optionally filtered) ────────────────────────────────
export async function getTasks(filters?: {
  projectId?: string;
  status?: string;
  priority?: string;
  assigneeId?: string;
}) {
  const where: Record<string, unknown> = { deletedAt: null };

  if (filters?.projectId) where.projectId = filters.projectId;
  if (filters?.status) where.status = filters.status;
  if (filters?.priority) where.priority = filters.priority;
  if (filters?.assigneeId) where.assigneeId = filters.assigneeId;

  const tasks = await prisma.task.findMany({
    where,
    include: {
      assignee: true,
      project: { select: { id: true, name: true } },
      _count: { select: { comments: true, subtasks: true } },
      tags: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return tasks;
}

// ─── CREATE TASK ────────────────────────────────────────────────────
export async function createTask(data: {
  title: string;
  description?: string;
  status?: "BACKLOG" | "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
  priority?: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  dueDate?: string;
  estimatedHours?: number;
  projectId: string;
  assigneeId?: string;
  parentId?: string;
}) {
  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status || "TODO",
      priority: data.priority || "MEDIUM",
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      estimatedHours: data.estimatedHours,
      projectId: data.projectId,
      assigneeId: data.assigneeId,
      parentId: data.parentId,
    },
  });

  revalidatePath("/tasks");
  revalidatePath(`/projects/${data.projectId}`);
  return task;
}

// ─── UPDATE TASK ────────────────────────────────────────────────────
export async function updateTask(
  id: string,
  data: {
    title?: string;
    description?: string;
    status?: "BACKLOG" | "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
    priority?: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    dueDate?: string | null;
    estimatedHours?: number;
    actualHours?: number;
    assigneeId?: string | null;
  }
) {
  const updateData: Record<string, unknown> = { ...data };
  if (data.dueDate !== undefined) {
    updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  }

  const task = await prisma.task.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/tasks");
  revalidatePath(`/projects/${task.projectId}`);
  return task;
}

// ─── DELETE TASK (SOFT) ─────────────────────────────────────────────
export async function deleteTask(id: string) {
  const task = await prisma.task.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/tasks");
  revalidatePath(`/projects/${task.projectId}`);
}

// ─── ADD COMMENT ────────────────────────────────────────────────────
export async function addComment(data: {
  content: string;
  taskId: string;
  userId: string;
}) {
  const comment = await prisma.comment.create({
    data: {
      content: data.content,
      taskId: data.taskId,
      userId: data.userId,
    },
    include: { user: true },
  });

  revalidatePath("/tasks");
  return comment;
}

// ─── GET COMMENTS FOR TASK ──────────────────────────────────────────
export async function getTaskComments(taskId: string) {
  const comments = await prisma.comment.findMany({
    where: { taskId },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return comments;
}
