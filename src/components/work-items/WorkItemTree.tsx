"use client";

import { useState } from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Circle,
  Layers,
  GitBranch,
  ListTodo,
  Check,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TypeBadge, StatusBadge } from "@/components/ui/status-badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createWorkItemAction,
  updateWorkItemAction,
  toggleWorkItemAction,
  deleteWorkItemAction,
  reorderWorkItemAction,
  reorderWorkItemToIndexAction,
} from "@/app/actions/work-items";
import { fireConfetti } from "@/components/ui/confetti-burst";
import { buildTree } from "@/lib/progress/calculate";
import { WeightBadge } from "@/components/projects/PhaseBreakdown";
import { WorkItemNoteIndicator } from "@/components/work-items/WorkItemNoteIndicator";
import {
  WorkItemResourcesSection,
  WorkItemAttachmentIndicator,
} from "@/components/work-items/WorkItemResources";
import { TooltipProvider } from "@/components/ui/tooltip";
import type {
  WorkItemNode,
  WorkItem,
  WorkItemType,
  WorkItemStatus,
  WorkItemAttachmentWithUrl,
} from "@/lib/types/database";
import { cn } from "@/lib/utils";

const STATUS_FILTERS: { value: WorkItemStatus; label: string }[] = [
  { value: "not_started", label: "Not Started" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const filterButtonStyles: Record<
  WorkItemStatus,
  { active: string; inactive: string }
> = {
  not_started: {
    inactive: "border-white/10 bg-white/5 text-muted-foreground hover:border-zinc-500/40 hover:bg-zinc-500/10 hover:text-zinc-200",
    active:
      "border-zinc-300 bg-zinc-500/50 text-white font-semibold ring-2 ring-zinc-400/60 shadow-[0_0_20px_rgba(161,161,170,0.35)]",
  },
  in_progress: {
    inactive: "border-white/10 bg-white/5 text-muted-foreground hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-200",
    active:
      "border-blue-400 bg-blue-500/50 text-white font-semibold ring-2 ring-blue-400/60 shadow-[0_0_20px_rgba(59,130,246,0.4)]",
  },
  completed: {
    inactive: "border-white/10 bg-white/5 text-muted-foreground hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-200",
    active:
      "border-emerald-400 bg-emerald-500/50 text-white font-semibold ring-2 ring-emerald-400/60 shadow-[0_0_20px_rgba(16,185,129,0.4)]",
  },
  blocked: {
    inactive: "border-white/10 bg-white/5 text-muted-foreground hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-200",
    active:
      "border-red-400 bg-red-500/50 text-white font-semibold ring-2 ring-red-400/60 shadow-[0_0_20px_rgba(239,68,68,0.4)]",
  },
  waiting_on_approval: {
    inactive: "border-white/10 bg-white/5 text-muted-foreground hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-200",
    active:
      "border-amber-400 bg-amber-500/50 text-white font-semibold ring-2 ring-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.4)]",
  },
  waiting_on_carrier: {
    inactive: "border-white/10 bg-white/5 text-muted-foreground hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-200",
    active:
      "border-orange-400 bg-orange-500/50 text-white font-semibold ring-2 ring-orange-400/60 shadow-[0_0_20px_rgba(249,115,22,0.4)]",
  },
  waiting_on_spruce: {
    inactive: "border-white/10 bg-white/5 text-muted-foreground hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-violet-200",
    active:
      "border-violet-400 bg-violet-500/50 text-white font-semibold ring-2 ring-violet-400/60 shadow-[0_0_20px_rgba(139,92,246,0.4)]",
  },
  waiting_on_vendor: {
    inactive: "border-white/10 bg-white/5 text-muted-foreground hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-200",
    active:
      "border-cyan-400 bg-cyan-500/50 text-white font-semibold ring-2 ring-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.4)]",
  },
  waiting_on_internal_owner: {
    inactive: "border-white/10 bg-white/5 text-muted-foreground hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-indigo-200",
    active:
      "border-indigo-400 bg-indigo-500/50 text-white font-semibold ring-2 ring-indigo-400/60 shadow-[0_0_20px_rgba(99,102,241,0.4)]",
  },
};

const WAITING_STATUSES: WorkItemStatus[] = [
  "waiting_on_approval",
  "waiting_on_vendor",
  "waiting_on_internal_owner",
  "waiting_on_carrier",
  "waiting_on_spruce",
];

function isWaitingStatus(status: WorkItemStatus): boolean {
  return WAITING_STATUSES.includes(status);
}

function filterTree(
  nodes: WorkItemNode[],
  activeFilters: Set<WorkItemStatus>
): WorkItemNode[] {
  if (activeFilters.size === 0) return nodes;

  return nodes.reduce<WorkItemNode[]>((acc, node) => {
    const filteredChildren = filterTree(node.children, activeFilters);
    const matches = activeFilters.has(node.derivedStatus);

    if (matches || filteredChildren.length > 0) {
      acc.push({ ...node, children: filteredChildren });
    }
    return acc;
  }, []);
}

function countVisibleNodes(nodes: WorkItemNode[]): number {
  return nodes.reduce(
    (count, node) => count + 1 + countVisibleNodes(node.children),
    0
  );
}

const typeIcons = {
  phase: Layers,
  subphase: GitBranch,
  task: ListTodo,
};

function getChildTypes(parentType: WorkItemType | null): WorkItemType[] {
  if (!parentType) return ["phase"];
  if (parentType === "phase") return ["subphase", "task"];
  if (parentType === "subphase") return ["subphase", "task"];
  return [];
}

export function WorkItemTree({
  items,
  projectId,
  attachmentsByWorkItem,
  readOnly = false,
  phaseFilterId = null,
}: {
  items: WorkItem[];
  projectId: string;
  attachmentsByWorkItem: Map<string, WorkItemAttachmentWithUrl[]>;
  readOnly?: boolean;
  phaseFilterId?: string | null;
}) {
  const [activeFilters, setActiveFilters] = useState<Set<WorkItemStatus>>(new Set());
  const tree = buildTree(items);
  const phaseFilteredTree = phaseFilterId
    ? tree.filter((node) => node.id === phaseFilterId)
    : tree;
  const filteredTree = filterTree(phaseFilteredTree, activeFilters);
  const hasActiveFilters = activeFilters.size > 0;
  const dragDisabled = readOnly || hasActiveFilters;
  const expandAll = hasActiveFilters || Boolean(phaseFilterId);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeItem = items.find((item) => item.id === active.id);
    const overItem = items.find((item) => item.id === over.id);
    if (!activeItem || !overItem) return;
    if (activeItem.parent_id !== overItem.parent_id) return;

    const siblings = items
      .filter((item) => item.parent_id === activeItem.parent_id)
      .sort((a, b) => a.sort_order - b.sort_order);

    const oldIndex = siblings.findIndex((item) => item.id === active.id);
    const newIndex = siblings.findIndex((item) => item.id === over.id);
    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

    await reorderWorkItemToIndexAction(String(active.id), projectId, newIndex);
  }

  function toggleFilter(status: WorkItemStatus) {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  }

  if (tree.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
        <p className="text-muted-foreground">
          {readOnly ? "No work items to show." : "No work items yet. Add a phase to get started."}
        </p>
        {!readOnly && (
          <WorkItemFormDialog
            projectId={projectId}
            parentId={null}
            defaultType="phase"
            trigger={
              <Button className="mt-4" variant="outline">
                <Plus className="mr-2 h-4 w-4" /> Add Phase
              </Button>
            }
          />
        )}
      </div>
    );
  }

  if (phaseFilterId && phaseFilteredTree.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
        <p className="text-muted-foreground">No work items found for this phase.</p>
      </div>
    );
  }

  return (
    <TooltipProvider delay={150}>
      <div className="space-y-1">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Filter
            </span>
            {STATUS_FILTERS.map(({ value, label }) => {
              const isActive = activeFilters.has(value);
              const styles = filterButtonStyles[value];
              return (
                <Button
                  key={value}
                  type="button"
                  variant="outline"
                  size="sm"
                  aria-pressed={isActive}
                  onClick={() => toggleFilter(value)}
                  className={cn(
                    "capitalize transition-all duration-200",
                    isActive ? styles.active : styles.inactive,
                    isActive && "scale-[1.03]"
                  )}
                >
                  {isActive && <Check className="mr-1 h-3.5 w-3.5" />}
                  {label}
                </Button>
              );
            })}
            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setActiveFilters(new Set())}
                className="text-muted-foreground"
              >
                Clear
              </Button>
            )}
          </div>
          {!readOnly && !phaseFilterId && (
            <WorkItemFormDialog
              projectId={projectId}
              parentId={null}
              defaultType="phase"
              trigger={
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Add Phase
                </Button>
              }
            />
          )}
        </div>

        {filteredTree.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
            <p className="text-muted-foreground">No items match the selected filters.</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => setActiveFilters(new Set())}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredTree.map((node) => node.id)}
              strategy={verticalListSortingStrategy}
            >
              {filteredTree.map((node) => (
                <SortableWorkItemRow
                  key={node.id}
                  node={node}
                  projectId={projectId}
                  depth={0}
                  forceExpanded={expandAll}
                  attachmentsByWorkItem={attachmentsByWorkItem}
                  readOnly={readOnly}
                  dragDisabled={dragDisabled}
                  items={items}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}

        {hasActiveFilters && filteredTree.length > 0 && (
          <p className="pt-2 text-center text-xs text-muted-foreground">
            Showing {countVisibleNodes(filteredTree)} matching items
          </p>
        )}
      </div>
    </TooltipProvider>
  );
}

