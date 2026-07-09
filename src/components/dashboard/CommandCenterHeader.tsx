"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Rocket } from "lucide-react";

export function CommandCenterHeader({ winsToday }: { winsToday: number }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex min-w-0 flex-col gap-4 2xl:flex-row 2xl:items-center 2xl:justify-between">
      <div className="flex min-w-0 items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 ring-1 ring-white/10">
          <Rocket className="h-6 w-6 text-indigo-300" />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-wide text-white md:text-3xl">
            COMMAND CENTER
          </h1>
          <p className="text-sm text-muted-foreground">
            Your Work. Your Mission. Your Progress.
          </p>
        </div>
      </div>

      <div className="hidden min-w-0 max-w-md flex-1 px-2 2xl:block">
        <div className="rounded-2xl border border-purple-500/30 bg-purple-500/5 px-4 py-3 text-center shadow-[0_0_30px_rgba(168,85,247,0.15)]">
          <p className="text-sm italic text-purple-200/90">
            &ldquo;Discipline today. Freedom tomorrow.&rdquo;
          </p>
        </div>
      </div>

      <div className="flex w-full flex-wrap items-center justify-between gap-3 sm:w-auto sm:justify-start sm:gap-6">
        <div className="text-right">
          <p className="text-sm text-muted-foreground">
            {format(now, "EEEE, MMMM d, yyyy")}
          </p>
          <p className="text-lg font-semibold tabular-nums">{format(now, "h:mm a")}</p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/40 to-purple-500/40">
            <Rocket className="h-4 w-4 text-indigo-200" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Let&apos;s make today count</p>
            <p className="text-lg font-bold tabular-nums">{winsToday} wins</p>
          </div>
        </div>
      </div>
    </header>
  );
}
