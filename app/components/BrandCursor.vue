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
      </span>
    </div>
  </div>
</template>
