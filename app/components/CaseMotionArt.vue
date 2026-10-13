<script setup lang="ts">
import { caseArtThemes } from '~/data/caseArt';
const props = defineProps<{ projectSlug: string }>();
const theme = computed(() => caseArtThemes[props.projectSlug] ?? 'components');
const { manualStatic } = useMotionPreference();
const artwork = ref<HTMLElement>();
const inView = ref(false);
const pageVisible = ref(true);
let observer: IntersectionObserver | undefined;

function updateVisibility() {
  pageVisible.value = !document.hidden;
}

onMounted(() => {
  updateVisibility();
  observer = new IntersectionObserver(([entry]) => {
    inView.value = Boolean(entry?.isIntersecting);
  });
  if (artwork.value) observer.observe(artwork.value);
  document.addEventListener('visibilitychange', updateVisibility);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  document.removeEventListener('visibilitychange', updateVisibility);
});
</script>

<template>
  <div
    ref="artwork"
    class="case-motion-art"
    :class="{ 'is-running': inView && pageVisible && !manualStatic }"
    :data-art-theme="theme"
    aria-hidden="true"
  >
    <svg viewBox="0 0 320 320" fill="none" focusable="false">
      <g class="art-guides">
        <path d="M22 46V22H46M274 22H298V46M298 274V298H274M46 298H22V274" />
        <path d="M142 284h36M160 278v12M142 36h36M160 30v12" />
      </g>

      <g v-if="theme === 'bus'" class="art-lines">
        <path class="art-muted" d="M24 252h272" />
        <path class="art-road" d="M24 264h272" stroke-dasharray="12 16" />
        <g class="art-bus-body">
          <rect
            class="art-surface"
            x="46"
            y="111"
            width="220"
            height="118"
            rx="18"
          />
          <rect
            class="art-surface"
            x="82"
            y="99"
            width="64"
            height="12"
            rx="4"
          />
          <rect
            class="art-tint"
            x="63"
            y="128"
            width="111"
            height="43"
            rx="5"
          />
          <path d="M100 128v43m37-43v43" />
          <rect
            class="art-tint"
            x="186"
            y="128"
            width="62"
            height="43"
            rx="5"
          />
          <path d="M186 184h45v45m-23-45v45M47 181h127M252 187h14" />
          <path
            class="art-charge art-solid"
            d="m148 181-13 21h15l-6 18 28-29h-16l6-10Z"
          />
          <g
            v-for="x in [91, 235]"
            :key="x"
            class="art-wheel"
            :style="{ '--wheel-x': x + 'px' }"
          >
            <circle class="art-surface" :cx="x" cy="230" r="18" />
            <circle :cx="x" cy="230" r="6" />
            <path :d="`M${x} 214v10m0 12v10m-16-16h10m12 0h10`" />
          </g>
        </g>
        <g class="art-muted"><path d="M32 136h-8m13 22H17m16 22h-9" /></g>
      </g>

      <g v-else-if="theme === 'voice'" class="art-lines">
        <path d="M90 165v-25a70 70 0 0 1 140 0v25" />
        <path class="art-muted" d="M102 139a58 58 0 0 1 116 0" />
        <rect
          class="art-surface"
          x="80"
          y="152"
          width="29"
          height="59"
          rx="12"
        />
        <rect
          class="art-surface"
          x="211"
          y="152"
          width="29"
          height="59"
          rx="12"
        />
        <path d="M226 211v10a20 20 0 0 1-20 20h-31" />
        <rect class="art-tint" x="150" y="234" width="28" height="14" rx="7" />
        <g class="art-solid">
          <rect
            v-for="(height, i) in [18, 38, 58, 32, 20]"
            :key="i"
            class="art-wave"
            :x="123 + i * 17"
            :y="181 - height / 2"
            width="6"
            :height="height"
            rx="3"
            :style="{ '--delay': -i * 0.3 + 's' }"
          />
        </g>
        <g class="art-float">
          <path
            class="art-surface"
            d="M210 63h58a10 10 0 0 1 10 10v25a10 10 0 0 1-10 10h-30l-15 11v-11h-13a10 10 0 0 1-10-10V73a10 10 0 0 1 10-10Z"
          />
          <path d="M215 80h47m-47 12h29" />
        </g>
      </g>

      <g v-else-if="theme === 'map'" class="art-lines">
        <path
          class="art-surface"
          d="m48 105 74-27 76 25 74-27v149l-74 27-76-25-74 27Z"
        />
        <path
          class="art-muted"
          d="M122 78v149m76-124v149M48 154l74-25 76 25 74-27M48 204l74-25 76 25 74-27"
        />
        <path class="art-muted" d="m77 216 43-44 51 18 65-52" />
        <path
          class="art-signal"
          d="m77 216 43-44 51 18 65-52"
          pathLength="100"
          stroke-dasharray="8 92"
        />
        <circle class="art-surface" cx="77" cy="216" r="6" />
        <circle class="art-surface" cx="120" cy="172" r="5" />
        <circle class="art-surface" cx="171" cy="190" r="5" />
        <g class="art-float">
          <path
            class="art-surface"
            d="M216 108a20 20 0 1 1 40 0c0 17-20 35-20 35s-20-18-20-35Z"
          />
          <circle class="art-tint" cx="236" cy="108" r="7" />
        </g>
      </g>

      <g v-else-if="theme === 'layers'" class="art-lines">
        <path
          class="art-muted"
          d="M160 62v201M66 111v107m188-107v107"
          stroke-dasharray="3 7"
        />
        <g
          v-for="(y, i) in [203, 163, 123, 83]"
          :key="y"
          class="art-layer"
          :style="{ '--delay': -i * 0.7 + 's' }"
        >
          <path
            class="art-surface"
            :d="`M160 ${y - 25} 254 ${y + 18} 160 ${y + 61} 66 ${y + 18}Z`"
          />
          <path class="art-tint" :d="`m160 ${y - 10} 62 28-62 28-62-28Z`" />
          <circle class="art-solid" :cx="160" :cy="y + 18" r="3" />
        </g>
      </g>

      <g v-else-if="theme === 'components'" class="art-lines">
        <path class="art-muted" d="M111 143v92h107V142" />
        <path
          class="art-signal"
          d="M111 143v92h107V142"
          pathLength="100"
          stroke-dasharray="8 92"
        />
        <rect
          class="art-surface"
          x="35"
          y="81"
          width="145"
          height="100"
          rx="10"
        />
        <path d="M35 104h145M47 92h5m8 0h5" />
        <rect class="art-tint" x="52" y="119" width="45" height="44" rx="4" />
        <path d="M111 124h50m-50 15h37m-37 15h45" />
        <g class="art-float">
          <rect
            class="art-surface"
            x="193"
            y="66"
            width="89"
            height="105"
            rx="9"
          />
          <path d="M193 89h89m-77-12h4m8 0h4" />
          <rect
            class="art-tint"
            x="210"
            y="105"
            width="54"
            height="48"
            rx="4"
          />
        </g>
        <rect
          class="art-surface"
          x="135"
          y="215"
          width="51"
          height="40"
          rx="6"
        />
        <path d="m155 226-10 9 10 9m10-18 10 9-10 9" />
      </g>

      <g v-else-if="theme === 'calendar'" class="art-lines">
        <rect
          class="art-surface"
          x="59"
          y="81"
          width="202"
          height="169"
          rx="15"
        />
        <path d="M59 124h202M104 67v28m112-28v28" />
        <g class="art-tint">
          <rect
            v-for="(x, i) in [83, 137, 191]"
            :key="i"
            :x="x"
            y="143"
            width="34"
            height="29"
            rx="5"
          />
          <rect x="83" y="190" width="34" height="29" rx="5" />
          <rect x="137" y="190" width="34" height="29" rx="5" />
        </g>
        <g class="art-pulse">
          <circle class="art-surface" cx="230" cy="218" r="30" />
          <path d="m216 219 10 10 18-21" />
        </g>
      </g>

      <g v-else-if="theme === 'jobs'" class="art-lines">
        <path d="M113 121V99h66v22" />
        <rect
          class="art-surface"
          x="53"
          y="121"
          width="186"
          height="125"
          rx="12"
        />
        <path d="M53 164q93 37 186 0" />
        <rect class="art-tint" x="130" y="165" width="32" height="23" rx="4" />
        <g class="art-search">
          <circle class="art-surface" cx="222" cy="132" r="35" />
          <path d="m247 157 26 26m-60-51 7 7 15-18" />
        </g>
      </g>

      <g v-else-if="theme === 'career'" class="art-lines">
        <rect
          class="art-surface"
          x="110"
          y="65"
          width="137"
          height="190"
          rx="12"
        />
        <circle class="art-tint" cx="178" cy="111" r="19" />
        <path d="M149 150q29-24 58 0M139 177h78m-78 17h61m-61 17h69" />
        <path class="art-muted" d="M44 251v-24h25v-26h25v-27" />
        <g class="art-rise">
          <path d="M54 174q2-44 43-57m-23-6 23 6-8 23" />
          <circle class="art-tint" cx="58" cy="197" r="7" />
        </g>
      </g>

      <g v-else-if="theme === 'graduation'" class="art-lines">
        <g class="art-float">
          <path class="art-surface" d="m48 125 112-52 112 52-112 52Z" />
          <path class="art-tint" d="M91 146v36q69 46 138 0v-36l-69 31Z" />
          <path d="m160 125 94 12v60" />
          <circle class="art-solid" cx="254" cy="202" r="5" />
        </g>
        <rect
          class="art-surface"
          x="89"
          y="222"
          width="142"
          height="30"
          rx="10"
        />
        <path d="M102 222v30m116-30v30" />
        <path class="art-tint" d="M150 222h20v30h-20Z" />
      </g>

      <g v-else-if="theme === 'campus'" class="art-lines">
        <path
          class="art-surface"
          d="m52 117 108-51 108 51ZM66 117h188v134H66Z"
        />
        <circle class="art-tint" cx="160" cy="96" r="8" />
        <path d="M51 251h218M44 263h232" />
        <rect
          v-for="x in [87, 144, 201]"
          :key="x"
          class="art-tint"
          :x="x"
          y="140"
          width="32"
          height="83"
          rx="3"
        />
        <g class="art-float">
          <rect
            class="art-surface"
            x="220"
            y="195"
            width="60"
            height="49"
            rx="7"
          />
          <path d="M238 195v-9h23v9m-41 18h60m-36-6v12h12v-12" />
        </g>
      </g>

      <g v-else-if="theme === 'gift'" class="art-lines">
        <rect
          class="art-surface"
          x="77"
          y="149"
          width="166"
          height="110"
          rx="7"
        />
        <rect
          class="art-surface"
          x="64"
          y="125"
          width="192"
          height="30"
          rx="6"
        />
        <path class="art-tint" d="M149 125h22v134h-22Z" />
        <g class="art-float">
          <path
            d="M160 125c-65-3-67-57-35-49 19 5 35 49 35 49Zm0 0c65-3 67-57 35-49-19 5-35 49-35 49Z"
          />
        </g>
        <g class="art-pulse">
          <circle class="art-surface" cx="260" cy="80" r="20" />
          <path d="M260 66v28m7-22h-10a5 5 0 0 0 0 10h6a5 5 0 0 1 0 10h-11" />
        </g>
      </g>

      <g v-else-if="theme === 'template'" class="art-lines">
        <rect
          class="art-surface"
          x="47"
          y="67"
          width="225"
          height="189"
          rx="12"
        />
        <path d="M47 97h225m-210-15h6m8 0h6m8 0h6M107 97v159" />
        <path class="art-muted" d="M63 123h26m-26 18h20m-20 18h26" />
        <rect class="art-tint" x="123" y="113" width="132" height="43" rx="5" />
        <rect class="art-tint" x="123" y="173" width="57" height="65" rx="5" />
        <g class="art-layer">
          <rect
            class="art-surface"
            x="198"
            y="174"
            width="68"
            height="64"
            rx="7"
          />
          <path d="M232 191v30m-15-15h30" />
        </g>
      </g>

      <g v-else-if="theme === 'ballot'" class="art-lines">
        <path class="art-tint" d="m72 164 47-30h82l47 30v87H72Z" />
        <path d="M72 164h176m-125-11h74" />
        <g class="art-ballot">
          <g transform="rotate(-12 160 115)">
            <rect
              class="art-surface"
              x="119"
              y="62"
              width="82"
              height="100"
              rx="7"
            />
            <rect
              class="art-tint"
              x="137"
              y="82"
              width="45"
              height="44"
              rx="6"
            />
            <path d="m146 103 9 10 19-23M136 144h48" />
          </g>
        </g>
        <path class="art-surface" d="M73 165h174v85H73Z" />
        <path d="m144 205 12 12 22-26" />
      </g>
    </svg>
  </div>
