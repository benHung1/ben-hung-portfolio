import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
const read = (path) => readFile(new URL('../' + path, import.meta.url), 'utf8');
function load(source, dependencies = {}) {
  const module = { exports: {} };
  vm.runInNewContext(
    ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText,
    { module, exports: module.exports, require: (id) => dependencies[id] },
  );
  return module.exports;
}
const loadPlaceholder = load(await read('app/data/playground.ts'));
const { skills } = loadPlaceholder;
const configModule = load(await read('app/utils/skillRangeConfig.ts'));
const {
  skillRangeConfig: config,
  rangeProfile,
  nextSpawnGap,
  randomFlightSpeed,
} = configModule;
const { SkillRangeGame, rangeCapacity, staticRangePose, validRangeTap } = load(
  await read('app/utils/skillRangeState.ts'),
  { './skillRangeConfig': configModule },
);
const flightModule = load(await read('app/utils/skillRangeFlight.ts'), {
  './skillRangeConfig': configModule,
});
const { createSkillFlight, projectSkillFlight } = flightModule;
const ids = skills.map((s) => s.id);
assert.equal(new Set(ids).size, 17);
for (const width of [350, 728, 1370]) {
  const cap = rangeCapacity(width),
    game = new SkillRangeGame(ids);
  game.resize(cap);
  let attempts = 0;
  while (!game.snapshot().complete && attempts++ < 30) {
    const before = game.snapshot(),
      id = before.targets[0];
    assert.ok(id);
    assert.equal(game.hit(id), true);
    assert.equal(game.hit(id), false);
    assert.equal(game.snapshot().unlocked.length, before.unlocked.length + 1);
    game.retire(id, game.round);
    game.retire(id, game.round);
    assert.equal(
      new Set(game.snapshot().targets).size,
      game.snapshot().targets.length,
    );
  }
  assert.equal(game.snapshot().unlocked.length, ids.length);
  assert.equal(game.takeCelebration(), true);
  assert.equal(game.takeCelebration(), false);
  game.paused = true;
  game.resize(3);
  assert.equal(game.paused, true);
  const round = game.round;
  game.restart();
  assert.equal(game.snapshot().unlocked.length, 0);
  assert.equal(game.round, round + 1);
  game.retire(ids[0], round);
  assert.equal(game.snapshot().targets.length, 3);
  for (let t = 0; t < 100; t += 0.3)
    for (let i = 0; i < cap; i++) {
      const p = staticRangePose(i, cap, width, 620, 174, 96);
      assert.ok(p.x >= 12 && p.x + 174 <= width - 12);
      assert.ok(p.y >= 82 && p.y + 78 <= 620 - 28);
      assert.ok(78 * p.scale >= 44);
    }
}
let seed = 12345;
const random = () => (seed = (1664525 * seed + 1013904223) >>> 0) / 4294967296;
const positions = [],
  durations = { slow: [], medium: [], fast: [] };
