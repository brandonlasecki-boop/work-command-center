import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { WorkItem, WorkItemAttachment, WorkItemAttachmentWithUrl } from "@/lib/types/database";

const BUCKET = "project-resources";
const SIGNED_URL_TTL = 60 * 60;

function getStorageClient() {
  try {
    return createAdminClient();
  } catch {
    return null;
  }
}

async function attachSignedUrls(
  attachments: WorkItemAttachment[]
): Promise<WorkItemAttachmentWithUrl[]> {
  if (attachments.length === 0) return [];

  const supabase = getStorageClient() ?? (await createClient());

  return Promise.all(
    attachments.map(async (attachment) => {
      const { data } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(attachment.storage_path, SIGNED_URL_TTL);

      return {
        ...attachment,
        url: data?.signedUrl ?? null,
      };
    })
  );
}

export async function listAttachmentsByProject(
  projectId: string
): Promise<WorkItemAttachmentWithUrl[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("work_item_attachments")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return attachSignedUrls(data ?? []);
}

export async function listAttachmentsByWorkItem(
  workItemId: string
): Promise<WorkItemAttachmentWithUrl[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("work_item_attachments")
    .select("*")
    .eq("work_item_id", workItemId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return attachSignedUrls(data ?? []);
}

export function groupAttachmentsByWorkItem(
  attachments: WorkItemAttachmentWithUrl[]
): Map<string, WorkItemAttachmentWithUrl[]> {
  const map = new Map<string, WorkItemAttachmentWithUrl[]>();
  for (const attachment of attachments) {
    const list = map.get(attachment.work_item_id) ?? [];
    list.push(attachment);
    map.set(attachment.work_item_id, list);
  }
  return map;
}

export async function uploadWorkItemAttachment(input: {
  companyId: string;
  projectId: string;
  workItemId: string;
  file: File;
}): Promise<WorkItemAttachmentWithUrl> {
  const storage = getStorageClient() ?? (await createClient());
  const db = await createClient();

  const attachmentId = crypto.randomUUID();
  const safeName = input.file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `${input.companyId}/${input.projectId}/${input.workItemId}/${attachmentId}_${safeName}`;

  const buffer = Buffer.from(await input.file.arrayBuffer());
  const { error: uploadError } = await storage.storage.from(BUCKET).upload(storagePath, buffer, {
    contentType: input.file.type || "application/octet-stream",
    upsert: false,
  });

  if (uploadError) throw uploadError;

  const { data, error } = await db
    .from("work_item_attachments")
    .insert({
      id: attachmentId,
      company_id: input.companyId,
      project_id: input.projectId,
      work_item_id: input.workItemId,
      file_name: input.file.name,
      storage_path: storagePath,
      file_size: input.file.size,
      mime_type: input.file.type || null,
    })
    .select()
    .single();

  if (error) {
    await storage.storage.from(BUCKET).remove([storagePath]);
    throw error;
  }

  const [withUrl] = await attachSignedUrls([data]);
  return withUrl;
}

export async function deleteWorkItemAttachment(id: string): Promise<{
  projectId: string;
  workItemId: string;
}> {
  const supabase = await createClient();
  const storage = getStorageClient() ?? supabase;

  const { data: attachment, error: fetchError } = await supabase
    .from("work_item_attachments")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !attachment) throw fetchError ?? new Error("Attachment not found");

  const { error: storageError } = await storage.storage
    .from(BUCKET)
    .remove([attachment.storage_path]);

  if (storageError) throw storageError;

  const { error: deleteError } = await supabase
    .from("work_item_attachments")
    .delete()
    .eq("id", id);

  if (deleteError) throw deleteError;

  return {
    projectId: attachment.project_id,
    workItemId: attachment.work_item_id,
  };
}

export type ProjectAttachmentRow = WorkItemAttachmentWithUrl & {
  work_item: Pick<WorkItem, "id" | "title" | "type"> | null;
};

export async function listProjectAttachmentsWithTasks(
  projectId: string
): Promise<ProjectAttachmentRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("work_item_attachments")
    .select("*, work_item:work_items(id, title, type)")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const rows = (data ?? []) as (WorkItemAttachment & {
    work_item: Pick<WorkItem, "id" | "title" | "type"> | null;
  })[];

  const withUrls = await attachSignedUrls(rows);
  return withUrls.map((row, index) => ({
    ...row,
    work_item: rows[index]?.work_item ?? null,
  }));
}
