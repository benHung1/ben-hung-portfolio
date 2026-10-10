<script setup lang="ts">
import { reviewTestimonials } from '#testimonial-review';
const { locale } = usePortfolio();
const fixture = ref<'all' | 'one' | 'empty'>('all');
const items = computed(() =>
  fixture.value === 'empty'
    ? []
    : fixture.value === 'one'
      ? reviewTestimonials.slice(0, 1)
      : reviewTestimonials,
);
useHead({
  title: 'Testimonial development preview — Ben Hung',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
});
</script>
<template>
  <main
    id="main-content"
    class="portfolio-stage testimonial-dev-page"
    data-page-path="/dev/testimonials"
    tabindex="-1"
  >
    <div class="testimonial-dev-tools">
      <NuxtLink to="/"
        >{{ locale === 'zh' ? '返回正常首頁' : 'Back to homepage' }}
        <UiIcon name="left"
      /></NuxtLink>
      <p>
        {{
          locale === 'zh'
            ? '獨立開發預覽：以下包含未核准資料，不會加入正式輸出。'
            : 'Development preview: these unapproved entries are excluded from production.'
        }}
      </p>
      <div role="group" aria-label="Development test data">
        <button
          v-for="value in ['all', 'one', 'empty'] as const"
          :key="value"
          :aria-pressed="fixture === value"
          @click="fixture = value"
        >
          {{
            locale === 'zh'
              ? { all: '完整資料', one: '只有一則', empty: '沒有資料' }[value]
              : { all: 'All entries', one: 'One entry', empty: 'No entries' }[
                  value
                ]
          }}
        </button>
      </div>
    </div>
    <TestimonialsSection :items="items" :show-empty="true" />
    <details class="testimonial-dev-tools">
      <summary>
        {{
          locale === 'zh' ? '資料來源與確認狀態' : 'Sources and approval status'
        }}
      </summary>
      <article v-for="entry in reviewTestimonials" :key="entry.id">
        <h2>{{ entry.displayName }}</h2>
        <p>{{ entry.review?.source.note[locale] }}</p>
        <p>approvedForPublic: {{ entry.review?.approvedForPublic }}</p>
        <a
          v-if="entry.review?.source.url"
          :href="entry.review.source.url"
          target="_blank"
          rel="noopener noreferrer"
          >{{ locale === 'zh' ? '來源' : 'Source' }}</a
        >
      </article>
    </details>
  </main>
</template>
