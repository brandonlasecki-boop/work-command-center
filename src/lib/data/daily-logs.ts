import { createClient } from "@/lib/supabase/server";
import type { DailyLog, DailyLogEnriched, DailyLogType, DailyLogWithRelations, TablesInsert, WorkItem } from "@/lib/types/database";
import { listAttachmentsByWorkItemIds, groupAttachmentsByWorkItem } from "@/lib/data/attachments";

export type DailyLogFilters = {
  companyId?: string;
  projectId?: string;
  fromDate?: string;
  toDate?: string;
  logType?: DailyLogType;
};

export async function enrichDailyLogs(logs: DailyLogWithRelations[]): Promise<DailyLogEnriched[]> {
  const workItemIds = logs
    .map((log) => log.work_item_id)
    .filter((id): id is string => Boolean(id));

  if (workItemIds.length === 0) {
    return logs.map((log) => ({ ...log, attachments: [] }));
  }

  const supabase = await createClient();
  const { data: workItems, error } = await supabase
    .from("work_items")
    .select("id, title, description, project_id")
    .in("id", workItemIds);

  if (error) throw error;

  const workItemMap = new Map(
    (workItems ?? []).map((item) => [item.id, item as Pick<WorkItem, "id" | "title" | "description" | "project_id">])
  );
  const attachments = await listAttachmentsByWorkItemIds(workItemIds);
  const attachmentsByWorkItem = groupAttachmentsByWorkItem(attachments);

  return logs.map((log) => ({
    ...log,
    work_item: log.work_item_id ? workItemMap.get(log.work_item_id) ?? null : null,
    attachments: log.work_item_id ? attachmentsByWorkItem.get(log.work_item_id) ?? [] : [],
  }));
}

export async function listDailyLogs(filters: DailyLogFilters = {}): Promise<DailyLogWithRelations[]> {
  const supabase = await createClient();
  let query = supabase
    .from("daily_logs")
    .select("*, company:companies(*), project:projects(*)")
    .order("log_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (filters.companyId) query = query.eq("company_id", filters.companyId);
  if (filters.projectId) query = query.eq("project_id", filters.projectId);
  if (filters.fromDate) query = query.gte("log_date", filters.fromDate);
  if (filters.toDate) query = query.lte("log_date", filters.toDate);
  if (filters.logType) query = query.eq("log_type", filters.logType);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as DailyLogWithRelations[];
}

export async function listDailyLogsEnriched(
  filters: DailyLogFilters = {}
): Promise<DailyLogEnriched[]> {
  const logs = await listDailyLogs(filters);
  return enrichDailyLogs(logs);
}

export async function listTodayLogs(): Promise<DailyLogWithRelations[]> {
  const today = new Date().toISOString().split("T")[0];
  return listDailyLogs({ fromDate: today, toDate: today });
}

export async function createManualLog(input: TablesInsert<"daily_logs">): Promise<DailyLog> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("daily_logs")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteDailyLog(id: string): Promise<string | null> {
  const supabase = await createClient();
  const { data: log } = await supabase
    .from("daily_logs")
    .select("company_id")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("daily_logs").delete().eq("id", id);
  if (error) throw error;
  return log?.company_id ?? null;
}
