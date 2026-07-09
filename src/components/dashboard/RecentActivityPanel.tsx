"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ActivityFeedItem } from "@/components/daily-log/ActivityFeedItem";
import type { DailyLogEnriched } from "@/lib/types/database";

export function RecentActivityPanel({ logs }: { logs: DailyLogEnriched[] }) {
  return (
    <GlassCard className="flex h-full flex-col p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Recent Activity
      </h2>

      {logs.length === 0 ? (
        <p className="flex-1 text-sm text-muted-foreground">No recent activity yet.</p>
      ) : (
        <TooltipProvider delay={150}>
          <div className="flex-1 space-y-2">
            {logs.slice(0, 8).map((log) => (
              <ActivityFeedItem key={log.id} log={log} />
            ))}
          </div>
        </TooltipProvider>
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
