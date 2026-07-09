"use client";

import { useEffect, useRef } from "react";
import { buildTree } from "@/lib/progress/calculate";
import { WorkItemTree } from "@/components/work-items/WorkItemTree";
import { useProjectPhaseFilter } from "@/components/projects/ProjectPhaseFilter";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import type { WorkItem, WorkItemAttachmentWithUrl } from "@/lib/types/database";

export function ProjectWorkItemsSection({
  items,
  projectId,
  attachmentsByWorkItem,
  readOnly = false,
}: {
  items: WorkItem[];
  projectId: string;
  attachmentsByWorkItem: Map<string, WorkItemAttachmentWithUrl[]>;
  readOnly?: boolean;
}) {
  const { selectedPhaseId, clearPhase } = useProjectPhaseFilter();
  const sectionRef = useRef<HTMLDivElement>(null);
  const phases = buildTree(items).filter((node) => node.type === "phase");
  const selectedPhase = phases.find((phase) => phase.id === selectedPhaseId);

  useEffect(() => {
    if (!selectedPhaseId || !sectionRef.current) return;
    sectionRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedPhaseId]);

  return (
    <div ref={sectionRef}>
      <GlassCard className="min-w-0 overflow-hidden p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold">Work Items</h2>
          {selectedPhase ? (
            <p className="mt-1 text-sm text-muted-foreground">
              Showing phase:{" "}
              <span className="font-medium text-indigo-300">{selectedPhase.title}</span>
            </p>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">All phases</p>
          )}
        </div>
        {selectedPhaseId && (
          <Button type="button" variant="outline" size="sm" onClick={clearPhase}>
            Show all phases
          </Button>
        )}
      </div>
      <WorkItemTree
        items={items}
        projectId={projectId}
        attachmentsByWorkItem={attachmentsByWorkItem}
        readOnly={readOnly}
        phaseFilterId={selectedPhaseId}
      />
      </GlassCard>
    </div>
  );
}
