<script setup lang="ts">
import type { ProjectCopy } from '~/data/projectCatalog';
defineProps<{ flow: NonNullable<ProjectCopy['decisionFlow']> }>();
</script>
<template>
  <figure class="case-decision-flow">
    <ol>
      <li v-for="(step, index) in flow.steps" :key="step.title">
        <span aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
        <div>
          <h3>{{ step.title }}</h3>
          <p>{{ step.detail }}</p>
        </div>
      </li>
    </ol>
    <figcaption>{{ flow.caption }}</figcaption>
  </figure>
</template>
<style scoped lang="scss">
.case-decision-flow {
  margin: 0;
  ol {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  li {
    display: grid;
    grid-template-columns: 32px minmax(0, 1fr);
    gap: 16px;
    padding: 20px 0;
    border-top: 1px solid var(--line);
    > span {
      color: var(--blue);
      font: 13px/1.8 var(--mono);
    }
  }
  h3 {
    margin: 0 0 8px;
    overflow-wrap: anywhere;
  }
  p {
    margin: 0;
  }
  figcaption {
    color: var(--muted);
    font-size: 0.8125rem;
    line-height: 1.7;
    margin-top: 14px;
  }
}
</style>
