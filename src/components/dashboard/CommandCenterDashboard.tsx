import Link from "next/link";
import { CommandCenterHeader } from "@/components/dashboard/CommandCenterHeader";
import { CompanyOverviewCard } from "@/components/dashboard/CompanyOverviewCard";
import { TodaysWinsPanel } from "@/components/dashboard/TodaysWinsPanel";
import { RecentActivityPanel } from "@/components/dashboard/RecentActivityPanel";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { MissionControlFooter } from "@/components/dashboard/MissionControlFooter";
import { GlassCard } from "@/components/ui/glass-card";
import { NewCompanyButton } from "@/components/companies/CompanyForm";
import type { DashboardSummary } from "@/lib/types/database";

export function CommandCenterDashboard({ data }: { data: DashboardSummary }) {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <CommandCenterHeader winsToday={data.todayLogs.length} />
        </div>
        <NewCompanyButton />
      </div>

      <section>
        {data.companies.length === 0 ? (
          <GlassCard className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-4 text-4xl">🏢</div>
            <h3 className="text-lg font-semibold">No companies yet</h3>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Add 360 Medical, WoundCare 360, BCMD, and OAF Nation to get started — or run the
              seed migration to pre-populate them.
            </p>
          </GlassCard>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {data.companies.map((company) => (
              <CompanyOverviewCard
                key={company.id}
                company={company}
                todayLogs={data.todayLogs}
              />
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-3">
          <TodaysWinsPanel logs={data.todayLogs} />
        </div>
        <div className="xl:col-span-5">
          <RecentActivityPanel logs={data.recentWins} />
        </div>
        <div className="xl:col-span-4">
          <DashboardSidebar
            companies={data.companies}
            activeProjects={data.activeProjects}
            focusItems={data.focusItems}
            todayStats={data.todayStats}
          />
        </div>
      </div>

      <MissionControlFooter
        companies={data.companies}
        activeProjects={data.activeProjects}
        todayLogs={data.todayLogs}
      />
    </div>
  );
}

export function EmptyCompaniesPrompt() {
  return (
    <GlassCard className="p-6 text-center">
      <p className="text-sm text-muted-foreground">
        No active projects yet.{" "}
        <Link href="/companies" className="text-indigo-400 hover:underline">
          Add a company and project
        </Link>{" "}
        to get started.
      </p>
    </GlassCard>
  );
}
