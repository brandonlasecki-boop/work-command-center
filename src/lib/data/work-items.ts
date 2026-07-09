import { createClient } from "@/lib/supabase/server";
import { buildTree, calcDerivedStatus, findNodeInTree } from "@/lib/progress/calculate";
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

export async function reorderWorkItem(id: string, direction: "up" | "down"): Promise<void> {
  const item = await getWorkItem(id);
  if (!item) return;

  const supabase = await createClient();
  let siblingQuery = supabase
    .from("work_items")
    .select("*")
    .eq("project_id", item.project_id)
    .order("sort_order");

  if (item.parent_id) {
    siblingQuery = siblingQuery.eq("parent_id", item.parent_id);
  } else {
    siblingQuery = siblingQuery.is("parent_id", null);
  }

  const { data: siblings } = await siblingQuery;

  if (!siblings) return;
  const idx = siblings.findIndex((s) => s.id === id);
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= siblings.length) return;

  const other = siblings[swapIdx];
  await supabase.from("work_items").update({ sort_order: other.sort_order }).eq("id", id);
  await supabase.from("work_items").update({ sort_order: item.sort_order }).eq("id", other.id);
}
