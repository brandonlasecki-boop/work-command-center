import { notFound } from "next/navigation";
import { getShareByToken, touchShareAccess } from "@/lib/data/shares";

export async function requireShareAccess(token: string) {
  const share = await getShareByToken(token);
  if (!share) notFound();
  await touchShareAccess(share.id);
  return share;
}
