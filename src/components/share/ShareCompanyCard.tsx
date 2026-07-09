import Link from "next/link";
import { ProgressRing } from "@/components/ui/progress-ring";
import { GlassCard } from "@/components/ui/glass-card";
import type { CompanyWithProgress } from "@/lib/types/database";

export function ShareCompanyCard({
  company,
  shareToken,
}: {
  company: CompanyWithProgress;
  shareToken: string;
}) {
  return (
    <Link href={`/share/${shareToken}/company/${company.id}`}>
      <GlassCard className="glass-card-hover block p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold">{company.name}</h3>
            {company.description && (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {company.description}
              </p>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              {company.activeProjectCount} active · {company.projectCount} total projects
            </p>
          </div>
          <ProgressRing
            progress={company.progress}
            size={56}
            strokeWidth={4}
            accentColor={company.color}
          />
        </div>
      </GlassCard>
    </Link>
  );
}
