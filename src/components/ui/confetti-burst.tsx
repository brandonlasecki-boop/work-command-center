"use client";

import confetti from "canvas-confetti";
import type { CreateTypes } from "canvas-confetti";

const CELEBRATION_COLORS = [
  "#6366f1",
  "#a855f7",
  "#ec4899",
  "#22d3ee",
  "#fbbf24",
  "#22c55e",
  "#ffffff",
];

let tvConfettiInstance: CreateTypes | null = null;

export function initTvConfetti(canvas: HTMLCanvasElement | null) {
  if (!canvas || tvConfettiInstance) return;
  tvConfettiInstance = confetti.create(canvas, {
    resize: true,
    useWorker: true,
  });
}

export function fireConfetti() {
  confetti({
    particleCount: 80,
    spread: 60,
    origin: { y: 0.7 },
    colors: CELEBRATION_COLORS,
    disableForReducedMotion: true,
  });
}

export function fireTvFireworks() {
  const shoot = tvConfettiInstance ?? confetti;

  shoot({
    particleCount: 70,
    spread: 76,
    startVelocity: 44,
    origin: { x: 0.5, y: 0.62 },
    colors: CELEBRATION_COLORS,
    ticks: 180,
    gravity: 1.05,
    scalar: 1.05,
    disableForReducedMotion: true,
  });

  window.setTimeout(() => {
    shoot({
      particleCount: 36,
      angle: 62,
      spread: 58,
      startVelocity: 40,
      origin: { x: 0.08, y: 0.72 },
      colors: CELEBRATION_COLORS,
      ticks: 160,
    });
    shoot({
      particleCount: 36,
      angle: 118,
      spread: 58,
      startVelocity: 40,
      origin: { x: 0.92, y: 0.72 },
      colors: CELEBRATION_COLORS,
      ticks: 160,
    });
  }, 180);

  window.setTimeout(() => {
    shoot({
      particleCount: 48,
      spread: 100,
      startVelocity: 36,
      origin: { x: 0.5, y: 0.48 },
      colors: CELEBRATION_COLORS,
      ticks: 200,
      scalar: 1.1,
    });
  }, 420);
}
