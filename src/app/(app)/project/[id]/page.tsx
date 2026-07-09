import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getProject } from "@/lib/data/projects";
import { getCompany } from "@/lib/data/companies";
import { listWorkItemsByProject } from "@/lib/data/work-items";
import { listDailyLogsEnriched } from "@/lib/data/daily-logs";
import { listProjectDocuments } from "@/lib/data/project-documents";
import { calcProjectProgress, buildTree, calcProjectProgressDeltas } from "@/lib/progress/calculate";
import { ProjectPhaseFilterProvider } from "@/components/projects/ProjectPhaseFilter";
import { ProjectPhaseBreakdownSection } from "@/components/projects/ProjectPhaseBreakdownSection";
import { ProjectWorkItemsSection } from "@/components/projects/ProjectWorkItemsSection";
import { ProgressWithTrend } from "@/components/ui/progress-with-trend";
import { StatusBadge, PriorityBadge } from "@/components/ui/status-badge";
import { EditProjectButton, DeleteProjectButton } from "@/components/projects/ProjectCard";
import { listProjectAttachmentsWithTasks, groupAttachmentsByWorkItem } from "@/lib/data/attachments";
import { ProjectResourcesPanel } from "@/components/projects/ProjectResourcesPanel";
import { ProjectDocumentsPanel } from "@/components/projects/ProjectDocumentsPanel";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { DailyLogList } from "@/components/daily-log/DailyLogList";
import { format } from "date-fns";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  const company = await getCompany(project.company_id);
  const workItems = await listWorkItemsByProject(id);
  const progress = calcProjectProgress(project, workItems);
  const progressDeltas = calcProjectProgressDeltas(project, workItems, progress);
  const phases = buildTree(workItems).filter((n) => n.type === "phase");
  const taskCount = workItems.filter((w) => w.type === "task").length;
  const completedTasks = workItems.filter((w) => w.type === "task" && w.status === "completed").length;
  const [recentLogs, projectAttachments, projectDocuments] = await Promise.all([
    listDailyLogsEnriched({ projectId: id }),
    listProjectAttachmentsWithTasks(id),
    listProjectDocuments(id),
  ]);
  const attachmentsByWorkItem = groupAttachmentsByWorkItem(projectAttachments);

  return (
    <ProjectPhaseFilterProvider>
      <div className="animate-fade-in w-full min-w-0 space-y-6 xl:space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
          <Link href={`/company/${project.company_id}`}>
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">{company?.name}</p>
            <h1 className="break-words text-2xl font-bold sm:text-3xl">{project.name}</h1>
            {project.description && (
              <p className="mt-1 break-words text-muted-foreground">{project.description}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <StatusBadge status={project.status} />
              <PriorityBadge priority={project.priority} />
              {project.start_date && (
                <span className="text-sm text-muted-foreground">
                  Start: {format(new Date(project.start_date + "T12:00:00"), "MMM d, yyyy")}
                </span>
              )}
              {project.due_date && (
                <span className="text-sm text-muted-foreground">
                  Due: {format(new Date(project.due_date + "T12:00:00"), "MMM d, yyyy")}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3 sm:gap-4">
          <ProgressWithTrend
            progress={progress}
            deltas={progressDeltas}
            size={88}
            strokeWidth={6}
            accentColor={company?.color}
            label="progress"
            align="start"
            className="sm:items-end"
          />
          <EditProjectButton project={{ ...project, progress }} companyId={project.company_id} />
          <DeleteProjectButton projectId={project.id} companyId={project.company_id} />
        </div>
      </div>

      {phases.length > 0 && (
        <ProjectPhaseBreakdownSection
          items={workItems}
          accentColor={company?.color}
          completedTasks={completedTasks}
          taskCount={taskCount}
          progress={progress}
        />
      )}

      <div className="grid min-w-0 gap-6 xl:grid-cols-12 xl:gap-8">
        <div className="min-w-0 space-y-6 xl:col-span-8">
          <ProjectWorkItemsSection
            items={workItems}
            projectId={id}
            attachmentsByWorkItem={attachmentsByWorkItem}
          />

          <ProjectDocumentsPanel projectId={id} documents={projectDocuments} />

          <ProjectResourcesPanel attachments={projectAttachments} projectId={id} />
        </div>
        <div className="min-w-0 xl:col-span-4">
          <GlassCard className="p-4 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold">Activity</h2>
            <DailyLogList logs={recentLogs.slice(0, 8)} />
          </GlassCard>
        </div>
      </div>
    </div>
    </ProjectPhaseFilterProvider>
  );
}
