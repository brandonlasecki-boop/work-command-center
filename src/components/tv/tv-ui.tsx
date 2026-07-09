"use client";

import { useEffect, useState } from "react";

export const TV_CANVAS_WIDTH = 1920;
export const TV_CANVAS_HEIGHT = 1080;

export function useCanvasScale() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (!w || !h) return;
      setScale(Math.min(w / TV_CANVAS_WIDTH, h / TV_CANVAS_HEIGHT));
    }

    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return scale;
}

export function TvProgressBar({
  value,
  color,
  height = 10,
}: {
  value: number;
  color: string;
  height?: number;
}) {
  return (
    <div
      className="w-full overflow-hidden rounded-full bg-white/10"
      style={{ height }}
    >
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: color }}
      />
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-[16px] font-semibold uppercase tracking-[0.2em] text-indigo-300/80">
      {children}
    </h2>
  );
}

type TvTickerItem = {
  id: string;
  title: string;
  subtitle?: string | null;
};

export function TvTicker({
  label,
  items,
  variant = "live",
  slow = true,
}: {
  label: string;
  items: TvTickerItem[];
  variant?: "live" | "focus";
  slow?: boolean;
}) {
  const loop = items.length > 1 ? [...items, ...items] : items;
  const isLive = variant === "live";

  return (
    <div
      className={
        isLive
          ? "flex h-[42px] shrink-0 items-center overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-500/5"
          : "flex h-[42px] shrink-0 items-center overflow-hidden rounded-xl border border-amber-500/25 bg-amber-500/5"
      }
    >
      <span
        className={
          isLive
            ? "shrink-0 border-r border-emerald-500/20 px-4 text-[12px] font-bold uppercase tracking-widest text-emerald-400"
            : "shrink-0 border-r border-amber-500/25 px-4 text-[12px] font-bold uppercase tracking-widest text-amber-400"
        }
      >
        {label}
      </span>
      <div className="min-w-0 flex-1 overflow-hidden">
        <div
          className={`inline-flex w-max whitespace-nowrap ${slow ? "animate-marquee-slow" : "animate-marquee"}`}
        >
          {loop.map((item, i) => (
            <span
              key={`${item.id}-${i}`}
              className="mx-6 inline-flex items-center gap-2 text-[17px] text-slate-300"
            >
              <span className={isLive ? "text-emerald-400" : "text-amber-400"}>
                {isLive ? "✓" : "●"}
              </span>
              {item.title}
              {item.subtitle && (
                <span className="text-slate-500">· {item.subtitle}</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
