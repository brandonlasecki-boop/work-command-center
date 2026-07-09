"use client";

import confetti from "canvas-confetti";

const CELEBRATION_COLORS = [
  "#6366f1",
  "#818cf8",
  "#a855f7",
  "#ec4899",
  "#f472b6",
  "#22d3ee",
  "#38bdf8",
  "#fbbf24",
  "#f97316",
  "#22c55e",
  "#ffffff",
];

const CONFETTI_DEFAULTS = {
  zIndex: 99999,
  disableForReducedMotion: true,
} as const;

export function fireConfetti() {
  confetti({
    ...CONFETTI_DEFAULTS,
    particleCount: 80,
    spread: 60,
    origin: { y: 0.7 },
    colors: CELEBRATION_COLORS,
  });
}

export function fireTvFireworks() {
  const end = Date.now() + 3200;

  const sideInterval = window.setInterval(() => {
    confetti({
      ...CONFETTI_DEFAULTS,
      particleCount: 14,
      angle: 60,
      spread: 68,
      startVelocity: 58,
      origin: { x: 0, y: 0.72 },
      colors: CELEBRATION_COLORS,
      scalar: 1.15,
    });
    confetti({
      ...CONFETTI_DEFAULTS,
      particleCount: 14,
      angle: 120,
      spread: 68,
      startVelocity: 58,
      origin: { x: 1, y: 0.72 },
      colors: CELEBRATION_COLORS,
      scalar: 1.15,
    });

    if (Date.now() >= end) {
      window.clearInterval(sideInterval);
    }
  }, 120);

  const burst = (delay: number, particleCount: number, spread: number, y: number, scalar = 1) => {
    window.setTimeout(() => {
      confetti({
        ...CONFETTI_DEFAULTS,
        particleCount,
        spread,
        startVelocity: 52,
        origin: { x: 0.5, y },
        colors: CELEBRATION_COLORS,
        scalar,
        ticks: 260,
      });
    }, delay);
  };

  burst(0, 180, 118, 0.58, 1.25);
  burst(180, 140, 130, 0.5, 1.1);
  burst(360, 120, 100, 0.62, 1.2);
  burst(540, 160, 140, 0.48, 1.3);
  burst(760, 100, 90, 0.55, 1.05);

  window.setTimeout(() => {
    for (let i = 0; i < 8; i += 1) {
      window.setTimeout(() => {
        confetti({
          ...CONFETTI_DEFAULTS,
          particleCount: 36,
          spread: 360,
          startVelocity: 28,
          origin: {
            x: 0.15 + Math.random() * 0.7,
            y: 0.35 + Math.random() * 0.25,
          },
          colors: CELEBRATION_COLORS,
          scalar: 0.95 + Math.random() * 0.45,
          shapes: ["circle", "square"],
          ticks: 220,
        });
      }, i * 110);
    }
  }, 900);

  window.setTimeout(() => {
    confetti({
      ...CONFETTI_DEFAULTS,
      particleCount: 220,
      spread: 160,
      startVelocity: 48,
      origin: { x: 0.5, y: 0.42 },
      colors: CELEBRATION_COLORS,
      scalar: 1.35,
      ticks: 320,
    });
  }, 1400);
}
