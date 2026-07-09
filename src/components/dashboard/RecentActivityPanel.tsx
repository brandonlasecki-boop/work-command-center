import Link from "next/link";
import { format } from "date-fns";
import { CheckCircle2, Pencil, ChevronRight } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import type { DailyLogWithRelations } from "@/lib/types/database";

export function RecentActivityPanel({ logs }: { logs: DailyLogWithRelations[] }) {
  return (
    <GlassCard className="flex h-full flex-col p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Recent Activity
      </h2>

      {logs.length === 0 ? (
        <p className="flex-1 text-sm text-muted-foreground">No recent activity yet.</p>
      ) : (
        <div className="flex-1 space-y-2">
          {logs.slice(0, 8).map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5"
            >
              {log.work_item_id ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              ) : (
                <Pencil className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
              )}
              <div className="min-w-0 flex-1">
                <p className="break-words text-sm">
                  <span className="text-muted-foreground">
                    {log.work_item_id ? "Completed task" : "Logged work"}
                  </span>
                  {" — "}
                  <span className="font-medium">{log.title}</span>
                </p>
                <div className="mt-1 flex items-center gap-2">
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
              </div>
            </div>
          ))}
        </div>
      )}

      <Link
        href="/daily-log"
        className="mt-4 flex items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-white/10 hover:text-white"
      >
        View Full Activity Feed
        <ChevronRight className="h-4 w-4" />
      </Link>
    </GlassCard>
  );
}
