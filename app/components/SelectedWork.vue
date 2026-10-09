<script setup lang="ts">
const { projects } = useProjects();
const { t } = usePortfolio();
const activeSlug = ref(projects.value[0]!.slug);
const active = computed(
  () =>
    projects.value.find((p) => p.slug === activeSlug.value) ||
    projects.value[0]!,
);
const activeIndex = computed(
  () => projects.value.findIndex((p) => p.slug === active.value.slug) + 1,
);
</script>
<template>
  <section
    id="selected-work"
    class="section shell selected-work"
    aria-labelledby="selected-heading"
    data-scene="work"
  >
    <div class="work-reveal-art" aria-hidden="true" data-scene="reveal">
      <div class="work-wash"></div>
    </div>
    <div class="work-scroll-art" aria-hidden="true">
      <span class="work-word">SELECTED<br />WORK.</span
      ><i class="work-outline"></i><b class="work-accent"></b>
    </div>
    <div class="section-top">
      <span class="eyebrow">{{ t.selected.eyebrow }}</span
      ><span class="collection-count"
        ><b>{{ String(projects.length).padStart(2, '0') }}</b>
        {{ t.selected.count }}</span
      >
    </div>
    <div class="section-heading" v-reveal>
      <h2 id="selected-heading">
        {{ t.selected.title }}<span class="blue">.</span>
      </h2>
      <NuxtLink class="underlined-link" to="/work"
        >{{ t.ui.all }}<UiIcon name="right"
      /></NuxtLink>
    </div>
    <div class="project-index-layout">
      <div class="project-preview">
        <div class="preview-stage">
          <Transition name="preview-swap">
            <NuxtLink
              :key="active.slug"
              :to="'/work/' + active.slug"
              class="preview-image-link"
              data-cursor="view"
              :aria-label="active.title + ' — ' + t.ui.view"
            >
              <ProjectCover :project="active" eager />
              <span class="preview-open"><UiIcon name="right" /></span>
            </NuxtLink>
          </Transition>
        </div>
        <div class="preview-caption">
          <span class="preview-number">{{
            String(activeIndex).padStart(2, '0')
          }}</span>
          <div>
            <p class="eyebrow">{{ active.company }}</p>
            <NuxtLink :to="'/work/' + active.slug"
              >{{ active.title }}<UiIcon name="right"
            /></NuxtLink>
          </div>
        </div>
        <p class="preview-hint">{{ t.selected.preview }}</p>
      </div>
      <ol class="project-index" :aria-label="t.ui.workList">
        <li
          v-for="(project, index) in projects"
          :key="project.slug"
          v-reveal
          class="project-index-row"
          :class="{ 'is-active': activeSlug === project.slug }"
          :data-project="project.slug"
          @pointerenter="activeSlug = project.slug"
          @focusin="activeSlug = project.slug"
        >
          <NuxtLink
            :to="'/work/' + project.slug"
            class="mobile-project-image"
            data-cursor="view"
            tabindex="-1"
            aria-hidden="true"
            ><ProjectCover :project="project"
          /></NuxtLink>
          <div class="project-index-meta">
            <span>{{ String(index + 1).padStart(2, '0') }}</span
            ><span>{{ project.company }}</span
            ><span class="project-type">{{
              t.categories[project.categories[0]!]
            }}</span>
          </div>
          <h3>
            <NuxtLink :to="'/work/' + project.slug"
              >{{ project.title }}<UiIcon name="right"
            /></NuxtLink>
          </h3>
          <div class="project-index-actions">
            <NuxtLink :to="'/work/' + project.slug" class="index-case-link"
              >{{ t.ui.view }}<UiIcon name="right"
            /></NuxtLink>
            <a
              v-if="project.liveUrl"
              :href="project.liveUrl"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="
                project.title + ' — ' + t.ui.live + ' (' + t.ui.newTab + ')'
              "
              >{{ t.ui.live }}<UiIcon name="external"
            /></a>
            <span v-if="project.requiresLogin" class="index-login">{{
              t.ui.login
            }}</span>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>
