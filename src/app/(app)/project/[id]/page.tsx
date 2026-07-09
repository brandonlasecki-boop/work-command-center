import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getProject } from "@/lib/data/projects";
import { getCompany } from "@/lib/data/companies";
import { listWorkItemsByProject } from "@/lib/data/work-items";
import { listDailyLogsEnriched } from "@/lib/data/daily-logs";
import { calcProjectProgress, buildTree } from "@/lib/progress/calculate";
import { WorkItemTree } from "@/components/work-items/WorkItemTree";
import { PhaseBreakdown } from "@/components/projects/PhaseBreakdown";
import { ProgressRing } from "@/components/ui/progress-ring";
import { StatusBadge, PriorityBadge } from "@/components/ui/status-badge";
import { EditProjectButton, DeleteProjectButton } from "@/components/projects/ProjectCard";
import { listProjectAttachmentsWithTasks, groupAttachmentsByWorkItem } from "@/lib/data/attachments";
import { ProjectResourcesPanel } from "@/components/projects/ProjectResourcesPanel";
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
  const phases = buildTree(workItems).filter((n) => n.type === "phase");
  const taskCount = workItems.filter((w) => w.type === "task").length;
  const completedTasks = workItems.filter((w) => w.type === "task" && w.status === "completed").length;
  const recentLogs = await listDailyLogsEnriched({ projectId: id });
  const projectAttachments = await listProjectAttachmentsWithTasks(id);
  const attachmentsByWorkItem = groupAttachmentsByWorkItem(projectAttachments);

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link href={`/company/${project.company_id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <p className="text-sm text-muted-foreground">{company?.name}</p>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            {project.description && (
              <p className="mt-1 text-muted-foreground">{project.description}</p>
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
        <div className="flex items-center gap-4">
          <ProgressRing
            progress={progress}
            size={88}
            strokeWidth={6}
            accentColor={company?.color}
            label="progress"
          />
          <EditProjectButton project={{ ...project, progress }} companyId={project.company_id} />
          <DeleteProjectButton projectId={project.id} companyId={project.company_id} />
        </div>
      </div>

      {phases.length > 0 && (
        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-semibold">Phase Breakdown</h2>
              <p className="text-sm text-muted-foreground">
                {completedTasks}/{taskCount} tasks complete · weighted progress
              </p>
            </div>
            <p className="text-3xl font-bold tabular-nums gradient-text">{progress}%</p>
          </div>
          <PhaseBreakdown items={workItems} accentColor={company?.color} />
        </section>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <GlassCard className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Work Items</h2>
            <WorkItemTree
              items={workItems}
              projectId={id}
              attachmentsByWorkItem={attachmentsByWorkItem}
            />
          </GlassCard>

          <ProjectResourcesPanel attachments={projectAttachments} projectId={id} />
        </div>
        <div>
          <GlassCard className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Activity</h2>
            <DailyLogList logs={recentLogs.slice(0, 8)} />
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
