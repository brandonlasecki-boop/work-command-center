"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import * as companies from "@/lib/data/companies";

const companySchema = z.object({
  name: z.string().min(1),
  color: z.string().default("#6366f1"),
  logo_url: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  is_ongoing_support: z.boolean().default(false),
});

function parseCompanyForm(formData: FormData) {
  return companySchema.parse({
    name: formData.get("name"),
    color: formData.get("color") || "#6366f1",
    logo_url: formData.get("logo_url") || null,
    description: formData.get("description") || null,
    is_ongoing_support: formData.get("is_ongoing_support") === "on",
  });
}

export async function createCompanyAction(formData: FormData) {
  const parsed = parseCompanyForm(formData);
  await companies.createCompany(parsed);
  revalidatePath("/dashboard");
  revalidatePath("/companies");
  revalidatePath("/tv");
}

export async function updateCompanyAction(id: string, formData: FormData) {
  const parsed = parseCompanyForm(formData);
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
