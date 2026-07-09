import { Eye } from "lucide-react";
import type { CompanyShareWithCompanies } from "@/lib/types/database";

export function ShareViewBanner({ share }: { share: CompanyShareWithCompanies }) {
  const companyLabel =
    share.companies.length === 0
      ? "No companies"
      : share.companies.length === 1
        ? share.companies[0].name
        : `${share.companies.length} companies`;

  return (
    <div className="border-b border-white/10 bg-indigo-500/10 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1920px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20">
            <Eye className="h-4 w-4 text-indigo-300" />
          </div>
          <div>
            <p className="text-sm font-medium">Shared view for {share.viewer_name}</p>
            <p className="text-xs text-muted-foreground">
              {companyLabel} · Read-only access
            </p>
          </div>
        </div>
        <span className="rounded-full border border-indigo-400/30 bg-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-200">
          View only
        </span>
      </div>
    </div>
  );
}
