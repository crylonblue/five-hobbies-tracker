import confetti from "canvas-confetti";

/** A quick, tasteful burst in the category's own color. */
export function celebrate(colors: string[]) {
  const defaults = {
    spread: 70,
    ticks: 220,
    gravity: 1,
    decay: 0.92,
    startVelocity: 32,
    colors,
    disableForReducedMotion: true,
  };

  confetti({ ...defaults, particleCount: 40, origin: { x: 0.5, y: 0.62 } });
  confetti({
    ...defaults,
    particleCount: 18,
    scalar: 0.8,
    origin: { x: 0.5, y: 0.62 },
  });
}

/** A bigger celebration for completing all five in a week. */
export function celebratePentathlon(colors: string[]) {
  const end = Date.now() + 700;
  const frame = () => {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.7 },
      colors,
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.7 },
      colors,
      disableForReducedMotion: true,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}
