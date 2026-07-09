import { getShareDashboardSummary } from "@/lib/data/dashboard";
import { CommandCenterDashboard } from "@/components/dashboard/CommandCenterDashboard";
import { requireShareAccess } from "@/lib/shares/access";

export default async function ShareDashboardPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const share = await requireShareAccess(token);
  const data = await getShareDashboardSummary(share.companies.map((company) => company.id));

  return (
    <CommandCenterDashboard data={data} shareToken={token} readOnly />
  );
}
