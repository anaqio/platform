export const FPS = 30;
export const DURATION_S = 60;
export const DURATION_FRAMES = FPS * DURATION_S; // 1800

// Scene start frames
export const SCENES = {
  intro: { start: 0, end: 149 }, // 0-5s
  problem: { start: 150, end: 449 }, // 5-15s
  upload: { start: 450, end: 749 }, // 15-25s
  generate: { start: 750, end: 1199 }, // 25-40s
  results: { start: 1200, end: 1559 }, // 40-52s
  cta: { start: 1560, end: 1799 }, // 52-60s
} as const;

export function sceneDuration(scene: keyof typeof SCENES) {
  return SCENES[scene].end - SCENES[scene].start + 1;
}
