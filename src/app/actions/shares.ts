"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import * as shares from "@/lib/data/shares";
import { buildShareUrl } from "@/lib/shares/token";

const shareSchema = z.object({
  company_id: z.string().uuid(),
  viewer_name: z.string().min(1, "Name is required"),
  viewer_email: z.string().email("Valid email is required"),
});

export async function createCompanyShareAction(formData: FormData) {
  const parsed = shareSchema.parse({
    company_id: formData.get("company_id"),
    viewer_name: formData.get("viewer_name"),
    viewer_email: formData.get("viewer_email"),
  });

  const share = await shares.createCompanyShare({
    companyId: parsed.company_id,
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
