"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { fireTvFireworks } from "@/components/ui/confetti-burst";

type CompletionPayload = {
  id: string;
  title: string;
  completed_at: string | null;
  status: string;
};

export function useTvTaskCompletionCelebration(
  onCompleted: (task: { id: string; title: string }) => void
) {
  const router = useRouter();
  const seenRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("tv-task-completions")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "work_items" },
        (payload) => {
          const next = payload.new as CompletionPayload;
          const prev = payload.old as Partial<CompletionPayload>;

          if (next.status !== "completed" || prev.status === "completed") return;
          if (!next.completed_at) return;

          const key = `${next.id}:${next.completed_at}`;
          if (seenRef.current.has(key)) return;
          seenRef.current.add(key);

          if (seenRef.current.size > 200) {
            seenRef.current.clear();
            seenRef.current.add(key);
          }

          fireTvFireworks();
          onCompleted({ id: next.id, title: next.title });
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [onCompleted, router]);
}
