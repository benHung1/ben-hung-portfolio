<script setup lang="ts">
const { t, locale, toggleLocale } = usePortfolio();
function toggleTheme() {
  const root = document.documentElement;
  const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = theme;
  try {
    localStorage.setItem('bh-theme', theme);
  } catch {
    /* Preference remains usable without storage. */
  }
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'dark' ? '#171a1e' : '#f6f4ed');
}
</script>
<template>
  <div class="preference-controls">
    <button
      class="icon-button theme-toggle"
      :aria-label="t.ui.theme"
      :title="t.ui.theme"
      @click="toggleTheme"
    >
      <UiIcon name="moon" class="theme-moon" /><UiIcon
        name="sun"
        class="theme-sun"
      />
    </button>
    <button
      class="language-toggle"
      :aria-label="t.ui.language"
      :title="t.ui.language"
      @click="toggleLocale"
    >
      <UiIcon name="globe" /><span>{{ locale === 'zh' ? 'EN' : '中' }}</span>
    </button>
  </div>
</template>
