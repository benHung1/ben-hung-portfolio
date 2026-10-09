<script setup lang="ts">
const { t } = usePortfolio();
</script>
<template>
  <div class="experience-timeline">
    <p class="eyebrow timeline-label">{{ t.ui.experience }}</p>
    <ol class="timeline-track">
      <li v-for="(experience, index) in t.experiences" :key="index">
        <span class="timeline-node" aria-hidden="true"></span>
        <span class="timeline-period" :class="{ 'is-current': index === 0 }">{{
          experience.period
        }}</span>
        <h3>
          {{ experience.company }} <span>{{ experience.context }}</span>
        </h3>
        <p class="timeline-role">{{ experience.role }}</p>
        <p class="timeline-description">{{ experience.description }}</p>
        <p v-if="experience.note" class="timeline-note">
          {{ experience.note }}
        </p>
      </li>
    </ol>
  </div>
</template>
