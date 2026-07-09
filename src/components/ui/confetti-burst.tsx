"use client";

import confetti from "canvas-confetti";

export function fireConfetti() {
  confetti({
    particleCount: 80,
    spread: 60,
    origin: { y: 0.7 },
    colors: ["#6366f1", "#a855f7", "#ec4899", "#22d3ee"],
  });
}
