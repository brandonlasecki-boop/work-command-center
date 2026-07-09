import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ProjectDocument, ProjectDocumentWithUrl } from "@/lib/types/database";

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
  documents: ProjectDocument[]
): Promise<ProjectDocumentWithUrl[]> {
  if (documents.length === 0) return [];

  const supabase = getStorageClient() ?? (await createClient());

  return Promise.all(
    documents.map(async (document) => {
      const { data } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(document.storage_path, SIGNED_URL_TTL);

      return {
        ...document,
        url: data?.signedUrl ?? null,
      };
    })
  );
}

export async function listProjectDocuments(
  projectId: string
): Promise<ProjectDocumentWithUrl[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_documents")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return attachSignedUrls(data ?? []);
}

export async function uploadProjectDocument(input: {
  companyId: string;
  projectId: string;
  file: File;
  description?: string | null;
}): Promise<ProjectDocumentWithUrl> {
  const storage = getStorageClient() ?? (await createClient());
  const db = await createClient();

  const documentId = crypto.randomUUID();
  const safeName = input.file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `${input.companyId}/${input.projectId}/documents/${documentId}_${safeName}`;

  const buffer = Buffer.from(await input.file.arrayBuffer());
  const { error: uploadError } = await storage.storage.from(BUCKET).upload(storagePath, buffer, {
    contentType: input.file.type || "application/octet-stream",
    upsert: false,
  });

  if (uploadError) throw uploadError;

  const { data, error } = await db
    .from("project_documents")
    .insert({
      id: documentId,
      company_id: input.companyId,
      project_id: input.projectId,
      file_name: input.file.name,
      storage_path: storagePath,
      file_size: input.file.size,
      mime_type: input.file.type || null,
      description: input.description ?? null,
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

export async function deleteProjectDocument(id: string): Promise<{ projectId: string }> {
  const supabase = await createClient();
  const storage = getStorageClient() ?? supabase;

  const { data: document, error: fetchError } = await supabase
    .from("project_documents")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !document) throw fetchError ?? new Error("Document not found");

  const { error: storageError } = await storage.storage
    .from(BUCKET)
    .remove([document.storage_path]);

  if (storageError) throw storageError;

  const { error: deleteError } = await supabase.from("project_documents").delete().eq("id", id);

  if (deleteError) throw deleteError;

  return { projectId: document.project_id };
}
