<script setup lang="ts">
const { t } = usePortfolio();
const { scene, move, reset } = useGeometry();
const arrangement = ref(0);
</script>
<template>
  <section class="hero shell" aria-labelledby="hero-heading" data-scene="hero">
    <div class="hero-contour" aria-hidden="true">
      <span class="hero-outline-back"></span
      ><span class="hero-outline-front"></span><i class="hero-color-block"></i>
    </div>
    <div class="hero-topline">
      <p class="eyebrow">{{ t.hero.eyebrow }}</p>
      <span class="eyebrow hero-index">PORTFOLIO — 2026</span>
    </div>
    <div class="hero-title-scroll">
      <h1 id="hero-heading" class="title-reveal">BEN HUNG<span>.</span></h1>
    </div>
    <div class="hero-lower">
      <div class="hero-copy">
        <h2>
          <span
            v-for="line in t.hero.subtitle"
            :key="line"
            class="line-reveal"
            >{{ line }}</span
          >
        </h2>
        <p>{{ t.hero.intro }}</p>
        <p>{{ t.hero.collaboration }}</p>
        <div class="hero-actions">
          <NuxtLink class="button button-dark explore-work" to="/#selected-work"
            >{{ t.hero.explore }}<UiIcon name="right"
          /></NuxtLink>
        </div>
      </div>
      <div
        ref="scene"
        class="geometry-scene"
        :class="'arrangement-' + arrangement"
        @pointermove="move"
        @pointerleave="reset"
      >
        <div class="geometry-orbit" aria-hidden="true"></div>
        <div class="geometry-scroll-layer" aria-hidden="true">
          <div class="geometry-object">
            <div
              v-for="n in 4"
              :key="n"
              class="geometry-scroll-frame"
              :style="{ '--i': n }"
            >
              <div class="geometry-frame"></div>
            </div>
          </div>
        </div>
        <button
          class="geometry-control"
          :aria-label="t.hero.recompose"
          @click="arrangement = (arrangement + 1) % 3"
        >
          <UiIcon name="shuffle" /><span>{{ t.hero.hint }}</span
          ><span class="geometry-step" aria-hidden="true"
            >0{{ arrangement + 1 }} / 03</span
          >
        </button>
        <span class="sr-only" role="status">{{
          t.hero.modes[arrangement]
        }}</span>
      </div>
    </div>
    <div class="capabilities">
      <span>Vue 2 / 3</span><span>Nuxt 3 / 4</span><span>{{ t.hero.lead }}</span
      ><span class="capabilities-caption">{{ t.hero.caption }}</span>
    </div>
  </section>
</template>
