"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import {
  ExternalLink,
  FileText,
  Loader2,
  Trash2,
  Upload,
  FileStack,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import {
  uploadProjectDocumentAction,
  deleteProjectDocumentAction,
} from "@/app/actions/project-documents";
import type { ProjectDocumentWithUrl } from "@/lib/types/database";

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ProjectDocumentsPanel({
  projectId,
  documents: initialDocuments,
  readOnly = false,
}: {
  projectId: string;
  documents: ProjectDocumentWithUrl[];
  readOnly?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState(initialDocuments);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleUpload(fileList: FileList | null) {
    if (!fileList?.length || readOnly) return;

    startTransition(async () => {
      for (const file of Array.from(fileList)) {
        const formData = new FormData();
        formData.set("file", file);
        formData.set("project_id", projectId);

        const result = await uploadProjectDocumentAction(formData);
        if (result.document) {
          setItems((prev) => [result.document, ...prev]);
        }
      }
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    if (readOnly) return;

    startTransition(async () => {
      await deleteProjectDocumentAction(id, projectId);
      setItems((prev) => prev.filter((item) => item.id !== id));
      router.refresh();
    });
  }

  return (
    <GlassCard className="p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2">
          <FileStack className="mt-0.5 h-5 w-5 shrink-0 text-indigo-300" />
          <div className="min-w-0">
            <h2 className="text-lg font-semibold">Documents</h2>
            <p className="text-sm text-muted-foreground">
              Project files such as SOWs, contracts, and briefs
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium tabular-nums text-muted-foreground">
            {items.length} file{items.length === 1 ? "" : "s"}
          </span>
          {!readOnly && (
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
          )}
        </div>
      </div>

      {!readOnly && (
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(event) => {
            handleUpload(event.target.files);
            event.target.value = "";
          }}
        />
      )}

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-muted-foreground">
          <FileText className="mx-auto mb-2 h-5 w-5 opacity-50" />
          {readOnly
            ? "No project documents uploaded yet."
            : "No documents yet. Upload SOWs, contracts, or other project files."}
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((document) => (
            <div
              key={document.id}
              className="flex flex-wrap items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 sm:flex-nowrap"
            >
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-indigo-300" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{document.file_name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatFileSize(document.file_size)}
                  {" · "}
                  {formatDistanceToNow(new Date(document.created_at), { addSuffix: true })}
                  {document.description && (
                    <>
                      {" · "}
                      {document.description}
                    </>
                  )}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {document.url && (
                  <Button
                    variant="outline"
                    size="sm"
                    nativeButton={false}
                    render={
                      <a href={document.url} target="_blank" rel="noopener noreferrer" />
                    }
                  >
                    Open
                    <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                )}
                {!readOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    disabled={isPending}
                    onClick={() => handleDelete(document.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
