import type { CompanyWithProgress, DailyLogWithRelations, ProjectWithProgress } from "@/lib/types/database";

export function MissionControlFooter({
  companies,
  activeProjects,
  todayLogs,
}: {
  companies: CompanyWithProgress[];
  activeProjects: ProjectWithProgress[];
  todayLogs: DailyLogWithRelations[];
}) {
  const messages: string[] = [];

  for (const project of activeProjects.slice(0, 3)) {
    messages.push(
      `${project.company?.name ?? "Project"}: ${project.name} is ${project.progress}% complete 🚀`
    );
  }

  for (const company of companies.filter((c) => c.progress >= 70).slice(0, 2)) {
    messages.push(`${company.name} is on track at ${company.progress}% ✨`);
  }

  if (todayLogs.length >= 5) {
    messages.push("You're crushing it! Keep going! 🚀");
  }

  if (messages.length === 0) {
    messages.push("Mission Control online — ready for today's work 🎯");
  }

  const tickerItems = [...messages, ...messages];

  return (
    <footer className="min-w-0 overflow-hidden rounded-2xl border border-purple-500/20 bg-black/40 backdrop-blur">
      <div className="flex min-w-0 items-center gap-4 px-4 py-3">
        <span className="shrink-0 text-xs font-bold uppercase tracking-widest text-purple-400">
          Mission Control
        </span>
        <div className="relative min-w-0 flex-1 overflow-hidden">
          <div className="animate-marquee inline-flex w-max whitespace-nowrap">
            {tickerItems.map((msg, i) => (
              <span key={`${msg}-${i}`} className="mx-8 shrink-0 text-sm text-muted-foreground">
                {msg}
              </span>
            ))}
          </div>
        </div>
        <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">
          Enjoy the process. 💜
        </span>
      </div>
    </footer>
  );
}
