<script setup lang="ts">
import { pageMotionCopy } from '~/data/pageMotion';
const state = usePagePreparation();
const { locale } = usePortfolio();
const copy = computed(() => pageMotionCopy[locale.value]);
</script>
<template>
  <div
    v-if="state.visible"
    :key="state.run"
    class="brand-intro route-intro"
    :class="{ 'is-leaving': state.phase === 'leaving' }"
    :data-run="state.run"
    role="status"
    aria-live="polite"
    aria-atomic="true"
  >
    <div class="intro-geometry" aria-hidden="true">
      <span v-for="n in 3" :key="n" class="intro-shape"></span>
    </div>
    <span class="intro-word" aria-hidden="true">LOADING</span>
    <span class="intro-caption">{{ copy.preparing }}</span>
  </div>
</template>
