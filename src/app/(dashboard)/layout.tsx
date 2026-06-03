import AppLayout from "@/components/layout/AppLayout";
import { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return <AppLayout>{children}</AppLayout>;
}
