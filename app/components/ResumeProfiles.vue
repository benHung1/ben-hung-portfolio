<script setup lang="ts">
import { profiles, profileCopy } from '~/data/profiles';
withDefaults(defineProps<{ variant?: 'subtle' | 'solid' }>(), {
  variant: 'solid',
});
const { locale } = usePortfolio();
const copy = computed(() => profileCopy[locale.value]);
const route = useRoute();
const id = useId();
const root = ref<HTMLElement>();
const trigger = ref<HTMLButtonElement>();
const panel = ref<HTMLElement>();
const opened = ref(false);
const position = ref({ top: '0px', left: '0px', width: '280px' });
let closeTimer: ReturnType<typeof setTimeout> | undefined;
let frame = 0;
let source: 'hover' | 'click' | 'keyboard' = 'click';
function cancelClose() {
  clearTimeout(closeTimer);
}
function place() {
  if (!opened.value || !trigger.value) return;
  const rect = trigger.value.getBoundingClientRect();
  const width = Math.min(280, window.innerWidth - 24);
  const height = panel.value?.offsetHeight || 200;
  const top =
    rect.bottom + 10 + height > window.innerHeight - 12
      ? Math.max(12, rect.top - height - 10)
      : rect.bottom + 10;
  position.value = {
    width: `${width}px`,
    top: `${Math.max(12, Math.min(top, window.innerHeight - height - 12))}px`,
    left: `${Math.max(12, Math.min(rect.left, window.innerWidth - width - 12))}px`,
  };
}
function schedulePlace() {
  if (frame || !opened.value) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    place();
  });
}
function close(returnFocus = false) {
  cancelClose();
  opened.value = false;
  if (returnFocus) trigger.value?.focus({ preventScroll: true });
}
async function open(kind: typeof source, focusFirst = false) {
  cancelClose();
  source = kind;
  opened.value = true;
  place();
  await nextTick();
  place();
  if (focusFirst) panel.value?.querySelector<HTMLAnchorElement>('a')?.focus();
}
function toggle(event: MouseEvent) {
  // A pointer enters before its first click: keep that click's menu open.
  if (opened.value && source === 'hover')
    void open(event.detail === 0 ? 'keyboard' : 'click', event.detail === 0);
  else if (opened.value) close();
  else void open(event.detail === 0 ? 'keyboard' : 'click', event.detail === 0);
}
function enter(event: PointerEvent) {
  cancelClose();
  if (
    event.pointerType === 'mouse' &&
    matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)')
      .matches &&
    !opened.value
  )
    void open('hover');
}
function leave() {
  if (source === 'hover') closeTimer = setTimeout(() => close(), 180);
}
function outside(event: Event) {
  const target = event.target as Node;
  if (!root.value?.contains(target) && !panel.value?.contains(target)) close();
}
function escape(event: KeyboardEvent) {
  if (opened.value && event.key === 'Escape') {
    event.preventDefault();
    close(true);
  }
}
function triggerKeys(event: KeyboardEvent) {
  if (
    event.key === 'ArrowDown' ||
    (event.key === 'Tab' && !event.shiftKey && opened.value)
  ) {
    event.preventDefault();
    void open('keyboard', true);
  }
}
function panelKeys(event: KeyboardEvent) {
  if (event.key !== 'Tab' || !panel.value) return;
  const links = [...panel.value.querySelectorAll<HTMLAnchorElement>('a')];
  if (event.shiftKey && document.activeElement === links[0]) {
    event.preventDefault();
    close(true);
  } else if (!event.shiftKey && document.activeElement === links.at(-1)) {
    // Restore the logical tab order even though the floating panel is teleported.
    const candidates = [
      ...document.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex="0"]',
      ),
    ].filter(
      (el) =>
        !panel.value?.contains(el) &&
        el.getClientRects().length &&
        el.tabIndex >= 0,
    );
    const next = candidates[candidates.indexOf(trigger.value!) + 1];
    if (next) {
      event.preventDefault();
      close();
      next.focus();
    } else close();
  }
}
watch(
  () => route.fullPath,
  () => close(),
);
watch(locale, async () => {
  await nextTick();
  place();
});
onMounted(() => {
  document.addEventListener('pointerdown', outside);
  document.addEventListener('focusin', outside);
  document.addEventListener('keydown', escape);
  window.addEventListener('resize', schedulePlace);
  window.addEventListener('scroll', schedulePlace, { passive: true });
});
onBeforeUnmount(() => {
  close();
  cancelAnimationFrame(frame);
  document.removeEventListener('pointerdown', outside);
  document.removeEventListener('focusin', outside);
  document.removeEventListener('keydown', escape);
  window.removeEventListener('resize', schedulePlace);
  window.removeEventListener('scroll', schedulePlace);
});
</script>
<template>
  <div
    ref="root"
    class="resume-profiles"
    @pointerenter="enter"
    @pointerleave="leave"
  >
    <button
      ref="trigger"
      type="button"
      :class="
        variant === 'subtle'
          ? 'underlined-link profiles-trigger'
          : 'button button-dark profiles-trigger'
      "
      :aria-expanded="opened"
      :aria-controls="id"
      @click="toggle"
      @keydown="triggerKeys"
    >
      {{ copy.label
      }}<UiIcon name="right" :class="{ 'profiles-arrow-open': opened }" />
    </button>
    <Teleport to="body">
      <Transition name="profiles">
        <nav
          v-if="opened"
          :id="id"
          ref="panel"
          class="profiles-popover"
          :style="position"
          :aria-label="copy.list"
          @pointerenter="cancelClose"
          @pointerleave="leave"
          @keydown="panelKeys"
        >
          <a
            v-for="(profile, index) in profiles"
            :key="profile.id"
            :href="profile.url"
            target="_blank"
            rel="noopener noreferrer"
            :style="{ '--profile-delay': `${index * 25}ms` }"
            :aria-label="`${profile.name} — ${copy.newTab}`"
          >
            <span
              class="profile-logo"
              :class="`profile-logo-${profile.id}`"
              aria-hidden="true"
              >{{ profile.id === 'linkedin' ? 'in' : profile.name }}</span
            >
            <span>{{ profile.name }}</span
            ><UiIcon name="external" />
          </a>
        </nav>
      </Transition>
    </Teleport>
  </div>
</template>
