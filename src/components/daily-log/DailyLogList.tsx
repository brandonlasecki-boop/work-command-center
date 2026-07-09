"use client";

import { useState } from "react";
import { format } from "date-fns";
import { GlassCard } from "@/components/ui/glass-card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ActivityFeedItem } from "@/components/daily-log/ActivityFeedItem";
import type { DailyLogEnriched } from "@/lib/types/database";
import { deleteDailyLogAction } from "@/app/actions/daily-logs";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function DailyLogList({
  logs,
  readOnly = false,
  shareToken,
}: {
  logs: DailyLogEnriched[];
  readOnly?: boolean;
  shareToken?: string;
}) {
  if (logs.length === 0) {
    return (
      <GlassCard className="p-8 text-center">
        <p className="text-muted-foreground">No completed work logged yet.</p>
      </GlassCard>
    );
  }

  const grouped = logs.reduce<Record<string, DailyLogEnriched[]>>((acc, log) => {
    const key = log.log_date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(log);
    return acc;
  }, {});

  return (
    <TooltipProvider delay={150}>
      <div className="space-y-6">
        {Object.entries(grouped).map(([date, dayLogs]) => (
          <div key={date}>
            <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              {format(new Date(date + "T12:00:00"), "EEEE, MMM d, yyyy")}
            </h3>
            <div className="space-y-2">
              {dayLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <ActivityFeedItem log={log} shareToken={shareToken} />
                  </div>
                  {!readOnly && !log.work_item_id && (
                    <ManualLogDeleteButton logId={log.id} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
}

function ManualLogDeleteButton({ logId }: { logId: string }) {
  const [deleting, setDeleting] = useState(false);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="shrink-0"
      disabled={deleting}
      onClick={async () => {
        setDeleting(true);
        await deleteDailyLogAction(logId);
        setDeleting(false);
      }}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
