import { listCompanies } from "@/lib/data/companies";
import { listCompanyShares } from "@/lib/data/shares";
import { ShareManagementPanel } from "@/components/admin/ShareManagementPanel";
import { Shield } from "lucide-react";

export default async function AdminSharesPage() {
  const [companies, shares] = await Promise.all([listCompanies(), listCompanyShares()]);

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20">
          <Shield className="h-6 w-6 text-indigo-300" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Sharing & Access</h1>
          <p className="text-muted-foreground">
            Share read-only company views with clients, partners, or stakeholders via secure links.
          </p>
        </div>
      </div>

      <ShareManagementPanel companies={companies} shares={shares} />
    </div>
  );
}
