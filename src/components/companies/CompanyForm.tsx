"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createCompanyAction, updateCompanyAction, deleteCompanyAction } from "@/app/actions/companies";
import { Pencil, Trash2 } from "lucide-react";
import type { Company } from "@/lib/types/database";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f97316", "#22c55e", "#06b6d4", "#eab308"];

export function CompanyFormDialog({
  company,
  trigger,
}: {
  company?: Company;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState(company?.color ?? "#6366f1");

  async function handleSubmit(formData: FormData) {
    formData.set("color", color);
    if (company) {
      await updateCompanyAction(company.id, formData);
    } else {
      await createCompanyAction(formData);
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)} className="inline-flex">{trigger}</div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{company ? "Edit Company" : "New Company"}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={company?.name} required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={company?.description ?? ""} />
          </div>
          <div>
            <Label htmlFor="logo_url">Logo URL</Label>
            <Input id="logo_url" name="logo_url" defaultValue={company?.logo_url ?? ""} placeholder="https://..." />
          </div>
          <div>
            <Label>Color</Label>
            <div className="mt-2 flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="h-8 w-8 rounded-full border-2 transition-transform hover:scale-110"
                  style={{
                    backgroundColor: c,
                    borderColor: color === c ? "white" : "transparent",
                  }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full">{company ? "Save" : "Create Company"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteCompanyButton({ id }: { id: string }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-destructive"
      onClick={async () => {
        if (confirm("Delete this company and all its projects?")) {
          await deleteCompanyAction(id);
        }
      }}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}

export function EditCompanyButton({ company }: { company: Company }) {
  return (
    <CompanyFormDialog
      company={company}
      trigger={
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      }
    />
  );
}

export function NewCompanyButton() {
  return (
    <CompanyFormDialog
      trigger={<Button>Add Company</Button>}
    />
  );
}
