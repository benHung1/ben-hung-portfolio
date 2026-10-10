import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
import * as vue from 'vue';
const read = (file) => readFile(new URL('../' + file, import.meta.url), 'utf8');
function evaluate(source, imports = {}, globals = {}) {
  const module = { exports: {} };
  vm.runInNewContext(
    ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText,
    {
      module,
      exports: module.exports,
      require: (id) => {
        assert.ok(id in imports, 'Unexpected import: ' + id);
        return imports[id];
      },
      ...globals,
    },
  );
  return module.exports;
}
const { testimonialRecords } = evaluate(await read('content/testimonials.ts'));
const { prepareTestimonials } = evaluate(
  await read('build/testimonial-policy.ts'),
);
assert.equal(testimonialRecords.length, 6);
assert.equal(
  testimonialRecords.filter((entry) => entry.companyGroup === '1111').length,
  3,
);
assert.equal(
  testimonialRecords.filter((entry) => entry.companyGroup === 'foxconn').length,
  3,
);
assert.ok(testimonialRecords.every((entry) => !entry.approvedForPublic));
for (const entry of testimonialRecords) {
  assert.match(entry.quoteEn, /Ben/);
  assert.doesNotMatch(entry.quoteEn, /阿班/);
  assert.match(entry.quoteZh, entry.companyGroup === '1111' ? /阿班/ : /Ben/);
  assert.equal(
    entry.source.kind,
    entry.companyGroup === '1111' ? 'adapted' : 'draft',
  );
}
assert.equal(
  testimonialRecords.find((entry) => entry.id === 'yichia').role,
  null,
);
assert.equal(
  testimonialRecords.find((entry) => entry.id === 'angles').displayName,
  'Angles',
);
assert.equal(
  prepareTestimonials(testimonialRecords, false, true).entries.length,
  0,
  'Preview flag must not expose drafts in a production build',
);
assert.equal(
  prepareTestimonials(testimonialRecords, true, false).entries.length,
  0,
);
const approvedFixture = testimonialRecords.map((entry) => ({
  ...entry,
  approvedForPublic: entry.id === 'yao',
}));
const released = prepareTestimonials(approvedFixture, false, true);
assert.equal(released.entries.length, 1);
assert.equal(released.entries[0].id, 'yao');
assert.equal(released.preview, false);
assert.ok(
  !('source' in released.entries[0]) &&
    !('review' in released.entries[0]) &&
    !('approvedForPublic' in released.entries[0]),
);
const review = prepareTestimonials(
  [...testimonialRecords].reverse(),
  true,
  true,
);
assert.deepEqual(
  Array.from(review.entries, (entry) => entry.id),
  ['ricky', 'angles', 'maggie', 'yao', 'ryder', 'yichia'],
);
assert.ok(
  review.entries.every(
    (entry) => entry.review && !entry.review.approvedForPublic,
  ),
);

