import { gsap } from 'gsap';
import { staticRangePose } from './skillRangeState';
import {
  createSkillFlight,
  projectSkillFlight,
  type SkillFlight,
} from './skillRangeFlight';
import {
  skillRangeConfig as config,
  nextSpawnGap,
  spawnWaitCeiling,
  randomFlightSpeed,
  shuffled,
  type FlightSpeed,
} from './skillRangeConfig';

export interface SkillFlightRecord {
  event: 'spawn' | 'miss' | 'hit';
  id: string;
  speed: FlightSpeed;
  plannedSeconds: number;
  actualSeconds: number;
  wallSeconds: number;
  startDepth: number;
  endDepth: number;
}

/** Owns DOM animation only; game state is independent of animation timing. */
export function createSkillRangeMotion(
  board: HTMLElement,
  onMissed: (id: string) => void,
  remainingCount?: () => number,
  onFlightRecord?: (record: SkillFlightRecord) => void,
) {
  const context = gsap.context(() => {}, board);
  const effects = new Set<gsap.core.Timeline>();
  const pending = new Map<string, () => void>();
  const nodes = new Set<HTMLElement>();
  const flights = new Map<string, SkillFlight>();
  const startedAt = new WeakMap<SkillFlight, number>();
  const sizes = new Map<HTMLElement, { width: number; height: number }>();
  let frame = 0,
    last = 0,
    running = false,
    reduced = false,
    disposed = false;
  let focused = '',
    width = board.clientWidth,
    height = board.clientHeight;
  let tracks: HTMLElement[] = [],
    initial = true,
    entered = false;
  let waiting: string[] = [];
  let spawnWait = 0;
  const remaining = () => remainingCount?.() ?? tracks.length;
  // Dev-only observer is injected by the component. No UI or production logs.
  // actualSeconds excludes pause/offscreen/focus time; wallSeconds includes it.
  function record(id: string, event: SkillFlightRecord['event']) {
    if (!onFlightRecord) return;
    const flight = flights.get(id);
    if (!flight) return;
    const now = performance.now();
    if (event === 'spawn') {
      if (startedAt.has(flight)) return;
      startedAt.set(flight, now);
    }
    const start = startedAt.get(flight);
    if (start === undefined) return;
    const size = sizes.get(
      tracks.find((track) => track.dataset.skill === id)!,
    )!;
    const depthAt = (age: number) =>
      projectSkillFlight(
        { ...flight, age },
        width,
        height,
        size.width,
        size.height,
      ).distance;
    onFlightRecord({
      event,
      id,
      speed: flight.speed,
      plannedSeconds: flight.duration,
      actualSeconds: flight.age,
      wallSeconds: (now - start) / 1000,
      startDepth: depthAt(0),
      endDepth: depthAt(flight.duration),
    });
  }
  function launch(id: string, progress = 0, speed = randomFlightSpeed()) {
    const track = tracks.find((item) => item.dataset.skill === id);
    if (!track) return;
    const size = sizes.get(track)!;
    flights.set(
      id,
      createSkillFlight(
        speed,
        [...flights.values()],
        {
          width,
          height,
          targetWidth: size.width,
          targetHeight: size.height,
        },
        progress,
      ),
    );
    waiting = waiting.filter((value) => value !== id);
    spawnWait = nextSpawnGap(remaining());
  }
  function animation(build: (timeline: gsap.core.Timeline) => void) {
    let timeline!: gsap.core.Timeline;
    context.add(() => {
      timeline = gsap.timeline({ onComplete: () => effects.delete(timeline) });
      effects.add(timeline);
      build(timeline);
      if (!running) timeline.pause();
    });
  }
  function paint(delta = 0) {
    const missed: string[] = [];
    const depthOrder: { track: HTMLElement; scale: number }[] = [];
    tracks.forEach((track, index) => {
      const id = track.dataset.skill!;
      const flight = flights.get(id);
      const size = sizes.get(track)!;
      const button = track.querySelector<HTMLElement>('.range-target');
      if (flight && running && !reduced) record(id, 'spawn');
      if (!flight && !reduced) {
        track.style.visibility = 'hidden';
        track.style.pointerEvents = 'none';
        track.dataset.flightPhase = 'waiting';
        if (button) button.tabIndex = -1;
        return;
      }
      // Focus/press/hit freezes flight time as well as position: no jump on blur.
      if (
        flight &&
        !reduced &&
        focused !== id &&
        !pending.has(id) &&
        !flight.recycling
      )
        flight.age += delta;
      const pose = reduced
        ? {
            ...staticRangePose(
              index,
              tracks.length,
              width,
              height,
              size.width,
              size.height,
            ),
            opacity: 1,
            expired: false,
          }
        : projectSkillFlight(flight!, width, height, size.width, size.height);
      track.style.transform = `translate3d(${pose.x}px,${pose.y}px,0) scale(${pose.scale}) rotate(${pose.rotation}deg)`;
      track.style.opacity = String(pose.opacity);
      track.style.visibility = 'visible';
      track.style.pointerEvents = pose.opacity > 0.1 ? 'auto' : 'none';
      track.dataset.flightPhase = 'active';
      track.dataset.flightSpeed = flight?.speed ?? 'static';
      if (button) button.tabIndex = pose.opacity > 0.1 ? 0 : -1;
      depthOrder.push({ track, scale: pose.scale });
      if (
        !reduced &&
        flight &&
        pose.expired &&
        !flight.recycling &&
        focused !== id &&
        !pending.has(id)
      ) {
        flight.recycling = true;
        record(id, 'miss');
        missed.push(id);
      }
    });
    // Exact depth order (no rounded distance ties), always beneath the HUD.
    depthOrder
      .sort((a, b) => a.scale - b.scale)
      .forEach(({ track }, index) => {
        track.style.zIndex = String(index + 1);
      });
    missed.forEach(onMissed);
  }
  function tick(now: number) {
    frame = 0;
    if (disposed || !running || reduced || !tracks.length) return;
    // Real elapsed time keeps approach speed consistent on low-refresh devices.
    // Visibility/pause resets `last`, so returning never advances hidden time.
    const delta = last ? Math.min((now - last) / 1000, 1) : 0;
    last = now;
    spawnWait = Math.max(0, spawnWait - delta);
    if (remaining() <= config.spawn.fewRemaining)
      spawnWait = Math.min(spawnWait, config.spawn.fewMax);
    // Existing targets consume the elapsed frame before newly born cards.
    paint(delta);
    if (waiting.length) {
      const playable = [...flights.entries()].filter(
        ([id, flight]) =>
          !flight.recycling &&
          !pending.has(id) &&
          flight.duration - flight.age > config.fadeOut,
      ).length;
      spawnWait = Math.min(
        spawnWait,
        spawnWaitCeiling(width, playable, remaining()),
      );
      if (spawnWait <= 0) {
        launch(waiting[0]!);
        paint();
      }
    }
    frame = requestAnimationFrame(tick);
  }
  function enter() {
    if (entered || !running || reduced) return;
    entered = true;
    animation((tl) =>
      tl
        .fromTo(
          board.querySelector('.range-floor'),
          { scaleY: 0.6, opacity: 0.2 },
          { scaleY: 1, opacity: 1, duration: 0.65, ease: 'power2.out' },
        )
        .fromTo(
          board.querySelectorAll('.range-target'),
          { opacity: 0.35, y: 22, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, stagger: 0.055, duration: 0.4 },
          0,
        ),
    );
  }
  function sync(active: boolean, isReduced: boolean) {
    if (disposed) return;
    reduced = isReduced;
    running = active;
    board.dataset.rangeAnimation = reduced
      ? 'static'
      : active
        ? 'running'
        : 'paused';
    cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
    for (const effect of effects) active ? effect.resume() : effect.pause();
    if (reduced) {
      for (const effect of [...effects]) effect.progress(1);
      paint();
    } else if (active) {
      enter();
      frame = requestAnimationFrame(tick);
    }
  }
  function measure() {
    if (disposed) return;
    width = board.clientWidth;
    height = board.clientHeight;
    tracks = Array.from(
      board.querySelectorAll<HTMLElement>('.range-target-track'),
    );
    sizes.clear();
    tracks.forEach((track) =>
      sizes.set(track, {
        width: track.offsetWidth,
        height: track.offsetHeight,
      }),
    );
    const ids = new Set(tracks.map((track) => track.dataset.skill!));
    for (const id of flights.keys()) if (!ids.has(id)) flights.delete(id);
    waiting = waiting.filter((id) => ids.has(id));
    const initialSpeeds = shuffled(config.initialSpeeds.slice(0, ids.size));
    for (const [index, id] of [...ids].entries()) {
      if (flights.has(id) || waiting.includes(id)) continue;
      if (initial)
        launch(
          id,
          0.02 + ((index + Math.random()) / ids.size) * 0.56,
          initialSpeeds[index] ?? randomFlightSpeed(),
        );
      else {
        if (!waiting.length) spawnWait = nextSpawnGap(remaining());
        waiting.push(id);
      }
    }
    initial = false;
    paint();
  }
  function cancel(finishHits = false) {
    for (const effect of effects) effect.kill();
    effects.clear();
    for (const node of nodes) node.remove();
    nodes.clear();
    for (const track of tracks) {
      const target = track.querySelector<HTMLElement>('.range-target');
      for (const property of ['transform', 'opacity', 'filter'])
        target?.style.removeProperty(property);
    }
    const callbacks = [...pending.values()];
    pending.clear();
    if (finishHits) callbacks.forEach((done) => done());
  }
  function hit(id: string, done: () => void) {
    if (!reduced) record(id, 'hit');
    const track = tracks.find((item) => item.dataset.skill === id);
    const target = track?.querySelector<HTMLElement>('.range-target');
    if (!track || !target || reduced || !running) {
      done();
      return;
    }
    pending.set(id, done);
    const rect = track.getBoundingClientRect(),
      bounds = board.getBoundingClientRect();
    const x =
      ((rect.left + rect.width / 2 - bounds.left) * width) / bounds.width;
    const y =
      ((rect.top + rect.height / 2 - bounds.top) * height) / bounds.height;
    const count = width < 600 ? 7 : 10;
    const shards = Array.from({ length: count }, (_, i) => {
      const node = document.createElement('i');
      node.className = 'range-shard';
      node.style.left = `${x}px`;
      node.style.top = `${y}px`;
      node.setAttribute('aria-hidden', 'true');
      board.append(node);
      nodes.add(node);
      return { node, angle: (i * Math.PI * 2) / count };
    });
    animation((tl) => {
      tl.to(target, {
        scale: 1.09,
        filter: 'brightness(1.7)',
        duration: 0.08,
      }).to(target, { scale: 0.65, opacity: 0, duration: 0.18 });
      shards.forEach(({ node, angle }, i) =>
        tl.fromTo(
          node,
          { x: 0, y: 0, opacity: 1 },
          {
            x: Math.cos(angle) * (42 + i * 3),
            y: Math.sin(angle) * (42 + i * 3),
            rotation: i * 35,
            opacity: 0,
            scale: 0.2,
            duration: 0.4,
          },
          0.06,
        ),
      );
      tl.call(() => {
        shards.forEach(({ node }) => {
          node.remove();
          nodes.delete(node);
        });
        const callback = pending.get(id);
        pending.delete(id);
        callback?.();
      });
    });
  }
  function celebrate() {
    if (disposed || reduced || !running) return;
    const badge = board.querySelector('.range-badge');
    if (!badge) return;
    animation((tl) => {
      badge.querySelectorAll('i').forEach((piece, i) =>
        tl.fromTo(
          piece,
          {
            x: Math.cos(i * 2.1) * 110,
            y: Math.sin(i * 2.1) * 90,
            rotation: i * 65,
            scale: 0.3,
            opacity: 0,
          },
          {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            opacity: 1,
            duration: 1.1,
            ease: 'power3.out',
          },
          i * 0.1,
        ),
      );
      tl.fromTo(
        badge.querySelector('strong'),
        { opacity: 0, scale: 0.7 },
        { opacity: 1, scale: 1, duration: 0.4 },
        0.75,
      );
    });
  }
  measure();
  return {
    sync,
    measure,
    hit,
    celebrate,
    cancel,
    /** Also relaunches the last uncollected ID when Vue reuses its DOM node. */
    recycled(id: string) {
      flights.delete(id);
      measure();
    },
    focus(id: string) {
      focused = id;
      if (id && !flights.has(id)) launch(id);
      const flight = flights.get(id);
      if (flight && !flight.recycling) {
        flight.age = Math.max(
          config.fadeIn,
          Math.min(flight.duration - config.fadeOut - 0.1, flight.age),
        );
        paint();
      }
    },
    reset() {
      cancel();
      flights.clear();
      waiting = [];
      spawnWait = 0;
      initial = true;
      focused = '';
      entered = false;
      measure();
      enter();
    },
    destroy() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(frame);
      cancel();
      context.revert();
      tracks.forEach((track) => {
        track.style.removeProperty('transform');
        track.style.removeProperty('z-index');
        track.style.removeProperty('opacity');
        track.style.removeProperty('visibility');
        track.style.removeProperty('pointer-events');
        delete track.dataset.flightPhase;
        delete track.dataset.flightSpeed;
        track
          .querySelector<HTMLElement>('.range-target')
          ?.removeAttribute('tabindex');
      });
      delete board.dataset.rangeAnimation;
      flights.clear();
      waiting = [];
      sizes.clear();
      tracks = [];
    },
  };
}
