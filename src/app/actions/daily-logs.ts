"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import * as dailyLogs from "@/lib/data/daily-logs";

const logSchema = z.object({
  company_id: z.string().uuid(),
  project_id: z.string().uuid().optional().nullable(),
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  log_date: z.string().optional(),
});

export async function createManualLogAction(formData: FormData) {
  const projectId = formData.get("project_id");
  const parsed = logSchema.parse({
    company_id: formData.get("company_id"),
    project_id: projectId && projectId !== "none" ? projectId : null,
    title: formData.get("title"),
    description: formData.get("description") || null,
    log_date: formData.get("log_date") || new Date().toISOString().split("T")[0],
  });
  await dailyLogs.createManualLog({ ...parsed, log_type: "general" });
  revalidatePath("/daily-log");
  revalidatePath("/dashboard");
  revalidatePath("/tv");
}

export async function createSupportLogAction(formData: FormData) {
  const parsed = logSchema.parse({
    company_id: formData.get("company_id"),
    project_id: null,
    title: formData.get("title"),
    description: formData.get("description") || null,
    log_date: formData.get("log_date") || new Date().toISOString().split("T")[0],
  });
  await dailyLogs.createManualLog({ ...parsed, log_type: "support" });
  revalidatePath("/daily-log");
  revalidatePath("/dashboard");
  revalidatePath("/tv");
  revalidatePath(`/company/${parsed.company_id}`);
}

export async function deleteDailyLogAction(id: string) {
  const companyId = await dailyLogs.deleteDailyLog(id);
  revalidatePath("/daily-log");
  revalidatePath("/dashboard");
  revalidatePath("/tv");
  if (companyId) revalidatePath(`/company/${companyId}`);
}