// Whole 3D paths must keep their rotated hit regions clear of HUD and edges.
for (const width of [350, 728, 1370]) {
  const flights = [];
  for (let i = 0; i < 60; i++) {
    const speed = ['slow', 'medium', 'fast'][i % 3];
    const flight = createSkillFlight(
      speed,
      flights.slice(-rangeCapacity(width)),
      { width, height: 620, targetWidth: 174, targetHeight: 96 },
      0,
      random,
    );
    flights.push(flight);
    positions.push([flight.u, flight.v]);
    durations[speed].push(
      flight.duration / rangeProfile(width).durationMultiplier,
    );
  }
  const profile = rangeProfile(width);
  for (const flight of flights) {
    let previousScale = 0,
      previousDistance = Infinity,
      readableSeconds = 0;
    for (let age = 0; age <= flight.duration; age += 0.05) {
      const p = projectSkillFlight({ ...flight, age }, width, 620, 174, 96);
      assert.ok(p.scale >= previousScale);
      assert.ok(p.distance <= previousDistance);
      assert.ok(Math.abs(p.scale * p.distance - 700) < 0.001);
      const rad = (Math.abs(p.rotation) * Math.PI) / 180;
      const halfW = ((174 * Math.cos(rad) + 96 * Math.sin(rad)) / 2) * p.scale;
      const halfH = ((96 * Math.cos(rad) + 174 * Math.sin(rad)) / 2) * p.scale;
      assert.ok(p.x + 87 - halfW >= profile.inline - 0.01);
      assert.ok(p.x + 87 + halfW <= width - profile.inline + 0.01);
      assert.ok(p.y + 48 - halfH >= profile.top - 0.01);
      assert.ok(p.y + 48 + halfH <= 620 - profile.bottom + 0.01);
      if (p.scale >= 0.55 && p.opacity >= 0.9) readableSeconds += 0.05;
      if (width < 600) assert.ok(96 * p.scale >= 44);
      previousScale = p.scale;
      previousDistance = p.distance;
    }
    assert.ok(
      readableSeconds > (width < 600 ? 1.1 : 0.65),
      `${flight.speed} needs a readable hit window: ${readableSeconds}s`,
    );
    const far = projectSkillFlight(
      { ...flight, age: flight.duration * 0.2 },
      width,
      620,
      174,
      96,
    );
    const near = projectSkillFlight(
      { ...flight, age: flight.duration * 0.8 },
      width,
      620,
      174,
      96,
    );
    assert.ok(near.scale > far.scale);
    assert.equal(
      projectSkillFlight(
        { ...flight, age: flight.duration },
        width,
        620,
        174,
        96,
      ).expired,
      true,
    );
  }
  const game = new SkillRangeGame(ids),
    seen = new Set();
  game.resize(rangeCapacity(width));
  game.randomize(random);
  // No shots for several cycles: the queue still visits every skill fairly.
  for (let i = 0; i < 100; i++) {
    const id = game.snapshot().targets[i % rangeCapacity(width)];
    seen.add(id);
    assert.equal(game.recycle(id, game.round), true);
    assert.equal(game.snapshot().unlocked.length, 0);
  }
  assert.equal(seen.size, ids.length);
  while (!game.snapshot().complete) {
    const id = game.snapshot().targets[0];
    game.hit(id);
    assert.equal(game.recycle(id, game.round), false);
    game.retire(id, game.round);
  }
  assert.equal(game.snapshot().unlocked.length, 17);
  const solo = new SkillRangeGame(['last']);
  for (let i = 0; i < 10; i++)
    assert.equal(solo.recycle('last', solo.round), true);
  assert.deepEqual([...solo.snapshot().targets], ['last']);
  solo.restart();
  assert.equal(solo.recycle('last', solo.round - 1), false);
}
for (const key of ['slow', 'medium', 'fast']) {
  assert.ok(Math.min(...durations[key]) >= config.speeds[key][0]);
  assert.ok(Math.max(...durations[key]) <= config.speeds[key][1]);
}
// Initial spatial head starts must not skip the selected travel time.
for (const speed of ['fast', 'medium', 'slow']) {
  for (const initialDepth of [0, 0.25, 0.58]) {
    const flight = createSkillFlight(
      speed,
      [],
      { width: 1370, height: 620, targetWidth: 215, targetHeight: 82 },
      initialDepth,
      random,
    );
    assert.equal(flight.age, 0);
    assert.equal(flight.startDepthProgress, initialDepth);
    assert.equal(
      projectSkillFlight(
        { ...flight, age: flight.duration - 0.01 },
        1370,
        620,
        215,
        82,
      ).expired,
      false,
    );
    assert.equal(
      projectSkillFlight(
        { ...flight, age: flight.duration },
        1370,
        620,
        215,
        82,
      ).expired,
      true,
    );
  }
}
const counts = { fast: 0, medium: 0, slow: 0 };
for (let i = 0; i < 10000; i++)
  counts[randomFlightSpeed(() => (i + 0.5) / 10000)]++;
