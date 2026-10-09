export interface PreparationState {
  active: boolean;
  progress: number;
  phase: 'preparing' | 'leaving' | 'idle';
  pathname: string;
  run: number;
}
export interface PreparationClock {
  now(): number;
  frame(callback: (time: number) => void): number;
  cancelFrame(id: number): void;
  timeout(callback: () => void, delay: number): ReturnType<typeof setTimeout>;
  clearTimeout(id: ReturnType<typeof setTimeout>): void;
}
/** Visual page-preparation progress, deliberately independent of download bytes. */
export function createPagePreparation(
  state: PreparationState,
  clock: PreparationClock,
  reduced: () => boolean,
  publish: () => void,
  finished: (reason: string) => void,
) {
  let frame = 0,
    watchdog: ReturnType<typeof setTimeout> | undefined;
  let started = 0,
    ready = false,
    fast = false,
    initial = true,
    completedAt = 0;
  function clear() {
    clock.cancelFrame(frame);
    frame = 0;
    if (watchdog) clock.clearTimeout(watchdog);
    watchdog = undefined;
  }
  function cancel(reason = 'cancelled') {
    clear();
    state.active = false;
    state.phase = 'idle';
    publish();
    finished(reason);
  }
  function tick(time: number) {
    frame = 0;
    if (!state.active) return;
    const elapsed = time - started;
    const short = reduced() || fast;
    const minimum = short ? 40 : initial ? 650 : 460;
    if (!ready || elapsed < minimum)
      state.progress = short
        ? 0
        : Math.min(86, Math.floor(86 * (1 - Math.exp(-elapsed / 210))));
    else {
      if (!completedAt) completedAt = time;
      const t = Math.min(1, (time - completedAt) / (short ? 30 : 130));
      state.progress = Math.round(86 + 14 * t);
      if (t === 1) state.phase = 'leaving';
      if (time - completedAt >= (short ? 75 : 350)) {
        cancel('ready');
        return;
      }
    }
    publish();
    frame = clock.frame(tick);
  }
  return {
    start(pathname: string, first = false) {
      clear();
      started = clock.now();
      ready = false;
      fast = false;
      completedAt = 0;
      initial = first;
      state.active = true;
      state.progress = 0;
      state.phase = 'preparing';
      state.pathname = pathname;
      state.run++;
      publish();
      frame = clock.frame(tick);
      watchdog = clock.timeout(() => cancel('timeout'), 4500);
    },
    ready(pathname: string) {
      if (state.active && state.pathname === pathname) ready = true;
    },
    skip() {
      fast = true;
    },
    cancel,
    destroy() {
      clear();
    },
  };
}
