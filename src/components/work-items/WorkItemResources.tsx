"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import {
  Paperclip,
  Upload,
  Trash2,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  uploadWorkItemAttachmentAction,
  deleteWorkItemAttachmentAction,
} from "@/app/actions/attachments";
import type { WorkItemAttachmentWithUrl } from "@/lib/types/database";
import { cn } from "@/lib/utils";

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileTypeIcon({ mimeType }: { mimeType: string | null }) {
  if (mimeType?.startsWith("image/")) return <ImageIcon className="h-4 w-4 text-sky-400" />;
  if (mimeType?.includes("sheet") || mimeType?.includes("excel") || mimeType?.includes("csv")) {
    return <FileSpreadsheet className="h-4 w-4 text-emerald-400" />;
  }
  return <FileText className="h-4 w-4 text-muted-foreground" />;
}

export function WorkItemResourcesSection({
  projectId,
  workItemId,
  initialAttachments,
}: {
  projectId: string;
  workItemId?: string;
  initialAttachments: WorkItemAttachmentWithUrl[];
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState(initialAttachments);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (!workItemId) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-4 text-sm text-muted-foreground">
        Save this work item first, then you can attach files and resources.
      </div>
    );
  }

  const itemId = workItemId;

  function handleUpload(fileList: FileList | null) {
    if (!fileList?.length) return;

    startTransition(async () => {
      for (const file of Array.from(fileList)) {
        const formData = new FormData();
        formData.set("file", file);
        formData.set("work_item_id", itemId);
        formData.set("project_id", projectId);

        const result = await uploadWorkItemAttachmentAction(formData);
        if (result.attachment) {
          setItems((prev) => [result.attachment, ...prev]);
        }
      }
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteWorkItemAttachmentAction(id, projectId);
      setItems((prev) => prev.filter((item) => item.id !== id));
      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Resources & Attachments</p>
          <p className="text-xs text-muted-foreground">
            Files stored under this company and project
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => inputRef.current?.click()}
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          Upload
        </Button>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            handleUpload(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-6 text-center text-sm text-muted-foreground">
          No files yet. Upload docs, screenshots, approvals, or reference files.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5"
            >
              <FileTypeIcon mimeType={item.mime_type} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.file_name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(item.file_size)}
                  {" · "}
                  {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {item.url && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    nativeButton={false}
                    render={<a href={item.url} target="_blank" rel="noopener noreferrer" />}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive"
                  disabled={isPending}
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function WorkItemAttachmentIndicator({
  attachments,
  className,
}: {
  attachments: WorkItemAttachmentWithUrl[];
  className?: string;
}) {
  if (attachments.length === 0) return null;

  const openable = attachments.filter((a) => a.url);
  const count = attachments.length;

  const badgeClass = cn(
    "inline-flex shrink-0 items-center gap-1 rounded-lg bg-indigo-400/15 px-1.5 py-0.5 text-indigo-200 ring-1 ring-indigo-400/30 transition-colors",
    openable.length > 0 && "cursor-pointer hover:bg-indigo-400/25 hover:ring-indigo-400/50",
    className
  );

  const badgeContent = (
    <>
      <Paperclip className="h-3.5 w-3.5" />
      <span className="text-[10px] font-semibold tabular-nums">{count}</span>
    </>
  );

  if (openable.length === 0) {
    return (
      <span className={badgeClass} title={`${count} attachment${count === 1 ? "" : "s"} (unavailable)`}>
        {badgeContent}
      </span>
    );
  }

  if (openable.length === 1) {
    const attachment = openable[0];
    return (
      <a
        href={attachment.url!}
        target="_blank"
        rel="noopener noreferrer"
        className={badgeClass}
        title={`Open ${attachment.file_name}`}
        onClick={(e) => e.stopPropagation()}
      >
        {badgeContent}
      </a>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={badgeClass}
        title={`${count} attachments — click to open`}
        onClick={(e) => e.stopPropagation()}
      >
        {badgeContent}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-w-xs">
        {openable.map((attachment) => (
          <DropdownMenuItem
            key={attachment.id}
            nativeButton={false}
            render={
              <a href={attachment.url!} target="_blank" rel="noopener noreferrer" />
            }
          >
            <Paperclip className="h-3.5 w-3.5 shrink-0 text-indigo-300" />
            <span className="truncate">{attachment.file_name}</span>
            <ExternalLink className="ml-auto h-3 w-3 shrink-0 opacity-50" />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
