"use client";

import { useEffect, useState } from "react";

export const TV_CANVAS_WIDTH = 1920;
export const TV_CANVAS_HEIGHT = 1080;

export function useCanvasScale() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function update() {
      const w = window.innerWidth || TV_CANVAS_WIDTH;
      const h = window.innerHeight || TV_CANVAS_HEIGHT;
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
