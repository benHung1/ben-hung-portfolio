<script setup lang="ts">
import { testimonials } from '#testimonial-content';
import { testimonialCopy } from '~/data/testimonialCopy';
import type { TestimonialGroup, TestimonialView } from '~/types/testimonials';
import type { createTestimonialMotion } from '~/utils/testimonialMotion';
const props = withDefaults(
  defineProps<{ items?: TestimonialView[]; showEmpty?: boolean }>(),
  { showEmpty: false },
);
const { locale } = usePortfolio();
const copy = computed(() => testimonialCopy[locale.value]);
const { manualStatic } = useMotionPreference();
const preparation = usePagePreparation();
const root = ref<HTMLElement>();
const group = ref<'all' | TestimonialGroup>('all');
const index = ref(0);
const direction = ref(1);
const groups = ['all', 'foxconn', '1111'] as const;
const sourceEntries = computed(() =>
  [...(props.items ?? testimonials)].sort((a, b) => a.order - b.order),
);
const entries = computed(() =>
  sourceEntries.value.filter(
    (entry) => group.value === 'all' || entry.companyGroup === group.value,
  ),
);
const active = computed(() => entries.value[index.value]);
const peeks = computed(() => {
  const count = Math.min(2, entries.value.length - 1);
  return Array.from(
    { length: Math.max(0, count) },
    (_, offset) =>
      entries.value[(index.value + offset + 1) % entries.value.length]!,
  );
});
const pageLabel = computed(
  () =>
    `${String(active.value ? index.value + 1 : 0).padStart(2, '0')} / ${String(entries.value.length).padStart(2, '0')}`,
);
function selectGroup(value: typeof group.value) {
  index.value = 0;
  group.value = value;
}
function step(delta: number) {
  if (entries.value.length < 2) return;
  direction.value = delta;
  index.value =
    (index.value + delta + entries.value.length) % entries.value.length;
}
let gesture: { id: number; x: number; y: number } | undefined;
function pointerDown(event: PointerEvent) {
  if (event.pointerType === 'mouse' || !event.isPrimary) return;
  gesture = { id: event.pointerId, x: event.clientX, y: event.clientY };
}
function pointerUp(event: PointerEvent) {
  if (!gesture || event.pointerId !== gesture.id) return;
  const dx = event.clientX - gesture.x,
    dy = event.clientY - gesture.y;
  gesture = undefined;
  if (Math.abs(dx) >= 48 && Math.abs(dx) > Math.abs(dy) * 1.4)
    step(dx < 0 ? 1 : -1);
}
let motion: ReturnType<typeof createTestimonialMotion> | undefined;
let factory: typeof createTestimonialMotion | undefined;
let disposed = false;
function rebuild() {
  motion?.destroy();
  motion = undefined;
  if (!disposed && !preparation.value.active && root.value && factory)
    motion = factory(root.value, manualStatic.value);
}
onMounted(async () => {
  try {
    factory = (await import('~/utils/testimonialMotion'))
      .createTestimonialMotion;
    rebuild();
  } catch {
    /* The unanimated cards remain visible and usable. */
  }
});
watch([manualStatic, () => preparation.value.active], rebuild);
watch([locale, group, sourceEntries], async () => {
  await nextTick();
  motion?.refresh();
});
watch(sourceEntries, () => {
  index.value = 0;
});
onBeforeUnmount(() => {
  disposed = true;
  gesture = undefined;
  motion?.destroy();
});
</script>

