import { createClient } from "@/lib/supabase/server";
import type { DailyLog, DailyLogWithRelations, TablesInsert } from "@/lib/types/database";

export type DailyLogFilters = {
  companyId?: string;
  projectId?: string;
  fromDate?: string;
  toDate?: string;
};

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

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as DailyLogWithRelations[];
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

export async function deleteDailyLog(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("daily_logs").delete().eq("id", id);
  if (error) throw error;
}
