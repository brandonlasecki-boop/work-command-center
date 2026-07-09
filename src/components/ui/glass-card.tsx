import { cn } from "@/lib/utils";

export function GlassCard({
  className,
  children,
  style,
}: {
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div className={cn("glass-card glass-card-hover", className)} style={style}>
      {children}
    </div>
  );
}
