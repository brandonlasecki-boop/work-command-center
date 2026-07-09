"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import * as workItems from "@/lib/data/work-items";
import * as projects from "@/lib/data/projects";

const workItemSchema = z.object({
  project_id: z.string().uuid(),
  parent_id: z.string().uuid().optional().nullable(),
  type: z.enum(["phase", "subphase", "task"]),
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  status: z.enum([
    "not_started",
    "in_progress",
    "completed",
    "blocked",
    "waiting_on_approval",
    "waiting_on_carrier",
    "waiting_on_spruce",
    "waiting_on_vendor",
    "waiting_on_internal_owner",
  ]).default("not_started"),
  weight: z.coerce.number().min(0).max(100).default(1),
});

export async function createWorkItemAction(formData: FormData) {
  const parentId = formData.get("parent_id");
  const parsed = workItemSchema.parse({
    project_id: formData.get("project_id"),
    parent_id: parentId && parentId !== "null" ? parentId : null,
    type: formData.get("type"),
    title: formData.get("title"),
    description: formData.get("description") || null,
    status: formData.get("status") || "not_started",
    weight: formData.get("weight") || 1,
  });
  const weight = await workItems.rebalanceSiblingWeights(
    parsed.project_id,
    parsed.parent_id ?? null,
    null,
    parsed.weight
  );
  const created = await workItems.createWorkItem({ ...parsed, weight });
  if (created.parent_id) {
    await workItems.syncParentStatuses(parsed.project_id, created.id);
  }
  revalidatePath(`/project/${parsed.project_id}`);
  revalidatePath("/dashboard");
  revalidatePath("/daily-log");
  revalidatePath("/tv");
}

export async function updateWorkItemAction(id: string, formData: FormData) {
  const parentId = formData.get("parent_id");
  const parsed = workItemSchema.parse({
    project_id: formData.get("project_id"),
    parent_id: parentId && parentId !== "null" ? parentId : null,
    type: formData.get("type"),
    title: formData.get("title"),
    description: formData.get("description") || null,
    status: formData.get("status") || "not_started",
    weight: formData.get("weight") || 1,
  });
  const weight = await workItems.rebalanceSiblingWeights(
    parsed.project_id,
    parsed.parent_id ?? null,
    id,
    parsed.weight
  );
  await workItems.updateWorkItem(id, { ...parsed, weight });
  await workItems.syncParentStatuses(parsed.project_id, id);
  revalidatePath(`/project/${parsed.project_id}`);
  revalidatePath("/dashboard");
  revalidatePath("/daily-log");
  revalidatePath("/tv");
}

export async function completeWorkItemAction(id: string, projectId: string) {
  await workItems.updateWorkItem(id, { status: "completed" });
  await workItems.syncParentStatuses(projectId, id);
  revalidatePath(`/project/${projectId}`);
  revalidatePath("/dashboard");
  revalidatePath("/daily-log");
  revalidatePath("/tv");
  return { success: true };
}

export async function toggleWorkItemAction(id: string, projectId: string, currentStatus: string) {
  const newStatus = currentStatus === "completed" ? "not_started" : "completed";
  await workItems.updateWorkItem(id, { status: newStatus as "completed" | "not_started" });
  await workItems.syncParentStatuses(projectId, id);
  revalidatePath(`/project/${projectId}`);
  revalidatePath("/dashboard");
  revalidatePath("/daily-log");
  revalidatePath("/tv");
  return { success: true, completed: newStatus === "completed" };
}

export async function deleteWorkItemAction(id: string, projectId: string) {
  const item = await workItems.getWorkItem(id);
  await workItems.deleteWorkItem(id);
  if (item?.parent_id) {
    await workItems.syncAncestorStatuses(projectId, item.parent_id);
  }
  revalidatePath(`/project/${projectId}`);
  revalidatePath("/dashboard");
  revalidatePath("/tv");
}

export async function reorderWorkItemAction(id: string, projectId: string, direction: "up" | "down") {
  await workItems.reorderWorkItem(id, direction);
  revalidatePath(`/project/${projectId}`);
}

export async function reorderWorkItemToIndexAction(
  id: string,
  projectId: string,
  newIndex: number
) {
  await workItems.reorderWorkItemToIndex(id, newIndex);
  revalidatePath(`/project/${projectId}`);
}

export async function getProjectCompanyId(projectId: string) {
  const project = await projects.getProject(projectId);
  return project?.company_id;
}
