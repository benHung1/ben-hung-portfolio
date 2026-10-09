<script setup lang="ts">
const { t } = usePortfolio();
const { manualStatic } = useMotionPreference();
const preparation = usePagePreparation();
useHead(() => ({
  htmlAttrs: {
    lang: t.value.locale,
    'data-user-motion': manualStatic.value ? 'reduce' : undefined,
  },
  meta: [{ property: 'og:locale', content: t.value.ogLocale }],
}));
useSeoMeta({
  description: () => t.value.meta,
  ogTitle: 'Ben Hung — Frontend Engineer',
  ogDescription: () => t.value.meta,
});
</script>
<template>
  <div>
    <BrandCursor />
    <BrandIntro />
    <div class="site-content" :inert="preparation.active || undefined">
      <a class="skip-link" href="#main-content">{{ t.ui.skip }}</a
      ><NuxtRouteAnnouncer /><SiteHeader /><NuxtPage /><SiteFooter />
    </div>
  </div>
</template>
