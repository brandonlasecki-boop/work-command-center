"use client";

import { PhaseBreakdown } from "@/components/projects/PhaseBreakdown";
import { useProjectPhaseFilter } from "@/components/projects/ProjectPhaseFilter";
import type { WorkItem } from "@/lib/types/database";

export function ProjectPhaseBreakdownSection({
  items,
  accentColor,
  completedTasks,
  taskCount,
  progress,
}: {
  items: WorkItem[];
  accentColor?: string;
  completedTasks: number;
  taskCount: number;
  progress: number;
}) {
  const { selectedPhaseId, selectPhase } = useProjectPhaseFilter();

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Phase Breakdown</h2>
          <p className="text-sm text-muted-foreground">
            {completedTasks}/{taskCount} tasks complete · weighted progress
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Click a phase to filter work items below
          </p>
        </div>
        <p className="text-2xl font-bold tabular-nums gradient-text sm:text-3xl">{progress}%</p>
      </div>
      <PhaseBreakdown
        items={items}
        accentColor={accentColor}
        selectedPhaseId={selectedPhaseId}
        onPhaseSelect={selectPhase}
      />
    </section>
  );
}
