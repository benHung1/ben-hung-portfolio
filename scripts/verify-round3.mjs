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
const { SkillWorld } = await moduleFrom('app/utils/skillPhysics.ts');
for (const [width, height, radius] of [
  [318, 500, 40],
  [650, 480, 52],
  [1220, 480, 52],
]) {
  const world = new SkillWorld(width, height, radius, 12);
  const inBounds = () =>
    world.bodies.forEach((b) => {
      assert.ok(Number.isFinite(b.x + b.y + b.vx + b.vy));
      assert.ok(
        b.x >= b.r - 0.01 &&
          b.x <= world.width - b.r + 0.01 &&
          b.y >= b.r - 0.01 &&
          b.y <= world.height - b.r + 0.01,
      );
    });
  for (let i = 0; i < 1200; i++) world.step(1 / 60);
  inBounds();
  for (let i = 0; i < world.bodies.length; i++)
    for (let j = i + 1; j < world.bodies.length; j++) {
      const a = world.bodies[i],
        b = world.bodies[j];
      assert.ok(
        Math.hypot(a.x - b.x, a.y - b.y) > a.r + b.r - 3,
        'settled circles do not overlap',
      );
    }
  world.shuffle();
  for (let i = 0; i < 900; i++) {
    world.step(1 / 60);
    inBounds();
  }
  world.resize(318, 500, 40);
  for (let i = 0; i < 600; i++) world.step(1 / 60);
  inBounds();
  world.bodies[0].held = true;
  const initial = { ...world.bodies[0] };
  world.step(1 / 60);
  assert.equal(world.bodies[0].x, initial.x);
  world.reset();
  inBounds();
}
console.log(
  'PASS: physics gravity/collisions, throws, mobile/desktop bounds, resize, reset and held object.',
);
const configCode = ts.transpileModule(await read('nuxt.config.ts'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
let config;
vm.runInNewContext(configCode, {
  exports: {},
  require: (name) => {
    assert.equal(name, 'node:process');
    return { env: {} };
  },
  defineNuxtConfig: (value) => (config = value),
});
// Execute the real playground setup with Vue reactivity and a controlled DOM clock.
const vue = await import('vue');
const playground = await moduleFrom('app/data/playground.ts');
const setup = (await read('app/components/SkillsPlayground.vue')).match(
  /<script setup lang="ts">([\s\S]*?)<\/script>/,
)[1];
const compiled = ts.transpileModule(
  setup +
    '\n globalThis.testHooks={field,items,physics,state,isStatic,manualStatic,selected,generation,reset};',
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  },
).outputText;
for (const reduced of [false, true]) {
  let mount, unmount;
  const observers = [],
    resizes = [],
    frames = new Map(),
    listeners = new Map();
  let frameId = 0;
  const media = {
    matches: reduced,
    addEventListener: (k, f) => listeners.set('media-' + k, f),
    removeEventListener: (k) => listeners.delete('media-' + k),
  };
  const document = {
    hidden: false,
    addEventListener: (k, f) => listeners.set(k, f),
    removeEventListener: (k) => listeners.delete(k),
  };
  const context = {
    exports: {},
    require: (p) => (p.includes('skillPhysics') ? { SkillWorld } : playground),
    ref: vue.ref,
    computed: vue.computed,
    watch: vue.watch,
    nextTick: vue.nextTick,
    usePortfolio: () => ({ locale: vue.ref('zh') }),
    useMotionPreference: () => ({ manualStatic: vue.ref(false) }),
    usePagePreparation: () => vue.ref({ active: false }),
    onMounted: (f) => (mount = f),
    onBeforeUnmount: (f) => (unmount = f),
    matchMedia: () => media,
    document,
    performance: { now: () => 1000 },
    requestAnimationFrame: (f) => {
      frames.set(++frameId, f);
      return frameId;
    },
    cancelAnimationFrame: (id) => frames.delete(id),
    IntersectionObserver: class {
      constructor(cb) {
        this.cb = cb;
        this.closed = false;
        observers.push(this);
      }
      observe() {}
      disconnect() {
        this.closed = true;
      }
    },
    ResizeObserver: class {
      constructor(cb) {
        this.cb = cb;
        this.closed = false;
        resizes.push(this);
      }
      observe() {}
      disconnect() {
        this.closed = true;
      }
    },
  };
  const scope = vue.effectScope();
  scope.run(() => vm.runInNewContext(compiled, context));
  const hooks = context.testHooks;
  hooks.field.value = { clientWidth: 318, clientHeight: 500 };
  hooks.items.push(
    ...Array.from({ length: playground.skills.length }, () => ({
      offsetWidth: 80,
      style: { setProperty() {}, removeProperty() {} },
    })),
  );
  mount();
  observers[0].cb([{ isIntersecting: true }]);
  await new Promise((resolve) => setImmediate(resolve));
  await vue.nextTick();
  if (reduced) {
    assert.equal(hooks.physics.value, false);
    assert.equal(frames.size, 0);
  } else {
    assert.equal(hooks.physics.value, true);
    assert.equal(frames.size, 1);
    document.hidden = true;
    listeners.get('visibilitychange')();
    assert.equal(frames.size, 0);
    document.hidden = false;
    listeners.get('visibilitychange')();
    assert.equal(frames.size, 1);
    observers[0].cb([{ isIntersecting: false }]);
    assert.equal(frames.size, 0);
    observers[0].cb([{ isIntersecting: true }]);
    assert.equal(frames.size, 1);
    const firstGeneration = hooks.generation.value;
    // Small edge crossings pause the same scene, rather than resetting it.
    observers[0].cb([{ isIntersecting: false, intersectionRatio: 0 }]);
    observers[0].cb([{ isIntersecting: true, intersectionRatio: 0.3 }]);
    assert.equal(hooks.generation.value, firstGeneration);
    for (let n = 1; n <= 3; n++) {
      observers[0].cb([{ isIntersecting: false, intersectionRatio: 0 }]);
      observers[1].cb([{ isIntersecting: false }]);
      observers[0].cb([{ isIntersecting: true, intersectionRatio: 0.3 }]);
      assert.equal(hooks.generation.value, firstGeneration + n);
      assert.equal(
        frames.size,
        1,
        'one reusable animation loop after re-entry',
      );
    }
    hooks.reset();
    const operatedGeneration = hooks.generation.value;
    observers[1].cb([{ isIntersecting: false }]);
    observers[0].cb([{ isIntersecting: true, intersectionRatio: 0.3 }]);
    assert.equal(
      hooks.generation.value,
      operatedGeneration,
      'do not reset during button interaction',
    );
    hooks.manualStatic.value = true;
    await vue.nextTick();
    assert.equal(frames.size, 0);
    assert.equal(hooks.physics.value, false);
  }
  unmount();
  scope.stop();
  assert.equal(frames.size, 0);
  assert.equal(listeners.size, 0);
  assert.ok(observers.every((o) => o.closed));
  assert.ok(resizes.every((o) => o.closed));
}
console.log(
  'PASS: actual playground setup pauses on hidden/offscreen, uses static reduced-motion layout, and cleans RAF/listeners/observers on unmount.',
);
