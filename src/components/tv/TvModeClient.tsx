"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, MonitorOff } from "lucide-react";
import { ProgressRing } from "@/components/ui/progress-ring";
import { StatusBadge, PriorityBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import type { DashboardSummary } from "@/lib/types/database";

export function TvModeClient({ data }: { data: DashboardSummary }) {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => router.refresh(), 30000);
    return () => clearInterval(interval);
  }, [router]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") router.push("/dashboard");
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  const tickerItems = data.todayLogs.length > 0
    ? [...data.todayLogs, ...data.todayLogs]
    : [{ id: "empty", title: "No wins logged today yet — go get one!", company: null, project: null, log_date: "", description: null, created_at: "", company_id: "", project_id: null, work_item_id: null }];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-8 animate-fade-in">
      <div className="fixed right-6 top-6 z-50 flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<Link href="/dashboard" />}
          className="border-white/20 bg-black/40 backdrop-blur hover:bg-white/10"
        >
          <MonitorOff className="mr-2 h-4 w-4" />
          Exit TV Mode
        </Button>
      </div>

      <header className="mb-8 flex items-end justify-between">
        <div>
          <Link
            href="/dashboard"
            className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold tracking-tight gradient-text md:text-5xl">
            Work Command Center
          </h1>
          <p className="mt-1 text-lg text-muted-foreground">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold tabular-nums">{data.todayLogs.length}</p>
          <p className="text-sm text-muted-foreground">wins today</p>
        </div>
      </header>

      {/* Ticker */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-white/10 bg-white/5 py-3 backdrop-blur">
        <div className="animate-marquee flex whitespace-nowrap">
          {tickerItems.map((log, i) => (
            <span key={`${log.id}-${i}`} className="mx-8 inline-flex items-center gap--2 text-lg">
              <span className="text-emerald-400">✓</span>
              {log.title}
              {"company" in log && log.company && (
                <span className="text-muted-foreground">· {log.company.name}</span>
              )}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Companies */}
        <section className="lg:col-span-1">
          <h2 className="mb-4 text-xl font-semibold uppercase tracking-wider text-muted-foreground">
            Companies
          </h2>
          <div className="space-y-4">
            {data.companies.map((company) => (
              <div
                key={company.id}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                style={{ "--company-accent": company.color } as React.CSSProperties}
              >
                <ProgressRing
                  progress={company.progress}
                  size={72}
                  strokeWidth={5}
                  accentColor={company.color}
                  large
                />
                <div>
                  <h3 className="text-xl font-bold">{company.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {company.activeProjectCount} active projects
                  </p>
                </div>
              </div>
            ))}
            {data.companies.length === 0 && (
              <p className="text-muted-foreground">No companies configured</p>
            )}
          </div>
        </section>

        {/* Active Projects + Focus */}
        <section className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="mb-4 text-xl font-semibold uppercase tracking-wider text-muted-foreground">
              Active Projects
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {data.activeProjects.slice(0, 6).map((project) => (
                <div
                  key={project.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">{project.company?.name}</p>
                    </div>
                    <ProgressRing
                      progress={project.progress}
                      size={56}
                      strokeWidth={4}
                      accentColor={project.company?.color}
                    />
                  </div>
                  <div className="mt-3 flex gap-2">
                    <StatusBadge status={project.status} />
                    <PriorityBadge priority={project.priority} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold uppercase tracking-wider text-muted-foreground">
              Current Focus
            </h2>
            <div className="space-y-2">
              {data.focusItems.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.company.color }}
                  />
                  <span className="flex-1 font-medium">{item.title}</span>
                  <span className="text-sm text-muted-foreground">{item.project.name}</span>
                </div>
              ))}
              {data.focusItems.length === 0 && (
                <p className="text-muted-foreground">All clear — no urgent focus items</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold uppercase tracking-wider text-muted-foreground">
              Recent Wins
            </h2>
            <div className="space-y-2">
              {data.recentWins.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3"
                >
                  <span className="text-emerald-400">✓</span>
                  <span className="flex-1">{log.title}</span>
                  <span className="text-sm text-muted-foreground">{log.company?.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
