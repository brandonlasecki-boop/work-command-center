"use client";

import { useEffect, useState } from "react";

export type TvSizing = {
  companyRing: number;
  projectRing: number;
  strokeCompany: number;
  strokeProject: number;
  isCompact: boolean;
  isWide: boolean;
};

function computeSizing(width: number, height: number): TvSizing {
  const vmin = Math.min(width, height);
  const isCompact = height < 720 || width < 1024;
  const isWide = width >= 1600;

  return {
    companyRing: Math.round(Math.min(Math.max(vmin * 0.11, 56), 132)),
    projectRing: Math.round(Math.min(Math.max(vmin * 0.085, 44), 96)),
    strokeCompany: Math.round(Math.min(Math.max(vmin * 0.007, 4), 7)),
    strokeProject: Math.round(Math.min(Math.max(vmin * 0.0055, 3), 5)),
    isCompact,
    isWide,
  };
}

export function useTvSizing(): TvSizing {
  const [sizing, setSizing] = useState<TvSizing>(() =>
    typeof window !== "undefined"
      ? computeSizing(window.innerWidth, window.innerHeight)
      : {
          companyRing: 80,
          projectRing: 60,
          strokeCompany: 5,
          strokeProject: 4,
          isCompact: false,
          isWide: true,
        }
  );

  useEffect(() => {
    function update() {
      setSizing(computeSizing(window.innerWidth, window.innerHeight));
    }

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return sizing;
}
