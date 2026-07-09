import { ProgressRing } from "@/components/ui/progress-ring";
import type { ProgressDeltas } from "@/lib/types/database";
import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

const PERIOD_STYLES = {
  day: {
    label: "day",
    positive: "border-sky-500/30 bg-sky-500/15 text-sky-300",
    negative: "border-red-500/30 bg-red-500/15 text-red-300",
    neutral: "border-white/10 bg-white/5 text-muted-foreground",
  },
  week: {
    label: "wk",
    positive: "border-indigo-500/30 bg-indigo-500/15 text-indigo-300",
    negative: "border-red-500/30 bg-red-500/15 text-red-300",
    neutral: "border-white/10 bg-white/5 text-muted-foreground",
  },
  month: {
    label: "mo",
    positive: "border-violet-500/30 bg-violet-500/15 text-violet-300",
    negative: "border-red-500/30 bg-red-500/15 text-red-300",
    neutral: "border-white/10 bg-white/5 text-muted-foreground",
  },
} as const;

function DeltaChip({
  value,
  period,
  compact,
}: {
  value: number;
  period: keyof typeof PERIOD_STYLES;
  compact?: boolean;
}) {
  const styles = PERIOD_STYLES[period];
  const tone =
    value > 0 ? styles.positive : value < 0 ? styles.negative : styles.neutral;
  const formatted =
    value > 0 ? `+${value}%` : value < 0 ? `${value}%` : "0%";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-semibold tabular-nums",
        compact ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-0.5 text-[10px]",
        tone
      )}
      title={`${formatted} this ${period === "day" ? "day" : period === "week" ? "week" : "month"}`}
    >
      {formatted} {styles.label}
    </span>
  );
}

export function ProgressDeltaChips({
  deltas,
  compact = false,
  className,
}: {
  deltas: ProgressDeltas;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap justify-center gap-1", className)}>
      <DeltaChip value={deltas.day} period="day" compact={compact} />
      <DeltaChip value={deltas.week} period="week" compact={compact} />
      <DeltaChip value={deltas.month} period="month" compact={compact} />
    </div>
  );
}

export function ProgressWithTrend({
  progress,
  deltas,
  size = 80,
  strokeWidth = 6,
  className,
  accentColor,
  label,
  large,
  percentClassName,
  percentStyle,
  compactDeltas = false,
  align = "center",
}: {
  progress: number;
  deltas?: ProgressDeltas;
  size?: number;
  strokeWidth?: number;
  className?: string;
  accentColor?: string;
  label?: string;
  large?: boolean;
  percentClassName?: string;
  percentStyle?: CSSProperties;
  compactDeltas?: boolean;
  align?: "center" | "end" | "start";
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 flex-col gap-1.5",
        align === "end"
          ? "items-end"
          : align === "start"
            ? "items-start"
            : "items-center",
        className
      )}
    >
      <ProgressRing
        progress={progress}
        size={size}
        strokeWidth={strokeWidth}
        accentColor={accentColor}
        label={label}
        large={large}
        percentClassName={percentClassName}
        percentStyle={percentStyle}
      />
      {deltas && (
        <ProgressDeltaChips deltas={deltas} compact={compactDeltas || size < 64} />
      )}
    </div>
  );
}
