import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { ProgressWithTrend } from "@/components/ui/progress-with-trend";
import { OngoingSupportBadge } from "@/components/ui/status-badge";
import { getCompanyInitials } from "@/lib/constants/companies";
import type { CompanyWithProgress, DailyLogWithRelations } from "@/lib/types/database";

function getCompanyStatus(progress: number) {
  if (progress >= 50) return { label: "ON TRACK", className: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" };
  return { label: "NEEDS ATTENTION", className: "bg-orange-500/20 text-orange-300 border-orange-500/30" };
}

export function CompanyOverviewCard({
  company,
  todayLogs,
  shareToken,
}: {
  company: CompanyWithProgress;
  todayLogs: DailyLogWithRelations[];
  shareToken?: string;
}) {
  const status = getCompanyStatus(company.progress);
  const tasksToday = todayLogs.filter((log) => log.company_id === company.id).length;
  const href = shareToken
    ? `/share/${shareToken}/company/${company.id}`
    : `/company/${company.id}`;

  return (
    <Link href={href} className="block min-w-0">
      <GlassCard
        className="group relative overflow-hidden p-4 sm:p-5"
        style={{ "--company-accent": company.color } as React.CSSProperties}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-60"
          style={{ background: `linear-gradient(90deg, transparent, ${company.color}, transparent)` }}
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {company.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={company.logo_url}
                alt={company.name}
                className="h-10 w-10 shrink-0 rounded-xl object-cover ring-1 ring-white/10"
              />
            ) : (
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white ring-1 ring-white/10"
                style={{ backgroundColor: company.color }}
              >
                {getCompanyInitials(company.name)}
              </div>
            )}
            <div className="min-w-0">
              <h3 className="truncate font-semibold group-hover:company-accent-text transition-colors">
                {company.name}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                {company.is_ongoing_support && <OngoingSupportBadge />}
                <span
                  className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wider ${status.className}`}
                >
                  {status.label}
                </span>
              </div>
            </div>
          </div>
          <ProgressWithTrend
            progress={company.progress}
            deltas={company.progressDeltas}
            size={72}
            strokeWidth={5}
            accentColor={company.color}
            large
            align="start"
            className="sm:items-end"
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-center">
          <div className="rounded-xl bg-white/5 px-2 py-2">
            <p className="text-lg font-bold tabular-nums">{company.activeProjectCount}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Active Projects
            </p>
          </div>
          <div className="rounded-xl bg-white/5 px-2 py-2">
            <p className="text-lg font-bold tabular-nums">{tasksToday}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Tasks Today
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>{company.projectCount} total projects</span>
          {company.progressDeltas && company.progressDeltas.month !== 0 ? (
            <span
              className={
                company.progressDeltas.month > 0
                  ? "font-medium text-violet-300"
                  : "font-medium text-red-300"
              }
            >
              {company.progressDeltas.month > 0 ? "+" : ""}
              {company.progressDeltas.month}% this month
            </span>
          ) : (
            <span className="font-medium" style={{ color: company.color }}>
              {company.progress}% complete
            </span>
          )}
        </div>
      </GlassCard>
    </Link>
  );
}