</template>

<style scoped lang="scss">
.case-motion-art {
  width: min(100%, 340px);
  margin-inline: auto;
  color: var(--blue);
  pointer-events: none;
  user-select: none;

  svg {
    width: 100%;
    height: auto;
    aspect-ratio: 1;
    overflow: hidden;
  }
}

.art-guides {
  stroke: var(--line);
  stroke-width: 1;
}

.art-lines {
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.art-muted {
  stroke: var(--line);
}

.art-surface {
  fill: var(--paper);
}

.art-tint {
  fill: color-mix(in srgb, var(--blue) 8%, var(--paper));
}

.art-solid {
  fill: currentColor;
  stroke: none;
}

.art-road {
  opacity: 0.45;
}

.art-signal {
  stroke-width: 3;
}

@media (min-width: 768px) and (prefers-reduced-motion: no-preference) {
  .art-float,
  .art-layer {
    animation: art-float 6s ease-in-out infinite paused;
    animation-delay: var(--delay, 0s);
  }

  .art-bus-body {
    animation: art-bus-ride 3s ease-in-out infinite paused;
  }

  .art-wheel {
    transform-box: view-box;
    transform-origin: var(--wheel-x) 230px;
    animation: art-wheel-turn 6s linear infinite paused;
  }

  .art-road {
    animation: art-road-travel 1.6s linear infinite paused;
  }

  .art-charge,
  .art-pulse {
    animation: art-pulse 4s ease-in-out infinite paused;
  }

  .art-wave {
    transform-box: fill-box;
    transform-origin: center;
    animation: art-wave 2s ease-in-out infinite paused;
    animation-delay: var(--delay, 0s);
  }

  .art-signal {
    animation: art-signal-travel 8s linear infinite paused;
  }

  .art-search {
    animation: art-search 7s ease-in-out infinite paused;
  }

  .art-rise,
  .art-ballot {
    animation: art-rise 5s ease-in-out infinite paused;
  }

  .is-running
    :is(
      .art-float,
      .art-layer,
      .art-bus-body,
      .art-wheel,
      .art-road,
      .art-charge,
      .art-pulse,
      .art-wave,
      .art-signal,
      .art-search,
      .art-rise,
      .art-ballot
    ) {
    animation-play-state: running;
  }
}

@keyframes art-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes art-bus-ride {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}

@keyframes art-wheel-turn {
  to {
    transform: rotate(360deg);
  }
}

@keyframes art-road-travel {
  to {
    stroke-dashoffset: -28;
  }
}

@keyframes art-pulse {
  0%,
  100% {
    opacity: 0.55;
  }
  50% {
    opacity: 1;
  }
}

@keyframes art-wave {
  0%,
  100% {
    transform: scaleY(0.45);
  }
  50% {
    transform: scaleY(1);
  }
}

@keyframes art-signal-travel {
  to {
    stroke-dashoffset: -100;
  }
}

@keyframes art-search {
  0%,
  100% {
    transform: translate(0, 0);
  }
  35% {
    transform: translate(-8px, 5px);
  }
  70% {
    transform: translate(3px, -3px);
  }
}

@keyframes art-rise {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}
</style>
