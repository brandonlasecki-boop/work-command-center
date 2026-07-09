import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { getCompanyInitials } from "@/lib/constants/companies";
import type { CompanyWithProgress, DailyLogWithRelations } from "@/lib/types/database";

function getCompanyStatus(progress: number) {
  if (progress >= 50) return { label: "ON TRACK", className: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" };
  return { label: "NEEDS ATTENTION", className: "bg-orange-500/20 text-orange-300 border-orange-500/30" };
}

export function CompanyOverviewCard({
  company,
  todayLogs,
}: {
  company: CompanyWithProgress;
  todayLogs: DailyLogWithRelations[];
}) {
  const status = getCompanyStatus(company.progress);
  const tasksToday = todayLogs.filter((log) => log.company_id === company.id).length;

  return (
    <Link href={`/company/${company.id}`}>
      <GlassCard
        className="group relative overflow-hidden p-5"
        style={{ "--company-accent": company.color } as React.CSSProperties}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-60"
          style={{ background: `linear-gradient(90deg, transparent, ${company.color}, transparent)` }}
        />
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {company.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={company.logo_url}
                alt={company.name}
                className="h-10 w-10 rounded-xl object-cover ring-1 ring-white/10"
              />
            ) : (
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold text-white ring-1 ring-white/10"
                style={{ backgroundColor: company.color }}
              >
                {getCompanyInitials(company.name)}
              </div>
            )}
            <div>
              <h3 className="font-semibold group-hover:company-accent-text transition-colors">
                {company.name}
              </h3>
              <span
                className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wider ${status.className}`}
              >
                {status.label}
              </span>
            </div>
          </div>
          <ProgressRing
            progress={company.progress}
            size={72}
            strokeWidth={5}
            accentColor={company.color}
            large
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

        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>{company.projectCount} total projects</span>
          <span className="font-medium" style={{ color: company.color }}>
            {company.progress}% complete
          </span>
        </div>
      </GlassCard>
    </Link>
  );
}
