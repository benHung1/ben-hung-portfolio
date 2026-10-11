export interface PreparationState {
  active: boolean;
  visible: boolean;
  phase: 'preparing' | 'leaving' | 'idle';
  pathname: string;
  run: number;
}
export interface PreparationClock {
  timeout(callback: () => void, delay: number): ReturnType<typeof setTimeout>;
  clearTimeout(id: ReturnType<typeof setTimeout>): void;
}
export const preparationTiming = { showAfter: 240, exit: 140, watchdog: 4500 };

/** Readiness controls page entrance; a delayed, non-blocking status has no fake progress. */
export function createPagePreparation(
  state: PreparationState,
  clock: PreparationClock,
  reduced: () => boolean,
  publish: () => void,
  finished: (reason: string) => void,
) {
  let reveal: ReturnType<typeof setTimeout> | undefined;
  let watchdog: ReturnType<typeof setTimeout> | undefined;
  let exit: ReturnType<typeof setTimeout> | undefined;
  function clear() {
    for (const timer of [reveal, watchdog, exit])
      if (timer !== undefined) clock.clearTimeout(timer);
    reveal = watchdog = exit = undefined;
  }
  function cancel(reason = 'cancelled') {
    clear();
    state.active = state.visible = false;
    state.phase = 'idle';
    publish();
    finished(reason);
  }
  return {
    start(pathname: string, _first = false) {
      clear();
      state.active = true;
      state.visible = false;
      state.phase = 'preparing';
      state.pathname = pathname;
      state.run++;
      publish();
      reveal = clock.timeout(() => {
        reveal = undefined;
        if (!state.active) return;
        state.visible = true;
        publish();
      }, preparationTiming.showAfter);
      watchdog = clock.timeout(
        () => cancel('timeout'),
        preparationTiming.watchdog,
      );
    },
    ready(pathname: string) {
      if (!state.active || state.pathname !== pathname) return;
      clear();
      // Release the page immediately, even while the status is fading out.
      state.active = false;
      if (state.visible && !reduced()) {
        state.phase = 'leaving';
        publish();
        finished('ready');
        exit = clock.timeout(() => {
          exit = undefined;
          state.visible = false;
          state.phase = 'idle';
          publish();
        }, preparationTiming.exit);
      } else cancel('ready');
    },
    skip() {
      if (reveal !== undefined) clock.clearTimeout(reveal);
      if (exit !== undefined) clock.clearTimeout(exit);
      reveal = exit = undefined;
      state.visible = false;
      state.phase = state.active ? 'preparing' : 'idle';
      publish();
    },
    cancel,
    destroy() {
      clear();
      state.active = state.visible = false;
      state.phase = 'idle';
      publish();
    },
  };
}
