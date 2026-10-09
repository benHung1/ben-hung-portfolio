import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

class Events {
  listeners = new Map();
  addEventListener(name, fn) {
    const set = this.listeners.get(name) || new Set();
    set.add(fn);
    this.listeners.set(name, set);
  }
  removeEventListener(name, fn) {
    this.listeners.get(name)?.delete(fn);
  }
  emit(name, event = {}) {
    for (const fn of [...(this.listeners.get(name) || [])]) fn(event);
  }
  count() {
    return [...this.listeners.values()].reduce((n, s) => n + s.size, 0);
  }
}
class El extends Events {
  dataset = {};
  isConnected = true;
  selectors = [];
  rect = { top: 0, height: 100 };
  style = {
    setProperty(k, v) {
      this[k] = v;
    },
  };
  closest(selector) {
    return this.selectors.some((s) =>
      selector
        .split(',')
        .map((x) => x.trim())
        .includes(s),
    )
      ? this
      : null;
  }
  getBoundingClientRect() {
    return this.rect;
  }
}
function harness() {
  const root = new El(),
    doc = new Events(),
    win = new Events();
  const fine = Object.assign(new Events(), { matches: true });
  const reduced = Object.assign(new Events(), { matches: false });
  const raf = new Map();
  let id = 0,
    selection = '',
    pointed = new El();
  Object.assign(doc, {
    documentElement: root,
    hidden: false,
    elementFromPoint: () => pointed,
  });
  Object.assign(win, {
    innerWidth: 1440,
    innerHeight: 900,
    getSelection: () => ({ toString: () => selection }),
  });
  const observers = [];
  class Resize {
    constructor(fn) {
      this.fn = fn;
      this.closed = false;
      observers.push(this);
    }
    observe() {}
    disconnect() {
      this.closed = true;
    }
  }
  const globals = {
    document: doc,
    window: win,
    Element: El,
    ResizeObserver: Resize,
    matchMedia: (q) => (q.includes('prefers-reduced') ? reduced : fine),
    getComputedStyle: (e) => ({
      position: 'fixed',
      pointerEvents: 'none',
      display: 'block',
      ...e.computed,
    }),
    requestAnimationFrame: (fn) => {
      raf.set(++id, fn);
      return id;
    },
    cancelAnimationFrame: (n) => raf.delete(n),
  };
  return {
    root,
    doc,
    win,
    fine,
    reduced,
    raf,
    observers,
    globals,
    select: (v) => (selection = v),
    point: (v) => (pointed = v),
    flush() {
      for (let i = 0; raf.size && i < 100; i++) {
        const queue = [...raf];
        raf.clear();
        queue.forEach(([, fn]) => fn());
      }
      assert.equal(raf.size, 0, 'RAF must sleep');
    },
    clean() {
      assert.equal(
        doc.count() + win.count() + fine.count() + reduced.count(),
        0,
      );
      assert.equal(raf.size, 0);
      assert.ok(observers.every((o) => o.closed));
    },
  };
}
function load(file, globals) {
  const exports = {};
  const js = ts.transpile(fs.readFileSync(file, 'utf8'), {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  });
  vm.runInNewContext(js, { exports, ...globals });
  return exports;
}

const env = harness(),
  cursor = load('app/utils/brandCursor.ts', env.globals);
const layer = new El(),
  dot = new El(),
  ring = new El();
const controller = cursor.createBrandCursor(layer, dot, ring);
const move = (target, x = 100, y = 200, type = 'mouse') =>
  env.doc.emit('pointermove', {
    target,
    clientX: x,
    clientY: y,
    pointerType: type,
  });
assert.equal(
  env.root.dataset.brandCursor,
  undefined,
  'native cursor before first pointer',
);
move(new El());
assert.equal(env.root.dataset.brandCursor, 'active');
move(new El(), 400, 600);
assert.equal(dot.style.transform, 'translate3d(400px, 600px, 0)');
assert.notEqual(
  ring.style.transform,
  dot.style.transform,
  'ring follows independently',
);
env.flush();
assert.equal(ring.style.transform, dot.style.transform);
for (const [selector, mode] of [
  ['[data-cursor="view"]', 'view'],
  ['.physics-ready .skill-object', 'drag'],
  ['a[href^="https://"][target="_blank"]', 'external'],
  ['button', 'link'],
  ['p', 'native'],
  ['textarea', 'native'],
]) {
  const target = new El();
  target.selectors = [selector];
  move(target);
  assert.equal(
    mode === 'native' ? env.root.dataset.brandCursor : layer.dataset.mode,
    mode === 'native' ? undefined : mode,
  );
}
move(new El());
env.doc.emit('pointerdown', {
  target: new El(),
  clientX: 100,
  clientY: 200,
  pointerType: 'mouse',
});
assert.equal(layer.dataset.pressed, 'true');
env.doc.emit('pointerup');
assert.equal(layer.dataset.pressed, 'false');
env.select('selected text');
env.doc.emit('selectionchange');
assert.equal(env.root.dataset.brandCursor, undefined);
env.select('');
move(new El());
env.doc.emit('pointerout', { relatedTarget: null });
assert.equal(layer.dataset.visible, 'false');
assert.equal(env.raf.size, 0);
move(new El(), 100, 200, 'touch');
assert.equal(env.root.dataset.brandCursor, undefined);
env.fine.matches = false;
move(new El());
assert.equal(env.root.dataset.brandCursor, undefined);
env.fine.matches = true;
env.reduced.matches = true;
move(new El(), 730, 120);
assert.equal(dot.style.transform, ring.style.transform);
assert.equal(env.raf.size, 0);
env.doc.hidden = true;
env.doc.emit('visibilitychange');
assert.equal(env.root.dataset.brandCursor, undefined);
env.doc.hidden = false;
move(new El());
controller.reset();
assert.equal(env.root.dataset.brandCursor, undefined);
layer.computed = { display: 'none' };
move(new El());
assert.equal(
  env.root.dataset.brandCursor,
  undefined,
  'CSS failure keeps native',
);
controller.destroy();
env.clean();
// An unexpected runtime failure must also restore the native pointer and release listeners.
const failEnv = harness(),
  failModule = load('app/utils/brandCursor.ts', failEnv.globals),
  failLayer = new El();
failModule.createBrandCursor(failLayer, new El(), new El());
failLayer.computed = {
  get position() {
    throw Error('simulated CSS access failure');
  },
};
failEnv.doc.emit('pointermove', {
  target: new El(),
  clientX: 1,
  clientY: 2,
  pointerType: 'mouse',
});
assert.equal(failEnv.root.dataset.brandCursor, undefined);
failEnv.clean();
console.log(
  'PASS: real cursor controller: modes, exact dot, ring settling, press, native text/selection, touch/coarse, reduced-motion, CSS/runtime failure, exit, reset and listener/RAF cleanup.',
);
