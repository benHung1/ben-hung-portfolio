<script setup lang="ts">
const { t } = usePortfolio();
</script>
<template>
  <footer class="site-footer shell">
    <NuxtLink class="wordmark" to="/" :aria-label="t.ui.home"
      >BH<span>.</span></NuxtLink
    ><span>© 2026 BEN HUNG</span><a href="#main-content">{{ t.ui.top }}</a>
  </footer>
</template>
