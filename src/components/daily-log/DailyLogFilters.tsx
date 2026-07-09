"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/glass-card";
import type { Company, Project } from "@/lib/types/database";

export function DailyLogFilters({
  companies,
  projects,
  current,
}: {
  companies: Company[];
  projects: Project[];
  current: { company?: string; project?: string; from?: string; to?: string };
}) {
  const router = useRouter();

  function update(key: string, value: string) {
    const params = new URLSearchParams();
    const next = { ...current, [key]: value || undefined };
    if (next.company) params.set("company", next.company);
    if (next.project) params.set("project", next.project);
    if (next.from) params.set("from", next.from);
    if (next.to) params.set("to", next.to);
    router.push(`/daily-log?${params.toString()}`);
  }

  const filteredProjects = current.company
    ? projects.filter((p) => p.company_id === current.company)
    : projects;

  return (
    <GlassCard className="p-4">
      <div className="grid gap-4 sm:grid-cols-4">
        <div>
          <Label className="text-xs">Company</Label>
          <Select
            value={current.company ?? "all"}
            onValueChange={(v) => update("company", !v || v === "all" ? "" : v)}
          >
            <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All companies</SelectItem>
              {companies.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Project</Label>
          <Select
            value={current.project ?? "all"}
            onValueChange={(v) => update("project", !v || v === "all" ? "" : v)}
          >
            <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All projects</SelectItem>
              {filteredProjects.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">From</Label>
          <Input
            type="date"
            defaultValue={current.from ?? ""}
            onChange={(e) => update("from", e.target.value)}
          />
        </div>
        <div>
          <Label className="text-xs">To</Label>
          <Input
            type="date"
            defaultValue={current.to ?? ""}
            onChange={(e) => update("to", e.target.value)}
          />
        </div>
      </div>
    </GlassCard>
  );
}
