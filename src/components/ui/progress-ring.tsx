"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export function ProgressRing({
  progress,
  size = 80,
  strokeWidth = 6,
  className,
  accentColor,
  label,
  large,
  percentClassName,
  percentStyle,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  accentColor?: string;
  label?: string;
  large?: boolean;
  percentClassName?: string;
  percentStyle?: CSSProperties;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  const color = accentColor ?? "oklch(0.65 0.2 280)";
  const rounded = Math.round(progress);

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="block -rotate-90 animate-pulse-slow"
        aria-hidden
      >
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
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 grid place-items-center">
          <span
            className={cn(
              "leading-none font-bold tabular-nums",
              percentClassName ?? (large ? "text-3xl" : "text-sm")
            )}
            style={percentStyle}
          >
            {rounded}
            <span className="text-[0.62em] font-bold opacity-90">%</span>
          </span>
        </div>
        {label && (
          <span className="absolute inset-x-0 bottom-[22%] text-center text-[10px] leading-none uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
