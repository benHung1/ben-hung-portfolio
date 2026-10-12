<script setup lang="ts">
import { playgroundCopy, skills } from '~/data/playground';
import {
  SkillRangeGame,
  rangeCapacity,
  validRangeTap,
} from '~/utils/skillRangeState';
import type { createSkillRangeMotion } from '~/utils/skillRangeMotion';
const { locale } = usePortfolio();
const copy = computed(() => playgroundCopy[locale.value]);
const { manualStatic } = useMotionPreference();
const preparation = usePagePreparation();
const field = ref<HTMLElement>();
const game = new SkillRangeGame(skills.map((skill) => skill.id));
const state = shallowRef(game.snapshot());
const selected = ref<string>();
const systemReduced = ref(false);
const isStatic = computed(() => systemReduced.value || manualStatic.value);
const targets = computed(() =>
  state.value.targets.map((id) => skills.find((skill) => skill.id === id)!),
);
const unlocked = computed(() =>
  state.value.unlocked.map((id) => skills.find((skill) => skill.id === id)!),
);
const activeSkill = computed(() =>
  skills.find((skill) => skill.id === selected.value),
);
let motion: ReturnType<typeof createSkillRangeMotion> | undefined;
let observer: IntersectionObserver | undefined,
  resizeObserver: ResizeObserver | undefined,
  media: MediaQueryList | undefined;
let visible = false,
  disposed = false,
  capacity = 3;
type Tap = {
  id: string;
  pointer: number;
  x: number;
  y: number;
  time: number;
  scroll: number;
};
let tap: Tap | undefined,
  allowedTap = '';
