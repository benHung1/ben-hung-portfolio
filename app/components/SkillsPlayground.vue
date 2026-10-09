<script setup lang="ts">
import { playgroundCopy, skills } from '~/data/playground';
import type { SkillWorld } from '~/utils/skillPhysics';
const { locale } = usePortfolio();
const copy = computed(() => playgroundCopy[locale.value]);
const field = ref<HTMLElement>();
const items: HTMLElement[] = [];
const selected = ref<string>('vue');
const activeSkill = computed(() =>
  skills.find((s) => s.id === selected.value)!,
);
const physics = ref(false);
const state = ref('static');
const reduced = ref(false);
const { manualStatic } = useMotionPreference();
const preparation = usePagePreparation();
const isStatic = computed(() => reduced.value || manualStatic.value);
let world: SkillWorld | undefined;
let observer: IntersectionObserver | undefined;
let departureObserver: IntersectionObserver | undefined;
let armed = true;
let interactionUntil = 0;
const generation = ref(0);
function interact() {
  interactionUntil = performance.now() + 700;
}
let resizeObserver: ResizeObserver | undefined;
let media: MediaQueryList | undefined;
let visible = false,
  disposed = false,
  loading = false,
  raf = 0,
  last = 0,
  frames = 0;
let visibleRatio = 0;
let drag:
  | {
      index: number;
      pointer: number;
      x: number;
      y: number;
      lastX: number;
      lastY: number;
      time: number;
      moved: boolean;
      element: HTMLElement;
    }
  | undefined;