<template>
  <section
    v-if="sourceEntries.length || showEmpty"
    id="testimonials"
    ref="root"
    class="section shell testimonials-section"
    aria-labelledby="testimonials-heading"
  >
    <div class="testimonials-art" aria-hidden="true">
      <span class="testimonials-quote-art">“</span><i></i>
    </div>
    <header class="testimonials-heading">
      <div>
        <p class="eyebrow">{{ copy.eyebrow }}</p>
        <h2 id="testimonials-heading">{{ copy.title }}</h2>
      </div>
      <p class="testimonials-intro">{{ copy.intro }}</p>
    </header>
    <div class="testimonial-filters" role="group" :aria-label="copy.filters">
      <button
        v-for="value in groups"
        :key="value"
        :aria-pressed="group === value"
        @click="selectGroup(value)"
      >
        {{ value === 'all' ? copy.all : copy.groups[value] }}
        <span>{{
          sourceEntries.filter(
            (entry) => value === 'all' || entry.companyGroup === value,
          ).length
        }}</span>
      </button>
    </div>
    <div
      class="testimonial-spread"
      role="region"
      aria-roledescription="carousel"
      :aria-label="copy.carousel"
      :class="{ 'is-single': peeks.length === 0 }"
    >
      <div class="testimonial-card-enter">
        <div
          class="testimonial-main-card"
          :class="{ 'is-reverse': direction < 0 }"
          tabindex="0"
          :aria-label="copy.carousel + ' ' + pageLabel"
          aria-describedby="testimonial-keyboard-hint"
          @keydown.left.prevent="step(-1)"
          @keydown.right.prevent="step(1)"
          @pointerdown="pointerDown"
          @pointerup="pointerUp"
          @pointercancel="gesture = undefined"
        >
          <span class="testimonial-mark" aria-hidden="true">“</span>
          <div class="testimonial-live" aria-live="polite" aria-atomic="true">
            <Transition name="testimonial-switch" mode="out-in">
              <article
                v-if="active"
                :key="active.id + locale"
                class="testimonial-copy"
                :data-testimonial-id="active.id"
              >
                <p class="testimonial-context">
                  <span>{{ copy.context }}</span
                  >{{ copy.groups[active.companyGroup] }}
                </p>
                <blockquote>
                  {{ locale === 'zh' ? active.quoteZh : active.quoteEn }}
                </blockquote>
                <footer class="testimonial-author">
                  <TestimonialAvatar :avatar="active.avatar" />
                  <div>
                    <h3>{{ active.displayName }}</h3>
                    <p>
                      {{ active.role?.[locale] || active.relationship[locale] }}
                    </p>
                    <span
                      v-if="active.role && active.companyGroup === '1111'"
                      >{{ active.relationship[locale] }}</span
                    >
                  </div>
                </footer>
              </article>
              <div v-else key="empty" class="testimonial-empty">
                <p>{{ copy.empty }}</p>
                <button class="underlined-link" @click="selectGroup('all')">
                  {{ copy.reset }}<UiIcon name="right" />
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </div>
      <aside class="testimonial-peeks" aria-hidden="true">
        <div
          v-for="position in [0, 1]"
          :key="position"
          class="testimonial-peek"
          :class="'peek-' + position"
        >
          <template v-if="peeks[position]">
            <span class="eyebrow">{{
              copy.groups[peeks[position]!.companyGroup]
            }}</span>
            <div class="peek-person">
              <TestimonialAvatar :avatar="peeks[position]!.avatar" />
              <div>
                <strong>{{ peeks[position]!.displayName }}</strong>
                <small class="peek-role">{{
                  peeks[position]!.role?.[locale] ||
                  peeks[position]!.relationship[locale]
                }}</small>
              </div>
            </div>
            <p>
              {{
                locale === 'zh'
                  ? peeks[position]!.quoteZh
                  : peeks[position]!.quoteEn
              }}
            </p>
          </template>
        </div>
      </aside>
    </div>
    <div class="testimonial-bottom">
      <p id="testimonial-keyboard-hint">{{ copy.hint }}</p>
      <div class="testimonial-controls">
        <span class="testimonial-page" aria-live="polite"
          >{{ pageLabel }}<span class="sr-only"> {{ copy.card }}</span></span
        >
        <button
          :aria-label="copy.previous"
          :disabled="entries.length < 2"
          @click="step(-1)"
        >
          <UiIcon name="left" />
        </button>
        <button
          :aria-label="copy.next"
          :disabled="entries.length < 2"
          @click="step(1)"
        >
          <UiIcon name="right" />
        </button>
      </div>
    </div>
  </section>
</template>
