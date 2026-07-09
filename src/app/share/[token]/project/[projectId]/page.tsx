import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getProject } from "@/lib/data/projects";
import { listWorkItemsByProject } from "@/lib/data/work-items";
import { listDailyLogsEnriched } from "@/lib/data/daily-logs";
import { listProjectDocuments } from "@/lib/data/project-documents";
import { listProjectAttachmentsWithTasks, groupAttachmentsByWorkItem } from "@/lib/data/attachments";
import { calcProjectProgress, buildTree } from "@/lib/progress/calculate";
import { requireShareAccess } from "@/lib/shares/access";
import { ShareViewBanner } from "@/components/share/ShareViewBanner";
import { WorkItemTree } from "@/components/work-items/WorkItemTree";
import { PhaseBreakdown } from "@/components/projects/PhaseBreakdown";
import { ProjectResourcesPanel } from "@/components/projects/ProjectResourcesPanel";
import { ProjectDocumentsPanel } from "@/components/projects/ProjectDocumentsPanel";
import { DailyLogList } from "@/components/daily-log/DailyLogList";
import { ProgressRing } from "@/components/ui/progress-ring";
import { StatusBadge, PriorityBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { format } from "date-fns";

export default async function ShareProjectPage({
  params,
}: {
  params: Promise<{ token: string; projectId: string }>;
}) {
  const { token, projectId } = await params;
  const share = await requireShareAccess(token);

  const project = await getProject(projectId);
  if (!project || project.company_id !== share.company_id) notFound();

  const company = share.company;
  const workItems = await listWorkItemsByProject(projectId);
  const progress = calcProjectProgress(project, workItems);
  const phases = buildTree(workItems).filter((n) => n.type === "phase");
  const taskCount = workItems.filter((w) => w.type === "task").length;
  const completedTasks = workItems.filter((w) => w.type === "task" && w.status === "completed").length;
  const [recentLogs, projectAttachments, projectDocuments] = await Promise.all([
    listDailyLogsEnriched({ projectId }),
    listProjectAttachmentsWithTasks(projectId),
    listProjectDocuments(projectId),
  ]);
  const attachmentsByWorkItem = groupAttachmentsByWorkItem(projectAttachments);

  return (
    <div className="min-h-screen">
      <ShareViewBanner share={share} />

      <div className="animate-fade-in mx-auto w-full min-w-0 max-w-[1920px] space-y-6 p-4 sm:p-6 lg:p-8 xl:p-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-3 sm:gap-4">
            <Link href={`/share/${token}`}>
              <Button variant="ghost" size="icon" className="shrink-0">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">{company.name}</p>
              <h1 className="text-2xl font-bold sm:text-3xl">{project.name}</h1>
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
          <ProgressRing
            progress={progress}
            size={88}
            strokeWidth={6}
            accentColor={company.color}
            label="progress"
          />
        </div>

        {phases.length > 0 && (
          <section>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Phase Breakdown</h2>
                <p className="text-sm text-muted-foreground">
                  {completedTasks}/{taskCount} tasks complete · weighted progress
                </p>
              </div>
              <p className="text-3xl font-bold tabular-nums gradient-text">{progress}%</p>
            </div>
            <PhaseBreakdown items={workItems} accentColor={company.color} />
          </section>
        )}

        <div className="grid min-w-0 gap-6 xl:grid-cols-12 xl:gap-8">
          <div className="min-w-0 space-y-6 xl:col-span-8">
            <GlassCard className="min-w-0 overflow-hidden p-4 sm:p-6">
              <h2 className="mb-4 text-lg font-semibold">Work Items</h2>
              <WorkItemTree
                items={workItems}
                projectId={projectId}
                attachmentsByWorkItem={attachmentsByWorkItem}
                readOnly
              />
            </GlassCard>

            <ProjectDocumentsPanel
              projectId={projectId}
              documents={projectDocuments}
              readOnly
            />

            <ProjectResourcesPanel attachments={projectAttachments} />
          </div>
          <div className="min-w-0 xl:col-span-4">
            <GlassCard className="p-4 sm:p-6">
              <h2 className="mb-4 text-lg font-semibold">Activity</h2>
              <DailyLogList logs={recentLogs.slice(0, 8)} />
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
