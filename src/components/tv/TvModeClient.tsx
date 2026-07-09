"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { MonitorOff } from "lucide-react";
import { ProgressRing } from "@/components/ui/progress-ring";
import { StatusBadge, PriorityBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { useTvSizing } from "@/components/tv/useTvSizing";
import type { DashboardSummary } from "@/lib/types/database";
import { cn } from "@/lib/utils";

export function TvModeClient({ data }: { data: DashboardSummary }) {
  const router = useRouter();
  const sizing = useTvSizing();

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

  const tickerItems =
    data.todayLogs.length > 0
      ? [...data.todayLogs, ...data.todayLogs]
      : [
          {
            id: "empty",
            title: "No wins logged today yet — go get one!",
            company: null,
            project: null,
            log_date: "",
            description: null,
            created_at: "",
            company_id: "",
            project_id: null,
            work_item_id: null,
          },
        ];

  const projectCols = sizing.isWide ? "grid-cols-2 xl:grid-cols-3" : "grid-cols-1 sm:grid-cols-2";
  const mainCols = sizing.isCompact
    ? "grid-cols-1"
    : sizing.isWide
      ? "grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)]"
      : "grid-cols-1 lg:grid-cols-2";

  return (
    <div
      className="tv-mode relative flex h-[100dvh] flex-col overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 animate-fade-in"
      style={{ padding: "var(--tv-pad)", gap: "var(--tv-gap)" }}
    >
      <div className="absolute right-[var(--tv-pad)] top-[var(--tv-pad)] z-50">
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<Link href="/dashboard" />}
          className="border-white/20 bg-black/40 text-[length:var(--tv-small)] backdrop-blur hover:bg-white/10"
        >
          <MonitorOff className="mr-2 h-[1.2em] w-[1.2em]" />
          Exit TV Mode
        </Button>
      </div>

      {/* Header */}
      <header className="flex shrink-0 items-end justify-between gap-4 pr-36">
        <div className="min-w-0">
          <h1 className="tv-title font-bold tracking-tight gradient-text">Work Command Center</h1>
          <p className="tv-subtitle mt-1 text-muted-foreground">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="tv-stat font-bold tabular-nums">{data.todayLogs.length}</p>
          <p className="tv-small text-muted-foreground">wins today</p>
        </div>
      </header>

      {/* Ticker */}
      <div
        className="shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur"
        style={{ paddingBlock: "calc(var(--tv-gap) * 0.6)" }}
      >
        <div className="animate-marquee flex whitespace-nowrap">
          {tickerItems.map((log, i) => (
            <span
              key={`${log.id}-${i}`}
              className="mx-[2vw] inline-flex items-center gap-2 tv-body"
            >
              <span className="text-emerald-400">✓</span>
              {log.title}
              {"company" in log && log.company && (
                <span className="text-muted-foreground">· {log.company.name}</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Main dashboard — fills remaining height */}
      <div
        className={cn("grid min-h-0 flex-1", mainCols)}
        style={{ gap: "var(--tv-gap)" }}
      >
        {/* Companies */}
        <section className="flex min-h-0 flex-col">
          <h2 className="tv-heading mb-[calc(var(--tv-gap)*0.75)] shrink-0 font-semibold uppercase tracking-wider text-muted-foreground">
            Companies
          </h2>
          <div
            className="flex min-h-0 flex-1 flex-col overflow-y-auto"
            style={{ gap: "var(--tv-gap)" }}
          >
            {data.companies.map((company) => (
              <div
                key={company.id}
                className="flex shrink-0 items-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur"
                style={
                  {
                    "--company-accent": company.color,
                    gap: "var(--tv-gap)",
                    padding: "var(--tv-card-pad)",
                  } as React.CSSProperties
                }
              >
                <ProgressRing
                  progress={company.progress}
                  size={sizing.companyRing}
                  strokeWidth={sizing.strokeCompany}
                  accentColor={company.color}
                  large
                  percentClassName="text-[length:var(--tv-percent-lg)]"
                />
                <div className="min-w-0">
                  <h3 className="tv-body truncate font-bold">{company.name}</h3>
                  <p className="tv-small text-muted-foreground">
                    {company.activeProjectCount} active projects
                  </p>
                </div>
              </div>
            ))}
            {data.companies.length === 0 && (
              <p className="tv-body text-muted-foreground">No companies configured</p>
            )}
          </div>
        </section>

        {/* Active Projects */}
        <section className="flex min-h-0 flex-col">
          <h2 className="tv-heading mb-[calc(var(--tv-gap)*0.75)] shrink-0 font-semibold uppercase tracking-wider text-muted-foreground">
            Active Projects
          </h2>
          <div
            className={cn("grid min-h-0 flex-1 content-start overflow-y-auto", projectCols)}
            style={{ gap: "var(--tv-gap)" }}
          >
            {data.activeProjects.slice(0, sizing.isWide ? 6 : 4).map((project) => (
              <div
                key={project.id}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur"
                style={{ padding: "var(--tv-card-pad)" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="tv-body truncate font-semibold">{project.name}</h3>
                    <p className="tv-small truncate text-muted-foreground">
                      {project.company?.name}
                    </p>
                  </div>
                  <ProgressRing
                    progress={project.progress}
                    size={sizing.projectRing}
                    strokeWidth={sizing.strokeProject}
                    accentColor={project.company?.color}
                    percentClassName="text-[length:var(--tv-percent-sm)]"
                  />
                </div>
                <div className="mt-[calc(var(--tv-gap)*0.75)] flex flex-wrap gap-2 [&_*]:text-[length:var(--tv-small)]">
                  <StatusBadge status={project.status} />
                  <PriorityBadge priority={project.priority} />
                </div>
              </div>
            ))}
            {data.activeProjects.length === 0 && (
              <p className="tv-body text-muted-foreground">No active projects</p>
            )}
          </div>
        </section>

        {/* Focus + Wins */}
        <section
          className={cn(
            "flex min-h-0 flex-col",
            !sizing.isWide && sizing.isCompact === false && "lg:col-span-2"
          )}
          style={{ gap: "var(--tv-gap)" }}
        >
          <div className="flex min-h-0 flex-1 flex-col">
            <h2 className="tv-heading mb-[calc(var(--tv-gap)*0.75)] shrink-0 font-semibold uppercase tracking-wider text-muted-foreground">
              Current Focus
            </h2>
            <div
              className="min-h-0 flex-1 space-y-[calc(var(--tv-gap)*0.5)] overflow-y-auto"
            >
              {data.focusItems.slice(0, sizing.isCompact ? 3 : 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center rounded-xl border border-white/10 bg-white/5"
                  style={{
                    gap: "calc(var(--tv-gap) * 0.75)",
                    padding: "calc(var(--tv-card-pad) * 0.75)",
                  }}
                >
                  <span
                    className="h-[0.6em] w-[0.6em] shrink-0 rounded-full"
                    style={{ backgroundColor: item.company.color, fontSize: "var(--tv-body)" }}
                  />
                  <span className="tv-body min-w-0 flex-1 truncate font-medium">{item.title}</span>
                  <span className="tv-small shrink-0 text-muted-foreground">{item.project.name}</span>
                </div>
              ))}
              {data.focusItems.length === 0 && (
                <p className="tv-body text-muted-foreground">All clear — no urgent focus items</p>
              )}
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col">
            <h2 className="tv-heading mb-[calc(var(--tv-gap)*0.75)] shrink-0 font-semibold uppercase tracking-wider text-muted-foreground">
              Recent Wins
            </h2>
            <div className="min-h-0 flex-1 space-y-[calc(var(--tv-gap)*0.5)] overflow-y-auto">
              {data.recentWins.slice(0, sizing.isCompact ? 3 : 5).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center rounded-xl border border-emerald-500/20 bg-emerald-500/5"
                  style={{
                    gap: "calc(var(--tv-gap) * 0.75)",
                    padding: "calc(var(--tv-card-pad) * 0.75)",
                  }}
                >
                  <span className="tv-body text-emerald-400">✓</span>
                  <span className="tv-body min-w-0 flex-1 truncate">{log.title}</span>
                  <span className="tv-small shrink-0 text-muted-foreground">{log.company?.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
