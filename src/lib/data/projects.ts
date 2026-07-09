import { createClient } from "@/lib/supabase/server";
import type { Project, TablesInsert, TablesUpdate } from "@/lib/types/database";

export async function listProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function listProjectsByCompany(companyId: string): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("company_id", companyId)
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getProject(id: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

export async function createProject(input: TablesInsert<"projects">): Promise<Project> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProject(id: string, input: TablesUpdate<"projects">): Promise<Project> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProject(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}
