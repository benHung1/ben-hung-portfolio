import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
const source = await readFile(
  new URL('../app/utils/weatherCanvas.ts', import.meta.url),
  'utf8',
);
const code = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const listeners = new Map(),
  frames = new Map();
let frameId = 0,
  time = 0,
  disconnected = false;
const listenerPair = (prefix) => ({
  addEventListener: (k, fn) => listeners.set(prefix + k, fn),
  removeEventListener: (k) => listeners.delete(prefix + k),
});
const media = { matches: false, ...listenerPair('media:') };
const document = {
  hidden: false,
  documentElement: {},
  querySelectorAll: () => [],
  ...listenerPair('document:'),
};
const window = {
  innerWidth: 1440,
  innerHeight: 1000,
  scrollY: 0,
  ...listenerPair('window:'),
};
const ctx = Object.fromEntries(
  [
    'setTransform',
    'clearRect',
    'beginPath',
    'moveTo',
    'lineTo',
    'stroke',
    'arc',
    'fill',
  ].map((k) => [k, () => {}]),
);
const canvas = { dataset: {}, getContext: () => ctx };
const context = {
  exports: {},
  window,
  document,
  devicePixelRatio: 2,
  matchMedia: () => media,
  getComputedStyle: () => ({ getPropertyValue: () => '#4964af' }),
  requestAnimationFrame: (f) => {
    frames.set(++frameId, f);
    return frameId;
  },
  cancelAnimationFrame: (id) => frames.delete(id),
  MutationObserver: class {
    observe() {}
    disconnect() {
      disconnected = true;
    }
  },
};
vm.runInNewContext(code, context);
const { weatherAt, createWeatherCanvas } = context.exports;
assert.equal(weatherAt(0).snow, 0);
assert.equal(weatherAt(1).snow, 1);
assert.ok(weatherAt(0.5).snow > 0.3 && weatherAt(0.5).snow < 0.7);
for (let i = 1; i <= 100; i++)
  assert.ok(weatherAt(i / 100).snow >= weatherAt((i - 1) / 100).snow);
assert.equal(weatherAt(-1).snow, 0);
assert.equal(weatherAt(2).snow, 1);
const engine = createWeatherCanvas(canvas, { querySelectorAll: () => [] });
const advance = (n = 12) => {
  for (let i = 0; i < n; i++) {
    const batch = [...frames.values()];
    frames.clear();
    time += 34;
    batch.forEach((f) => f(time));
  }
};
engine.setProgress(0.5);
advance();
const firstY = canvas.dataset.particleSample;
advance();
assert.notEqual(
  canvas.dataset.particleSample,
  firstY,
  'falls at fixed scroll progress',
);
assert.equal(canvas.dataset.weatherProgress, '0.5000');
engine.setProgress(1);
assert.equal(canvas.dataset.weatherKind, 'snow');
engine.setProgress(0);
assert.equal(canvas.dataset.weatherKind, 'rain');
assert.equal(canvas.dataset.particleCapacity, '88');
assert.equal(canvas.dataset.pixelRatio, '1.5');
document.hidden = true;
listeners.get('document:visibilitychange')();
assert.equal(frames.size, 0);
assert.equal(canvas.dataset.weatherState, 'hidden');
document.hidden = false;
listeners.get('document:visibilitychange')();
assert.equal(frames.size, 1);
engine.setReduced(true);
assert.equal(frames.size, 0);
assert.equal(canvas.dataset.weatherState, 'reduced');
engine.setReduced(false);
assert.equal(frames.size, 1);
media.matches = true;
listeners.get('media:change')();
assert.equal(frames.size, 0);
media.matches = false;
listeners.get('media:change')();
assert.equal(frames.size, 1);
window.innerWidth = 390;
engine.refresh();
assert.equal(canvas.dataset.particleCapacity, '34');
assert.equal(canvas.dataset.pixelRatio, '1');
engine.destroy();
assert.equal(frames.size, 0);
assert.equal(listeners.size, 0);
assert.ok(disconnected);
assert.throws(
  () => createWeatherCanvas({ getContext: () => null }, {}),
  /Canvas 2D unavailable/,
);
console.log(
  'PASS: actual weather controller: smooth/reversible parameters, continuous falling at rest, hidden/manual/system motion pause, mobile density/DPR, failure and complete resource cleanup.',
);
