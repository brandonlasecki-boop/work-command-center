"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import * as shares from "@/lib/data/shares";
import { buildShareUrl } from "@/lib/shares/token";

const shareSchema = z.object({
  company_ids: z.array(z.string().uuid()).min(1, "Select at least one company"),
  viewer_name: z.string().min(1, "Name is required"),
  viewer_email: z.string().email("Valid email is required"),
});

export async function createCompanyShareAction(formData: FormData) {
  const companyIds = formData.getAll("company_ids").map(String);

  const parsed = shareSchema.parse({
    company_ids: companyIds,
    viewer_name: formData.get("viewer_name"),
    viewer_email: formData.get("viewer_email"),
  });

  const share = await shares.createCompanyShare({
    companyIds: parsed.company_ids,
    viewerName: parsed.viewer_name,
    viewerEmail: parsed.viewer_email,
  });

  revalidatePath("/admin/shares");
  return {
    success: true,
    share,
    shareUrl: buildShareUrl(share.access_token),
  };
}

export async function revokeCompanyShareAction(id: string) {
  await shares.revokeCompanyShare(id);
  revalidatePath("/admin/shares");
  return { success: true };
}
