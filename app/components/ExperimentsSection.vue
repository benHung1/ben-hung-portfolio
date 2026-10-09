<script setup lang="ts">
const { t } = usePortfolio();
const mode = ref('grid');
const modes = ['grid', 'orbit', 'scatter'];
</script>
<template>
  <section
    id="experiments"
    class="experiments-section"
    aria-labelledby="experiments-heading"
  >
    <div class="experiment-layout shell">
      <div class="experiment-copy">
        <p class="eyebrow">{{ t.experiment.eyebrow }}</p>
        <h2 id="experiments-heading">
          {{ t.experiment.title[0] }}<br /><span class="serif">{{
            t.experiment.title[1]
          }}</span>
        </h2>
        <p>{{ t.experiment.intro }}</p>
        <div class="experiment-meta">
          <span>01 — {{ t.experiment.group }}</span
          ><span>{{ t.experiment.meta }}</span>
        </div>
        <p class="experiment-description">{{ t.experiment.description }}</p>
        <div
          class="experiment-controls"
          role="group"
          :aria-label="t.experiment.group"
        >
          <button
            v-for="(option, index) in modes"
            :key="option"
            :aria-pressed="mode === option"
            @click="mode = option"
          >
            {{ t.experiment.modes[index] }}
          </button>
        </div>
        <span class="sr-only" role="status"
          >{{ t.experiment.current }}:
          {{ t.experiment.modes[modes.indexOf(mode)] }}</span
        >
      </div>
      <div
        class="experiment-canvas"
        :class="'experiment-' + mode"
        aria-hidden="true"
      >
        <div class="experiment-cross cross-one">+</div>
        <div class="experiment-cross cross-two">+</div>
        <div class="experiment-shapes">
          <span
            v-for="n in 9"
            :key="n"
            class="experiment-shape"
            :style="{ '--n': n }"
          ></span>
        </div>
        <span class="experiment-canvas-caption">{{
          t.experiment.caption
        }}</span>
      </div>
    </div>
  </section>
</template>
