"use client";

import { cn } from "@/lib/utils";

export function ProgressRing({
  progress,
  size = 80,
  strokeWidth = 6,
  className,
  accentColor,
  label,
  large,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  accentColor?: string;
  label?: string;
  large?: boolean;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  const color = accentColor ?? "oklch(0.65 0.2 280)";

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90 animate-pulse-slow">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="oklch(1 0 0 / 10%)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-bold tabular-nums", large ? "text-3xl" : "text-sm")}>
          {Math.round(progress)}%
        </span>
        {label && (
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
