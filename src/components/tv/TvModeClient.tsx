"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { MonitorOff } from "lucide-react";
import { ProgressRing } from "@/components/ui/progress-ring";
import { StatusBadge, PriorityBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { useTvDisplay } from "@/components/tv/useTvDisplay";
import type { DashboardSummary } from "@/lib/types/database";
import { cn } from "@/lib/utils";

export function TvModeClient({ data }: { data: DashboardSummary }) {
  const router = useRouter();
  const d = useTvDisplay();

  useEffect(() => {
    document.documentElement.style.height = "100%";
    document.body.style.height = "100%";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.height = "";
      document.body.style.height = "";
      document.body.style.overflow = "";
    };
  }, []);

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

  const maxProjects = d.isFireTv ? 4 : d.columns === 3 ? 6 : 4;
  const maxListItems = d.isFireTv ? 4 : 5;

  return (
    <div
      className={cn(
        "tv-mode relative flex flex-col overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950",
        d.isFireTv && "fire-tv"
      )}
      style={{
        height: "100vh",
        padding: d.pad,
        gap: d.gap,
        boxSizing: "border-box",
      }}
    >
      {/* Header row ~10% */}
      <header
        className="flex shrink-0 items-end justify-between"
        style={{ gap: d.gap, paddingRight: d.isFireTv ? 0 : 160 }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <h1
            className="font-bold tracking-tight gradient-text"
            style={{ fontSize: d.title, lineHeight: 1.1 }}
          >
            Work Command Center
          </h1>
          <p className="text-muted-foreground" style={{ fontSize: d.subtitle, marginTop: 6 }}>
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-bold tabular-nums" style={{ fontSize: d.stat, lineHeight: 1 }}>
            {data.todayLogs.length}
          </p>
          <p className="text-muted-foreground" style={{ fontSize: d.small }}>
            wins today
          </p>
        </div>
        {d.isFireTv && (
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href="/dashboard" />}
            className="ml-3 shrink-0 border-white/20 bg-black/60 hover:bg-white/10"
            style={{ fontSize: d.small }}
          >
            <MonitorOff className="mr-1 h-[1.1em] w-[1.1em]" />
            Exit
          </Button>
        )}
      </header>

      {!d.isFireTv && (
        <div className="absolute z-50" style={{ right: d.pad, top: d.pad }}>
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href="/dashboard" />}
            className="border-white/20 bg-black/40 hover:bg-white/10"
            style={{ fontSize: d.small }}
          >
            <MonitorOff className="mr-2 h-[1.1em] w-[1.1em]" />
            Exit TV Mode
          </Button>
        </div>
      )}

      {/* Ticker */}
      <div
        className="tv-panel shrink-0 overflow-hidden rounded-xl border border-white/10"
        style={{ padding: `${d.gap * 0.5}px 0` }}
      >
        <div className="animate-marquee flex whitespace-nowrap">
          {tickerItems.map((log, i) => (
            <span
              key={`${log.id}-${i}`}
              className="inline-flex items-center"
              style={{ fontSize: d.body, marginLeft: d.pad, marginRight: d.pad, gap: 8 }}
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

      {/* Main — flex row, fills rest of screen */}
      <div
        className="flex min-h-0 flex-1"
        style={{ gap: d.gap, flexDirection: d.columns === 1 ? "column" : "row" }}
      >
        {/* Companies column */}
        <section className="tv-col">
          <h2
            className="shrink-0 font-semibold uppercase tracking-wider text-muted-foreground"
            style={{ fontSize: d.heading, marginBottom: d.gap * 0.6 }}
          >
            Companies
          </h2>
          <div className="tv-scroll" style={{ display: "flex", flexDirection: "column", gap: d.gap }}>
            {data.companies.map((company) => (
              <div
                key={company.id}
                className="tv-panel flex shrink-0 items-center rounded-xl border border-white/10"
                style={{ gap: d.gap, padding: d.cardPad }}
              >
                <ProgressRing
                  progress={company.progress}
                  size={d.companyRing}
                  strokeWidth={d.strokeCompany}
                  accentColor={company.color}
                  percentStyle={{ fontSize: d.percentLg }}
                />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h3 className="truncate font-bold" style={{ fontSize: d.body }}>
                    {company.name}
                  </h3>
                  <p className="text-muted-foreground" style={{ fontSize: d.small }}>
                    {company.activeProjectCount} active projects
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects column */}
        <section className="tv-col" style={{ flex: d.columns === 3 ? 2 : 1 }}>
          <h2
            className="shrink-0 font-semibold uppercase tracking-wider text-muted-foreground"
            style={{ fontSize: d.heading, marginBottom: d.gap * 0.6 }}
          >
            Active Projects
          </h2>
          <div
            className="tv-scroll"
            style={{
              display: "grid",
              gridTemplateColumns: d.columns >= 2 ? "1fr 1fr" : "1fr",
              gap: d.gap,
              alignContent: "start",
            }}
          >
            {data.activeProjects.slice(0, maxProjects).map((project) => (
              <div
                key={project.id}
                className="tv-panel rounded-xl border border-white/10"
                style={{ padding: d.cardPad }}
              >
                <div className="flex items-start justify-between" style={{ gap: d.gap * 0.5 }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h3 className="truncate font-semibold" style={{ fontSize: d.body }}>
                      {project.name}
                    </h3>
                    <p className="truncate text-muted-foreground" style={{ fontSize: d.small }}>
                      {project.company?.name}
                    </p>
                  </div>
                  <ProgressRing
                    progress={project.progress}
                    size={d.projectRing}
                    strokeWidth={d.strokeProject}
                    accentColor={project.company?.color}
                    percentStyle={{ fontSize: d.percentSm }}
                  />
                </div>
                <div className="flex flex-wrap" style={{ gap: 8, marginTop: d.gap * 0.6 }}>
                  <StatusBadge status={project.status} />
                  <PriorityBadge priority={project.priority} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Focus + Wins column */}
        {d.columns >= 2 && (
          <section className="tv-col" style={{ gap: d.gap }}>
            <div className="tv-col" style={{ flex: 1 }}>
              <h2
                className="shrink-0 font-semibold uppercase tracking-wider text-muted-foreground"
                style={{ fontSize: d.heading, marginBottom: d.gap * 0.6 }}
              >
                Current Focus
              </h2>
              <div className="tv-scroll" style={{ display: "flex", flexDirection: "column", gap: d.gap * 0.5 }}>
                {data.focusItems.slice(0, maxListItems).map((item) => (
                  <div
                    key={item.id}
                    className="tv-panel flex items-center rounded-lg border border-white/10"
                    style={{ gap: d.gap * 0.6, padding: d.cardPad * 0.75 }}
                  >
                    <span
                      className="shrink-0 rounded-full"
                      style={{
                        width: d.body * 0.45,
                        height: d.body * 0.45,
                        backgroundColor: item.company.color,
                      }}
                    />
                    <span
                      className="min-w-0 flex-1 truncate font-medium"
                      style={{ fontSize: d.body }}
                    >
                      {item.title}
                    </span>
                    <span
                      className="shrink-0 text-muted-foreground"
                      style={{ fontSize: d.small, maxWidth: "35%" }}
                    >
                      {item.project.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="tv-col" style={{ flex: 1 }}>
              <h2
                className="shrink-0 font-semibold uppercase tracking-wider text-muted-foreground"
                style={{ fontSize: d.heading, marginBottom: d.gap * 0.6 }}
              >
                Recent Wins
              </h2>
              <div className="tv-scroll" style={{ display: "flex", flexDirection: "column", gap: d.gap * 0.5 }}>
                {data.recentWins.slice(0, maxListItems).map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center rounded-lg border border-emerald-500/25 bg-emerald-500/10"
                    style={{ gap: d.gap * 0.6, padding: d.cardPad * 0.75 }}
                  >
                    <span className="text-emerald-400" style={{ fontSize: d.body }}>
                      ✓
                    </span>
                    <span className="min-w-0 flex-1 truncate" style={{ fontSize: d.body }}>
                      {log.title}
                    </span>
                    <span className="shrink-0 text-muted-foreground" style={{ fontSize: d.small }}>
                      {log.company?.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
