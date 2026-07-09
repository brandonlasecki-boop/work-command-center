"use client";

import { useState, useTransition } from "react";
import { formatDistanceToNow } from "date-fns";
import { Copy, Link2, ShieldOff, UserPlus, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createCompanyShareAction,
  revokeCompanyShareAction,
} from "@/app/actions/shares";
import { buildShareUrl, isShareActive } from "@/lib/shares/token";
import type { Company, CompanyShareWithCompany } from "@/lib/types/database";

function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
      {copied ? (
        <Check className="mr-2 h-4 w-4 text-emerald-400" />
      ) : (
        <Copy className="mr-2 h-4 w-4" />
      )}
      {copied ? "Copied" : "Copy link"}
    </Button>
  );
}

export function ShareManagementPanel({
  companies,
  shares,
}: {
  companies: Company[];
  shares: CompanyShareWithCompany[];
}) {
  const [isPending, startTransition] = useTransition();
  const [companyId, setCompanyId] = useState(companies[0]?.id ?? "");
  const [newShareUrl, setNewShareUrl] = useState<string | null>(null);
  const [newShareName, setNewShareName] = useState("");

  function handleCreate(formData: FormData) {
    formData.set("company_id", companyId);
    startTransition(async () => {
      try {
        const result = await createCompanyShareAction(formData);
        setNewShareUrl(result.shareUrl);
        setNewShareName(String(formData.get("viewer_name") ?? ""));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to create share");
      }
    });
  }

  function handleRevoke(id: string, name: string) {
    if (!confirm(`Revoke access for ${name}? Their link will stop working.`)) return;

    startTransition(async () => {
      try {
        await revokeCompanyShareAction(id);
        toast.success("Share link revoked");
      } catch {
        toast.error("Failed to revoke share");
      }
    });
  }

  return (
    <div className="space-y-8">
      <GlassCard className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20">
            <UserPlus className="h-5 w-5 text-indigo-300" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Invite viewer</h2>
            <p className="text-sm text-muted-foreground">
              Enter their name and email — they get a secure read-only link to that company.
            </p>
          </div>
        </div>

        <form action={handleCreate} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label htmlFor="company_id">Company</Label>
            <Select value={companyId} onValueChange={(v) => v && setCompanyId(v)}>
              <SelectTrigger id="company_id">
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="viewer_name">Name</Label>
            <Input id="viewer_name" name="viewer_name" placeholder="Jane Smith" required />
          </div>
          <div>
            <Label htmlFor="viewer_email">Email</Label>
            <Input
              id="viewer_email"
              name="viewer_email"
              type="email"
              placeholder="jane@example.com"
              required
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" className="w-full" disabled={isPending || !companyId}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Link2 className="mr-2 h-4 w-4" />
              )}
              Create share link
            </Button>
          </div>
        </form>
      </GlassCard>

      <GlassCard className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Active shares</h2>
        {shares.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No share links yet. Create one above to give someone read-only access.
          </p>
        ) : (
          <div className="space-y-3">
            {shares.map((share) => {
              const active = isShareActive(share);
              const shareUrl = buildShareUrl(share.access_token);

              return (
                <div
                  key={share.id}
                  className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{share.viewer_name}</p>
                      <span
                        className={
                          active
                            ? "rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-300"
                            : "rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-300"
                        }
                      >
                        {active ? "Active" : share.revoked_at ? "Revoked" : "Expired"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{share.viewer_email}</p>
                    <p className="mt-1 text-sm">
                      <span className="text-muted-foreground">Company:</span>{" "}
                      {share.company.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Created {formatDistanceToNow(new Date(share.created_at), { addSuffix: true })}
                      {share.last_accessed_at &&
                        ` · Last viewed ${formatDistanceToNow(new Date(share.last_accessed_at), { addSuffix: true })}`}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {active && <CopyLinkButton url={shareUrl} />}
                    {active && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isPending}
                        onClick={() => handleRevoke(share.id, share.viewer_name)}
                      >
                        <ShieldOff className="mr-2 h-4 w-4" />
                        Revoke
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>

      <Dialog open={!!newShareUrl} onOpenChange={(open) => !open && setNewShareUrl(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share link ready</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Send this secure link to {newShareName}. They can view projects and progress — nothing
            can be edited.
          </p>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3">
            <code className="min-w-0 flex-1 truncate text-xs">{newShareUrl}</code>
            {newShareUrl && <CopyLinkButton url={newShareUrl} />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
