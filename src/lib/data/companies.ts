import { createClient } from "@/lib/supabase/server";
import type { Company, TablesInsert, TablesUpdate } from "@/lib/types/database";

export async function listCompanies(): Promise<Company[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getCompany(id: string): Promise<Company | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

export async function createCompany(input: TablesInsert<"companies">): Promise<Company> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("companies")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCompany(id: string, input: TablesUpdate<"companies">): Promise<Company> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("companies")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCompany(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("companies").delete().eq("id", id);
  if (error) throw error;
}
