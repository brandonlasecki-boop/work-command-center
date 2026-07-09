"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { MonitorOff } from "lucide-react";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Button } from "@/components/ui/button";
import {
  TV_CANVAS_HEIGHT,
  TV_CANVAS_WIDTH,
  useCanvasScale,
  TvProgressBar,
  SectionTitle,
  TvTicker,
} from "@/components/tv/tv-ui";
import type { DashboardSummary } from "@/lib/types/database";

export function TvModeClient({ data }: { data: DashboardSummary }) {
  const router = useRouter();
  const scale = useCanvasScale();

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.margin = "0";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
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

  const winsTickerItems =
    data.todayLogs.length > 0
      ? data.todayLogs.map((log) => ({
          id: log.id,
          title: log.title,
          subtitle: log.company?.name ?? null,
        }))
      : [{ id: "empty", title: "No wins logged today yet — go get one!", subtitle: null }];

  const focusTickerItems =
    data.focusItems.length > 0
      ? data.focusItems.map((item) => ({
          id: item.id,
          title: item.title,
          subtitle: `${item.project.name} · ${item.company.name}`,
        }))
      : [{ id: "empty", title: "All clear — no urgent focus items", subtitle: null }];

  const companies = data.companies.slice(0, 4);
  const projects = data.activeProjects.slice(0, 4);
  const focusItems = data.focusItems.slice(0, 3);
  const wins = data.recentWins.slice(0, 3);

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#07080f]">
      <div className="flex h-full w-full items-center justify-center">
        <div
          style={{
            width: TV_CANVAS_WIDTH,
            height: TV_CANVAS_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: "center center",
            flexShrink: 0,
          }}
        >
          <div className="tv-canvas relative flex h-full w-full flex-col overflow-hidden bg-gradient-to-br from-[#0c0e1a] via-[#0f1225] to-[#12102a] p-8">
            {/* Ambient glow */}
            <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />

            {/* Header */}
            <header className="relative z-10 mb-4 flex shrink-0 items-center justify-between">
              <div className="flex items-baseline gap-5">
                <h1 className="text-[44px] font-bold leading-none tracking-tight gradient-text">
                  Work Command Center
                </h1>
                <span className="text-[22px] text-slate-400">
                  {format(new Date(), "EEEE, MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-5">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-2 text-right">
                  <p className="text-[32px] font-bold leading-none tabular-nums text-white">
                    {data.todayLogs.length}
                  </p>
                  <p className="text-[13px] uppercase tracking-wider text-slate-400">wins today</p>
                </div>
                <Button
                  variant="outline"
                  nativeButton={false}
                  render={<Link href="/dashboard" />}
                  className="border-white/15 bg-black/40 text-[15px] hover:bg-white/10"
                >
                  <MonitorOff className="mr-2 h-4 w-4" />
                  Exit
                </Button>
              </div>
            </header>

            {/* Wins newsfeed */}
            <TvTicker label="Live" items={winsTickerItems} variant="live" />

            {/* Main grid — 3 balanced columns */}
            <div className="relative z-10 my-5 grid min-h-0 flex-1 grid-cols-3 gap-5">
              {/* Companies */}
              <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-white/8 bg-black/20 p-4">
                <SectionTitle>Companies</SectionTitle>
                <div className="flex min-h-0 flex-1 flex-col gap-3">
                  {companies.map((company) => (
                    <div
                      key={company.id}
                      className="flex flex-1 items-center gap-4 rounded-xl border border-white/8 bg-white/[0.04] pl-1 pr-4"
                      style={{ borderLeftWidth: 4, borderLeftColor: company.color }}
                    >
                      <div className="flex shrink-0 items-center justify-center py-2 pl-3">
                        <ProgressRing
                          progress={company.progress}
                          size={80}
                          strokeWidth={6}
                          accentColor={company.color}
                          percentStyle={{ fontSize: 18, fontWeight: 700 }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-[20px] font-bold text-white">{company.name}</h3>
                        <p className="mt-0.5 text-[14px] text-slate-400">
                          {company.activeProjectCount} active · {company.projectCount} total
                        </p>
                        <div className="mt-2">
                          <TvProgressBar value={company.progress} color={company.color} height={8} />
                        </div>
                      </div>
                      <span
                        className="shrink-0 text-[22px] font-bold tabular-nums"
                        style={{ color: company.color }}
                      >
                        {company.progress}%
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Active Projects — stacked rows, not empty 2x2 */}
              <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-white/8 bg-black/20 p-4">
                <SectionTitle>Active Projects</SectionTitle>
                <div className="flex min-h-0 flex-1 flex-col gap-3">
                  {projects.map((project) => {
                    const color = project.company?.color ?? "#6366f1";
                    return (
                      <div
                        key={project.id}
                        className="flex flex-1 flex-col justify-center rounded-xl border border-white/8 bg-white/[0.04] px-5 py-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate text-[20px] font-semibold text-white">
                              {project.name}
                            </h3>
                            <p className="mt-0.5 text-[14px] text-slate-400">
                              {project.company?.name}
                              {" · "}
                              <span className="capitalize">{project.status.replace(/_/g, " ")}</span>
                              {" · "}
                              <span className="capitalize">{project.priority} priority</span>
                            </p>
                          </div>
                          <span
                            className="shrink-0 text-[28px] font-bold tabular-nums leading-none"
                            style={{ color }}
                          >
                            {project.progress}%
                          </span>
                        </div>
                        <div className="mt-3">
                          <TvProgressBar value={project.progress} color={color} height={12} />
                        </div>
                      </div>
                    );
                  })}
                  {projects.length === 0 && (
                    <p className="text-[16px] text-slate-400">No active projects</p>
                  )}
                </div>
              </section>

              {/* Focus + Wins */}
              <section className="flex min-h-0 flex-col gap-4 overflow-hidden">
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/8 bg-black/20 p-4">
                  <SectionTitle>Current Focus</SectionTitle>
                  <div className="flex min-h-0 flex-1 flex-col gap-2.5">
                    {focusItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-1 items-center gap-3 rounded-xl border border-white/8 bg-white/[0.04] px-4"
                      >
                        <span
                          className="h-3 w-3 shrink-0 rounded-full ring-2 ring-white/20"
                          style={{ backgroundColor: item.company.color }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[17px] font-medium text-white">{item.title}</p>
                          <p className="truncate text-[13px] text-slate-400">{item.project.name}</p>
                        </div>
                      </div>
                    ))}
                    {focusItems.length === 0 && (
                      <p className="text-[15px] text-slate-400">All clear — no urgent items</p>
                    )}
                  </div>
                </div>

                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.04] p-4">
                  <SectionTitle>Recent Wins</SectionTitle>
                  <div className="flex min-h-0 flex-1 flex-col gap-2.5">
                    {wins.map((log) => (
                      <div
                        key={log.id}
                        className="flex flex-1 items-center gap-3 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.06] px-4"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[14px] text-emerald-400">
                          ✓
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[17px] text-white">{log.title}</p>
                          {log.company && (
                            <p className="truncate text-[13px] text-slate-400">{log.company.name}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Focus newsfeed */}
            <TvTicker label="Focus" items={focusTickerItems} variant="focus" />
          </div>
        </div>
      </div>
    </div>
  );
}
