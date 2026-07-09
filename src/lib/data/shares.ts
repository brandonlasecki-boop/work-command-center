import { createClient } from "@/lib/supabase/server";
import { generateShareToken, isShareActive } from "@/lib/shares/token";
import type { Company, CompanyShare, CompanyShareWithCompany } from "@/lib/types/database";

export async function listCompanyShares(): Promise<CompanyShareWithCompany[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("company_shares")
    .select("*, company:companies(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    ...row,
    company: row.company as Company,
  }));
}

export async function listSharesByCompany(companyId: string): Promise<CompanyShare[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("company_shares")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createCompanyShare(input: {
  companyId: string;
  viewerName: string;
  viewerEmail: string;
  expiresAt?: string | null;
}): Promise<CompanyShare> {
  const supabase = await createClient();
  const accessToken = generateShareToken();

  const { data, error } = await supabase
    .from("company_shares")
    .insert({
      company_id: input.companyId,
      viewer_name: input.viewerName.trim(),
      viewer_email: input.viewerEmail.trim().toLowerCase(),
      access_token: accessToken,
      expires_at: input.expiresAt ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function revokeCompanyShare(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("company_shares")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}

export async function getShareByToken(token: string): Promise<CompanyShareWithCompany | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("company_shares")
    .select("*, company:companies(*)")
    .eq("access_token", token)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const share = {
    ...data,
    company: data.company as Company,
  };

  if (!isShareActive(share)) return null;
  return share;
}

export async function touchShareAccess(id: string): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from("company_shares")
    .update({ last_accessed_at: new Date().toISOString() })
    .eq("id", id);
}
