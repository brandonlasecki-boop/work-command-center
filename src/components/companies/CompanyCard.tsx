import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { ProgressWithTrend } from "@/components/ui/progress-with-trend";
import { OngoingSupportBadge } from "@/components/ui/status-badge";
import type { CompanyWithProgress } from "@/lib/types/database";

export function CompanyCard({
  company,
  href,
}: {
  company: CompanyWithProgress;
  href?: string;
}) {
  return (
    <Link href={href ?? `/company/${company.id}`} className="block min-w-0">
      <GlassCard
        className="group overflow-hidden p-4 sm:p-6"
        style={{ "--company-accent": company.color } as React.CSSProperties}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {company.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={company.logo_url}
                alt={company.name}
                className="h-10 w-10 shrink-0 rounded-xl object-cover"
              />
            ) : (
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                style={{ backgroundColor: company.color }}
              >
                {company.name.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate font-semibold transition-colors group-hover:company-accent-text">
                  {company.name}
                </h3>
                {company.is_ongoing_support && <OngoingSupportBadge />}
              </div>
              <p className="text-xs text-muted-foreground">
                {company.activeProjectCount} active · {company.projectCount} total
              </p>
            </div>
          </div>
          <ProgressWithTrend
            progress={company.progress}
            deltas={company.progressDeltas}
            size={56}
            strokeWidth={4}
            accentColor={company.color}
            compactDeltas
            align="start"
            className="sm:items-end"
          />
        </div>
        {company.description && (
          <p className="mt-3 line-clamp-2 break-words text-sm text-muted-foreground">
            {company.description}
          </p>
        )}
      </GlassCard>
    </Link>
  );
}

export function EmptyCompanies() {
  return (
    <GlassCard className="flex flex-col items-center justify-center p-12 text-center">
      <div className="mb-4 text-4xl">🏢</div>
      <h3 className="text-lg font-semibold">No companies yet</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Add your first company to start tracking work across organizations.
      </p>
    </GlassCard>
  );
}
