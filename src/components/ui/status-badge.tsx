import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  not_started: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
  in_progress: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  completed: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  blocked: "bg-red-500/20 text-red-300 border-red-500/30",
  waiting_on_approval: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  waiting_on_carrier: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  waiting_on_spruce: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  waiting_on_vendor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  waiting_on_internal_owner: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  paused: "bg-amber-500/20 text-amber-300 border-amber-500/30",
};

const priorityStyles: Record<string, string> = {
  low: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
  medium: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  high: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  urgent: "bg-rose-500/20 text-rose-300 border-rose-500/30",
};

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const label = status.replace(/_/g, " ");
  return (
    <Badge variant="outline" className={cn("capitalize", statusStyles[status], className)}>
      {label}
    </Badge>
  );
}

export function PriorityBadge({
  priority,
  className,
}: {
  priority: string;
  className?: string;
}) {
  return (
    <Badge variant="outline" className={cn("capitalize", priorityStyles[priority], className)}>
      {priority}
    </Badge>
  );
}

export function TypeBadge({
  type,
  className,
}: {
  type: string;
  className?: string;
}) {
  return (
    <Badge variant="outline" className={cn("capitalize text-xs", className)}>
      {type}
    </Badge>
  );
}
