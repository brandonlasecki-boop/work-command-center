"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { GlassCard } from "@/components/ui/glass-card";
import { createManualLogAction } from "@/app/actions/daily-logs";
import type { Company, Project } from "@/lib/types/database";

export function DailyLogForm({
  companies,
  projects,
}: {
  companies: Company[];
  projects: Project[];
}) {
  const [companyId, setCompanyId] = useState(companies[0]?.id ?? "");
  const filteredProjects = projects.filter((p) => p.company_id === companyId);

  async function handleSubmit(formData: FormData) {
    formData.set("company_id", companyId);
    await createManualLogAction(formData);
  }

  if (companies.length === 0) return null;

  return (
    <GlassCard className="p-4 sm:p-6">
      <h3 className="mb-4 font-semibold">Log Completed Work</h3>
      <form action={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>Company</Label>
            <Select value={companyId} onValueChange={(v) => v && setCompanyId(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {companies.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Project (optional)</Label>
            <Select name="project_id" defaultValue="none">
              <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {filteredProjects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="title">What did you complete?</Label>
          <Input id="title" name="title" required placeholder="Shipped feature X..." />
        </div>
        <div>
          <Label htmlFor="description">Details (optional)</Label>
          <Textarea id="description" name="description" placeholder="Notes..." />
        </div>
        <div>
          <Label htmlFor="log_date">Date</Label>
          <Input
            id="log_date"
            name="log_date"
            type="date"
            defaultValue={new Date().toISOString().split("T")[0]}
          />
        </div>
        <Button type="submit">Add Log Entry</Button>
      </form>
    </GlassCard>
  );
}
