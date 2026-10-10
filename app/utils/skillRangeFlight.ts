import {
  skillRangeConfig as config,
  rangeProfile,
  randomBetween,
  type FlightSpeed,
} from './skillRangeConfig';

export interface SkillFlight {
  age: number;
  duration: number;
  speed: FlightSpeed;
  depth: number;
  startDepthProgress: number;
  u: number;
  v: number;
  endU: number;
  endV: number;
  lean: number;
  turn: number;
  recycling: boolean;
}
export interface FlightViewport {
  width: number;
  height: number;
  targetWidth: number;
  targetHeight: number;
}
const clamp = (n: number, min = 0, max = 1) => Math.max(min, Math.min(max, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Project a straight 3D path toward the camera, with a small screen-space drift. */
export function projectSkillFlight(
  flight: SkillFlight,
  width: number,
  height: number,
  targetWidth: number,
  targetHeight: number,
) {
  const profile = rangeProfile(width);
  const far = lerp(
    lerp(profile.far[0], profile.far[1], flight.depth),
    profile.near,
    flight.startDepthProgress,
  );
  const progress = clamp(flight.age / flight.duration);
  const distance = lerp(far, profile.near, progress);
  const scale = config.focalLength / distance;
  const farScale = config.focalLength / far,
    nearScale = config.focalLength / profile.near;
  // Bound rotated corners at both endpoints. Perspective interpolation keeps
  // the whole route inside the safe rectangle, including after resize.
  const radians =
    ((config.placement.lean + config.placement.turn) * Math.PI) / 180;
  const halfW =
    (targetWidth * Math.cos(radians) + targetHeight * Math.sin(radians)) / 2;
  const halfH =
    (targetHeight * Math.cos(radians) + targetWidth * Math.sin(radians)) / 2;
  const point = (s: number, u: number, v: number) => ({
    x: lerp(profile.inline + halfW * s, width - profile.inline - halfW * s, u),
    y: lerp(profile.top + halfH * s, height - profile.bottom - halfH * s, v),
  });
  const start = point(farScale, flight.u, flight.v),
    end = point(nearScale, flight.endU, flight.endV);
  const cameraX = width / 2,
    cameraY = height * 0.44;
  const worldX = lerp(
    (start.x - cameraX) / farScale,
    (end.x - cameraX) / nearScale,
    progress,
  );
  const worldY = lerp(
    (start.y - cameraY) / farScale,
    (end.y - cameraY) / nearScale,
    progress,
  );
  return {
    x: cameraX + worldX * scale - targetWidth / 2,
    y: cameraY + worldY * scale - targetHeight / 2,
    scale,
    distance,
    rotation: flight.lean + flight.turn * progress,
    opacity:
      clamp(flight.age / config.fadeIn) *
      clamp((flight.duration - flight.age) / config.fadeOut),
    expired: flight.age >= flight.duration,
  };
}

/** Sample the entire safe area; score current and future overlap before launch. */
export function createSkillFlight(
  speed: FlightSpeed,
  others: readonly SkillFlight[],
  viewport: FlightViewport,
  initialProgress = 0,
  random: () => number = Math.random,
): SkillFlight {
  const duration =
    randomBetween(config.speeds[speed], random) *
    rangeProfile(viewport.width).durationMultiplier;
  const base = {
    // Populate several depths by shortening the spatial path, never by
    // skipping flight time. Every birth receives its entire chosen duration.
    age: 0,
    duration,
    speed,
    depth: random(),
    startDepthProgress: clamp(initialProgress, 0, 0.58),
    lean: (random() * 2 - 1) * config.placement.lean,
    turn: (random() * 2 - 1) * config.placement.turn,
    recycling: false,
  };
  const rect = (f: SkillFlight, time: number) => {
    const p = projectSkillFlight(
      { ...f, age: Math.min(f.duration, f.age + time) },
      viewport.width,
      viewport.height,
      viewport.targetWidth,
      viewport.targetHeight,
    );
    const margin = config.placement.gap / 2;
    return {
      x: p.x + viewport.targetWidth / 2,
      y: p.y + viewport.targetHeight / 2,
      w: viewport.targetWidth * p.scale + margin * 2,
      h: viewport.targetHeight * p.scale + margin * 2,
    };
  };
  let best!: SkillFlight,
    bestScore = Infinity;
  for (let i = 0; i < config.placement.attempts; i++) {
    const u = random(),
      v = random();
    const candidate = {
      ...base,
      u,
      v,
      endU: clamp(
        u + (u - 0.5) * 0.12 + (random() - 0.5) * config.placement.drift,
      ),
      endV: clamp(
        v + (v - 0.5) * 0.12 + (random() - 0.5) * config.placement.drift,
      ),
    };
    let score = 0;
    for (const future of [0, 3]) {
      const a = rect(candidate, future);
      for (const other of others) {
        if (other.recycling || other.age + future >= other.duration) continue;
        const b = rect(other, future);
        score +=
          Math.max(0, (a.w + b.w) / 2 - Math.abs(a.x - b.x)) *
          Math.max(0, (a.h + b.h) / 2 - Math.abs(a.y - b.y)) *
          (future ? 0.5 : 1);
      }
    }
    if (score < bestScore) {
      best = candidate;
      bestScore = score;
    }
    if (score === 0) break;
  }
  return best;
}
