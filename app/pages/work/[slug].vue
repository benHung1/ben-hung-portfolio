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
const related = computed(() =>
  projects.value.filter((item) =>
    project.value.relatedSlugs?.includes(item.slug),
  ),
);
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
      <ul
        v-if="project.highlights?.length"
        class="case-highlights case-header-grid"
        :aria-label="t.ui.contributions"
      >
        <li v-for="(item, highlightIndex) in project.highlights" :key="item">
          <span aria-hidden="true">{{
            String(highlightIndex + 1).padStart(2, '0')
          }}</span>
          <p>{{ item }}</p>
        </li>
      </ul>
      <div class="case-metadata case-header-grid inner-lead">
        <div>
          <span>{{ t.ui.company }}</span>
          <p>{{ project.company }}</p>
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
            · {{ project.loginLabel || t.ui.login }}</template
          ></span
        ><a
          v-if="project.liveUrl"
          class="button button-dark"
          :href="project.liveUrl"
          target="_blank"
          rel="noopener noreferrer"
          >{{ project.liveLabel || t.ui.live }}<UiIcon name="external" /><span
            class="sr-only"
            >{{ t.ui.newTab }}</span
          ></a
        >
      </div>
    </header>
    <div class="case-cover-window">
      <div class="case-cover-motion">
        <ProjectCover :project="project" eager />
      </div>
    </div>
    <p v-if="project.cover" class="case-art-caption">
      {{ project.coverNote || t.ui.imageNote }}
    </p>
    <div class="case-content">
      <aside class="case-art-rail" aria-hidden="true">
        <CaseMotionArt :project-slug="project.slug" />
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
        <section v-if="project.challenge">
          <h2>{{ t.ui.challenge }}</h2>
          <p>{{ project.challenge }}</p>
        </section>
        <CaseArchitectureOverview
          v-if="
            project.architectureOverview &&
            project.slug !== 'enterprise-framework'
          "
          :overview="project.architectureOverview"
        />
        <section>
          <h2>{{ t.ui.contributions }}</h2>
          <ul>
            <li v-for="item in project.contributions" :key="item">
              {{ item }}
            </li>
          </ul>
          <p v-if="project.collaboration">{{ project.collaboration }}</p>
          <div
            v-if="project.contributionDetails"
            class="case-contribution-details"
          >
            <h3>{{ project.contributionDetails.title }}</h3>
            <CaseStateBoundaries :diagram="project.contributionDetails" />
          </div>
        </section>
        <CaseArchitectureOverview
          v-if="
            project.architectureOverview &&
            project.slug === 'enterprise-framework'
          "
          :overview="project.architectureOverview"
        />
        <section v-if="project.integrationDiagram">
          <h2>{{ project.integrationDiagram.title }}</h2>
          <SharedComponentsDiagram :diagram="project.integrationDiagram" />
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
        <section v-if="project.decisionFlow">
          <h2>{{ project.decisionFlow.title }}</h2>
          <CaseDecisionFlow :flow="project.decisionFlow" />
        </section>
        <section v-if="project.stateBoundaries">
          <h2>{{ project.stateBoundaries.title }}</h2>
          <CaseStateBoundaries :diagram="project.stateBoundaries" />
        </section>
        <section v-if="project.engineeringValue">
          <h2>{{ t.ui.engineeringValue }}</h2>
          <p>{{ project.engineeringValue }}</p>
        </section>
        <section v-if="project.outcomes?.length">
          <h2>{{ t.ui.outcomes }}</h2>
          <ul>
            <li v-for="item in project.outcomes" :key="item">{{ item }}</li>
          </ul>
        </section>
        <section v-if="related.length">
          <h2>{{ t.ui.related }}</h2>
          <p v-if="project.relatedNote">{{ project.relatedNote }}</p>
          <div class="case-related-links">
            <NuxtLink
              v-for="item in related"
              :key="item.slug"
              class="underlined-link case-related"
              :to="'/work/' + item.slug"
            >
              <span>{{ item.title }}</span
              ><UiIcon name="right" />
            </NuxtLink>
          </div>
        </section>
      </div>
    </div>
    <nav class="case-navigation" :aria-label="t.ui.workList">
      <NuxtLink
        v-if="previous"
        class="next-case previous-case"
        :to="'/work/' + previous.slug"
        ><span class="eyebrow case-nav-label"
          ><UiIcon name="left" /><span>{{ t.ui.previous }}</span></span
        ><strong>{{ previous.title }}</strong></NuxtLink
      ><span v-else></span
      ><NuxtLink v-if="next" class="next-case" :to="'/work/' + next.slug"
        ><span class="eyebrow case-nav-label"
          ><span>{{ t.ui.next }}</span
          ><UiIcon name="right" /></span
        ><strong>{{ next.title }}</strong></NuxtLink
      ><NuxtLink v-else class="underlined-link" to="/work"
        >{{ t.ui.all }}<UiIcon name="right"
      /></NuxtLink>
    </nav>
  </main>
</template>

<style scoped lang="scss">
.case-contribution-details {
  margin-top: 32px;

  > h3 {
    margin: 0 0 20px;
    font-size: 1.0625rem;
    font-weight: 500;
    line-height: 1.5;
  }
}

.case-header-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  align-items: start;

  > * {
    min-width: 0;
  }
}

.case-highlights {
  list-style: none;
  padding: 24px 0 0;
  margin: 28px 0 0;
  border-top: 1px solid var(--line);

  span {
    color: var(--blue);
    font-family: var(--mono);
    font-size: 0.75rem;
  }

  p {
    margin: 10px 0 0;
    font-size: 0.95rem;
    line-height: 1.7;
    overflow-wrap: anywhere;
  }
}

@media (max-width: 767px) {
  .case-header-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .case-highlights {
    li {
      display: grid;
      grid-template-columns: 24px minmax(0, 1fr);
      gap: 12px;
      align-items: baseline;
    }

    p {
      margin: 0;
    }
  }
}
</style>
