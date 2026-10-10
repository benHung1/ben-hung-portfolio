import { rangeProfile, shuffled } from './skillRangeConfig';

export interface RangeSnapshot {
  targets: string[];
  unlocked: string[];
  retiring: string[];
  total: number;
  complete: boolean;
  round: number;
  paused: boolean;
}

/** State is independent of animation timing, language, DOM and device size. */
export class SkillRangeGame {
  private ids: string[];
  private queue: string[] = [];
  private active: string[] = [];
  private collected = new Set<string>();
  private retiring = new Set<string>();
  private capacity = 3;
  private celebrated = false;
  round = 1;
  paused = false;
  constructor(ids: readonly string[]) {
    this.ids = [...new Set(ids)];
    this.queue = [...this.ids];
    this.fill();
  }
  private fill() {
    while (this.active.length < this.capacity && this.queue.length)
      this.active.push(this.queue.shift()!);
  }
  snapshot(): RangeSnapshot {
    return {
      targets: [...this.active],
      unlocked: [...this.collected],
      retiring: [...this.retiring],
      total: this.ids.length,
      complete: this.ids.length > 0 && this.collected.size === this.ids.length,
      round: this.round,
      paused: this.paused,
    };
  }
  hit(id: string): boolean {
    if (!this.active.includes(id) || this.collected.has(id)) return false;
    this.collected.add(id);
    this.retiring.add(id);
    return true;
  }
  retire(id: string, round: number) {
    if (round !== this.round || !this.retiring.delete(id)) return;
    const slot = this.active.indexOf(id);
    const replacement = this.queue.shift();
    if (slot >= 0 && replacement) this.active[slot] = replacement;
    else this.active = this.active.filter((value) => value !== id);
    this.fill();
  }
  /** Misses go to the back of a finite queue; collecting is the only removal. */
  recycle(id: string, round: number): boolean {
    const slot = this.active.indexOf(id);
    if (round !== this.round || slot < 0 || this.collected.has(id))
      return false;
    this.queue.push(id);
    this.active[slot] = this.queue.shift()!;
    return true;
  }
  resize(capacity: number) {
    this.capacity = Math.max(1, Math.floor(capacity));
    const remaining = this.active.filter((id) => !this.collected.has(id));
    this.queue = [...remaining.slice(this.capacity), ...this.queue];
    this.active = remaining.slice(0, this.capacity);
    this.retiring.clear();
    this.fill();
  }
  takeCelebration(): boolean {
    if (!this.snapshot().complete || this.celebrated) return false;
    this.celebrated = true;
    return true;
  }
  /** Client only: keep server-rendered initial state deterministic. */
  randomize(random: () => number = Math.random) {
    this.queue = shuffled(
      this.ids.filter((id) => !this.collected.has(id)),
      random,
    );
    this.active = [];
    this.retiring.clear();
    this.fill();
  }
  restart() {
    this.round++;
    this.queue = [...this.ids];
    this.active = [];
    this.collected.clear();
    this.retiring.clear();
    this.celebrated = false;
    this.paused = false;
    this.randomize();
  }
}

export function rangeCapacity(width: number) {
  return rangeProfile(width).capacity;
}
export function validRangeTap(
  start: { x: number; y: number; time: number; scroll: number },
  end: { x: number; y: number; time: number; scroll: number },
) {
  return (
    Math.hypot(end.x - start.x, end.y - start.y) < 9 &&
    Math.abs(end.scroll - start.scroll) < 5 &&
    end.time - start.time < 800
  );
}

/** Only the reduced-motion fallback uses a stable, readable arrangement. */
export function staticRangePose(
  index: number,
  capacity: number,
  width: number,
  height: number,
  targetWidth: number,
  targetHeight: number,
) {
  const columns = capacity >= 5 ? 3 : capacity >= 3 ? 2 : 1;
  const rows = Math.ceil(capacity / columns);
  const cellW = (width - 32) / columns,
    cellH = (height - 150) / rows;
  const scale = Math.min(1, (cellW - 24) / targetWidth);
  const x = 16 + ((index % columns) + 0.5) * cellW - targetWidth / 2;
  const y = 95 + (Math.floor(index / columns) + 0.5) * cellH - targetHeight / 2;
  return {
    x: Math.max(12, Math.min(width - targetWidth - 12, x)),
    y: Math.max(82, Math.min(height - targetHeight - 28, y)),
    scale,
    rotation: 0,
  };
}
