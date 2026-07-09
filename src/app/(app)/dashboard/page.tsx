import { getDashboardSummary } from "@/lib/data/dashboard";
import { CommandCenterDashboard } from "@/components/dashboard/CommandCenterDashboard";

export default async function DashboardPage() {
  const data = await getDashboardSummary();

  return <CommandCenterDashboard data={data} />;
}
