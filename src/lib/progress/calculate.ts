import type {
  WorkItem,
  WorkItemNode,
  WorkItemStatus,
  Project,
  ProjectWithProgress,
  CompanyWithProgress,
  ProgressDeltas,
} from "@/lib/types/database";
import { startOfDay, startOfMonth, subDays } from "date-fns";

export function calcDerivedStatusFromLeaves(
  leaves: Pick<WorkItem, "status">[]
): WorkItemStatus {
  if (leaves.length === 0) return "not_started";
  if (leaves.every((l) => l.status === "completed")) return "completed";
  if (leaves.some((l) => l.status === "blocked")) return "blocked";
  if (leaves.some((l) => l.status === "in_progress" || l.status === "completed")) {
    return "in_progress";
  }
  if (leaves.some((l) => l.status === "waiting_on_carrier")) return "waiting_on_carrier";
  if (leaves.some((l) => l.status === "waiting_on_spruce")) return "waiting_on_spruce";
  if (leaves.some((l) => l.status === "waiting_on_vendor")) return "waiting_on_vendor";
  if (leaves.some((l) => l.status === "waiting_on_internal_owner")) {
    return "waiting_on_internal_owner";
  }
  if (leaves.some((l) => l.status === "waiting_on_approval")) return "waiting_on_approval";
  return "not_started";
}

export function calcDerivedStatus(node: WorkItemNode): WorkItemStatus {
  const leaves = getLeafNodes(node);
  if (leaves.length === 1 && leaves[0].id === node.id) {
    return node.status;
  }
  return calcDerivedStatusFromLeaves(leaves);
}

function assignDerivedStatuses(nodes: WorkItemNode[]): void {
  for (const node of nodes) {
    assignDerivedStatuses(node.children);
    node.derivedStatus = calcDerivedStatus(node);
  }
}

