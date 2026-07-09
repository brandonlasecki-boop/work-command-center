import { listCompanies } from "@/lib/data/companies";
import { listProjects } from "@/lib/data/projects";
import { listAllWorkItems } from "@/lib/data/work-items";
import { listTodayLogs, listDailyLogs, enrichDailyLogs } from "@/lib/data/daily-logs";
import {
  enrichCompaniesWithProgress,
  enrichProjectsWithProgress,
  sortByPriority,
} from "@/lib/progress/calculate";
import type { DashboardSummary } from "@/lib/types/database";

type DashboardSummaryOptions = {
  companyIds?: string[];
};

export async function getShareDashboardSummary(companyIds: string[]): Promise<DashboardSummary> {
  return getDashboardSummary({ companyIds });
}

export async function getDashboardSummary(
  options: DashboardSummaryOptions = {}
): Promise<DashboardSummary> {
  const companyIdSet = options.companyIds?.length ? new Set(options.companyIds) : null;

  const [allCompanies, allProjects, allWorkItems, allTodayLogs] = await Promise.all([
    listCompanies(),
    listProjects(),
    listAllWorkItems(),
    listTodayLogs(),
  ]);

  const companies = companyIdSet
    ? allCompanies.filter((company) => companyIdSet.has(company.id))
    : allCompanies;
  const projects = companyIdSet
    ? allProjects.filter((project) => companyIdSet.has(project.company_id))
    : allProjects;
  const projectIds = new Set(projects.map((project) => project.id));
  const workItems = companyIdSet
    ? allWorkItems.filter((item) => projectIds.has(item.project_id))
    : allWorkItems;
  const todayLogs = companyIdSet
    ? allTodayLogs.filter((log) => companyIdSet.has(log.company_id))
    : allTodayLogs;

  const workItemsByProject = new Map<string, typeof workItems>();
  for (const item of workItems) {
    const list = workItemsByProject.get(item.project_id) ?? [];
    list.push(item);
    workItemsByProject.set(item.project_id, list);
  }

  const projectsWithProgress = enrichProjectsWithProgress(projects, workItemsByProject).map(
    (p) => ({
      ...p,
      company: companies.find((c) => c.id === p.company_id),
    })
  );

  const companiesWithProgress = enrichCompaniesWithProgress(
    companies,
    projectsWithProgress,
    workItemsByProject
  );

  const activeProjects = sortByPriority(
    projectsWithProgress.filter(
      (p) => p.status === "in_progress" || p.status === "not_started"
    )
  );

  const focusItems = workItems
    .filter((w) => w.status === "in_progress" || w.status === "not_started")
    .map((w) => {
      const project = projects.find((p) => p.id === w.project_id)!;
      const company = companies.find((c) => c.id === project.company_id)!;
      return { ...w, project, company };
    })
    .filter((w) => w.project.priority === "urgent" || w.project.priority === "high")
    .slice(0, 8);

  const recentWinsRaw = await listDailyLogs({});
  const scopedRecentWins = companyIdSet
    ? recentWinsRaw.filter((log) => companyIdSet.has(log.company_id))
    : recentWinsRaw;
  const recentWins = await enrichDailyLogs(scopedRecentWins.slice(0, 10));

  const averageProgress =
    companiesWithProgress.length > 0
      ? Math.round(
          companiesWithProgress.reduce((sum, c) => sum + c.progress, 0) /
            companiesWithProgress.length
        )
      : 0;

  return {
    companies: companiesWithProgress,
    activeProjects,
    todayLogs,
    focusItems,
    recentWins,
    averageProgress,
  };
}
