"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import * as companies from "@/lib/data/companies";

const companySchema = z.object({
  name: z.string().min(1),
  color: z.string().default("#6366f1"),
  logo_url: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

export async function createCompanyAction(formData: FormData) {
  const parsed = companySchema.parse({
    name: formData.get("name"),
    color: formData.get("color") || "#6366f1",
    logo_url: formData.get("logo_url") || null,
    description: formData.get("description") || null,
  });
  await companies.createCompany(parsed);
  revalidatePath("/dashboard");
  revalidatePath("/companies");
  revalidatePath("/tv");
}

export async function updateCompanyAction(id: string, formData: FormData) {
  const parsed = companySchema.parse({
    name: formData.get("name"),
    color: formData.get("color") || "#6366f1",
    logo_url: formData.get("logo_url") || null,
    description: formData.get("description") || null,
  });
  await companies.updateCompany(id, parsed);
  revalidatePath("/dashboard");
  revalidatePath("/companies");
  revalidatePath(`/company/${id}`);
  revalidatePath("/tv");
}

export async function deleteCompanyAction(id: string) {
  await companies.deleteCompany(id);
  revalidatePath("/dashboard");
  revalidatePath("/companies");
  revalidatePath("/tv");
}
