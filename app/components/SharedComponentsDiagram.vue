<script setup lang="ts">
import type { IntegrationDiagram } from '~/data/projectCatalog';
defineProps<{ diagram: IntegrationDiagram }>();
</script>

<template>
  <figure class="integration-diagram">
    <div class="integration-flow">
      <div class="integration-node integration-source">
        <span class="integration-step" aria-hidden="true">01</span>
        <strong>{{ diagram.sourceLabel }}</strong>
        <span class="integration-note">{{ diagram.sourceNote }}</span>
      </div>
      <UiIcon class="integration-arrow" name="right" />
      <div class="integration-node integration-shared">
        <span class="integration-step" aria-hidden="true">02</span>
        <strong>{{ diagram.sharedLabel }}</strong>
        <ul>
          <li v-for="component in diagram.components" :key="component">
            {{ component }}
          </li>
        </ul>
      </div>
      <UiIcon class="integration-arrow" name="right" />
      <div class="integration-node integration-targets">
        <span class="integration-step" aria-hidden="true">03</span>
        <strong>{{ diagram.targetsLabel }}</strong>
        <ul>
          <li v-for="target in diagram.targets" :key="target">
            {{ target }}
          </li>
        </ul>
      </div>
    </div>
    <figcaption>{{ diagram.caption }}</figcaption>
  </figure>
</template>

<style scoped lang="scss">
.integration-diagram {
  margin: 1.5rem 0 0;
  padding: clamp(16px, 2vw, 28px);
  border: 1px solid var(--line);
  border-radius: 24px;
  background: var(--paper);
  .integration-flow {
    display: grid;
    grid-template-columns: minmax(0, 0.85fr) 20px minmax(0, 1.2fr) 20px minmax(
        0,
        1fr
      );
    gap: 12px;
    align-items: center;
  }
  .integration-node {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
    strong {
      font-size: 1rem;
      line-height: 1.5;
      overflow-wrap: anywhere;
    }
  }
  .integration-shared {
    padding: 16px;
    border: 1px solid color-mix(in srgb, var(--blue) 50%, var(--line));
    border-radius: 18px;
    background: color-mix(in srgb, var(--blue) 7%, var(--paper));
  }
  .integration-step {
    font-family: var(--mono);
    font-size: 0.75rem;
    color: var(--blue);
  }
  ul {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 0;
    margin: 0;
    list-style: none;
  }
  li {
    padding: 7px 10px;
    border: 1px solid var(--line);
    border-radius: 10px;
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.5;
    background: var(--paper);
    overflow-wrap: anywhere;
  }
  .integration-note,
  figcaption {
    font-size: 0.875rem;
    line-height: 1.7;
    color: var(--muted);
  }
  figcaption {
    margin-top: 24px;
  }
  .integration-arrow {
    width: 20px;
    height: 20px;
    color: var(--blue);
  }
}
@media (max-width: 800px) {
  .integration-diagram {
    .integration-flow {
      grid-template-columns: 1fr;
      gap: 16px;
    }
    .integration-arrow {
      justify-self: center;
      transform: rotate(90deg);
    }
    .integration-source {
      text-align: center;
    }
    .integration-targets ul {
      flex-direction: row;
      flex-wrap: wrap;
    }
    .integration-targets li {
      flex: 1 1 90px;
    }
  }
}
</style>
