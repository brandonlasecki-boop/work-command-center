"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import * as projects from "@/lib/data/projects";

const projectSchema = z.object({
  company_id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  status: z.enum(["not_started", "in_progress", "completed", "blocked", "paused"]).default("not_started"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  start_date: z.string().optional().nullable(),
  due_date: z.string().optional().nullable(),
  manual_progress_override: z.coerce.number().optional().nullable(),
});

export async function createProjectAction(formData: FormData) {
  const parsed = projectSchema.parse({
    company_id: formData.get("company_id"),
    name: formData.get("name"),
    description: formData.get("description") || null,
    status: formData.get("status") || "not_started",
    priority: formData.get("priority") || "medium",
    start_date: formData.get("start_date") || null,
    due_date: formData.get("due_date") || null,
    manual_progress_override: formData.get("manual_progress_override") || null,
  });
  const project = await projects.createProject(parsed);
  revalidatePath("/dashboard");
  revalidatePath(`/company/${parsed.company_id}`);
  revalidatePath("/tv");
  return project;
}

export async function updateProjectAction(id: string, formData: FormData) {
  const parsed = projectSchema.parse({
    company_id: formData.get("company_id"),
    name: formData.get("name"),
    description: formData.get("description") || null,
    status: formData.get("status") || "not_started",
    priority: formData.get("priority") || "medium",
    start_date: formData.get("start_date") || null,
    due_date: formData.get("due_date") || null,
    manual_progress_override: formData.get("manual_progress_override") || null,
  });
  await projects.updateProject(id, parsed);
  revalidatePath("/dashboard");
  revalidatePath(`/company/${parsed.company_id}`);
  revalidatePath(`/project/${id}`);
  revalidatePath("/tv");
}

export async function deleteProjectAction(id: string, companyId: string) {
  await projects.deleteProject(id);
  revalidatePath("/dashboard");
  revalidatePath(`/company/${companyId}`);
  revalidatePath("/tv");
}
