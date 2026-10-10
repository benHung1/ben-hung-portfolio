/** All pacing and layout values are tuned here. Times are seconds. */
export const skillRangeConfig = {
  focalLength: 700,
  // Full visible birth-to-recycle time, including the short edge fades.
  speeds: { fast: [1.28, 1.76], medium: [2, 2.64], slow: [3.2, 4.16] },
  speedWeights: { fast: 0.25, medium: 0.45, slow: 0.3 },
  initialSpeeds: ['fast', 'slow', 'medium'],
  spawn: {
    burstChance: 0.2,
    pauseChance: 0.15,
    burst: [0.12, 0.32],
    normal: [0.65, 1.55],
    pause: [1.8, 2.6],
    fewRemaining: 3,
    fewMultiplier: 0.3,
    fewMax: 0.48,
    emptyMax: 0.22,
  },
  fadeIn: 0.08,
  fadeOut: 0.128,
  placement: { attempts: 48, gap: 24, drift: 0.16, lean: 6, turn: 2 },
  devices: {
    mobile: {
      maxWidth: 600,
      capacity: 2,
      durationMultiplier: 1.25,
      far: [1020, 1470],
      near: 560,
      inline: 18,
      top: 96,
      bottom: 54,
    },
    tablet: {
      maxWidth: 1000,
      capacity: 4,
      durationMultiplier: 1,
      far: [1000, 1600],
      near: 460,
      inline: 22,
      top: 94,
      bottom: 56,
    },
    desktop: {
      maxWidth: Infinity,
      capacity: 5,
      durationMultiplier: 1,
      far: [1000, 1800],
      near: 430,
      inline: 24,
      top: 92,
      bottom: 56,
    },
  },
} as const;
export type FlightSpeed = keyof typeof skillRangeConfig.speeds;
/** Independent draw per birth; no shared progress or batch duration. */
export function randomFlightSpeed(
  random: () => number = Math.random,
): FlightSpeed {
  const choice = random(),
    weights = skillRangeConfig.speedWeights;
  return choice < weights.fast
    ? 'fast'
    : choice < weights.fast + weights.medium
      ? 'medium'
      : 'slow';
}
export const randomBetween = (
  range: readonly [number, number],
  random: () => number,
) => range[0] + (range[1] - range[0]) * random();
export function rangeProfile(width: number) {
  return Object.values(skillRangeConfig.devices).find(
    (profile) => width < profile.maxWidth,
  )!;
}
export function shuffled<T>(
  items: readonly T[],
  random: () => number = Math.random,
): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}
export function nextSpawnGap(
  remaining: number,
  random: () => number = Math.random,
) {
  const s = skillRangeConfig.spawn,
    choice = random();
  const gap = randomBetween(
    choice < s.burstChance
      ? s.burst
      : choice > 1 - s.pauseChance
        ? s.pause
        : s.normal,
    random,
  );
  return remaining <= s.fewRemaining
    ? Math.min(s.fewMax, gap * s.fewMultiplier)
    : gap;
}
