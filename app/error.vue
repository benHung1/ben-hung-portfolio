<script setup lang="ts">
import type { NuxtError } from '#app';
defineProps<{ error: NuxtError }>();
const { t } = usePortfolio();
useHead(() => ({ htmlAttrs: { lang: t.value.locale } }));
</script>
<template>
  <main class="error-page shell">
    <p class="eyebrow">BEN HUNG / {{ error.statusCode }}</p>
    <h1>{{ error.statusCode }}</h1>
    <p>{{ error.statusCode === 404 ? t.ui.missing : t.ui.error }}</p>
    <button
      class="button button-dark"
      @click="clearError({ redirect: '/work' })"
    >
      <UiIcon name="left" />{{ t.ui.back }}
    </button>
  </main>
</template>
