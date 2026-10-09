<script setup lang="ts">
import type { createPortfolioScrollScenes } from '~/utils/portfolioScrollScenes';
import type { WeatherApi } from '~/utils/weatherCanvas';
const page = ref<HTMLElement>();
const weather = ref<WeatherApi>();
const { locale } = usePortfolio();
const { manualStatic } = useMotionPreference();
const preparation = usePagePreparation();
let scene: ReturnType<typeof createPortfolioScrollScenes> | undefined;
let factory: typeof createPortfolioScrollScenes | undefined;
let disposed = false;
function rebuild() {
  scene?.destroy();
  if (!disposed && !preparation.value.active && page.value && factory)
    scene = factory(page.value, {
      weather: weather.value,
      manualStatic: manualStatic.value,
    });
}
onMounted(async () => {
  try {
    const { createPortfolioScrollScenes } =
      await import('~/utils/portfolioScrollScenes');
    factory = createPortfolioScrollScenes;
    rebuild();
  } catch {
    if (page.value) page.value.dataset.scrollMotion = 'static';
  }
});
watch(locale, async () => {
  await nextTick();
  scene?.refresh();
});
watch(manualStatic, async () => {
  await nextTick();
  rebuild();
});
watch(
  () => preparation.value.active,
  (active) => {
    if (!active) rebuild();
  },
);
onBeforeUnmount(() => {
  disposed = true;
  scene?.destroy();
});
useHead({ title: 'Ben Hung — Frontend Engineer' });
</script>
<template>
  <main
    ref="page"
    id="main-content"
    data-page-path="/"
    class="portfolio-stage scroll-story"
    tabindex="-1"
  >
    <WeatherBackdrop
      ref="weather"
    /><Hero /><SelectedWork /><AboutSection /><SkillsPlayground /><ContactSection />
  </main>
</template>
