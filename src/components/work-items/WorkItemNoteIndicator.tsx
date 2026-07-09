"use client";

import { StickyNote } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function WorkItemNoteIndicator({
  note,
  className,
}: {
  note: string;
  className?: string;
}) {
  const trimmed = note.trim();
  if (!trimmed) return null;

  return (
    <Tooltip>
      <TooltipTrigger
        delay={150}
        aria-label="This item has a note"
        render={
          <span
            className={cn(
              "inline-flex shrink-0 cursor-help items-center gap-1 rounded-lg",
              "bg-amber-400/15 px-1.5 py-0.5 text-amber-300",
              "ring-1 ring-amber-400/35 shadow-[0_0_12px_rgba(251,191,36,0.15)]",
              "transition-all duration-200 hover:scale-110 hover:bg-amber-400/25 hover:ring-amber-300/50",
              "animate-note-wiggle",
              className
            )}
          />
        }
      >
        <StickyNote className="h-3.5 w-3.5" />
        <span className="text-[10px] font-semibold uppercase tracking-wider">Note</span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-sm -rotate-1">
        <div className="flex items-start gap-2">
          <span className="text-base leading-none" aria-hidden>
            📝
          </span>
          <div className="min-w-0 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700/80 dark:text-amber-200/80">
              Sticky note
            </p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{trimmed}</p>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
