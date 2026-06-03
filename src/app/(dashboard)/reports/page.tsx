import { getMonthlyRevenues } from "@/app/actions/reports";
import { ReportsClient } from "./reports-client";

export default async function ReportsPage() {
  const monthlyRevenues = await getMonthlyRevenues();
  return <ReportsClient monthlyRevenues={monthlyRevenues} />;
}
