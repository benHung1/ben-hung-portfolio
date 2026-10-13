<script setup lang="ts">
import type { ProjectCopy } from '~/data/projectCatalog';
defineProps<{ diagram: NonNullable<ProjectCopy['stateBoundaries']> }>();
</script>

<template>
  <figure
    class="state-boundaries"
    :class="{
      'state-boundaries-two': diagram.groups.length === 2,
      'state-boundaries-four': diagram.groups.length === 4,
    }"
  >
    <dl>
      <div v-for="group in diagram.groups" :key="group.title">
        <dt>{{ group.title }}</dt>
        <dd>{{ group.description }}</dd>
      </div>
    </dl>
    <figcaption v-if="diagram.caption">{{ diagram.caption }}</figcaption>
  </figure>
</template>

<style scoped lang="scss">
.state-boundaries {
  margin: 0;
  dl {
    display: grid;
    gap: 14px;
    margin: 0;
    > div {
      min-width: 0;
      padding: clamp(18px, 2vw, 26px);
      border: 1px solid var(--line);
      border-top: 3px solid var(--blue);
      border-radius: 18px;
      background: var(--paper);
    }
  }
  dt {
    color: var(--blue);
    font-weight: 600;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }
  dd {
    margin: 14px 0 0;
    color: var(--ink);
    font-size: 0.9375rem;
    line-height: 1.8;
  }
  figcaption {
    margin-top: 18px;
    font-size: 0.8125rem;
    line-height: 1.7;
    color: var(--muted);
  }
}
@media (min-width: 1200px) {
  .state-boundaries dl {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (min-width: 768px) {
  .state-boundaries.state-boundaries-two dl,
  .state-boundaries.state-boundaries-four dl {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
