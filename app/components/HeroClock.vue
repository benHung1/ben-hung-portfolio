<script setup lang="ts">
import { formatTaipeiClock, untilNextMinute } from '~/utils/taipeiClock';
const { t, locale } = usePortfolio();
const { manualStatic } = useMotionPreference();
// Identical empty state on server and hydration; reserve the digits' layout space.
const now = ref<number>();
const stamp = computed(() =>
  now.value === undefined
    ? undefined
    : formatTaipeiClock(now.value, locale.value),
);
const clock = ref<HTMLElement>();
const inView = ref(false);
const pageVisible = ref(true);
let observer: IntersectionObserver | undefined;
let timer: ReturnType<typeof setTimeout> | undefined;
function stop() {
  clearTimeout(timer);
  timer = undefined;
}
function update() {
  stop();
  pageVisible.value = !document.hidden;
  if (document.hidden) return;
  now.value = Date.now();
  timer = setTimeout(update, untilNextMinute(now.value));
}
onMounted(() => {
  update();
  observer = new IntersectionObserver(([entry]) => {
    inView.value = Boolean(entry?.isIntersecting);
  });
  if (clock.value) observer.observe(clock.value);
  document.addEventListener('visibilitychange', update);
});
onBeforeUnmount(() => {
  stop();
  observer?.disconnect();
  document.removeEventListener('visibilitychange', update);
});
</script>
<template>
  <div
    ref="clock"
    class="hero-clock"
    :class="{
      'clock-static': manualStatic,
      'clock-running': inView && pageVisible,
    }"
    :aria-label="t.hero.clockLabel"
  >
    <span class="clock-sweep" aria-hidden="true"></span>
    <span class="clock-zone"
      ><i aria-hidden="true"></i>{{ t.hero.clockCity }} <span>UTC+8</span></span
    >
    <time :datetime="stamp?.iso">
      <span class="clock-date">{{ stamp?.date ?? '----.--.--' }}</span>
      <span class="clock-minute-window"
        ><span :key="stamp?.time" class="clock-minute"
          ><span
            v-for="(character, index) in stamp?.time ?? '--:--'"
            :key="index"
            :class="{ 'clock-colon': character === ':' }"
            >{{ character }}</span
          ></span
        ></span
      >
    </time>
  </div>
</template>
<style scoped>
.hero-clock {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: 7px 12px;
  border: 1px solid color-mix(in srgb, var(--blue) 26%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, var(--blue) 4%, transparent);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px 18px;
  font-family: var(--mono);
  font-size: 12px;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}
.clock-sweep {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background: linear-gradient(
    110deg,
    transparent 25%,
    color-mix(in srgb, var(--blue) 17%, transparent) 50%,
    transparent 75%
  );
  animation: clock-sweep 6s ease-in-out infinite;
}
.clock-zone {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}
.clock-zone i {
  position: relative;
  flex-shrink: 0;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--blue);
}
.clock-zone i::after {
  content: '';
  position: absolute;
  inset: -3px;
  border: 1px solid var(--blue);
  border-radius: 50%;
  animation: clock-beacon 3s ease-out infinite;
}
.clock-zone > span {
  font-size: 11px;
}
time {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--ink);
  min-height: 22px;
}
.clock-date {
  min-width: 10ch;
}
.clock-minute-window {
  overflow: hidden;
  display: inline-flex;
  min-width: 5ch;
}
.clock-minute {
  display: inline-flex;
  animation: minute-arrive 380ms ease-out both;
}
.clock-colon {
  color: var(--blue);
  animation: clock-colon 1.8s ease-in-out infinite;
}
.hero-clock:not(.clock-running) .clock-sweep,
.hero-clock:not(.clock-running) .clock-colon,
.hero-clock:not(.clock-running) .clock-minute,
.hero-clock:not(.clock-running) .clock-zone i::after {
  animation-play-state: paused;
}
@keyframes clock-sweep {
  0%,
  12% {
    transform: translateX(-110%);
    opacity: 0;
  }
  22% {
    opacity: 1;
  }
  52%,
  100% {
    transform: translateX(110%);
    opacity: 0;
  }
}
@keyframes clock-beacon {
  0% {
    transform: scale(0.5);
    opacity: 0.8;
  }
  70%,
  100% {
    transform: scale(1.8);
    opacity: 0;
  }
}
@keyframes clock-colon {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}
@keyframes minute-arrive {
  from {
    opacity: 0.3;
    transform: translateY(35%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.clock-static .clock-minute,
.clock-static .clock-sweep,
.clock-static .clock-colon,
.clock-static .clock-zone i::after {
  animation: none;
}
.clock-static .clock-sweep,
.clock-static .clock-zone i::after {
  opacity: 0;
}
@media (max-width: 767px) {
  .hero-clock {
    width: 100%;
    justify-content: space-between;
    gap: 8px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .clock-sweep,
  .clock-zone i::after {
    opacity: 0;
  }
  .clock-minute,
  .clock-sweep,
  .clock-colon,
  .clock-zone i::after {
    animation: none;
  }
}
</style>
