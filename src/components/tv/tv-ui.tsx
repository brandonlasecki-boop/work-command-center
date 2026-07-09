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
