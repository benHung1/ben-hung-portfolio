<script setup lang="ts">
import { pageMotionCopy } from '~/data/pageMotion';
const state = usePagePreparation();
const { locale } = usePortfolio();
const copy = computed(() => pageMotionCopy[locale.value]);
</script>
<template>
  <div
    v-if="state.active"
    :key="state.run"
    class="brand-intro route-intro"
    :class="{ 'is-leaving': state.phase === 'leaving' }"
    :data-run="state.run"
    :data-progress="state.progress"
    role="status"
    :aria-label="copy.preparing"
  >
    <div class="intro-geometry" aria-hidden="true">
      <span v-for="n in 3" :key="n" class="intro-shape"></span>
    </div>
    <span class="intro-word" aria-hidden="true">LOADING</span>
    <div class="intro-progress" :aria-label="copy.progress">
      <span aria-hidden="true">{{
        String(state.progress).padStart(3, '0')
      }}</span
      ><small> / 100</small>
    </div>
    <span class="intro-caption">{{ copy.preparing }}</span>
  </div>
</template>
