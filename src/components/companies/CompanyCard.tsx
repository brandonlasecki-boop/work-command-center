import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { ProgressRing } from "@/components/ui/progress-ring";
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
    <Link href={href ?? `/company/${company.id}`}>
      <GlassCard
        className="group p-6"
        style={{ "--company-accent": company.color } as React.CSSProperties}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {company.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={company.logo_url}
                alt={company.name}
                className="h-10 w-10 rounded-xl object-cover"
              />
            ) : (
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white"
                style={{ backgroundColor: company.color }}
              >
                {company.name.charAt(0)}
              </div>
            )}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold group-hover:company-accent-text transition-colors">
                  {company.name}
                </h3>
                {company.is_ongoing_support && <OngoingSupportBadge />}
              </div>
              <p className="text-xs text-muted-foreground">
                {company.activeProjectCount} active · {company.projectCount} total
              </p>
            </div>
          </div>
          <ProgressRing progress={company.progress} size={56} strokeWidth={4} accentColor={company.color} />
        </div>
        {company.description && (
          <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{company.description}</p>
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
