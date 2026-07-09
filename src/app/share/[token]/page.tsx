import { listProjectsByCompany } from "@/lib/data/projects";
import { listWorkItemsByProject } from "@/lib/data/work-items";
import { listDailyLogs } from "@/lib/data/daily-logs";
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
  const recentLogs = await listDailyLogs({ companyId: company.id });

  return (
    <div
      className="min-h-screen"
      style={{ "--company-accent": company.color } as React.CSSProperties}
    >
      <ShareViewBanner share={share} />

      <div className="animate-fade-in mx-auto max-w-6xl space-y-8 p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {company.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={company.logo_url} alt={company.name} className="h-14 w-14 rounded-2xl object-cover" />
            ) : (
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold text-white"
                style={{ backgroundColor: company.color }}
              >
                {company.name.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold">{company.name}</h1>
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
