"use client";

import { useEffect, useState } from "react";

export type TvDisplay = {
  title: number;
  subtitle: number;
  heading: number;
  body: number;
  small: number;
  stat: number;
  pad: number;
  gap: number;
  cardPad: number;
  companyRing: number;
  projectRing: number;
  strokeCompany: number;
  strokeProject: number;
  percentLg: number;
  percentSm: number;
  isFireTv: boolean;
  isWide: boolean;
  columns: 1 | 2 | 3;
};

function isFireTvBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Silk|AFT[A-Z]|AmazonWebKit|SmartTV|GoogleTV|CrKey|Tizen|Web0S/i.test(navigator.userAgent);
}

function getBaseHeight(): number {
  const inner = window.innerHeight || 0;
  const client = document.documentElement.clientHeight || 0;
  const screen = window.screen?.height || 0;
  return Math.max(inner, client, screen, 720);
}

function getBaseWidth(): number {
  const inner = window.innerWidth || 0;
  const client = document.documentElement.clientWidth || 0;
  const screen = window.screen?.width || 0;
  return Math.max(inner, client, screen, 1280);
}

function computeDisplay(width: number, height: number, fireTv: boolean): TvDisplay {
  // Scale from 1080p baseline — works better on Fire TV than vmin/clamp
  const scale = height / 1080;
  const boost = fireTv ? 1.15 : 1;

  const px = (base: number) => Math.round(base * scale * boost);

  return {
    title: px(48),
    subtitle: px(26),
    heading: px(20),
    body: px(fireTv ? 26 : 22),
    small: px(fireTv ? 20 : 18),
    stat: px(44),
    pad: px(28),
    gap: px(18),
    cardPad: px(20),
    companyRing: px(fireTv ? 100 : 88),
    projectRing: px(fireTv ? 76 : 64),
    strokeCompany: Math.max(4, px(6)),
    strokeProject: Math.max(3, px(5)),
    percentLg: px(28),
    percentSm: px(18),
    isFireTv: fireTv,
    isWide: width >= 1200,
    columns: width >= 1400 ? 3 : width >= 900 ? 2 : 1,
  };
}

export function useTvDisplay(): TvDisplay {
  const [display, setDisplay] = useState<TvDisplay>(() => {
    if (typeof window === "undefined") {
      return computeDisplay(1920, 1080, false);
    }
    const fireTv = isFireTvBrowser();
    return computeDisplay(getBaseWidth(), getBaseHeight(), fireTv);
  });

  useEffect(() => {
    const fireTv = isFireTvBrowser();

    function update() {
      setDisplay(computeDisplay(getBaseWidth(), getBaseHeight(), fireTv));
    }

    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return display;
}
