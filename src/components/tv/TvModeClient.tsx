"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { MonitorOff } from "lucide-react";
import { ProgressRing } from "@/components/ui/progress-ring";
import { StatusBadge, PriorityBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import {
  TV_CANVAS_HEIGHT,
  TV_CANVAS_WIDTH,
  useCanvasScale,
} from "@/components/tv/useCanvasScale";
import type { DashboardSummary } from "@/lib/types/database";

const MAX_COMPANIES = 4;
const MAX_PROJECTS = 4;
const MAX_FOCUS = 3;
const MAX_WINS = 3;

export function TvModeClient({ data }: { data: DashboardSummary }) {
  const router = useRouter();
  const scale = useCanvasScale();

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.height = "100%";
    document.body.style.overflow = "hidden";
    document.body.style.height = "100%";
    document.body.style.margin = "0";
    return () => {
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.body.style.margin = "";
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
          },
        ];

  const companies = data.companies.slice(0, MAX_COMPANIES);
  const projects = data.activeProjects.slice(0, MAX_PROJECTS);
  const focusItems = data.focusItems.slice(0, MAX_FOCUS);
  const wins = data.recentWins.slice(0, MAX_WINS);

  return (
    <div className="fixed inset-0 overflow-hidden bg-slate-950">
      <div
        className="absolute left-1/2 top-1/2 origin-center"
        style={{
          width: TV_CANVAS_WIDTH,
          height: TV_CANVAS_HEIGHT,
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        <div className="tv-canvas flex h-full flex-col overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6">
          {/* Header — fixed height */}
          <header className="flex h-[72px] shrink-0 items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-[38px] font-bold leading-none tracking-tight gradient-text">
                Work Command Center
              </h1>
              <p className="mt-1 text-[20px] text-muted-foreground">
                {format(new Date(), "EEEE, MMMM d, yyyy")}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-6">
              <div className="text-right">
                <p className="text-[36px] font-bold leading-none tabular-nums">
                  {data.todayLogs.length}
                </p>
                <p className="text-[14px] text-muted-foreground">wins today</p>
              </div>
              <Button
                variant="outline"
                nativeButton={false}
                render={<Link href="/dashboard" />}
                className="border-white/20 bg-black/50 text-[14px] hover:bg-white/10"
              >
                <MonitorOff className="mr-1.5 h-4 w-4" />
                Exit
              </Button>
            </div>
          </header>

          {/* Ticker — fixed height */}
          <div className="mb-3 mt-2 flex h-[44px] shrink-0 items-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.06]">
            <div className="animate-marquee inline-flex w-max whitespace-nowrap">
              {tickerItems.map((log, i) => (
                <span
                  key={`${log.id}-${i}`}
                  className="mx-8 inline-flex items-center gap-2 text-[18px]"
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

          {/* Main — fills remaining space, no scroll */}
          <div className="flex min-h-0 flex-1 gap-4">
            {/* Companies */}
            <section className="flex w-[420px] shrink-0 flex-col overflow-hidden">
              <h2 className="mb-2 shrink-0 text-[15px] font-semibold uppercase tracking-wider text-muted-foreground">
                Companies
              </h2>
              <div className="flex min-h-0 flex-1 flex-col justify-between gap-2">
                {companies.map((company) => (
                  <div
                    key={company.id}
                    className="flex flex-1 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-3"
                  >
                    <ProgressRing
                      progress={company.progress}
                      size={56}
                      strokeWidth={4}
                      accentColor={company.color}
                      percentStyle={{ fontSize: 14 }}
                    />
                    <div className="min-w-0">
                      <h3 className="truncate text-[17px] font-bold">{company.name}</h3>
                      <p className="text-[13px] text-muted-foreground">
                        {company.activeProjectCount} active · {company.progress}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects — 2x2 grid */}
            <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
              <h2 className="mb-2 shrink-0 text-[15px] font-semibold uppercase tracking-wider text-muted-foreground">
                Active Projects
              </h2>
              <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-3">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex flex-col justify-center rounded-xl border border-white/10 bg-white/[0.06] p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-[17px] font-semibold">{project.name}</h3>
                        <p className="truncate text-[13px] text-muted-foreground">
                          {project.company?.name}
                        </p>
                      </div>
                      <ProgressRing
                        progress={project.progress}
                        size={48}
                        strokeWidth={4}
                        accentColor={project.company?.color}
                        percentStyle={{ fontSize: 12 }}
                      />
                    </div>
                    <div className="mt-2 flex gap-2 [&_*]:text-[11px]">
                      <StatusBadge status={project.status} />
                      <PriorityBadge priority={project.priority} />
                    </div>
                  </div>
                ))}
                {projects.length === 0 && (
                  <p className="col-span-2 text-[16px] text-muted-foreground">No active projects</p>
                )}
              </div>
            </section>

            {/* Focus + Wins */}
            <section className="flex w-[420px] shrink-0 flex-col gap-3 overflow-hidden">
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <h2 className="mb-2 shrink-0 text-[15px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Current Focus
                </h2>
                <div className="flex min-h-0 flex-1 flex-col justify-between gap-2">
                  {focusItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-1 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-3"
                    >
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: item.company.color }}
                      />
                      <span className="min-w-0 flex-1 truncate text-[16px] font-medium">
                        {item.title}
                      </span>
                    </div>
                  ))}
                  {focusItems.length === 0 && (
                    <p className="text-[14px] text-muted-foreground">All clear</p>
                  )}
                </div>
              </div>

              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <h2 className="mb-2 shrink-0 text-[15px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Recent Wins
                </h2>
                <div className="flex min-h-0 flex-1 flex-col justify-between gap-2">
                  {wins.map((log) => (
                    <div
                      key={log.id}
                      className="flex flex-1 items-center gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3"
                    >
                      <span className="text-[16px] text-emerald-400">✓</span>
                      <span className="min-w-0 flex-1 truncate text-[16px]">{log.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
