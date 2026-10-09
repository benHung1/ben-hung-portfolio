<script setup lang="ts">
import type { Project } from '~/data/projectCatalog';
const props = defineProps<{ project: Project; eager?: boolean }>();
const { t } = usePortfolio();
const { projects } = useProjects();
const position = computed(
  () => projects.value.findIndex((p) => p.slug === props.project.slug) + 1,
);
const failed = ref(false);
</script>
<template>
  <div
    class="project-cover real-cover"
    :class="{ 'text-cover': !project.cover || failed }"
    :style="{ background: project.cover?.background }"
  >
    <img
      v-if="project.cover && !failed"
      :src="project.cover.src"
      :alt="project.title + ' — ' + t.ui.image"
      :loading="eager ? 'eager' : 'lazy'"
      decoding="async"
      width="1440"
      height="900"
      :style="{
        objectFit: project.cover.fit || 'cover',
        objectPosition: project.cover.position,
      }"
      @error="failed = true"
    />
    <template v-else
      ><span class="eyebrow">{{ project.company }}</span
      ><strong>{{ project.title }}</strong
      ><span class="text-cover-index">{{
        String(position).padStart(2, '0')
      }}</span></template
    >
  </div>
</template>
