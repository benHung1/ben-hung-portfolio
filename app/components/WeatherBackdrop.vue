<script setup lang="ts">
import { createWeatherCanvas } from '~/utils/weatherCanvas';
const canvas = ref<HTMLCanvasElement>();
const { manualStatic } = useMotionPreference();
let engine: ReturnType<typeof createWeatherCanvas> | undefined;
let progress = 0,
  reduced = false;
function setProgress(value: number) {
  progress = value;
  engine?.setProgress(value);
}
function setReduced(value: boolean) {
  reduced = value;
  engine?.setReduced(value || manualStatic.value);
}
function refresh() {
  engine?.refresh();
}
watch(manualStatic, (value) => engine?.setReduced(value || reduced));
onMounted(() => {
  try {
    engine = createWeatherCanvas(canvas.value!, canvas.value!.closest('main')!);
    engine.setProgress(progress);
    engine.setReduced(reduced || manualStatic.value);
  } catch {
    if (canvas.value) canvas.value.hidden = true;
  }
});
onBeforeUnmount(() => engine?.destroy());
defineExpose({ setProgress, setReduced, refresh });
</script>
<template>
  <canvas
    ref="canvas"
    class="weather-canvas"
    data-scene="weather"
    aria-hidden="true"
  ></canvas>
</template>
