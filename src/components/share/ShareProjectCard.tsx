import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { StatusBadge, PriorityBadge } from "@/components/ui/status-badge";
import type { ProjectWithProgress } from "@/lib/types/database";

export function ShareProjectCard({
  project,
  companyColor,
  shareToken,
}: {
  project: ProjectWithProgress;
  companyColor?: string;
  shareToken: string;
}) {
  return (
    <Link href={`/share/${shareToken}/project/${project.id}`}>
      <GlassCard className="group p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold transition-colors group-hover:text-indigo-300">
              {project.name}
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              <StatusBadge status={project.status} />
              <PriorityBadge priority={project.priority} />
            </div>
          </div>
          <ProgressRing
            progress={project.progress}
            size={52}
            strokeWidth={4}
            accentColor={companyColor}
          />
        </div>
        {project.description && (
          <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
        )}
      </GlassCard>
    </Link>
  );
}
