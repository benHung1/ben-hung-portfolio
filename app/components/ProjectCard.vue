<script setup lang="ts">
import type { Project } from '~/data/projectCatalog';
const props = defineProps<{
  project: Project;
  index?: number;
  featured?: boolean;
}>();
const { projects } = useProjects();
const position = computed(
  () => projects.value.findIndex((p) => p.slug === props.project.slug) + 1,
);
const { t } = usePortfolio();
</script>
<template>
  <article
    class="project-card"
    :class="{ 'project-featured': featured }"
    :style="{ '--reveal-delay': ((index ?? 0) % 2) * 75 + 'ms' }"
    :data-project="project.slug"
  >
    <NuxtLink
      :to="'/work/' + project.slug"
      class="project-cover-link"
      data-cursor="view"
      tabindex="-1"
      aria-hidden="true"
      ><ProjectCover :project="project" :eager="featured"
    /></NuxtLink>
    <div class="project-card-info">
      <span class="project-number" aria-hidden="true">{{
        String(position).padStart(2, '0')
      }}</span>
      <div class="project-card-copy">
        <div class="project-category">
          <span>{{ t.categories[project.categories[0]!] }}</span
          ><span>{{ project.company }}</span>
        </div>
        <h3>
          <NuxtLink class="project-title-link" :to="'/work/' + project.slug"
            >{{ project.title }}<UiIcon name="right"
          /></NuxtLink>
        </h3>
        <p class="project-role">{{ project.role }}</p>
        <p class="project-summary">{{ project.summary }}</p>
        <ul v-if="project.stack.length" class="tags" :aria-label="t.ui.stack">
          <li v-for="tag in project.stack" :key="tag">{{ tag }}</li>
        </ul>
        <div class="project-status" v-if="project.deployment === 'live'">
          <span class="status-dot"></span>{{ t.ui.liveStatus
          }}<template v-if="project.requiresLogin">
            · {{ t.ui.login }}</template
          >
        </div>
        <div class="card-actions">
          <NuxtLink class="case-link" :to="'/work/' + project.slug"
            >{{ t.ui.view }}<UiIcon name="right"
          /></NuxtLink>
          <a
            v-if="project.liveUrl"
            class="live-link"
            :href="project.liveUrl"
            target="_blank"
            rel="noopener noreferrer"
            >{{ t.ui.live }}<UiIcon name="external" /><span class="sr-only">{{
              t.ui.newTab
            }}</span></a
          >
        </div>
      </div>
    </div>
  </article>
</template>
