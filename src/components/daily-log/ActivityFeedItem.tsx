"use client";

import Link from "next/link";
import { format } from "date-fns";
import { CheckCircle2, Pencil } from "lucide-react";
import { WorkItemNoteIndicator } from "@/components/work-items/WorkItemNoteIndicator";
import { WorkItemAttachmentIndicator } from "@/components/work-items/WorkItemResources";
import type { DailyLogEnriched } from "@/lib/types/database";

export function ActivityFeedItem({ log }: { log: DailyLogEnriched }) {
  const note = log.work_item?.description ?? log.description ?? "";
  const projectId = log.project_id ?? log.work_item?.project_id;

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5 sm:flex-row sm:items-start sm:gap-3">
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
          {projectId ? (
            <Link
              href={`/project/${projectId}`}
              className="font-medium hover:text-indigo-300 hover:underline"
            >
              {log.title}
            </Link>
          ) : (
            <span className="font-medium">{log.title}</span>
          )}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="text-xs tabular-nums text-muted-foreground">
            {format(new Date(log.created_at), "h:mm a")}
          </span>
          {log.company && (
            <Link
              href={`/company/${log.company.id}`}
              className="rounded-full px-2 py-0.5 text-[10px] font-medium transition-opacity hover:opacity-80"
              style={{
                backgroundColor: `${log.company.color}20`,
                color: log.company.color,
              }}
            >
              {log.company.name}
            </Link>
          )}
          {log.project && (
            <Link
              href={`/project/${log.project.id}`}
              className="text-[10px] text-muted-foreground hover:text-indigo-300 hover:underline"
            >
              {log.project.name}
            </Link>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1 sm:ml-auto">
        <WorkItemNoteIndicator note={note} />
        <WorkItemAttachmentIndicator attachments={log.attachments} />
      </div>
    </div>
  );
}
