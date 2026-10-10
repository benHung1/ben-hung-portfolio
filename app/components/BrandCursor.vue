<script setup lang="ts">
import { createBrandCursor } from '~/utils/brandCursor';
const { locale } = usePortfolio();
const route = useRoute();
const layer = ref<HTMLElement>();
const dot = ref<HTMLElement>();
const ring = ref<HTMLElement>();
const copy = computed(() => motionCopy[locale.value]);
import { motionCopy } from '~/data/motion';
let controller: ReturnType<typeof createBrandCursor> | undefined;
onMounted(() => {
  if (layer.value && dot.value && ring.value)
    controller = createBrandCursor(layer.value, dot.value, ring.value);
});
watch(
  () => route.fullPath,
  () => controller?.reset(),
);
onBeforeUnmount(() => controller?.destroy());
</script>
<template>
  <div
    ref="layer"
    class="brand-cursor"
    aria-hidden="true"
    data-visible="false"
    data-mode="idle"
  >
    <div ref="dot" class="cursor-dot"><i /></div>
    <div ref="ring" class="cursor-ring">
      <span class="cursor-disc">
        <span class="cursor-view">{{ copy.view }}</span>
        <span class="cursor-drag">{{ copy.drag }}</span>
        <UiIcon class="cursor-external" name="external" />
        <svg
          class="cursor-aim"
          viewBox="0 0 34 34"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <circle cx="17" cy="17" r="8" />
          <path d="M17 1v9m0 14v9M1 17h9m14 0h9" />
          <circle cx="17" cy="17" r="1" fill="currentColor" />
        </svg>
      </span>
    </div>
  </div>
</template>
