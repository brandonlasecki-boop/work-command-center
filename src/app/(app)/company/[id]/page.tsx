import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCompany } from "@/lib/data/companies";
import { listProjectsByCompany } from "@/lib/data/projects";
import { listWorkItemsByProject } from "@/lib/data/work-items";
import { listDailyLogsEnriched } from "@/lib/data/daily-logs";
import { enrichProjectsWithProgress, calcCompanyProgress } from "@/lib/progress/calculate";
import { ProjectCard, ProjectFormDialog } from "@/components/projects/ProjectCard";
import { DailyLogList } from "@/components/daily-log/DailyLogList";
import { ProgressRing } from "@/components/ui/progress-ring";
import { EditCompanyButton, DeleteCompanyButton } from "@/components/companies/CompanyForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const company = await getCompany(id);
  if (!company) notFound();

  const projects = await listProjectsByCompany(id);
  const workItemsByProject = new Map<string, Awaited<ReturnType<typeof listWorkItemsByProject>>>();
  for (const project of projects) {
    workItemsByProject.set(project.id, await listWorkItemsByProject(project.id));
  }
  const projectsWithProgress = enrichProjectsWithProgress(projects, workItemsByProject);
  const progress = calcCompanyProgress(projectsWithProgress);
  const recentLogs = await listDailyLogsEnriched({ companyId: id });

  return (
    <div
      className="animate-fade-in space-y-8"
      style={{ "--company-accent": company.color } as React.CSSProperties}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link href="/companies">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
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
        </div>
        <div className="flex items-center gap-4">
          <ProgressRing progress={progress} size={72} strokeWidth={5} accentColor={company.color} />
          <EditCompanyButton company={company} />
          <DeleteCompanyButton id={company.id} />
        </div>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Projects</h2>
          <ProjectFormDialog
            companyId={id}
            trigger={
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" /> New Project
              </Button>
            }
          />
        </div>
        {projectsWithProgress.length === 0 ? (
          <GlassCard className="p-8 text-center text-muted-foreground">
            No projects yet. Create one to start tracking work.
          </GlassCard>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projectsWithProgress.map((project) => (
              <ProjectCard key={project.id} project={project} companyColor={company.color} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
        <DailyLogList logs={recentLogs.slice(0, 10)} />
      </section>
    </div>
  );
}
