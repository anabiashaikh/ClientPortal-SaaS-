"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ─── GET MEETINGS ───────────────────────────────────────────────────
export async function getMeetings(filter?: "upcoming" | "past") {
  const now = new Date();
  const where: Record<string, unknown> = {};

  if (filter === "upcoming") {
    where.date = { gte: now };
  } else if (filter === "past") {
    where.date = { lt: now };
  }

  const meetings = await prisma.meeting.findMany({
    where,
    include: {
      project: { select: { id: true, name: true } },
      attendees: { include: { user: true } },
      actionItems: true,
    },
    orderBy: { date: filter === "past" ? "desc" : "asc" },
  });

  return meetings;
}

// ─── CREATE MEETING ─────────────────────────────────────────────────
export async function createMeeting(data: {
  title: string;
  date: string;
  duration: number;
  type: string;
  link?: string;
  notes?: string;
  projectId: string;
  attendeeIds?: string[];
}) {
  const meeting = await prisma.meeting.create({
    data: {
      title: data.title,
      date: new Date(data.date),
      duration: data.duration,
      type: data.type,
      link: data.link,
      notes: data.notes,
      projectId: data.projectId,
      attendees: data.attendeeIds
        ? {
            create: data.attendeeIds.map((userId) => ({
              userId,
            })),
          }
        : undefined,
    },
  });

  revalidatePath("/meetings");
  return meeting;
}

// ─── UPDATE MEETING ─────────────────────────────────────────────────
export async function updateMeeting(
  id: string,
  data: {
    title?: string;
    date?: string;
    duration?: number;
    type?: string;
    status?: string;
    link?: string;
    notes?: string;
  }
) {
  const updateData: Record<string, unknown> = { ...data };
  if (data.date) {
    updateData.date = new Date(data.date);
  }

  const meeting = await prisma.meeting.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/meetings");
  return meeting;
}

// ─── DELETE MEETING ─────────────────────────────────────────────────
export async function deleteMeeting(id: string) {
  await prisma.meeting.delete({ where: { id } });
  revalidatePath("/meetings");
}

// ─── ADD ACTION ITEM ────────────────────────────────────────────────
export async function addActionItem(data: {
  content: string;
  meetingId: string;
}) {
  const actionItem = await prisma.actionItem.create({
    data: {
      content: data.content,
      meetingId: data.meetingId,
    },
  });

  revalidatePath("/meetings");
  return actionItem;
}

// ─── TOGGLE ACTION ITEM ─────────────────────────────────────────────
export async function toggleActionItem(id: string) {
  const item = await prisma.actionItem.findUnique({ where: { id } });
  if (!item) throw new Error("Action item not found");

  const updated = await prisma.actionItem.update({
    where: { id },
    data: { completed: !item.completed },
  });

  revalidatePath("/meetings");
  return updated;
}
