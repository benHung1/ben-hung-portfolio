import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
import * as vue from 'vue';
const read = (p) => readFile(new URL('../' + p, import.meta.url), 'utf8');
const compile = (code) =>
  ts.transpileModule(code, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
const data = { exports: {} };
vm.runInNewContext(compile(await read('app/data/profiles.ts')), data);
assert.deepEqual(
  Array.from(data.exports.profiles, (x) => x.url),
  [
    'https://pda.104.com.tw/profile/share/gyTNH4XJNFWGx4w9fowbA1Cx4DrBXr6R',
    'https://www.cake.me/ben-hung-5fd0c6',
    'https://www.linkedin.com/in/ben-hung-01b8a121a',
  ],
);
let mount, unmount, active;
const listeners = new Map();
const listenerPair = (prefix) => ({
  addEventListener: (k, fn) => listeners.set(prefix + k, fn),
  removeEventListener: (k) => listeners.delete(prefix + k),
});
const context = {
  exports: {},
  require: () => data.exports,
  ref: vue.ref,
  computed: vue.computed,
  watch: vue.watch,
  nextTick: vue.nextTick,
  withDefaults: () => {},
  defineProps: () => {},
  usePortfolio: () => ({ locale: vue.ref('zh') }),
  useRoute: () => ({ fullPath: '/' }),
  useId: () => 'test',
  onMounted: (fn) => (mount = fn),
  onBeforeUnmount: (fn) => (unmount = fn),
  matchMedia: () => ({ matches: true }),
  setTimeout,
  clearTimeout,
  requestAnimationFrame: () => 1,
  cancelAnimationFrame: () => {},
  window: { innerWidth: 390, innerHeight: 844, ...listenerPair('window:') },
  document: { ...listenerPair('document:') },
};
const script = (await read('app/components/ResumeProfiles.vue')).match(
  /<script setup lang="ts">([\s\S]*?)<\/script>/,
)[1];
const scope = vue.effectScope();
scope.run(() =>
  vm.runInNewContext(
    compile(
      script +
        '\n globalThis.hooks={root,trigger,panel,opened,enter,toggle,escape,outside,position};',
    ),
    context,
  ),
);
const h = context.hooks;
const first = { focus: () => (active = '104') };
h.root.value = { contains: (t) => t === 'inside' };
h.trigger.value = {
  focus: () => (active = 'trigger'),
  getBoundingClientRect: () => ({ left: 320, top: 760, bottom: 818 }),
};
h.panel.value = {
  offsetHeight: 195,
  querySelector: () => first,
  contains: (t) => t === 'panel',
};
mount();
h.enter({ pointerType: 'mouse' });
await vue.nextTick();
await new Promise((resolve) => setImmediate(resolve));
assert.equal(h.opened.value, true);
h.toggle({ detail: 1 });
await vue.nextTick();
await new Promise((resolve) => setImmediate(resolve));
assert.equal(h.opened.value, true, 'first click pins the hover-open menu');
h.toggle({ detail: 1 });
assert.equal(h.opened.value, false, 'second click closes');
h.toggle({ detail: 0 });
await vue.nextTick();
await new Promise((resolve) => setImmediate(resolve));
assert.equal(active, '104');
assert.ok(parseFloat(h.position.value.left) + 280 <= 378);
assert.ok(parseFloat(h.position.value.top) >= 12);
h.escape({ key: 'Escape', preventDefault() {} });
assert.equal(h.opened.value, false);
assert.equal(active, 'trigger');
h.toggle({ detail: 1 });
await vue.nextTick();
await new Promise((resolve) => setImmediate(resolve));
h.outside({ target: 'elsewhere' });
assert.equal(h.opened.value, false);
unmount();
scope.stop();
assert.equal(listeners.size, 0);
console.log(
  'PASS: exact profile URLs; real component hover/first-click/second-click, keyboard focus, Escape, outside close, viewport clamping and listener cleanup.',
);
