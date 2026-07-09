"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GlassCard } from "@/components/ui/glass-card";
import { DailyLogList } from "@/components/daily-log/DailyLogList";
import { createSupportLogAction } from "@/app/actions/daily-logs";
import { Headphones } from "lucide-react";
import type { DailyLogEnriched } from "@/lib/types/database";

export function OngoingSupportSection({
  companyId,
  logs,
  readOnly = false,
  shareToken,
}: {
  companyId: string;
  logs: DailyLogEnriched[];
  readOnly?: boolean;
  shareToken?: string;
}) {
  async function handleSubmit(formData: FormData) {
    formData.set("company_id", companyId);
    await createSupportLogAction(formData);
  }

  return (
    <section>
      <GlassCard className="p-4 sm:p-6">
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20">
            <Headphones className="h-5 w-5 text-cyan-300" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold">Ongoing Support</h2>
            <p className="text-sm text-muted-foreground">
              IT support, devices, email, and other recurring help — log completed support tasks here.
            </p>
          </div>
        </div>

        {!readOnly && (
          <form action={handleSubmit} className="mb-6 space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <h3 className="text-sm font-medium">Log completed support</h3>
            <div>
              <Label htmlFor={`support-title-${companyId}`}>What did you resolve?</Label>
              <Input
                id={`support-title-${companyId}`}
                name="title"
                required
                placeholder="Fixed email sync on iPad, replaced device battery..."
              />
            </div>
            <div>
              <Label htmlFor={`support-description-${companyId}`}>Details (optional)</Label>
              <Textarea
                id={`support-description-${companyId}`}
                name="description"
                placeholder="User, device, steps taken..."
              />
            </div>
            <div>
              <Label htmlFor={`support-date-${companyId}`}>Date</Label>
              <Input
                id={`support-date-${companyId}`}
                name="log_date"
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            </div>
            <Button type="submit" size="sm">
              Add support log
            </Button>
          </form>
        )}

        {logs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {readOnly
              ? "No support tasks logged yet."
              : "No support tasks logged yet. Add one above when you complete support work."}
          </p>
        ) : (
          <DailyLogList logs={logs} readOnly={readOnly} shareToken={shareToken} />
        )}
      </GlassCard>
    </section>
  );
}
