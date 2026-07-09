import Link from "next/link";
import { CheckCircle2, ClipboardList, Clock, Target } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Progress } from "@/components/ui/progress";
import { ProgressDonut } from "@/components/dashboard/ProgressDonut";
import type {
  CompanyWithProgress,
  DashboardTodayStats,
  ProjectWithProgress,
  WorkItem,
  Project,
  Company,
} from "@/lib/types/database";

type FocusItem = WorkItem & { project: Project; company: Company };

export function DashboardSidebar({
  companies,
  activeProjects,
  focusItems,
  todayStats,
  shareToken,
}: {
  companies: CompanyWithProgress[];
  activeProjects: ProjectWithProgress[];
  focusItems: FocusItem[];
  todayStats: DashboardTodayStats;
  shareToken?: string;
}) {
  const topProject = activeProjects[0];
  const upNext = focusItems.slice(0, 4);
  const projectHref = (projectId: string) =>
    shareToken ? `/share/${shareToken}/project/${projectId}` : `/project/${projectId}`;

  return (
    <div className="space-y-4">
      <GlassCard className="p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Current Focus
        </h2>

        {topProject ? (
          <Link href={projectHref(topProject.id)} className="block">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-300">
                Top Priority
              </p>
              <p className="mt-1 font-semibold">{topProject.name}</p>
              <p className="text-xs text-muted-foreground">{topProject.company?.name}</p>
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium tabular-nums">{topProject.progress}%</span>
                </div>
                <Progress value={topProject.progress} className="h-2" />
              </div>
            </div>
          </Link>
        ) : (
          <p className="text-sm text-muted-foreground">No active projects right now.</p>
        )}

        {upNext.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Up Next
            </p>
            <div className="space-y-2">
              {upNext.map((item) => (
                <Link key={item.id} href={projectHref(item.project.id)}>
                  <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-white/5">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: item.company.color }}
                    />
                    <span className="min-w-0 flex-1 truncate">{item.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </GlassCard>

      <GlassCard className="p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Today&apos;s Stats
        </h2>
        <div className="space-y-3">
          <StatRow
            icon={CheckCircle2}
            label="Tasks Completed"
            value={String(todayStats.tasksCompleted)}
          />
          <StatRow
            icon={ClipboardList}
            label="Work Logs"
            value={String(todayStats.workLogs)}
          />
          <StatRow icon={Clock} label="Focus Time" value="—" />
          <StatRow
            icon={Target}
            label="On Track"
            value={`${todayStats.onTrackPercent}%`}
          />
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          All Projects Progress
        </h2>
        <ProgressDonut
          companies={companies}
          averageProgress={todayStats.averageProgress}
        />
      </GlassCard>
    </div>
  );
}

function StatRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  );
}
