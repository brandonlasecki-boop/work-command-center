import { notFound } from "next/navigation";
import { getShareByToken, shareIncludesCompany, touchShareAccess } from "@/lib/data/shares";

export async function requireShareAccess(token: string) {
  const share = await getShareByToken(token);
  if (!share) notFound();
  await touchShareAccess(share.id);
  return share;
}

export async function requireShareCompanyAccess(token: string, companyId: string) {
  const share = await requireShareAccess(token);
  if (!shareIncludesCompany(share, companyId)) notFound();
  return share;
}
