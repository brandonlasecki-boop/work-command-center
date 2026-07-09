import { formatDistanceToNow } from "date-fns";
import { ExternalLink, FolderOpen, Paperclip } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import type { ProjectAttachmentRow } from "@/lib/data/attachments";

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ProjectResourcesPanel({
  attachments,
  readOnly = false,
}: {
  attachments: ProjectAttachmentRow[];
  projectId?: string;
  readOnly?: boolean;
}) {
  return (
    <GlassCard className="min-w-0 overflow-hidden p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2">
          <FolderOpen className="mt-0.5 h-5 w-5 shrink-0 text-indigo-300" />
          <div className="min-w-0">
            <h2 className="text-lg font-semibold">Task Attachments</h2>
            <p className="text-sm text-muted-foreground">
              All files attached to tasks in this project
            </p>
          </div>
        </div>
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium tabular-nums text-muted-foreground">
          {attachments.length} file{attachments.length === 1 ? "" : "s"}
        </span>
      </div>

      {attachments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-muted-foreground">
          <Paperclip className="mx-auto mb-2 h-5 w-5 opacity-50" />
          No resources yet. Edit a task and upload files from the Resources section.
        </div>
      ) : (
        <div className="space-y-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex flex-wrap items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 sm:flex-nowrap"
            >
              <Paperclip className="mt-0.5 h-4 w-4 shrink-0 text-indigo-300" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{attachment.file_name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {attachment.work_item?.title ?? "Unknown task"}
                  {" · "}
                  {formatFileSize(attachment.file_size)}
                  {" · "}
                  {formatDistanceToNow(new Date(attachment.created_at), { addSuffix: true })}
                </p>
              </div>
              {attachment.url && (
                <Button
                  variant="outline"
                  size="sm"
                  nativeButton={false}
                  render={<a href={attachment.url} target="_blank" rel="noopener noreferrer" />}
                >
                  Open
                  <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {!readOnly && (
        <p className="mt-4 text-xs text-muted-foreground">
          Tip: open any task with the pencil icon to upload files to that specific task.
        </p>
      )}
    </GlassCard>
  );
}
