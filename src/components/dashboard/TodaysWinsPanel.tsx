import { format } from "date-fns";
import { CheckCircle2, PartyPopper } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import type { DailyLogWithRelations } from "@/lib/types/database";

export function TodaysWinsPanel({ logs }: { logs: DailyLogWithRelations[] }) {
  return (
    <GlassCard className="relative flex h-full flex-col p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Today&apos;s Wins
      </h2>

      {logs.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
          <PartyPopper className="mb-3 h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No wins logged yet today.</p>
          <p className="mt-1 text-xs text-muted-foreground">Go get one!</p>
        </div>
      ) : (
        <div className="flex-1 space-y-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-3 rounded-xl border border-emerald-500/10 bg-emerald-500/5 px-3 py-2.5"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {format(new Date(log.created_at), "h:mm a")}
                  </span>
                  {log.company && (
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{
                        backgroundColor: `${log.company.color}20`,
                        color: log.company.color,
                      }}
                    >
                      {log.company.name}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm font-medium">{log.title}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {logs.length > 0 && (
        <div className="pointer-events-none absolute bottom-3 left-3 opacity-40">
          <PartyPopper className="h-6 w-6 text-amber-400" />
        </div>
      )}
    </GlassCard>
  );
}
