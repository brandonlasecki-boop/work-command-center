"use client";

import { useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { StatusBadge, PriorityBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateProjectAction, deleteProjectAction } from "@/app/actions/projects";
import { Pencil, Trash2 } from "lucide-react";
import type { ProjectWithProgress } from "@/lib/types/database";

export function ProjectCard({
  project,
  companyColor,
  href,
}: {
  project: ProjectWithProgress;
  companyColor?: string;
  href?: string;
}) {
  return (
    <Link href={href ?? `/project/${project.id}`}>
      <GlassCard className="group p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold group-hover:text-indigo-300 transition-colors">
              {project.name}
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              <StatusBadge status={project.status} />
              <PriorityBadge priority={project.priority} />
            </div>
          </div>
          <ProgressRing
            progress={project.progress}
            size={52}
            strokeWidth={4}
            accentColor={companyColor}
          />
        </div>
        {project.description && (
          <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
        )}
      </GlassCard>
    </Link>
  );
}

export function ProjectFormDialog({
  companyId,
  project,
  trigger,
}: {
  companyId: string;
  project?: ProjectWithProgress;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<string>(project?.status ?? "not_started");
  const [priority, setPriority] = useState<string>(project?.priority ?? "medium");

  async function handleSubmit(formData: FormData) {
    formData.set("company_id", companyId);
    formData.set("status", status);
    formData.set("priority", priority);
    if (project) {
      await updateProjectAction(project.id, formData);
    } else {
      const { createProjectAction } = await import("@/app/actions/projects");
      await createProjectAction(formData);
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)} className="inline-flex">{trigger}</div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "New Project"}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={project?.name} required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={project?.description ?? ""} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => v && setStatus(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_started">Not Started</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => v && setPriority(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="start_date">Start Date</Label>
              <Input id="start_date" name="start_date" type="date" defaultValue={project?.start_date ?? ""} />
            </div>
            <div>
              <Label htmlFor="due_date">Due Date</Label>
              <Input id="due_date" name="due_date" type="date" defaultValue={project?.due_date ?? ""} />
            </div>
          </div>
          <Button type="submit" className="w-full">{project ? "Save" : "Create Project"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteProjectButton({
  projectId,
  companyId,
}: {
  projectId: string;
  companyId: string;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-destructive hover:text-destructive"
      onClick={async () => {
        if (confirm("Delete this project and all work items?")) {
          await deleteProjectAction(projectId, companyId);
        }
      }}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}

export function EditProjectButton({
  project,
  companyId,
}: {
  project: ProjectWithProgress;
  companyId: string;
}) {
  return (
    <ProjectFormDialog
      companyId={companyId}
      project={project}
      trigger={
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      }
    />
  );
}
