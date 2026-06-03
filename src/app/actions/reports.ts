"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const SEED_DATA = [
  { month: "2026-01", revenue: 28000, expenses: 9500 },
  { month: "2026-02", revenue: 31500, expenses: 11000 },
  { month: "2026-03", revenue: 27800, expenses: 10200 },
  { month: "2026-04", revenue: 34000, expenses: 12500 },
  { month: "2026-05", revenue: 38500, expenses: 13800 },
];

export async function getMonthlyRevenues() {
  const records = await prisma.monthlyRevenue.findMany({
    orderBy: { month: "asc" },
  });

  if (records.length === 0) {
    // Seed initial data if empty
    await prisma.monthlyRevenue.createMany({ data: SEED_DATA });
    return await prisma.monthlyRevenue.findMany({ orderBy: { month: "asc" } });
  }

  return records;
}

export async function saveMonthlyRevenue(
  month: string,
  revenue: number,
  expenses: number,
  id?: string
) {
  if (id) {
    // Update existing record
    await prisma.monthlyRevenue.update({
      where: { id },
      data: { month, revenue, expenses },
    });
  } else {
    // Create or update by month
    await prisma.monthlyRevenue.upsert({
      where: { month },
      update: { revenue, expenses },
      create: { month, revenue, expenses },
    });
  }
  revalidatePath("/reports");
}

export async function deleteMonthlyRevenue(id: string) {
  await prisma.monthlyRevenue.delete({ where: { id } });
  revalidatePath("/reports");
}
