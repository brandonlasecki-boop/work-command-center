"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Eye, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Company } from "@/lib/types/database";

function ShareSidebarNav({
  token,
  viewerName,
  companies,
  pathname,
  onNavigate,
}: {
  token: string;
  viewerName: string;
  companies: Pick<Company, "id" | "name">[];
  pathname: string;
  onNavigate?: () => void;
}) {
  const shareBase = `/share/${token}`;
  const showHubLink = companies.length > 1;

  return (
    <>
      <div className="border-b border-white/10 px-6 py-6">
        <Link href={shareBase} className="block" onClick={onNavigate}>
          <h1 className="text-lg font-bold gradient-text">Work Command</h1>
          <p className="text-xs text-muted-foreground">Center</p>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Shared with {viewerName}
        </p>
        {showHubLink && (
          <Link
            href={shareBase}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
              pathname === shareBase
                ? "bg-white/10 text-white"
                : "text-muted-foreground hover:bg-white/5 hover:text-white"
            )}
          >
            <Building2 className="h-4 w-4" />
            All companies
          </Link>
        )}
        {companies.map((company) => {
          const href = `${shareBase}/company/${company.id}`;
          const isActive = pathname === href;

          return (
            <Link
              key={company.id}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <Building2 className="h-4 w-4 shrink-0" />
              <span className="truncate">{company.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-muted-foreground">
          <Eye className="h-4 w-4 shrink-0 text-indigo-300" />
          <span>View only — no editing</span>
        </div>
      </div>
    </>
  );
}

export function ShareShell({
  token,
  viewerName,
  companies,
  children,
}: {
  token: string;
  viewerName: string;
  companies: Pick<Company, "id" | "name">[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const shareBase = `/share/${token}`;

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-black/40 backdrop-blur-xl transition-transform duration-200 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <ShareSidebarNav
          token={token}
          viewerName={viewerName}
          companies={companies}
          pathname={pathname}
          onNavigate={() => setMobileOpen(false)}
        />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:ml-64">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/10 bg-black/40 px-4 py-3 backdrop-blur-xl lg:hidden">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <Link href={shareBase} className="min-w-0 flex-1 truncate">
            <span className="font-semibold gradient-text">Work Command Center</span>
          </Link>
        </header>

        <main className="min-w-0 flex-1 overflow-x-hidden p-4 md:p-6 lg:p-8 xl:p-10">
          <div className="mx-auto w-full min-w-0 max-w-[1920px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
