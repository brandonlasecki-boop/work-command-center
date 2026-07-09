import { listCompanies } from "@/lib/data/companies";
import { listProjects } from "@/lib/data/projects";
import { listDailyLogsEnriched } from "@/lib/data/daily-logs";
import { DailyLogList } from "@/components/daily-log/DailyLogList";
import { DailyLogForm } from "@/components/daily-log/DailyLogForm";
import { DailyLogFilters } from "@/components/daily-log/DailyLogFilters";

export default async function DailyLogPage({
  searchParams,
}: {
  searchParams: Promise<{ company?: string; project?: string; from?: string; to?: string }>;
}) {
  const params = await searchParams;
  const [companies, projects, logs] = await Promise.all([
    listCompanies(),
    listProjects(),
    listDailyLogsEnriched({
      companyId: params.company,
      projectId: params.project,
      fromDate: params.from,
      toDate: params.to,
    }),
  ]);

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Daily Log</h1>
        <p className="text-muted-foreground">Track completed work across all companies</p>
      </div>

      <DailyLogForm companies={companies} projects={projects} />

      <DailyLogFilters companies={companies} projects={projects} current={params} />

      <DailyLogList logs={logs} />
    </div>
  );
}