function SortableWorkItemRow({
  node,
  projectId,
  depth,
  forceExpanded = false,
  attachmentsByWorkItem,
  readOnly = false,
  dragDisabled = false,
  items,
}: {
  node: WorkItemNode;
  projectId: string;
  depth: number;
  forceExpanded?: boolean;
  attachmentsByWorkItem: Map<string, WorkItemAttachmentWithUrl[]>;
  readOnly?: boolean;
  dragDisabled?: boolean;
  items: WorkItem[];
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: node.id, disabled: dragDisabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={cn(isDragging && "relative z-10 opacity-60")}>
      <WorkItemRow
        node={node}
        projectId={projectId}
        depth={depth}
        forceExpanded={forceExpanded}
        attachmentsByWorkItem={attachmentsByWorkItem}
        readOnly={readOnly}
        dragDisabled={dragDisabled}
        items={items}
        dragHandleRef={setActivatorNodeRef}
        dragHandleProps={dragDisabled ? undefined : { ...attributes, ...listeners }}
      />
    </div>
  );
}

function WorkItemRow({
  node,
  projectId,
  depth,
  forceExpanded = false,
  attachmentsByWorkItem,
  readOnly = false,
  dragDisabled = false,
  items,
  dragHandleRef,
  dragHandleProps,
}: {
  node: WorkItemNode;
  projectId: string;
  depth: number;
  forceExpanded?: boolean;
  attachmentsByWorkItem: Map<string, WorkItemAttachmentWithUrl[]>;
  readOnly?: boolean;
  dragDisabled?: boolean;
  items: WorkItem[];
  dragHandleRef?: (element: HTMLElement | null) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
}) {
  const [expanded, setExpanded] = useState(true);
  const isExpanded = forceExpanded || expanded;
  const Icon = typeIcons[node.type];
  const childTypes = getChildTypes(node.type);
  const attachments = attachmentsByWorkItem.get(node.id) ?? [];

  async function handleToggle() {
    const result = await toggleWorkItemAction(node.id, projectId, node.status);
    if (result.completed) fireConfetti();
  }

  return (
    <div>
      <div
        className={cn(
          "group flex min-w-0 flex-col gap-1.5 rounded-xl border border-transparent py-2 pr-3 pl-[calc(var(--depth)*12px+8px)] transition-colors sm:flex-row sm:items-center sm:gap-2 sm:pl-[calc(var(--depth)*24px+12px)] hover:border-white/10 hover:bg-white/5",
          node.type === "task" && isWaitingStatus(node.status) &&
            "border-amber-500/30 bg-amber-500/5",
          node.type === "task" && node.status === "blocked" &&
            "border-red-500/30 bg-red-500/5",
        )}
        style={{ "--depth": depth } as React.CSSProperties}
      >
        <div className="flex min-w-0 items-center gap-2 sm:contents">
          {!readOnly && !dragDisabled && dragHandleProps ? (
            <button
              type="button"
              ref={dragHandleRef}
              className="cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
              aria-label="Drag to reorder"
              {...dragHandleProps}
            >
              <GripVertical className="h-4 w-4" />
            </button>
          ) : (
            <span className="inline-block w-4 shrink-0" />
          )}

          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-muted-foreground"
          >
            {node.children.length > 0 ? (
              isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
            ) : (
              <span className="inline-block w-4" />
            )}
          </button>

          {readOnly ? (
            <span className="shrink-0">
              {node.status === "completed" ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </span>
          ) : (
            <button type="button" onClick={handleToggle} className="shrink-0">
              {node.status === "completed" ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground hover:text-emerald-400" />
              )}
            </button>
          )}

          <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className={cn("min-w-0 flex-1 truncate text-sm", node.status === "completed" && "text-muted-foreground line-through")}>
            {node.title}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pl-10 sm:contents">
          <WorkItemNoteIndicator note={node.description ?? ""} />
          <WorkItemAttachmentIndicator attachments={attachments} />
          <WeightBadge weight={Number(node.weight)} className="hidden sm:inline" />
          {node.children.length > 0 && (
            <span className="hidden text-xs tabular-nums text-muted-foreground md:inline">
              {node.progress}%
            </span>
          )}
          <TypeBadge type={node.type} className="hidden sm:inline-flex" />
          {node.children.length > 0 && (
            <div className="hidden w-20 sm:block">
              <Progress value={node.progress} className="h-1.5" />
            </div>
          )}
          <StatusBadge status={node.derivedStatus} className="hidden sm:inline-flex" />

          {!readOnly && (
            <div className="flex opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
              {childTypes.length > 0 &&
                childTypes.map((t) => (
                  <WorkItemFormDialog
                    key={t}
                    projectId={projectId}
                    parentId={node.id}
                    defaultType={t}
                    attachments={attachmentsByWorkItem.get(node.id) ?? []}
                    trigger={
                      <Button variant="ghost" size="icon" className="h-7 w-7" title={`Add ${t}`}>
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    }
                  />
                ))}
              <WorkItemFormDialog
                projectId={projectId}
                parentId={node.parent_id}
                defaultType={node.type}
                item={node}
                attachments={attachmentsByWorkItem.get(node.id) ?? []}
                trigger={
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                }
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => reorderWorkItemAction(node.id, projectId, "up")}
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => reorderWorkItemAction(node.id, projectId, "down")}
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={async () => {
                  if (confirm("Delete this item and all children?")) {
                    await deleteWorkItemAction(node.id, projectId);
                  }
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>
      {isExpanded &&
        (node.children.length > 0 ? (
          <SortableContext
            items={node.children.map((child) => child.id)}
            strategy={verticalListSortingStrategy}
          >
            {node.children.map((child) => (
              <SortableWorkItemRow
                key={child.id}
                node={child}
                projectId={projectId}
                depth={depth + 1}
                forceExpanded={forceExpanded}
                attachmentsByWorkItem={attachmentsByWorkItem}
                readOnly={readOnly}
                dragDisabled={dragDisabled}
                items={items}
              />
            ))}
          </SortableContext>
        ) : null)}
    </div>
  );
}

function WorkItemFormDialog({
  projectId,
  parentId,
  defaultType,
  item,
  attachments = [],
  trigger,
}: {
  projectId: string;
  parentId: string | null;
  defaultType: WorkItemType;
  item?: WorkItem;
  attachments?: WorkItemAttachmentWithUrl[];
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [itemStatus, setItemStatus] = useState(item?.status ?? "not_started");

  async function handleSubmit(formData: FormData) {
    formData.set("project_id", projectId);
    formData.set("parent_id", parentId ?? "null");
    formData.set("status", itemStatus);
    if (item) {
      await updateWorkItemAction(item.id, formData);
    } else {
      await createWorkItemAction(formData);
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)} className="inline-flex">{trigger}</div>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{item ? "Edit Work Item" : `New ${defaultType}`}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <input type="hidden" name="type" value={item?.type ?? defaultType} />
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={item?.title} required />
          </div>
          <div>
            <Label htmlFor="description">Description / Notes</Label>
            <Textarea id="description" name="description" defaultValue={item?.description ?? ""} />
          </div>
          <div>
            <Label htmlFor="weight">Weight (%)</Label>
            <Input
              id="weight"
              name="weight"
              type="number"
              step="any"
              min="0"
              max="100"
              defaultValue={item?.weight ?? 1}
            />
          </div>
          <div>
            <Label>Status</Label>
            <Select value={itemStatus} onValueChange={(v) => v && setItemStatus(v as typeof itemStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="not_started">Not Started</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="waiting_on_approval">Waiting on Approval</SelectItem>
                <SelectItem value="waiting_on_vendor">Waiting on Vendor</SelectItem>
                <SelectItem value="waiting_on_internal_owner">Waiting on Internal Owner</SelectItem>
                <SelectItem value="waiting_on_carrier">Waiting on Carrier</SelectItem>
                <SelectItem value="waiting_on_spruce">Waiting on Spruce</SelectItem>
                <SelectItem value="completed">Complete</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">{item ? "Save" : "Create"}</Button>
        </form>

        <WorkItemResourcesSection
          projectId={projectId}
          workItemId={item?.id}
          initialAttachments={attachments}
        />
      </DialogContent>
    </Dialog>
  );
}