assert.deepEqual(counts, { fast: 2500, medium: 4500, slow: 3000 });
assert.ok(config.speeds.fast[1] < config.speeds.medium[0]);
assert.ok(config.speeds.medium[1] < config.speeds.slow[0]);
for (const axis of [0, 1]) {
  assert.ok(Math.min(...positions.map((p) => p[axis])) < 0.1);
  assert.ok(Math.max(...positions.map((p) => p[axis])) > 0.9);
}
const gaps = Array.from({ length: 200 }, () => nextSpawnGap(17, random));
assert.ok(gaps.some((g) => g < 0.33) && gaps.some((g) => g > 1.8));
assert.ok(new Set(gaps).size > 190);
assert.ok(
  Array.from({ length: 100 }, () => nextSpawnGap(2, random)).every(
    (g) => g <= config.spawn.fewMax,
  ),
);
console.log(
  'PASS: 180 safe 3D paths; full configured lifetimes at every initial depth; distinct speed tiers; independent 25/45/30 speed weights; mobile 1.25x duration; readable fast hit windows; unchanged fair collection queue.',
);
const resizing = new SkillRangeGame(ids);
resizing.resize(6);
resizing.hit(ids[0]);
resizing.resize(3);
resizing.resize(6);
while (!resizing.snapshot().complete) {
  const id = resizing.snapshot().targets[0];
  assert.ok(id);
  resizing.hit(id);
  resizing.retire(id, resizing.round);
}
assert.equal(resizing.snapshot().unlocked.length, 17);
assert.equal(resizing.hit('nonexistent'), false);
const start = { x: 20, y: 100, scroll: 0, time: 0 };
assert.equal(
  validRangeTap(start, { x: 22, y: 101, scroll: 0, time: 100 }),
  true,
);
assert.equal(
  validRangeTap(start, { x: 22, y: 151, scroll: 50, time: 100 }),
  false,
);
assert.equal(
  validRangeTap(start, { x: 20, y: 100, scroll: 12, time: 100 }),
  false,
);
assert.equal(validRangeTap(start, { ...start, time: 900 }), false);
console.log(
  'PASS: 17-skill collection at mobile/tablet/desktop capacities; duplicate/retiring hit rejection; once-per-round completion; resize retains collection; old-round callbacks ignored; bounded readable targets; touch movement/scroll/long-press rejection.',
);
// Execute the actual Vue setup handlers: touch scrolling cannot fire a shot.
const vue = await import('vue');
const component = await read('app/components/SkillsPlayground.vue');
const setup = component
  .match(/<script setup lang="ts">([\s\S]*?)<\/script>/)[1]
  .replaceAll('import.meta.client', 'true')
  .replaceAll('import.meta.dev', 'false');
const stateModule = {
  SkillRangeGame,
  rangeCapacity,
  staticRangePose,
  validRangeTap,
};
const module = { exports: {} };
const locale = vue.ref('zh'),
  manualStatic = vue.ref(false);
const documentMock = {
  hidden: false,
  removeEventListener() {},
  addEventListener() {},
};
vm.runInNewContext(
  ts.transpileModule(
    setup +
      '\nexport { pointerDown,pointerMove,pointerUp,cancelTap,shoot,state,pause,restart,game,selected };',
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    },
  ).outputText,
  {
    module,
    exports: module.exports,
    require: (id) =>
      id === '~/data/playground' ? loadPlaceholder : stateModule,
    ref: vue.ref,
    shallowRef: vue.shallowRef,
    computed: vue.computed,
    watch() {},
    nextTick: vue.nextTick,
    onMounted() {},
    onBeforeUnmount() {},
    usePortfolio: () => ({ locale }),
    useMotionPreference: () => ({ manualStatic }),
    usePagePreparation: () => vue.ref({ active: false }),
    window: { scrollY: 0 },
    document: documentMock,
    performance: { now: () => 100 },
  },
);
const handler = module.exports;
const pointer = (x, y) => ({
  isPrimary: true,
  button: 0,
  pointerId: 1,
  clientX: x,
  clientY: y,
});
handler.pointerDown(pointer(20, 20), 'vue');
handler.pointerMove(pointer(22, 90));
handler.pointerUp(pointer(22, 90), 'vue');
await handler.shoot('vue', { detail: 1 });
assert.equal(
  handler.state.value.unlocked.length,
  0,
  'Vertical gesture cannot become a click',
);
handler.pointerDown(pointer(20, 20), 'vue');
handler.pointerUp(pointer(22, 22), 'vue');
await handler.shoot('vue', { detail: 1 });
await handler.shoot('vue', { detail: 1 });
assert.equal(handler.state.value.unlocked.length, 1);
await handler.shoot('nuxt', { detail: 0 });
assert.equal(handler.state.value.unlocked.length, 2);
handler.pause();
assert.equal(handler.state.value.paused, true);
locale.value = 'en';
manualStatic.value = true;
assert.equal(handler.state.value.unlocked.length, 2);
assert.equal(handler.state.value.paused, true);
handler.pointerDown(pointer(10, 10), 'ts');
handler.cancelTap();
await handler.shoot('ts', { detail: 1 });
assert.equal(handler.state.value.unlocked.length, 2);
await handler.restart();
assert.equal(handler.state.value.unlocked.length, 0);
assert.equal(handler.state.value.round, 2);
console.log(
  'PASS: actual Vue pointer handlers reject scrolling and cancellation; taps and keyboard collect once; locale/manual-motion changes retain score and pause; restart resets one round.',
);
// Animation controller uses one RAF and releases its owned GSAP context/resources.
const frames = new Map(),
  motionTimelines = [];