let suppressClick = -1;
function size() {
  const el = field.value!;
  return {
    width: el.clientWidth,
    height: el.clientHeight,
    radius: (items[0]?.offsetWidth || 86) / 2,
  };
}
function paint() {
  if (isStatic.value || !physics.value) return;
  world?.bodies.forEach((b, i) =>
    items[i]?.style.setProperty(
      'transform',
      'translate3d(' +
        (b.x - b.r) +
        'px,' +
        (b.y - b.r) +
        'px,0) rotate(' +
        b.angle.toFixed(2) +
        'deg)',
    ),
  );
}
function stop() {
  cancelAnimationFrame(raf);
  raf = 0;
  last = 0;
  state.value = isStatic.value ? 'static' : 'paused';
}
function tick(time: number) {
  raf = 0;
  if (!world || !visible || document.hidden || isStatic.value || disposed)
    return;
  world.step(last ? (time - last) / 1000 : 1 / 60);
  last = time;
  frames++;
  paint();
  const moving = world.bodies.some(
    (b) => b.held || Math.abs(b.vx) > 5 || Math.abs(b.vy) > 12,
  );
  if (frames > 120 && !moving && !drag) {
    state.value = 'sleeping';
    last = 0;
    return;
  }
  // Bound active work even if a tightly packed pile never reaches a perfect rest.
  if (frames > 900 && !drag) {
    state.value = 'sleeping';
    last = 0;
    return;
  }
  state.value = 'running';
  raf = requestAnimationFrame(tick);
}
function wake() {
  frames = 0;
  if (
    world &&
    !raf &&
    visible &&
    !document.hidden &&
    !preparation.value.active &&
    !isStatic.value &&
    !disposed
  ) {
    state.value = 'running';
    raf = requestAnimationFrame(tick);
  }
}
function enterIfReady() {
  if (
    !visible ||
    visibleRatio < 0.25 ||
    !armed ||
    drag ||
    performance.now() < interactionUntil ||
    isStatic.value ||
    preparation.value.active
  )
    return;
  armed = false;
  if (world) {
    world.reset();
    generation.value++;
    paint();
  } else void initialize();
}
watch(
  () => preparation.value.active,
  (active) => {
    if (active) stop();
    else {
      enterIfReady();
      wake();
    }
  },
);
async function initialize() {
  if (world || loading || isStatic.value || disposed) return;
  loading = true;
  try {
    const { SkillWorld } = await import('~/utils/skillPhysics');
    if (disposed || isStatic.value) return;
    const { width, height, radius } = size();
    world = new SkillWorld(width, height, radius, skills.length);
    generation.value++;
    physics.value = true;
    await nextTick();
    paint();
    wake();
  } catch {
    physics.value = false;
    state.value = 'static';
  } finally {
    loading = false;
  }
}
function reset() {
  interact();
  releaseDrag();
  if (!isStatic.value) {
    world?.reset();
    if (world) generation.value++;
    paint();
    wake();
  }
}
function shuffle() {
  interact();
  if (!isStatic.value) {
    world?.shuffle();
    wake();
  }
}
function releaseDrag() {
  if (!drag) return;
  if (world?.bodies[drag.index]) world.bodies[drag.index]!.held = false;
  if (drag.element.hasPointerCapture(drag.pointer))
    drag.element.releasePointerCapture(drag.pointer);
  drag = undefined;
}
function down(event: PointerEvent, index: number) {
  if (!world || isStatic.value || event.button !== 0) return;
  if (field.value?.closest('[data-drag-ready="false"]')) return;
  const b = world.bodies[index]!;
  const el = event.currentTarget as HTMLElement;
  drag = {
    index,
    pointer: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    lastX: event.clientX,
    lastY: event.clientY,
    time: event.timeStamp,
    moved: false,
    element: el,
  };
  b.held = true;
  b.vx = 0;
  b.vy = 0;
  suppressClick = -1;
  el.setPointerCapture(event.pointerId);
  wake();
}
function move(event: PointerEvent) {
  if (!drag || event.pointerId !== drag.pointer || !world) return;
  const rect = field.value!.getBoundingClientRect(),
    b = world.bodies[drag.index]!;
  if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 7)
    drag.moved = true;
  if (!drag.moved) return;
  const dt = Math.max(8, event.timeStamp - drag.time) / 1000;
  b.vx = Math.max(-750, Math.min(750, (event.clientX - drag.lastX) / dt));
  b.vy = Math.max(-750, Math.min(750, (event.clientY - drag.lastY) / dt));
  b.x = event.clientX - rect.left;
  b.y = event.clientY - rect.top;
  world.clamp(b);
  drag.lastX = event.clientX;
  drag.lastY = event.clientY;
  drag.time = event.timeStamp;
  paint();
}
function up(event: PointerEvent) {
  if (!drag || event.pointerId !== drag.pointer) return;
  if (drag.moved) suppressClick = drag.index;
  releaseDrag();
  wake();
}
function choose(index: number, event: MouseEvent) {
  if (event.detail !== 0 && suppressClick === index) {
    suppressClick = -1;
    return;
  }
  selected.value = skills[index]!.id;
}
function visibility() {
  if (document.hidden) {
    releaseDrag();
    stop();
  } else wake();
}
function preference() {
  reduced.value = Boolean(media?.matches);
}
watch(isStatic, async (value) => {
  releaseDrag();
  stop();
  if (value) {
    physics.value = false;
    items.forEach((el) => el?.style.removeProperty('transform'));
  } else {
    if (world) {
      physics.value = true;
      world.reset();
      await nextTick();
      paint();
      wake();
    } else if (visible) await initialize();
  }
});
onMounted(() => {
  media = matchMedia('(prefers-reduced-motion: reduce)');
  preference();
  media.addEventListener('change', preference);
  document.addEventListener('visibilitychange', visibility);
  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      visible = Boolean(entry?.isIntersecting);
      visibleRatio = entry?.intersectionRatio ?? 1;
      if (visible) {
        enterIfReady();
        wake();
      } else {
        releaseDrag();
        stop();
      }
    },
    { threshold: [0, 0.25, 0.6] },
  );
  observer.observe(field.value!);
  departureObserver = new IntersectionObserver(
    (entries) => {
      if (!entries[0]?.isIntersecting) armed = true;
    },
    { rootMargin: '120px 0px', threshold: 0 },
  );
  departureObserver.observe(field.value!);
  resizeObserver = new ResizeObserver(() => {
    if (!world || !field.value) return;
    releaseDrag();
    const { width, height, radius } = size();
    world.resize(width, height, radius);
    paint();
    wake();
  });
  resizeObserver.observe(field.value!);
});
onBeforeUnmount(() => {
  disposed = true;
  releaseDrag();
  stop();
  observer?.disconnect();
  departureObserver?.disconnect();
  resizeObserver?.disconnect();
  media?.removeEventListener('change', preference);
  document.removeEventListener('visibilitychange', visibility);
  world = undefined;
  items.length = 0;
});
</script>
<template>
  <section
    id="experiments"
    class="section skills-section shell"
    aria-labelledby="skills-heading"
    data-scene="skills"
    @pointerdown.capture="interact"
    @keydown.capture="interact"
  >
    <div class="skills-heading">
      <div>
        <p class="eyebrow">{{ copy.eyebrow }}</p>
        <h2 id="skills-heading" v-reveal class="reveal-heading">
          {{ copy.title }}
        </h2>
      </div>
      <p>{{ copy.intro }}</p>
    </div>
    <div class="playground-scroll-shell" @scene-drag-lock="releaseDrag">
      <div class="playground-panel">
        <div class="playground-toolbar">
          <p>{{ copy.hint }}</p>
          <div class="playground-actions">
            <button class="pill-control" @click="reset" :disabled="isStatic">
              <UiIcon name="reset" />{{ copy.reset }}
            </button>
            <button class="pill-control" @click="shuffle" :disabled="isStatic">
              <UiIcon name="shuffle" />{{ copy.shuffle }}
            </button>
            <button
              class="pill-control motion-control"
              :aria-pressed="isStatic"
              :disabled="reduced"
              @click="manualStatic = !manualStatic"
            >
              {{ isStatic ? copy.animate : copy.still }}
            </button>
          </div>
        </div>
        <div
          ref="field"
          class="skill-field"
          :class="{ 'physics-ready': physics && !isStatic }"
          :data-simulation="state"
          :data-generation="generation"
          :aria-label="copy.field"
          role="group"
        >
          <span class="field-wordmark" aria-hidden="true"
            ><span class="toolbox-word">TOOLBOX</span
            ><span class="inplay-word">IN PLAY.</span></span
          >
          <button
            v-for="(skill, index) in skills"
            :key="skill.id"
            :ref="
              (el) => {
                if (el) items[index] = el as HTMLElement;
              }
            "
            class="skill-object"
            :style="{ '--skill-color': skill.color }"
            :aria-pressed="selected === skill.id"
            :data-skill="skill.id"
            @pointerdown="down($event, index)"
            @pointermove="move"
            @pointerup="up"
            @pointercancel="releaseDrag"
            @lostpointercapture="releaseDrag"
            @click="choose(index, $event)"
          >
            <SkillIcon :id="skill.id" :symbol="skill.symbol" /><span>{{
              skill.name
            }}</span>
          </button>
        </div>
      </div>
    </div>
    <div class="skill-reading">
      <div class="skill-button-list" role="group" :aria-label="copy.choose">
        <button
          v-for="skill in skills"
          :key="skill.id"
          :aria-pressed="selected === skill.id"
          @click="selected = skill.id"
        >
          {{ skill.name }}
        </button>
      </div>
      <div class="skill-description" aria-live="polite" aria-atomic="true">
        <span class="eyebrow">{{ copy.usage }}</span>
        <h3>{{ activeSkill.name }}<UiIcon name="right" /></h3>
        <p>{{ activeSkill[locale] }}</p>
      </div>
    </div>
  </section>
</template>
