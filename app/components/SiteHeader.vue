<script setup lang="ts">
const { t } = usePortfolio();
const route = useRoute();
const menu = ref<HTMLDialogElement>();
const toggle = ref<HTMLButtonElement>();
const opened = ref(false);
const links = computed(() => [
  { label: t.value.nav.work, to: '/work' },
  { label: t.value.nav.about, to: '/#about' },
  { label: t.value.nav.experiments, to: '/#experiments' },
  { label: t.value.nav.contact, to: '/#contact' },
]);
function openMenu() {
  menu.value?.showModal();
  opened.value = true;
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  if (opened.value) menu.value?.close();
}
function onClose() {
  opened.value = false;
  document.body.style.overflow = '';
  toggle.value?.focus({ preventScroll: true });
}
function trapFocus(event: KeyboardEvent) {
  if (event.key !== 'Tab' || !menu.value) return;
  const items = [
    ...menu.value.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    ),
  ];
  const first = items[0],
    last = items.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
}
function onResize() {
  if (window.innerWidth >= 768 && opened.value) closeMenu();
}
watch(() => route.fullPath, closeMenu);
onMounted(() => window.addEventListener('resize', onResize));
onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
  document.body.style.overflow = '';
});
</script>
<template>
  <header class="site-header shell">
    <NuxtLink to="/" class="wordmark" :aria-label="t.ui.home"
      >BH<span>.</span></NuxtLink
    >
    <nav class="desktop-nav" :aria-label="t.ui.navigation">
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        :aria-current="
          link.to === '/work' && route.path.startsWith('/work')
            ? 'page'
            : undefined
        "
        >{{ link.label }}</NuxtLink
      >
    </nav>
    <div class="header-controls">
      <PreferenceControls /><button
        ref="toggle"
        class="menu-toggle icon-button"
        :aria-label="t.ui.menu"
        aria-controls="mobile-menu"
        :aria-expanded="opened"
        @click="openMenu"
      >
        <UiIcon name="menu" />
      </button>
    </div>
    <dialog
      id="mobile-menu"
      ref="menu"
      class="mobile-menu"
      :aria-label="t.ui.mobileNav"
      @close="onClose"
      @keydown="trapFocus"
      @click="$event.target === menu && closeMenu()"
    >
      <div class="menu-top">
        <span class="eyebrow">{{ t.ui.navigation }}</span
        ><button class="text-button" autofocus @click="closeMenu">
          {{ t.ui.close }}<UiIcon name="close" />
        </button>
      </div>
      <nav :aria-label="t.ui.mobileNav">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          @click="closeMenu"
          >{{ link.label }}</NuxtLink
        >
      </nav>
      <PreferenceControls />
      <p>BEN HUNG · FRONTEND ENGINEER</p>
    </dialog>
  </header>
</template>
