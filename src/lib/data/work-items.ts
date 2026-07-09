import { createClient } from "@/lib/supabase/server";
import { buildTree, calcDerivedStatus, findNodeInTree } from "@/lib/progress/calculate";
import {
  computeRebalancedSiblingWeights,
  getSiblingWeightBudget,
} from "@/lib/progress/weights";
import type { WorkItem, TablesInsert, TablesUpdate, WorkItemStatus } from "@/lib/types/database";

export async function listWorkItemsByProject(projectId: string): Promise<WorkItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("work_items")
    .select("*")
    .eq("project_id", projectId)
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function listAllWorkItems(): Promise<WorkItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("work_items")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function getWorkItem(id: string): Promise<WorkItem | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("work_items")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

export async function listSiblingWorkItems(
  projectId: string,
  parentId: string | null,
  excludeId?: string
): Promise<WorkItem[]> {
  const supabase = await createClient();
  let query = supabase
    .from("work_items")
    .select("*")
    .eq("project_id", projectId)
    .order("sort_order");

  if (parentId) {
    query = query.eq("parent_id", parentId);
  } else {
    query = query.is("parent_id", null);
  }

  const { data, error } = await query;
  if (error) throw error;

  const siblings = data ?? [];
  return excludeId ? siblings.filter((item) => item.id !== excludeId) : siblings;
}

export async function rebalanceSiblingWeights(
  projectId: string,
  parentId: string | null,
  excludeId: string | null,
  requestedWeight: number
): Promise<number> {
  const parent = parentId ? await getWorkItem(parentId) : null;
  const budget = getSiblingWeightBudget(parent);
  const siblings = await listSiblingWorkItems(projectId, parentId, excludeId ?? undefined);
  const { weight, siblingUpdates } = computeRebalancedSiblingWeights(
    siblings.map((item) => ({ id: item.id, weight: Number(item.weight) })),
    requestedWeight,
    budget
  );

  for (const [id, siblingWeight] of siblingUpdates) {
    await updateWorkItem(id, { weight: siblingWeight });
  }

  return weight;
}

export async function createWorkItem(input: TablesInsert<"work_items">): Promise<WorkItem> {
  const supabase = await createClient();
  let siblingQuery = supabase
    .from("work_items")
    .select("sort_order")
    .eq("project_id", input.project_id);

  if (input.parent_id) {
    siblingQuery = siblingQuery.eq("parent_id", input.parent_id);
  } else {
    siblingQuery = siblingQuery.is("parent_id", null);
  }

  const { data: siblings } = await siblingQuery;

  const maxOrder = siblings?.reduce((m, s) => Math.max(m, s.sort_order), -1) ?? -1;

  const { data, error } = await supabase
    .from("work_items")
    .insert({ ...input, sort_order: input.sort_order ?? maxOrder + 1 })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateWorkItem(id: string, input: TablesUpdate<"work_items">): Promise<WorkItem> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("work_items")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteWorkItem(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("work_items").delete().eq("id", id);
  if (error) throw error;
}

export async function syncAncestorStatuses(
  projectId: string,
  startParentId: string | null
): Promise<void> {
  if (!startParentId) return;

  const items = await listWorkItemsByProject(projectId);
  const itemMap = new Map(items.map((item) => [item.id, item]));
  const tree = buildTree(items);

  let parentId: string | null = startParentId;

  while (parentId) {
    const parent = itemMap.get(parentId);
    if (!parent) break;

    const node = findNodeInTree(tree, parentId);
    if (node) {
      const derivedStatus: WorkItemStatus = calcDerivedStatus(node);
      if (derivedStatus !== parent.status) {
        await updateWorkItem(parentId, { status: derivedStatus });
        parent.status = derivedStatus;
        node.status = derivedStatus;
        node.derivedStatus = derivedStatus;
      }
    }

    parentId = parent.parent_id;
  }
}

export async function syncParentStatuses(
  projectId: string,
  changedItemId: string
): Promise<void> {
  const item = await getWorkItem(changedItemId);
  await syncAncestorStatuses(projectId, item?.parent_id ?? null);
}

export async function reorderWorkItemToIndex(id: string, newIndex: number): Promise<void> {
  const item = await getWorkItem(id);
  if (!item) return;

  const siblings = await listSiblingWorkItems(item.project_id, item.parent_id);
  const oldIndex = siblings.findIndex((s) => s.id === id);
  if (
    oldIndex === -1 ||
    oldIndex === newIndex ||
    newIndex < 0 ||
    newIndex >= siblings.length
  ) {
    return;
  }

  const reordered = [...siblings];
  const [moved] = reordered.splice(oldIndex, 1);
  reordered.splice(newIndex, 0, moved);

  const supabase = await createClient();
  await Promise.all(
    reordered.map((sibling, index) =>
      supabase.from("work_items").update({ sort_order: index }).eq("id", sibling.id)
    )
  );
}

export async function reorderWorkItem(id: string, direction: "up" | "down"): Promise<void> {
  const item = await getWorkItem(id);
  if (!item) return;

  const siblings = await listSiblingWorkItems(item.project_id, item.parent_id);
  const idx = siblings.findIndex((s) => s.id === id);
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= siblings.length) return;

  await reorderWorkItemToIndex(id, swapIdx);
}
