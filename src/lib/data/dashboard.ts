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

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const [companies, projects, workItems, todayLogs] = await Promise.all([
    listCompanies(),
    listProjects(),
    listAllWorkItems(),
    listTodayLogs(),
  ]);

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

  const companiesWithProgress = enrichCompaniesWithProgress(companies, projectsWithProgress);

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
  const recentWins = await enrichDailyLogs(recentWinsRaw.slice(0, 10));

  const today = new Date().toISOString().split("T")[0];
  const tasksCompletedToday = workItems.filter(
    (w) => w.status === "completed" && w.completed_at?.startsWith(today)
  ).length;

  const onTrackCount = companiesWithProgress.filter((c) => c.progress >= 50).length;
  const onTrackPercent =
    companiesWithProgress.length > 0
      ? Math.round((onTrackCount / companiesWithProgress.length) * 100)
      : 0;

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
    todayStats: {
      tasksCompleted: tasksCompletedToday,
      workLogs: todayLogs.length,
      onTrackPercent,
      averageProgress,
    },
  };
}
