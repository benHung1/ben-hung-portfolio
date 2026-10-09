<script setup lang="ts">
import { categoryIds, type Category } from '~/data/projectCatalog';
const { projects } = useProjects();
const { t } = usePortfolio();
const page = ref<HTMLElement>();
useInnerPageMotion(page, 'work');
function beforeLeave(el: Element) {
  (el as HTMLElement).style.width = `${el.getBoundingClientRect().width}px`;
}
const route = useRoute(),
  router = useRouter();
const active = computed(() =>
  categoryIds.includes(route.query.category as Category)
    ? (route.query.category as Category)
    : 'all',
);
const filtered = computed(() =>
  projects.value.filter(
    (p) => active.value === 'all' || p.categories.includes(active.value),
  ),
);
const filters = ['all', ...categoryIds] as const;
function filter(id: string) {
  router.replace({ query: id === 'all' ? {} : { category: id } });
}
useSeoMeta({
  title: () => t.value.nav.work + ' — Ben Hung',
  description: () => t.value.work.description,
  ogTitle: () => t.value.nav.work + ' — Ben Hung',
  ogDescription: () => t.value.work.description,
});
</script>
<template>
  <main
    ref="page"
    id="main-content"
    data-page-path="/work"
    tabindex="-1"
    class="work-page shell inner-motion-page"
  >
    <InnerPageArt word="WORK" />
    <header class="work-intro">
      <p class="eyebrow">{{ t.work.eyebrow }}</p>
      <h1>
        <span class="inner-title-mask"
          ><span class="inner-title-line">{{ t.work.title[0] }}</span></span
        ><span class="inner-title-mask"
          ><span class="inner-title-line serif blue">{{
            t.work.title[1]
          }}</span></span
        >
      </h1>
      <div class="work-intro-bottom inner-lead">
        <p>{{ t.work.description }}</p>
      </div>
    </header>
    <div class="work-filters" role="group" :aria-label="t.ui.categories">
      <button
        v-for="option in filters"
        :key="option"
        :aria-pressed="active === option"
        @click="filter(option)"
      >
        {{ t.categories[option]
        }}<span>{{
          projects.filter(
            (p) => option === 'all' || p.categories.includes(option),
          ).length
        }}</span>
      </button>
    </div>
    <div class="work-results-heading">
      <p role="status" aria-live="polite">
        {{ filtered.length }} {{ t.ui.results }}
      </p>
    </div>
    <h2 class="sr-only">{{ t.ui.workList }}</h2>
    <TransitionGroup
      name="project-filter"
      tag="div"
      class="work-grid"
      @before-leave="beforeLeave"
    >
      <ProjectCard
        v-for="(project, index) in filtered"
        :key="project.slug"
        :project="project"
        :index="index"
      />
    </TransitionGroup>
    <div class="work-bottom">
      <p>{{ t.work.footer }}</p>
      <NuxtLink class="underlined-link" to="/#contact"
        >{{ t.work.cta }}<UiIcon name="mail"
      /></NuxtLink>
    </div>
  </main>
</template>
