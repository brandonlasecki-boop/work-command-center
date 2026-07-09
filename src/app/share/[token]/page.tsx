import { redirect } from "next/navigation";
import { listProjectsByCompany } from "@/lib/data/projects";
import { listWorkItemsByProject } from "@/lib/data/work-items";
import { enrichCompaniesWithProgress, enrichProjectsWithProgress } from "@/lib/progress/calculate";
import { requireShareAccess } from "@/lib/shares/access";
import { ShareViewBanner } from "@/components/share/ShareViewBanner";
import { ShareCompanyCard } from "@/components/share/ShareCompanyCard";
import { GlassCard } from "@/components/ui/glass-card";

export default async function ShareHubPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const share = await requireShareAccess(token);

  if (share.companies.length === 1) {
    redirect(`/share/${token}/company/${share.companies[0].id}`);
  }

  const companiesWithProgress = await Promise.all(
    share.companies.map(async (company) => {
      const projects = await listProjectsByCompany(company.id);
      const workItemsByProject = new Map<string, Awaited<ReturnType<typeof listWorkItemsByProject>>>();
      for (const project of projects) {
        workItemsByProject.set(project.id, await listWorkItemsByProject(project.id));
      }
      const projectsWithProgress = enrichProjectsWithProgress(projects, workItemsByProject);
      return enrichCompaniesWithProgress([company], projectsWithProgress)[0];
    })
  );

  return (
    <div className="min-h-screen">
      <ShareViewBanner share={share} />

      <div className="animate-fade-in mx-auto w-full min-w-0 max-w-[1920px] space-y-6 p-4 sm:p-6 lg:p-8 xl:p-10">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Shared companies</h1>
          <p className="mt-1 text-muted-foreground">
            Select a company to view its projects and progress.
          </p>
        </div>

        {companiesWithProgress.length === 0 ? (
          <GlassCard className="p-8 text-center text-muted-foreground">
            No companies are attached to this share link.
          </GlassCard>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {companiesWithProgress.map((company) => (
              <ShareCompanyCard key={company.id} company={company} shareToken={token} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