export function buildTree(items: WorkItem[]): WorkItemNode[] {
  const map = new Map<string, WorkItemNode>();
  const roots: WorkItemNode[] = [];

  for (const item of items) {
    map.set(item.id, { ...item, children: [], progress: 0, derivedStatus: item.status });
  }

  for (const item of items) {
    const node = map.get(item.id)!;
    if (item.parent_id && map.has(item.parent_id)) {
      map.get(item.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  const sortNodes = (nodes: WorkItemNode[]) => {
    nodes.sort((a, b) => a.sort_order - b.sort_order);
    nodes.forEach((n) => sortNodes(n.children));
  };
  sortNodes(roots);

  for (const node of map.values()) {
    node.progress = calcNodeProgress(node);
  }

  assignDerivedStatuses(roots);

  return roots;
}

export function findNodeInTree(roots: WorkItemNode[], id: string): WorkItemNode | null {
  for (const root of roots) {
    if (root.id === id) return root;
    const found = findNodeInTree(root.children, id);
    if (found) return found;
  }
  return null;
}

export function getLeafNodes(node: WorkItemNode): WorkItemNode[] {
  if (node.children.length === 0) return [node];
  return node.children.flatMap(getLeafNodes);
}

export function getAllLeafNodesFromForest(roots: WorkItemNode[]): WorkItemNode[] {
  return roots.flatMap(getLeafNodes);
}

export function sumCompletedWeight(nodes: WorkItemNode[]): number {
  return nodes
    .filter((n) => n.status === "completed")
    .reduce((sum, n) => sum + Number(n.weight), 0);
}

export function sumTotalWeight(nodes: WorkItemNode[]): number {
  return nodes.reduce((sum, n) => sum + Number(n.weight), 0);
}

export function calcWeightedProgressFromLeaves(leaves: WorkItemNode[]): number {
  if (leaves.length === 0) return 0;
  const totalWeight = sumTotalWeight(leaves);
  if (totalWeight === 0) return 0;
  const completedWeight = sumCompletedWeight(leaves);
  return Math.round((completedWeight / totalWeight) * 100);
}

export function calcNodeProgress(node: WorkItemNode): number {
  const leaves = getLeafNodes(node);
  if (leaves.length === 0) {
    return node.status === "completed" ? 100 : 0;
  }
  return calcWeightedProgressFromLeaves(leaves);
}

export function calcProjectProgress(
  project: Pick<Project, "manual_progress_override">,
  items: WorkItem[]
): number {
  if (project.manual_progress_override != null) {
    return Math.min(100, Math.max(0, Number(project.manual_progress_override)));
  }
  if (items.length === 0) return 0;

  const tree = buildTree(items);
  const leaves = getAllLeafNodesFromForest(tree);
  return calcWeightedProgressFromLeaves(leaves);
}

export function calcCompanyProgress(
  projects: Pick<ProjectWithProgress, "status" | "progress">[]
): number {
  const active = projects.filter((p) => p.status !== "completed" && p.status !== "paused");
  if (active.length === 0) {
    const all = projects.filter((p) => p.status !== "paused");
    if (all.length === 0) return 0;
    return Math.round(all.reduce((s, p) => s + p.progress, 0) / all.length);
  }
  return Math.round(active.reduce((s, p) => s + p.progress, 0) / active.length);
}

function roundDelta(value: number): number {
  const rounded = Math.round(value * 10) / 10;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function workItemsAsOf(items: WorkItem[], asOf: Date): WorkItem[] {
  return items.map((item) => {
    if (item.status !== "completed") return item;
    if (!item.completed_at) return item;
    if (new Date(item.completed_at) <= asOf) return item;
    return { ...item, status: "in_progress" as const, completed_at: null };
  });
}

export function calcProjectProgressAsOf(
  project: Pick<Project, "manual_progress_override">,
  items: WorkItem[],
  asOf: Date
): number {
  if (project.manual_progress_override != null) {
    return Math.min(100, Math.max(0, Number(project.manual_progress_override)));
  }
  return calcProjectProgress(project, workItemsAsOf(items, asOf));
}

export function calcProjectProgressDeltas(
  project: Pick<Project, "manual_progress_override">,
  items: WorkItem[],
  currentProgress?: number
): ProgressDeltas {
  if (project.manual_progress_override != null) {
    return { day: 0, week: 0, month: 0 };
  }

  const current = currentProgress ?? calcProjectProgress(project, items);
  const now = new Date();
  const atDayStart = calcProjectProgressAsOf(project, items, startOfDay(now));
  const atWeekStart = calcProjectProgressAsOf(project, items, startOfDay(subDays(now, 7)));
  const atMonthStart = calcProjectProgressAsOf(project, items, startOfMonth(now));

  return {
    day: roundDelta(current - atDayStart),
    week: roundDelta(current - atWeekStart),
    month: roundDelta(current - atMonthStart),
  };
}

export function calcCompanyProgressDeltas(
  projects: ProjectWithProgress[],
  workItemsByProject: Map<string, WorkItem[]>
): ProgressDeltas {
  const now = new Date();
  const current = calcCompanyProgress(projects);

  function companyProgressAt(asOf: Date): number {
    const projectsAtTime = projects.map((project) => ({
      ...project,
      progress: calcProjectProgressAsOf(
        project,
        workItemsByProject.get(project.id) ?? [],
        asOf
      ),
    }));
    return calcCompanyProgress(projectsAtTime);
  }

  return {
    day: roundDelta(current - companyProgressAt(startOfDay(now))),
    week: roundDelta(current - companyProgressAt(startOfDay(subDays(now, 7)))),
    month: roundDelta(current - companyProgressAt(startOfMonth(now))),
  };
}

export function enrichProjectsWithProgress(
  projects: Project[],
  workItemsByProject: Map<string, WorkItem[]>
): ProjectWithProgress[] {
  return projects.map((project) => {
    const items = workItemsByProject.get(project.id) ?? [];
    const progress = calcProjectProgress(project, items);
    return {
      ...project,
      progress,
      progressDeltas: calcProjectProgressDeltas(project, items, progress),
    };
  });
}

export function enrichCompaniesWithProgress(
  companies: import("@/lib/types/database").Company[],
  projects: ProjectWithProgress[],
  workItemsByProject?: Map<string, WorkItem[]>
): CompanyWithProgress[] {
  return companies.map((company) => {
    const companyProjects = projects.filter((p) => p.company_id === company.id);
    const progressDeltas: ProgressDeltas | undefined = workItemsByProject
      ? calcCompanyProgressDeltas(companyProjects, workItemsByProject)
      : undefined;
    return {
      ...company,
      progress: calcCompanyProgress(companyProjects),
      progressDeltas,
      projectCount: companyProjects.length,
      activeProjectCount: companyProjects.filter(
        (p) => p.status === "in_progress" || p.status === "not_started"
      ).length,
    };
  });
}

export const PRIORITY_ORDER: Record<string, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export function sortByPriority<T extends { priority: string }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => (PRIORITY_ORDER[a.priority] ?? 99) - (PRIORITY_ORDER[b.priority] ?? 99)
  );
}