let frameId = 0,
  reverts = 0,
  nowMs = 0;
function element(id = '') {
  return {
    dataset: { skill: id },
    style: {
      removeProperty(key) {
        delete this[key];
      },
    },
    offsetWidth: 174,
    offsetHeight: 78,
    getBoundingClientRect() {
      return { left: 0, top: 0, width: 174, height: 78 };
    },
    querySelector() {
      return { style: { removeProperty() {} }, removeAttribute() {} };
    },
    setAttribute() {},
    remove() {
      this.removed = true;
    },
  };
}
const tracks = [element('vue'), element('nuxt'), element('ts')],
  children = [];
const board = {
  clientWidth: 350,
  clientHeight: 620,
  dataset: {},
  querySelectorAll: (selector) =>
    selector === '.range-target-track' ? tracks : [],
  querySelector: () => ({}),
  getBoundingClientRect: () => ({ left: 0, top: 0, width: 350, height: 620 }),
  append(node) {
    children.push(node);
  },
};
const motionModule = { exports: {} };
const gsapMock = {
  context: () => ({
    add(fn) {
      fn();
    },
    revert() {
      reverts++;
    },
  }),
  timeline(options) {
    const tl = {
      fromTo() {
        return this;
      },
      to() {
        return this;
      },
      call(callback) {
        this.callback = callback;
        return this;
      },
      pause() {
        this.paused = true;
        return this;
      },
      resume() {
        this.paused = false;
        return this;
      },
      kill() {
        this.killed = true;
      },
      progress(value) {
        if (value === 1) {
          this.callback?.();
          options.onComplete?.();
        }
        return this;
      },
    };
    motionTimelines.push(tl);
    return tl;
  },
};
vm.runInNewContext(
  ts.transpileModule(await read('app/utils/skillRangeMotion.ts'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText,
  {
    module: motionModule,
    exports: motionModule.exports,
    require: (id) =>
      id === 'gsap'
        ? { gsap: gsapMock }
        : id.endsWith('skillRangeFlight')
          ? flightModule
          : id.endsWith('skillRangeConfig')
            ? configModule
            : { staticRangePose },
    document: { createElement: () => element() },
    performance: { now: () => nowMs },
    requestAnimationFrame: (fn) => {
      frames.set(++frameId, fn);
      return frameId;
    },
    cancelAnimationFrame: (id) => frames.delete(id),
  },
);
const missed = [];
const motion = motionModule.exports.createSkillRangeMotion(board, (id) =>
  missed.push(id),
);
function frame(now) {
  nowMs = now;
  const queue = [...frames];
  frames.clear();
  queue.forEach(([, fn]) => fn(now));
}
motion.sync(true, false);
assert.equal(frames.size, 1);
frame(1000);
const moving = tracks[0].style.transform;
frame(1100);
assert.notEqual(tracks[0].style.transform, moving);
motion.focus('vue');
const frozen = tracks[0].style.transform;
frame(1200);
assert.equal(tracks[0].style.transform, frozen);
motion.sync(false, false);
assert.equal(frames.size, 0);
assert.ok(motionTimelines.every((t) => t.paused));
motion.sync(true, true);
assert.equal(frames.size, 0);
assert.equal(board.dataset.rangeAnimation, 'static');
motion.sync(true, false);
let retired = 0;
motion.hit('vue', () => retired++);
assert.equal(children.length, 7);
assert.equal(retired, 0);
motion.cancel(true);
assert.equal(retired, 1);
assert.ok(children.every((n) => n.removed));
assert.ok(motionTimelines.every((t) => t.killed || t.callback === undefined));
motion.focus('');
for (let time = 1300; time < 30000; time += 40) frame(time);
assert.equal(missed.length, 3, 'Each missed target expires exactly once');
assert.equal(new Set(missed).size, 3);
const oldPose = tracks[0].style.transform;
motion.recycled('vue');
assert.equal(
  tracks[0].dataset.flightPhase,
  'waiting',
  'Recycled card waits for its new spawn interval',
);
frame(31000);
frame(31500);
frame(32000);
frame(32500);
assert.equal(tracks[0].dataset.flightPhase, 'active');
assert.notEqual(
  tracks[0].style.transform,
  oldPose,
  'Same-ID final skill is born in a new location',
);
const afterRecycle = tracks[0].style.transform;
motion.sync(false, false);
frame(100000);
assert.equal(tracks[0].style.transform, afterRecycle);
motion.sync(true, false);
frame(100100);
assert.equal(
  tracks[0].style.transform,
  afterRecycle,
  'Resume does not catch up hidden time',
);
// Measure a fresh flight: an older fast card may already have expired.
motion.reset();
motion.sync(true, false);
frame(101100);
const scaleBeforeSlowFrame = Number(
  tracks[0].style.transform.match(/scale\(([^)]+)/)[1],
);
frame(102100);
const scaleAfterSlowFrame = Number(
  tracks[0].style.transform.match(/scale\(([^)]+)/)[1],
);
assert.ok(
  700 / scaleBeforeSlowFrame - 700 / scaleAfterSlowFrame > 12,
  'One low-refresh frame advances one second, not 0.05 seconds',
);
motion.destroy();
motion.destroy();
assert.equal(frames.size, 0);
assert.equal(reverts, 1);
motion.sync(true, false);
assert.equal(frames.size, 0);
console.log(
  'PASS: actual range controller owns one RAF; focus freezes target; offscreen and reduced modes stop RAF; pending hits flush on resize; particles and GSAP context released once on destroy.',
);
// Runtime expiry timing, including a ten-second pause: initial cards must
// finish their own complete duration, not a duration minus pre-seeded age.
board.clientWidth = 1370;
const records = [],
  timedMisses = [];
const timed = motionModule.exports.createSkillRangeMotion(
  board,
  (id) => timedMisses.push(id),
  () => 17,
  (entry) => records.push(entry),
);
timed.sync(true, false);
frame(200000);
frame(200500);
timed.sync(false, false);
const beforePause = tracks.map((track) => track.style.transform);
frame(210500);
assert.deepEqual(
  tracks.map((track) => track.style.transform),
  beforePause,
);
timed.sync(true, false);
frame(210500);
assert.deepEqual(
  tracks.map((track) => track.style.transform),
  beforePause,
);
for (let time = 210510; time <= 223000; time += 10) frame(time);
assert.equal(timedMisses.length, 3);
const completed = records.filter((record) => record.event === 'miss');
assert.deepEqual(completed.map((record) => record.speed).sort(), [
  'fast',
  'medium',
  'slow',
]);
for (const entry of completed) {
  assert.ok(entry.actualSeconds >= entry.plannedSeconds);
  assert.ok(entry.actualSeconds - entry.plannedSeconds < 0.011);
  assert.ok(Math.abs(entry.wallSeconds - entry.actualSeconds - 10) < 0.011);
}
timed.destroy();
console.log(
  'PASS: actual RAF controller expires all three speed classes within one frame of planned time; pause adds wall time only, with no resume jump; dev records distinguish spawn/miss/hit.',
);
