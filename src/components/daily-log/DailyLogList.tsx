"use client";

import { useState } from "react";
import { format } from "date-fns";
import { GlassCard } from "@/components/ui/glass-card";
import type { DailyLogWithRelations } from "@/lib/types/database";
import { deleteDailyLogAction } from "@/app/actions/daily-logs";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function DailyLogList({ logs }: { logs: DailyLogWithRelations[] }) {
  if (logs.length === 0) {
    return (
      <GlassCard className="p-8 text-center">
        <p className="text-muted-foreground">No completed work logged yet.</p>
      </GlassCard>
    );
  }

  const grouped = logs.reduce<Record<string, DailyLogWithRelations[]>>((acc, log) => {
    const key = log.log_date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(log);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([date, dayLogs]) => (
        <div key={date}>
          <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            {format(new Date(date + "T12:00:00"), "EEEE, MMM d, yyyy")}
          </h3>
          <div className="space-y-2">
            {dayLogs.map((log) => (
              <DailyLogEntry key={log.id} log={log} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DailyLogEntry({ log }: { log: DailyLogWithRelations }) {
  const [deleting, setDeleting] = useState(false);

  return (
    <GlassCard className="flex items-start justify-between gap-4 p-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {log.company && (
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: log.company.color }}
            />
          )}
          <span className="text-xs text-muted-foreground">
            {log.company?.name}
            {log.project && ` · ${log.project.name}`}
          </span>
        </div>
        <p className="mt-1 font-medium">{log.title}</p>
        {log.description && (
          <p className="mt-1 text-sm text-muted-foreground">{log.description}</p>
        )}
      </div>
      {!log.work_item_id && (
        <Button
          variant="ghost"
          size="icon"
          disabled={deleting}
          onClick={async () => {
            setDeleting(true);
            await deleteDailyLogAction(log.id);
            setDeleting(false);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </GlassCard>
  );
}