const publish = () => {
  state.value = game.snapshot();
};
function sync() {
  motion?.sync(
    visible && !document.hidden && !game.paused && !preparation.value.active,
    isStatic.value,
  );
}
function pointerDown(event: PointerEvent, id: string) {
  if (!event.isPrimary || event.button !== 0) return;
  allowedTap = '';
  tap = {
    id,
    pointer: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    time: performance.now(),
    scroll: window.scrollY,
  };
}
function pointerUp(event: PointerEvent, id: string) {
  if (
    tap?.id === id &&
    tap.pointer === event.pointerId &&
    validRangeTap(tap, {
      x: event.clientX,
      y: event.clientY,
      time: performance.now(),
      scroll: window.scrollY,
    })
  )
    allowedTap = id;
  tap = undefined;
}
function cancelTap() {
  tap = undefined;
  allowedTap = '';
}
function pointerMove(event: PointerEvent) {
  if (tap && Math.hypot(event.clientX - tap.x, event.clientY - tap.y) >= 9)
    cancelTap();
}
async function shoot(id: string, event: MouseEvent) {
  // A shot requires the matching, validated mouse/touch gesture.
  if (event.detail === 0 || allowedTap !== id) return;
  allowedTap = '';
  if (!game.hit(id)) return;
  selected.value = id;
  publish();
  const round = game.round;
  const retire = async () => {
    if (disposed || round !== game.round) return;
    game.retire(id, round);
    publish();
    await nextTick();
    if (disposed || round !== game.round) return;
    motion?.measure();
  };
  if (motion) motion.hit(id, retire);
  else void retire();
  if (game.takeCelebration()) {
    await nextTick();
    if (!disposed && round === game.round) motion?.celebrate();
  }
}
function pause() {
  game.paused = !game.paused;
  publish();
  sync();
}
async function restart() {
  motion?.cancel();
  cancelTap();
  game.restart();
  selected.value = undefined;
  publish();
  await nextTick();
  if (disposed) return;
  motion?.reset();
  sync();
}
async function recycle(id: string) {
  const round = game.round;
  if (!game.recycle(id, round)) return;
  publish();
  await nextTick();
  if (!disposed && round === game.round) motion?.recycled(id);
}
function resize() {
  if (!field.value || disposed) return;
  const next = rangeCapacity(field.value.clientWidth);
  if (next !== capacity) {
    motion?.cancel(true);
    capacity = next;
    game.resize(next);
    publish();
  }
  void nextTick(() => {
    if (!disposed) motion?.measure();
  });
}
function preference() {
  systemReduced.value = media?.matches ?? false;
}
onMounted(async () => {
  game.randomize();
  publish();
  media = matchMedia('(prefers-reduced-motion: reduce)');
  preference();
  media.addEventListener('change', preference);
  document.addEventListener('visibilitychange', sync);
  observer = new IntersectionObserver(
    ([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      sync();
    },
    { threshold: 0 },
  );
  if (field.value) observer.observe(field.value);
  resizeObserver = new ResizeObserver(resize);
  if (field.value) resizeObserver.observe(field.value);
  resize();
  try {
    const { createSkillRangeMotion } = await import('~/utils/skillRangeMotion');
    if (!disposed && field.value) {
      motion = createSkillRangeMotion(
        field.value,
        recycle,
        () => state.value.total - state.value.unlocked.length,
        import.meta.dev
          ? (record) =>
              console.debug(
                '[skill-flight] ' +
                  JSON.stringify({
                    ...record,
                    skill: skills.find((skill) => skill.id === record.id)?.name,
                  }),
              )
          : undefined,
      );
      sync();
    }
  } catch {
    /* Static DOM targets and scoring remain usable if animation cannot load. */
  }
});
watch([isStatic, () => preparation.value.active], () => {
  if (import.meta.client) sync();
});
watch(locale, () => {
  void nextTick(() => motion?.measure());
});
onBeforeUnmount(() => {
  disposed = true;
  cancelTap();
  observer?.disconnect();
  resizeObserver?.disconnect();
  media?.removeEventListener('change', preference);
  document.removeEventListener('visibilitychange', sync);
  motion?.destroy();
});
</script>
<template>
  <section
    id="experiments"
    data-scene="skills"
    class="section shell skills-section"
    aria-labelledby="skills-title"
  >
    <header class="section-heading range-heading">
      <div>
        <p class="eyebrow">{{ copy.eyebrow }}</p>
        <h2 id="skills-title">{{ copy.title }}</h2>
      </div>
      <p>{{ copy.intro }}</p>
    </header>
    <div class="playground-scroll-shell">
      <div class="playground-panel range-panel">
        <div
          ref="field"
          class="range-board"
          data-cursor="aim"
          :data-score="state.unlocked.length"
          :data-total="state.total"
          :data-round="state.round"
          :data-manual-paused="state.paused"
          role="group"
          :aria-label="copy.field"
        >
          <div class="range-scenery" aria-hidden="true">
            <div class="range-horizon"></div>
            <svg
              class="range-floor"
              viewBox="0 0 1200 500"
              preserveAspectRatio="none"
            >
              <path
                v-for="(x, i) in [
                  -1800, -1200, -700, -350, 0, 300, 600, 900, 1200, 1550, 1900,
                  2400, 3000,
                ]"
                :key="i"
                :d="`M600 0 L${x} 500`"
              />
              <path
                v-for="y in [12, 30, 57, 98, 158, 243, 360, 495]"
                :key="y"
                :d="`M0 ${y} H1200`"
              />
            </svg>
            <span class="toolbox-word">TOOLBOX</span
            ><span class="inplay-word">IN PLAY</span>
          </div>
          <div class="range-hud">
            <span>SKILLS &amp; TECHNOLOGIES</span
            ><output aria-live="polite" aria-atomic="true"
              >SCORE: {{ state.unlocked.length }} / {{ state.total }}</output
            >
          </div>
          <div
            v-for="skill in targets"
            :key="skill.id"
            class="range-target-track"
            :data-skill="skill.id"
          >
            <button
              class="range-target"
              type="button"
              tabindex="-1"
              :aria-label="copy.hit + ' ' + skill.name"
              :aria-disabled="state.retiring.includes(skill.id)"
              @pointerdown="pointerDown($event, skill.id)"
              @pointermove="pointerMove"
              @pointerup="pointerUp($event, skill.id)"
              @pointercancel="cancelTap"
              @click="shoot(skill.id, $event)"
            >
              <SkillIcon :id="skill.id" :symbol="skill.symbol" /><span>{{
                skill.name
              }}</span
              ><i aria-hidden="true">+</i>
            </button>
          </div>
          <p v-if="!state.complete" class="range-field-hint">
            {{ state.paused ? copy.paused : copy.aim }}
          </p>
          <div
            v-if="state.complete"
            class="range-completion"
            data-cursor="link"
          >
            <div class="range-badge" aria-hidden="true">
              <i></i><i></i><i></i><strong>BH.</strong>
            </div>
            <p class="eyebrow">ALL SKILLS UNLOCKED</p>
            <h3>{{ copy.complete }}</h3>
            <p>{{ copy.nextMission }}</p>
            <div class="range-finish-actions">
              <NuxtLink to="/#contact" class="button button-primary"
                >{{ copy.contact }}<UiIcon name="right" /></NuxtLink
              ><button class="button" @click="restart">
                {{ copy.replay }}<UiIcon name="right" />
              </button>
            </div>
          </div>
        </div>
        <div class="range-controls">
          <div>
            <button
              :aria-pressed="manualStatic"
              @click="manualStatic = !manualStatic"
            >
              {{ manualStatic ? copy.animate : copy.still }}</button
            ><button :aria-pressed="state.paused" @click="pause">
              {{ state.paused ? copy.resume : copy.pause }}</button
            ><button @click="restart">{{ copy.restart }}</button
            ><NuxtLink to="/#range-library" class="range-library-link">
              {{ copy.all }}<UiIcon name="right" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    <div class="range-collection">
      <div class="range-unlocked">
        <h3>
          {{ copy.unlocked }}
          <span>{{ state.unlocked.length.toString().padStart(2, '0') }}</span>
        </h3>
        <p v-if="!unlocked.length">{{ copy.empty }}</p>
        <div class="range-chips">
          <button
            v-for="skill in unlocked"
            :key="skill.id"
            :aria-pressed="selected === skill.id"
            @click="selected = skill.id"
          >
            <SkillIcon :id="skill.id" :symbol="skill.symbol" />{{ skill.name }}
          </button>
        </div>
      </div>
      <div
        class="skill-reading range-reading"
        aria-live="polite"
        aria-atomic="true"
      >
        <template v-if="activeSkill"
          ><span class="eyebrow">{{ copy.collected }}</span>
          <h3>{{ activeSkill.name }}</h3>
          <p>{{ activeSkill[locale] }}</p></template
        >
        <p v-else>{{ copy.hint }}</p>
      </div>
    </div>
    <section
      id="range-library"
      class="range-library"
      aria-labelledby="range-library-title"
      tabindex="-1"
    >
      <header class="range-library-heading">
        <h3 id="range-library-title">
          {{ copy.library }}<span>{{ skills.length }}</span>
        </h3>
        <p>{{ copy.libraryIntro }}</p>
      </header>
      <div>
        <article v-for="skill in skills" :key="skill.id">
          <SkillIcon :id="skill.id" :symbol="skill.symbol" />
          <h4>{{ skill.name }}</h4>
          <p>{{ skill[locale] }}</p>
        </article>
      </div>
    </section>
  </section>
</template>
