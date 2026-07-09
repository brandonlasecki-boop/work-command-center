import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { listProjectsByCompany } from "@/lib/data/projects";
import { listWorkItemsByProject } from "@/lib/data/work-items";
import { listDailyLogsEnriched } from "@/lib/data/daily-logs";
import { enrichProjectsWithProgress, calcCompanyProgress, calcCompanyProgressDeltas } from "@/lib/progress/calculate";
import { requireShareCompanyAccess } from "@/lib/shares/access";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { OngoingSupportSection } from "@/components/companies/OngoingSupportSection";
import { DailyLogList } from "@/components/daily-log/DailyLogList";
import { OngoingSupportBadge } from "@/components/ui/status-badge";
import { ProgressWithTrend } from "@/components/ui/progress-with-trend";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";

export default async function ShareCompanyPage({
  params,
}: {
  params: Promise<{ token: string; companyId: string }>;
}) {
  const { token, companyId } = await params;
  const share = await requireShareCompanyAccess(token, companyId);
  const company = share.companies.find((item) => item.id === companyId);
  if (!company) return null;

  const projects = await listProjectsByCompany(company.id);
  const workItemsByProject = new Map<string, Awaited<ReturnType<typeof listWorkItemsByProject>>>();
  for (const project of projects) {
    workItemsByProject.set(project.id, await listWorkItemsByProject(project.id));
  }
  const projectsWithProgress = enrichProjectsWithProgress(projects, workItemsByProject);
  const progress = calcCompanyProgress(projectsWithProgress);
  const progressDeltas = calcCompanyProgressDeltas(projectsWithProgress, workItemsByProject);
  const recentLogs = await listDailyLogsEnriched({ companyId: company.id, logType: "general" });
  const supportLogs = company.is_ongoing_support
    ? await listDailyLogsEnriched({ companyId: company.id, logType: "support" })
    : [];
  const backHref = share.companies.length > 1 ? `/share/${token}` : null;

  return (
    <div
      className="animate-fade-in w-full min-w-0 space-y-6 xl:space-y-8"
      style={{ "--company-accent": company.color } as React.CSSProperties}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
          {backHref && (
            <Link href={backHref}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          )}
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            {company.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={company.logo_url}
                alt={company.name}
                className="h-12 w-12 shrink-0 rounded-2xl object-cover sm:h-14 sm:w-14"
              />
            ) : (
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white sm:h-14 sm:w-14"
                style={{ backgroundColor: company.color }}
              >
                {company.name.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="break-words text-2xl font-bold sm:text-3xl">{company.name}</h1>
                {company.is_ongoing_support && <OngoingSupportBadge />}
              </div>
              {company.description && (
                <p className="break-words text-muted-foreground">{company.description}</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3 sm:gap-4">
          <ProgressWithTrend
            progress={progress}
            deltas={progressDeltas}
            size={72}
            strokeWidth={5}
            accentColor={company.color}
            align="end"
          />
        </div>
      </div>

      {company.is_ongoing_support && (
        <OngoingSupportSection
          companyId={company.id}
          logs={supportLogs}
          readOnly
          shareToken={token}
        />
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold">Projects</h2>
        {projectsWithProgress.length === 0 ? (
          <GlassCard className="p-8 text-center text-muted-foreground">
            No projects to show yet.
          </GlassCard>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 [&>*]:min-w-0">
            {projectsWithProgress.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                companyColor={company.color}
                href={`/share/${token}/project/${project.id}`}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
        <DailyLogList logs={recentLogs.slice(0, 10)} readOnly shareToken={token} />
      </section>
    </div>
  );
}
