import { getDashboardSummary } from "@/lib/data/dashboard";
import { TvModeClient } from "@/components/tv/TvModeClient";

export default async function TvPage() {
  const data = await getDashboardSummary();
  return <TvModeClient data={data} />;
}
