import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import vm from 'node:vm';
const read = (p) => readFile(new URL('../' + p, import.meta.url), 'utf8');
const moduleFrom = async (p) =>
  import(
    'data:text/javascript;base64,' +
      Buffer.from(
        ts.transpileModule(await read(p), {
          compilerOptions: {
            module: ts.ModuleKind.ESNext,
            target: ts.ScriptTarget.ES2022,
          },
        }).outputText,
      ).toString('base64')
  );
const { createPagePreparation } = await moduleFrom(
  'app/utils/pagePreparation.ts',
);
function harness(reduce = false) {
  let now = 0,
    id = 0;
  const frames = new Map(),
    timers = new Map(),
    snapshots = [],
    finished = [];
  const state = {
    active: false,
    progress: 0,
    phase: 'idle',
    pathname: '',
    run: 0,
  };
  const control = createPagePreparation(
    state,
    {
      now: () => now,
      frame: (f) => {
        frames.set(++id, f);
        return id;
      },
      cancelFrame: (i) => frames.delete(i),
      timeout: (f, d) => {
        timers.set(++id, { f, at: now + d });
        return id;
      },
      clearTimeout: (i) => timers.delete(i),
    },
    () => reduce,
    () => snapshots.push({ ...state, time: now }),
    (reason) => finished.push(reason),
  );
  const advance = (ms) => {
    for (let t = 0; t < ms; t += 10) {
      now += 10;
      for (const [i, v] of [...timers])
        if (v.at <= now) {
          timers.delete(i);
          v.f();
        }
      const queue = [...frames];
      frames.clear();
      queue.forEach(([, f]) => f(now));
    }
  };
  return { state, control, advance, frames, timers, snapshots, finished };
}
{
  const h = harness();
  h.control.start('/work', true);
  h.advance(2000);
  assert.equal(h.state.active, true);
  assert.ok(h.state.progress < 100, 'unready target never reaches 100');
  h.control.ready('/wrong');
  h.advance(200);
  assert.ok(h.state.progress < 100);
  h.control.ready('/work');
  h.advance(400);
  assert.equal(h.state.active, false);
  assert.equal(h.state.progress, 100);
  assert.equal(h.frames.size + h.timers.size, 0);
  h.control.start('/work/a');
  h.advance(200);
  h.control.start('/work/b');
  h.control.ready('/work/a');
  h.advance(1000);
  assert.equal(h.state.active, true);
  assert.ok(h.state.progress < 100);
  h.control.ready('/work/b');
  h.advance(400);
  assert.equal(h.state.active, false);
  assert.equal(h.state.run, 3);
  h.control.start('/timeout');
  h.advance(4600);
  assert.equal(h.state.active, false);
  assert.equal(h.finished.at(-1), 'timeout');
  h.control.start('/cancel');
  h.control.cancel('navigation-cancelled');
  h.advance(1000);
  assert.equal(h.state.active, false);
  assert.equal(h.frames.size + h.timers.size, 0);
  h.control.start('/error');
  h.control.cancel('navigation-error');
  assert.equal(h.state.active, false);
  h.control.start('/skip');
  h.control.skip();
  h.advance(500);
  assert.equal(h.state.active, true);
  assert.ok(h.state.progress < 100);
  h.control.ready('/skip');
  h.advance(120);
  assert.equal(h.state.active, false);
}
for (const initial of [false, true]) {
  const h = harness();
  h.control.start('/work', initial);
  h.control.ready('/work');
  h.advance(1200);
  const end = h.snapshots.find((s) => !s.active).time;
  assert.ok(end >= (initial ? 950 : 750) && end <= (initial ? 1100 : 1000));
  assert.ok(
    h.snapshots.some((s) => s.phase === 'leaving' && s.progress === 100),
  );
}
{
  const h = harness(true);
  h.control.start('/');
  h.control.ready('/');
  h.advance(150);
  assert.equal(h.state.active, false);
}
const { NavigationJournal } = await moduleFrom(
  'app/utils/navigationJournal.ts',
);
const j = new NavigationJournal(8, '/work?category=campaign');
j.save('/work?category=campaign', 0, 1450);
j.arrive(9, '/work/freshman');
assert.equal(j.previous('/work?category=campaign').top, 1450);
assert.equal(j.previous('https://example.org'), undefined);
assert.equal(
  new NavigationJournal(9, '/work/freshman').previous('/work'),
  undefined,
  'new tab/reload has no trusted source',
);
j.arrive(8, '/work?category=campaign');
j.arrive(9, '/work/curated-jobs');
assert.equal(
  j.previous('/work?category=campaign').fullPath,
  '/work?category=campaign',
);
const { SkillWorld } = await moduleFrom('app/utils/skillPhysics.ts');
for (const width of [306, 704, 1354, 1809]) {
  const w = new SkillWorld(
      width,
      width < 400 ? 500 : 480,
      width < 400 ? 40 : 52,
      12,
    ),
    layouts = [];
  for (let generation = 0; generation < 4; generation++) {
    w.reset();
    layouts.push(w.bodies.map((b) => [b.x, b.y, b.vx, b.vy]));
    w.bodies.forEach((b, i) => {
      assert.ok(
        b.x >= b.r &&
          b.x <= w.width - b.r &&
          b.y >= b.r &&
          b.y <= w.height - b.r,
      );
      assert.ok(Math.abs(b.angle) <= 8);
      w.bodies
        .slice(i + 1)
        .forEach((c) =>
          assert.ok(
            Math.hypot(c.x - b.x, c.y - b.y) >= b.r + c.r + 7,
            'initial spawn has a gap',
          ),
        );
    });
  }
  for (let i = 1; i < layouts.length; i++)
    assert.notDeepEqual(layouts[i], layouts[i - 1]);
}
// Client boot failure must release both the visual mask and interaction lock.
let config;
vm.runInNewContext(
  ts.transpileModule(await read('nuxt.config.ts'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText,
  {
    exports: {},
    require: () => ({ env: {} }),
    defineNuxtConfig: (c) => (config = c),
  },
);
let watchdog,
  unlocked = false;
const dataset = {};
vm.runInNewContext(
  config.app.head.script.find((s) => s.key === 'page-preparation-init')
    .innerHTML,
  {
    document: {
      documentElement: { dataset },
      querySelector: () => ({
        removeAttribute: () => {
          unlocked = true;
        },
      }),
    },
    setTimeout: (f) => (watchdog = f),
  },
);
assert.equal(dataset.pageLoading, 'preparing');
watchdog();
assert.equal(dataset.pageLoading, undefined);
assert.ok(unlocked);
console.log(
  'PASS: Loading ready gate, duration, 100-before-exit, rapid replacement, stale target, cancellation/error/timeout, reduced motion and fail-open boot; safe source journal; four randomized separated skill generations at four widths.',
);
