<script setup lang="ts">
import { pageMotionCopy } from '~/data/pageMotion';
definePageMeta({ key: (route) => route.path });
const route = useRoute();
const { t, locale } = usePortfolio();
const copy = computed(() => pageMotionCopy[locale.value]);
const app = useNuxtApp();
const goBack = () => app.$portfolioNavigation?.back();
const page = ref<HTMLElement>();
useInnerPageMotion(page, 'case');
const { projects } = useProjects();
const slug = String(route.params.slug);
const index = computed(() => projects.value.findIndex((p) => p.slug === slug));
if (index.value < 0)
  throw createError({ statusCode: 404, statusMessage: 'Project not found' });
const project = computed(() => projects.value[index.value]!);
const previous = computed(() => projects.value[index.value - 1]);
const next = computed(() => projects.value[index.value + 1]);
useSeoMeta({
  title: () => project.value.title + ' — Ben Hung',
  description: () => project.value.summary,
  ogTitle: () => project.value.title + ' — Ben Hung',
  ogDescription: () => project.value.summary,
  robots: 'index, follow',
});
</script>
<template>
  <main
    ref="page"
    id="main-content"
    :data-page-path="route.path"
    tabindex="-1"
    class="case-page shell inner-motion-page"
  >
    <InnerPageArt word="CASE" />
    <nav class="case-return-controls" :aria-label="t.ui.navigation">
      <button class="underlined-link return-previous" @click="goBack">
        <UiIcon name="left" />{{ copy.back }}
      </button>
      <NuxtLink class="underlined-link" to="/work"
        >{{ t.ui.all }}<UiIcon name="right"
      /></NuxtLink>
    </nav>
    <header class="case-header">
      <p class="eyebrow">
        {{ project.categories.map((id) => t.categories[id]).join(' / ') }}
      </p>
      <h1 class="inner-title-mask">
        <span class="inner-title-line">{{ project.title }}</span>
      </h1>
      <p class="case-deck inner-lead">{{ project.summary }}</p>
      <div class="case-metadata inner-lead">
        <div>
          <span>{{ t.ui.company }}</span>
          <p>{{ project.company }}</p>
        </div>
        <div v-if="project.period">
          <span>{{ t.ui.period }}</span>
          <p>{{ project.period }}</p>
        </div>
        <div>
          <span>{{ t.ui.role }}</span>
          <p>{{ project.role }}</p>
        </div>
        <div v-if="project.stack.length">
          <span>{{ t.ui.focus }}</span>
          <p>{{ project.stack.join(' / ') }}</p>
        </div>
      </div>
      <div class="case-header-actions">
        <span v-if="project.deployment === 'live'" class="project-status"
          ><span class="status-dot"></span>{{ t.ui.liveStatus
          }}<template v-if="project.requiresLogin">
            · {{ t.ui.login }}</template
          ></span
        ><a
          v-if="project.liveUrl"
          class="button button-dark"
          :href="project.liveUrl"
          target="_blank"
          rel="noopener noreferrer"
          >{{ t.ui.live }}<UiIcon name="external" /><span class="sr-only">{{
            t.ui.newTab
          }}</span></a
        >
      </div>
    </header>
    <div class="case-cover-window">
      <div class="case-cover-motion">
        <ProjectCover :project="project" eager />
      </div>
    </div>
    <p v-if="project.cover" class="case-art-caption">{{ t.ui.imageNote }}</p>
    <div class="case-content">
      <aside>
        <span class="eyebrow">{{ t.ui.overview }}</span>
        <p>{{ project.title }}</p>
      </aside>
      <div class="case-story">
        <section>
          <h2>{{ t.ui.background }}</h2>
          <p>{{ project.background }}</p>
        </section>
        <section v-if="project.audience">
          <h2>{{ t.ui.audience }}</h2>
          <p>{{ project.audience }}</p>
        </section>
        <section>
          <h2>{{ t.ui.contributions }}</h2>
          <ul>
            <li v-for="item in project.contributions" :key="item">
              {{ item }}
            </li>
          </ul>
          <p v-if="project.collaboration">{{ project.collaboration }}</p>
        </section>
        <section v-if="project.implementation?.length">
          <h2>{{ t.ui.implementation }}</h2>
          <div
            v-for="item in project.implementation"
            :key="item.title"
            class="implementation-item"
          >
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </section>
        <section v-if="project.outcomes?.length">
          <h2>{{ t.ui.outcomes }}</h2>
          <ul>
            <li v-for="item in project.outcomes" :key="item">{{ item }}</li>
          </ul>
        </section>
      </div>
    </div>
    <nav class="case-navigation" :aria-label="t.ui.workList">
      <NuxtLink
        v-if="previous"
        class="next-case previous-case"
        :to="'/work/' + previous.slug"
        ><span class="eyebrow"><UiIcon name="left" />{{ t.ui.previous }}</span
        ><strong>{{ previous.title }}</strong></NuxtLink
      ><span v-else></span
      ><NuxtLink v-if="next" class="next-case" :to="'/work/' + next.slug"
        ><span class="eyebrow">{{ t.ui.next }}<UiIcon name="right" /></span
        ><strong>{{ next.title }}</strong></NuxtLink
      ><NuxtLink v-else class="underlined-link" to="/work"
        >{{ t.ui.all }}<UiIcon name="right"
      /></NuxtLink>
    </nav>
  </main>
</template>
