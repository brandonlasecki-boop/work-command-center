"use server";

import { revalidatePath } from "next/cache";
import * as projectDocuments from "@/lib/data/project-documents";
import * as projects from "@/lib/data/projects";

export async function uploadProjectDocumentAction(formData: FormData) {
  const file = formData.get("file");
  const projectId = String(formData.get("project_id") ?? "");
  const description = formData.get("description");

  if (!(file instanceof File) || file.size === 0) {
    throw new Error("No file provided");
  }

  const project = await projects.getProject(projectId);
  if (!project) throw new Error("Project not found");

  const document = await projectDocuments.uploadProjectDocument({
    companyId: project.company_id,
    projectId,
    file,
    description: typeof description === "string" && description.trim() ? description.trim() : null,
  });

  revalidatePath(`/project/${projectId}`);
  revalidatePath(`/share`);
  return { success: true, document };
}

export async function deleteProjectDocumentAction(id: string, projectId: string) {
  const { projectId: deletedProjectId } = await projectDocuments.deleteProjectDocument(id);
  revalidatePath(`/project/${deletedProjectId ?? projectId}`);
  revalidatePath(`/share`);
  return { success: true };
}
