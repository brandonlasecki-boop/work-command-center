"use client";

import type { CompanyWithProgress } from "@/lib/types/database";

export function ProgressDonut({
  companies,
  averageProgress,
  size = 140,
}: {
  companies: CompanyWithProgress[];
  averageProgress: number;
  size?: number;
}) {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (averageProgress / 100) * circumference;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block -rotate-90">
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="oklch(1 0 0 / 8%)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="url(#donutGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700"
          />
          <defs>
            <linearGradient id="donutGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00A3FF" />
              <stop offset="33%" stopColor="#A855F7" />
              <stop offset="66%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#22C55E" />
            </linearGradient>
          </defs>
        </svg>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 grid place-items-center">
            <span className="leading-none text-2xl font-bold tabular-nums">
              {averageProgress}
              <span className="text-[0.62em] font-bold opacity-90">%</span>
            </span>
          </div>
          <span className="absolute inset-x-0 bottom-[22%] text-center text-[10px] leading-none uppercase tracking-wider text-muted-foreground">
            Avg Progress
          </span>
        </div>
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        {companies.map((company) => (
          <div key={company.id} className="flex items-center justify-between gap-2 text-sm">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: company.color }}
              />
              <span className="truncate text-muted-foreground">{company.name}</span>
            </div>
            <span className="shrink-0 font-medium tabular-nums">{company.progress}%</span>
          </div>
        ))}
        {companies.length === 0 && (
          <p className="text-sm text-muted-foreground">No companies yet</p>
        )}
      </div>
    </div>
  );
}
