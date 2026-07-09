import { listProjectsByCompany } from "@/lib/data/projects";
import { listWorkItemsByProject } from "@/lib/data/work-items";
import { listDailyLogsEnriched } from "@/lib/data/daily-logs";
import { enrichProjectsWithProgress, calcCompanyProgress } from "@/lib/progress/calculate";
import { requireShareAccess } from "@/lib/shares/access";
import { ShareViewBanner } from "@/components/share/ShareViewBanner";
import { ShareProjectCard } from "@/components/share/ShareProjectCard";
import { DailyLogList } from "@/components/daily-log/DailyLogList";
import { ProgressRing } from "@/components/ui/progress-ring";
import { GlassCard } from "@/components/ui/glass-card";

export default async function ShareCompanyPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const share = await requireShareAccess(token);
  const company = share.company;

  const projects = await listProjectsByCompany(company.id);
  const workItemsByProject = new Map<string, Awaited<ReturnType<typeof listWorkItemsByProject>>>();
  for (const project of projects) {
    workItemsByProject.set(project.id, await listWorkItemsByProject(project.id));
  }
  const projectsWithProgress = enrichProjectsWithProgress(projects, workItemsByProject);
  const progress = calcCompanyProgress(projectsWithProgress);
  const recentLogs = await listDailyLogsEnriched({ companyId: company.id });

  return (
    <div
      className="min-h-screen"
      style={{ "--company-accent": company.color } as React.CSSProperties}
    >
      <ShareViewBanner share={share} />

      <div className="animate-fade-in mx-auto w-full min-w-0 max-w-[1920px] space-y-6 p-4 sm:p-6 lg:p-8 xl:p-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            {company.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={company.logo_url} alt={company.name} className="h-12 w-12 shrink-0 rounded-2xl object-cover sm:h-14 sm:w-14" />
            ) : (
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white sm:h-14 sm:w-14"
                style={{ backgroundColor: company.color }}
              >
                {company.name.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-2xl font-bold sm:text-3xl">{company.name}</h1>
              {company.description && (
                <p className="text-muted-foreground">{company.description}</p>
              )}
            </div>
          </div>
          <ProgressRing progress={progress} size={72} strokeWidth={5} accentColor={company.color} />
        </div>

        <section>
          <h2 className="mb-4 text-lg font-semibold">Projects</h2>
          {projectsWithProgress.length === 0 ? (
            <GlassCard className="p-8 text-center text-muted-foreground">
              No projects to show yet.
            </GlassCard>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {projectsWithProgress.map((project) => (
                <ShareProjectCard
                  key={project.id}
                  project={project}
                  companyColor={company.color}
                  shareToken={token}
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
          <DailyLogList logs={recentLogs.slice(0, 10)} />
        </section>
      </div>
    </div>
  );
}
