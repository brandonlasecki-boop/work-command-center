"use client";

import { buildTree } from "@/lib/progress/calculate";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/status-badge";
import type { WorkItem } from "@/lib/types/database";
import { cn } from "@/lib/utils";

export function PhaseBreakdown({
  items,
  accentColor,
  selectedPhaseId = null,
  onPhaseSelect,
}: {
  items: WorkItem[];
  accentColor?: string;
  selectedPhaseId?: string | null;
  onPhaseSelect?: (phaseId: string) => void;
}) {
  const phases = buildTree(items).filter((n) => n.type === "phase");

  if (phases.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {phases.map((phase) => {
        const tasks = phase.children.filter((c) => c.type === "task");
        const completedTasks = tasks.filter((t) => t.status === "completed").length;
        const phaseWeight = Number(phase.weight);
        const completedWeight = tasks
          .filter((t) => t.status === "completed")
          .reduce((sum, t) => sum + Number(t.weight), 0);

        const isSelected = selectedPhaseId === phase.id;
        const isInteractive = Boolean(onPhaseSelect);

        return (
          <button
            key={phase.id}
            type="button"
            disabled={!isInteractive}
            onClick={() => onPhaseSelect?.(phase.id)}
            aria-pressed={isSelected}
            className={cn(
              "rounded-2xl border bg-white/5 p-4 text-left backdrop-blur transition-all",
              isInteractive && "cursor-pointer hover:border-white/20 hover:bg-white/[0.08]",
              isSelected
                ? "border-indigo-400/70 bg-indigo-500/10 ring-2 ring-indigo-400/50 shadow-[0_0_24px_rgba(99,102,241,0.2)]"
                : "border-white/10"
            )}
            style={
              isSelected && accentColor
                ? {
                    borderColor: `${accentColor}99`,
                    boxShadow: `0 0 24px ${accentColor}33`,
                  }
                : undefined
            }
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {phaseWeight}% weight
                </p>
                <h3 className="mt-1 text-sm font-semibold leading-snug">{phase.title}</h3>
                <StatusBadge status={phase.derivedStatus} className="mt-2" />
              </div>
              <ProgressRing
                progress={phase.progress}
                size={52}
                strokeWidth={4}
                accentColor={accentColor}
              />
            </div>
            <div className="mt-3 space-y-2">
              <Progress value={phase.progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {completedTasks}/{tasks.length} tasks done
                </span>
                <span className="tabular-nums">{completedWeight.toFixed(1)}% earned</span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function formatWeight(weight: number) {
  const n = Number(weight);
  const formatted = Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/\.?0+$/, "");
  return `${formatted}%`;
}

export function WeightBadge({ weight, className }: { weight: number; className?: string }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-muted-foreground",
        className
      )}
    >
      {formatWeight(weight)}
    </span>
  );
}
