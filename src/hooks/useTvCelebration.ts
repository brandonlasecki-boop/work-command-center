"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { fireTvFireworks } from "@/components/ui/confetti-burst";
import type { DashboardSummary } from "@/lib/types/database";

const BANNER_DELAY_MS = 1100;
const BANNER_DURATION_MS = 8000;
const REFRESH_DELAY_MS = 2500;

type WorkItemPayload = {
  id: string;
  title: string;
  completed_at: string | null;
  status: string;
};

type DailyLogPayload = {
  id: string;
  title: string;
  work_item_id: string | null;
  log_date: string;
};

function makeCelebrationKey(input: {
  taskId?: string | null;
  completedAt?: string | null;
  logDate?: string | null;
}) {
  if (input.taskId && input.completedAt) {
    return `task:${input.taskId}:${input.completedAt}`;
  }
  if (input.taskId && input.logDate) {
    return `task:${input.taskId}:${input.logDate}`;
  }
  return null;
}

export function useTvCelebration(data: DashboardSummary) {
  const router = useRouter();
  const [celebration, setCelebration] = useState<{ id: string; title: string } | null>(null);
  const [liveConnected, setLiveConnected] = useState(false);
  const celebratedRef = useRef<Set<string>>(new Set());
  const recentTaskRef = useRef<Map<string, number>>(new Map());
  const winsBootstrappedRef = useRef(false);
  const bannerTimeoutRef = useRef<number | null>(null);
  const refreshTimeoutRef = useRef<number | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);

  const clearCelebrationTimers = useCallback(() => {
    if (bannerTimeoutRef.current) {
      window.clearTimeout(bannerTimeoutRef.current);
      bannerTimeoutRef.current = null;
    }
    if (refreshTimeoutRef.current) {
      window.clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  const showBanner = useCallback((key: string, title: string) => {
    setCelebration({ id: key, title });
    if (hideTimeoutRef.current) window.clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = window.setTimeout(() => {
      setCelebration(null);
      hideTimeoutRef.current = null;
    }, BANNER_DURATION_MS);
  }, []);

  const celebrate = useCallback(
    (key: string, taskId: string, title: string, refresh = true) => {
      const recentAt = recentTaskRef.current.get(taskId);
      if (recentAt && Date.now() - recentAt < 4000) return;
      if (celebratedRef.current.has(key)) return;

      celebratedRef.current.add(key);
      recentTaskRef.current.set(taskId, Date.now());

      if (celebratedRef.current.size > 300) {
        celebratedRef.current.clear();
        celebratedRef.current.add(key);
      }

      clearCelebrationTimers();
      fireTvFireworks();

      bannerTimeoutRef.current = window.setTimeout(() => {
        showBanner(key, title);
        bannerTimeoutRef.current = null;
      }, BANNER_DELAY_MS);

      if (refresh) {
        refreshTimeoutRef.current = window.setTimeout(() => {
          router.refresh();
          refreshTimeoutRef.current = null;
        }, REFRESH_DELAY_MS);
      }
    },
    [clearCelebrationTimers, router, showBanner]
  );

  useEffect(() => () => clearCelebrationTimers(), [clearCelebrationTimers]);

  useEffect(() => {
    for (const log of data.todayLogs) {
      if (!winsBootstrappedRef.current) continue;
      if (!log.work_item_id) continue;

      const key = makeCelebrationKey({
        taskId: log.work_item_id,
        logDate: log.log_date,
      });
      if (!key || celebratedRef.current.has(key)) continue;
      celebrate(key, log.work_item_id, log.title, false);
    }

    winsBootstrappedRef.current = true;
    for (const log of data.todayLogs) {
      const key = makeCelebrationKey({
        taskId: log.work_item_id,
        logDate: log.log_date,
      });
      if (key) celebratedRef.current.add(key);
    }
  }, [data.todayLogs, celebrate]);

  useEffect(() => {
    const supabase = createClient();

    function handleWorkItemUpdate(payload: { new: WorkItemPayload; old: Partial<WorkItemPayload> }) {
      const next = payload.new;
      const prev = payload.old;

      if (next.status !== "completed") return;
      if (prev.status === "completed") return;

      const key = makeCelebrationKey({ taskId: next.id, completedAt: next.completed_at });
      if (!key) return;
      celebrate(key, next.id, next.title);
    }

    function handleDailyLogInsert(payload: { new: DailyLogPayload }) {
      const row = payload.new;
      if (!row.work_item_id) return;

      const key = makeCelebrationKey({
        taskId: row.work_item_id,
        logDate: row.log_date,
      });
      if (!key) return;
      celebrate(key, row.work_item_id, row.title);
    }

    const channel = supabase
      .channel("tv-live-updates", {
        config: { broadcast: { self: false } },
      })
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "work_items" },
        (payload) =>
          handleWorkItemUpdate(
            payload as unknown as { new: WorkItemPayload; old: Partial<WorkItemPayload> }
          )
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "daily_logs" },
        (payload) =>
          handleDailyLogInsert(payload as unknown as { new: DailyLogPayload })
      )
      .subscribe((status) => {
        setLiveConnected(status === "SUBSCRIBED");
      });

    return () => {
      setLiveConnected(false);
      void supabase.removeChannel(channel);
    };
  }, [celebrate]);

  return { celebration, liveConnected };
}
