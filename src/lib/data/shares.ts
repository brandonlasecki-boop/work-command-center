import { createClient } from "@/lib/supabase/server";
import { generateShareToken, isShareActive } from "@/lib/shares/token";
import type { Company, CompanyShare, CompanyShareWithCompanies } from "@/lib/types/database";

type ShareCompanyRow = {
  company: Company | Company[] | null;
};

function mapShareCompanies(rows: ShareCompanyRow[] | null | undefined): Company[] {
  if (!rows?.length) return [];
  return rows
    .map((row) => {
      const company = row.company;
      if (Array.isArray(company)) return company[0] ?? null;
      return company;
    })
    .filter((company): company is Company => company != null);
}

function mapShareRow(
  row: CompanyShare & { company_share_companies?: ShareCompanyRow[] | null }
): CompanyShareWithCompanies {
  const { company_share_companies, ...share } = row;
  return {
    ...share,
    companies: mapShareCompanies(company_share_companies),
  };
}

const shareWithCompaniesSelect = `
  *,
  company_share_companies (
    company:companies (*)
  )
`;

export async function listCompanyShares(): Promise<CompanyShareWithCompanies[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("company_shares")
    .select(shareWithCompaniesSelect)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => mapShareRow(row as CompanyShare & { company_share_companies?: ShareCompanyRow[] }));
}

export async function listSharesByCompany(companyId: string): Promise<CompanyShare[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("company_share_companies")
    .select("share:company_shares(*)")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? [])
    .map((row) => row.share as CompanyShare | CompanyShare[] | null)
    .flatMap((share) => (share == null ? [] : Array.isArray(share) ? share : [share]));
}

export async function createCompanyShare(input: {
  companyIds: string[];
  viewerName: string;
  viewerEmail: string;
  expiresAt?: string | null;
}): Promise<CompanyShareWithCompanies> {
  const supabase = await createClient();
  const accessToken = generateShareToken();
  const uniqueCompanyIds = [...new Set(input.companyIds)];

  if (uniqueCompanyIds.length === 0) {
    throw new Error("At least one company is required");
  }

  const { data: share, error } = await supabase
    .from("company_shares")
    .insert({
      viewer_name: input.viewerName.trim(),
      viewer_email: input.viewerEmail.trim().toLowerCase(),
      access_token: accessToken,
      expires_at: input.expiresAt ?? null,
    })
    .select()
    .single();

  if (error) throw error;

  const { error: linkError } = await supabase.from("company_share_companies").insert(
    uniqueCompanyIds.map((companyId) => ({
      share_id: share.id,
      company_id: companyId,
    }))
  );

  if (linkError) {
    await supabase.from("company_shares").delete().eq("id", share.id);
    throw linkError;
  }

  const created = await getShareByToken(accessToken);
  if (!created) throw new Error("Failed to load created share");
  return created;
}

export async function revokeCompanyShare(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("company_shares")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}

export async function getShareByToken(token: string): Promise<CompanyShareWithCompanies | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("company_shares")
    .select(shareWithCompaniesSelect)
    .eq("access_token", token)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const share = mapShareRow(data as CompanyShare & { company_share_companies?: ShareCompanyRow[] });
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

export function shareIncludesCompany(share: CompanyShareWithCompanies, companyId: string): boolean {
  return share.companies.some((company) => company.id === companyId);
}
