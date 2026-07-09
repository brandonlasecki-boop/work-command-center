"use server";

import { revalidatePath } from "next/cache";
import * as attachments from "@/lib/data/attachments";
import * as projects from "@/lib/data/projects";

export async function uploadWorkItemAttachmentAction(formData: FormData) {
  const file = formData.get("file");
  const workItemId = String(formData.get("work_item_id") ?? "");
  const projectId = String(formData.get("project_id") ?? "");

  if (!(file instanceof File) || file.size === 0) {
    throw new Error("No file provided");
  }

  const project = await projects.getProject(projectId);
  if (!project) throw new Error("Project not found");

  const attachment = await attachments.uploadWorkItemAttachment({
    companyId: project.company_id,
    projectId,
    workItemId,
    file,
  });

  revalidatePath(`/project/${projectId}`);
  return { success: true, attachment };
}

export async function deleteWorkItemAttachmentAction(id: string, projectId: string) {
  const { projectId: deletedProjectId } = await attachments.deleteWorkItemAttachment(id);
  revalidatePath(`/project/${deletedProjectId ?? projectId}`);
  return { success: true };
}