// Run the component's actual setup handlers with Vue refs, without mounting a browser.
// This exercises touch/pen gestures independently of a desktop-only browser driver.
const component = await read('app/components/TestimonialsSection.vue');
const setup = component.match(
  /<script setup lang="ts">([\s\S]*?)<\/script>/,
)[1];
const props = vue.reactive({ items: review.entries, showEmpty: true });
const state = evaluate(
  setup +
    '\nexport { entries, active, pageLabel, selectGroup, step, pointerDown, pointerUp };',
  {
    '#testimonial-content': {
      testimonials: review.entries,
      testimonialPreview: true,
    },
    '~/data/testimonialCopy': evaluate(
      await read('app/data/testimonialCopy.ts'),
    ),
  },
  {
    defineProps: () => props,
    withDefaults: (value) => value,
    ref: vue.ref,
    computed: vue.computed,
    watch: () => {},
    nextTick: vue.nextTick,
    onMounted: () => {},
    onBeforeUnmount: () => {},
    usePortfolio: () => ({ locale: vue.ref('zh') }),
    useMotionPreference: () => ({ manualStatic: vue.ref(false) }),
    usePagePreparation: () => vue.ref({ active: false }),
  },
);
const seen = [];
for (let i = 0; i < 6; i++) {
  seen.push(state.active.value.id);
  state.step(1);
}
assert.deepEqual(seen, ['ricky', 'angles', 'maggie', 'yao', 'ryder', 'yichia']);
assert.equal(state.active.value.id, 'ricky');
state.step(-1);
assert.equal(state.active.value.id, 'yichia');
state.selectGroup('1111');
assert.equal(state.pageLabel.value, '01 / 03');
state.selectGroup('foxconn');
assert.equal(state.active.value.id, 'ricky');
assert.equal(state.entries.value.length, 3);
const touch = (x, y, extra = {}) => ({
  pointerId: 1,
  pointerType: 'touch',
  isPrimary: true,
  clientX: x,
  clientY: y,
  ...extra,
});
state.pointerDown(touch(220, 100));
state.pointerUp(touch(80, 110));
assert.equal(
  state.active.value.id,
  'angles',
  'Horizontal touch swipe advances',
);
state.pointerDown(touch(80, 100));
state.pointerUp(touch(220, 110));
assert.equal(state.active.value.id, 'ricky', 'Reverse swipe goes back');
state.pointerDown(touch(220, 100));
state.pointerUp(touch(170, 260));
assert.equal(
  state.active.value.id,
  'ricky',
  'Vertical scroll must not change card',
);
state.pointerDown(touch(220, 100, { pointerType: 'mouse' }));
state.pointerUp(touch(80, 110));
assert.equal(
  state.active.value.id,
  'ricky',
  'Selecting text with a mouse must not swipe',
);
state.pointerDown(touch(220, 100));
state.pointerUp(touch(80, 110, { pointerId: 2 }));
assert.equal(
  state.active.value.id,
  'ricky',
  'A second pointer must not complete another gesture',
);
props.items = [review.entries.find((entry) => entry.id === 'yao')];
state.selectGroup('all');
state.step(1);
state.step(-1);
assert.equal(state.pageLabel.value, '01 / 01');
state.selectGroup('foxconn');
assert.equal(state.pageLabel.value, '00 / 00');
props.items = [];
state.selectGroup('all');
state.step(1);
assert.equal(state.active.value, undefined);
assert.equal(state.pageLabel.value, '00 / 00');
const { projectRecords } = evaluate(await read('app/data/projectCatalog.ts'));
assert.equal(projectRecords.length, 8);
const voting = projectRecords.find((entry) => entry.slug === 'voting-system');
assert.ok(voting);
assert.doesNotMatch(JSON.stringify(voting), /YAML/i);
assert.match(
  voting.content.zh.contributions.join(' '),
  /前端架構.*介面.*資料串接/,
);
assert.match(
  voting.content.en.contributions.join(' '),
  /architecture.*interfaces.*API integration/,
);
assert.ok(
  projectRecords
    .filter((entry) => entry.slug !== 'voting-system')
    .every((entry) => /YAML/.test(JSON.stringify(entry.content))),
);
// Exercise both reduced-motion paths and owned-resource disposal.
for (const [systemReduced, manualReduced] of [
  [false, false],
  [true, false],
  [false, true],
]) {
  let reverted = 0,
    disconnected = 0,
    timers = 0,
    created = 0,
    cleanup;
  const root = { dataset: {}, querySelector: () => ({}) };
  const document = { documentElement: { dataset: {} }, fonts: undefined };
  const media = {
    add(_queries, callback) {
      cleanup = callback({
        conditions: { reduced: systemReduced, small: false, large: true },
      });
    },
    revert() {
      reverted++;
      cleanup?.();
    },
  };
  const timeline = {
    fromTo() {
      return this;
    },
    scrollTrigger: { refresh() {} },
    progress: () => 1,
  };
  const { createTestimonialMotion } = evaluate(
    await read('app/utils/testimonialMotion.ts'),
    {
      gsap: {
        gsap: {
          registerPlugin() {},
          matchMedia: () => media,
          timeline() {
            created++;
            return timeline;
          },
        },
      },
      'gsap/ScrollTrigger': { ScrollTrigger: {} },
    },
    {
      document,
      ResizeObserver: class {
        observe() {}
        disconnect() {
          disconnected++;
        }
      },
      setTimeout: () => ++timers,
      clearTimeout: () => {},
    },
  );
  const motion = createTestimonialMotion(root, manualReduced);
  assert.equal(created, systemReduced || manualReduced ? 0 : 1);
  motion.destroy();
  motion.destroy();
  assert.equal(reverted, 1);
  assert.equal(disconnected, 1);
  const previousTimers = timers;
  motion.refresh();
  assert.equal(
    timers,
    previousTimers,
    'Disposed scene must not schedule refreshes',
  );
  assert.equal(document.documentElement.dataset.testimonialTriggers, '0');
}
console.log(
  'PASS: six exact groups and naming rules; approval gate; stripped public metadata; six-card navigation; 3/1/0 states; touch directions/vertical scroll/mouse/second-pointer handling; Sanlih correction with all eight projects retained.',
);
