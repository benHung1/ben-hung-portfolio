<script setup lang="ts">
import type { ProjectCopy } from '~/data/projectCatalog';

defineProps<{
  overview: NonNullable<ProjectCopy['architectureOverview']>;
}>();
</script>

<template>
  <section class="architecture-section">
    <h2>{{ overview.layers.title }}</h2>
    <CaseStateBoundaries :diagram="overview.layers" />
  </section>
  <section class="architecture-section">
    <h2>{{ overview.comparison.title }}</h2>
    <p>{{ overview.comparison.intro }}</p>
    <table class="architecture-comparison" role="table">
      <caption class="sr-only">
        {{
          overview.comparison.title
        }}
      </caption>
      <thead role="rowgroup">
        <tr role="row">
          <th
            v-for="column in overview.comparison.columns"
            :key="column"
            scope="col"
            role="columnheader"
          >
            {{ column }}
          </th>
        </tr>
      </thead>
      <tbody role="rowgroup">
        <tr
          v-for="row in overview.comparison.rows"
          :key="row.aspect"
          role="row"
        >
          <th scope="row" role="rowheader">{{ row.aspect }}</th>
          <td role="cell">
            <span class="comparison-label" aria-hidden="true">{{
              overview.comparison.columns[1]
            }}</span>
            <p>{{ row.company }}</p>
          </td>
          <td role="cell">
            <span class="comparison-label" aria-hidden="true">{{
              overview.comparison.columns[2]
            }}</span>
            <p>{{ row.typical }}</p>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
  <section class="architecture-section">
    <h2>{{ overview.tradeoffs.title }}</h2>
    <div class="architecture-tradeoffs">
      <div>
        <h3>{{ overview.tradeoffs.benefitsTitle }}</h3>
        <ul>
          <li v-for="benefit in overview.tradeoffs.benefits" :key="benefit">
            {{ benefit }}
          </li>
        </ul>
      </div>
      <div>
        <h3>{{ overview.tradeoffs.costsTitle }}</h3>
        <ul>
          <li v-for="cost in overview.tradeoffs.costs" :key="cost">
            {{ cost }}
          </li>
        </ul>
      </div>
    </div>
    <p class="architecture-judgment">{{ overview.tradeoffs.judgment }}</p>
  </section>
</template>

<style scoped lang="scss">
.architecture-section {
  min-width: 0;
}

.architecture-comparison {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  margin-top: 24px;
  text-align: left;

  th,
  td {
    padding: 18px 14px;
    border-bottom: 1px solid var(--line);
    vertical-align: top;
    overflow-wrap: anywhere;
  }

  th {
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.7;
  }

  thead {
    background: var(--surface);
  }

  thead th:first-child {
    width: 20%;
  }

  td p {
    margin: 0;
    font-size: 0.9375rem;
    line-height: 1.8;
  }
}

.comparison-label {
  display: none;
}

.architecture-tradeoffs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;

  > div {
    min-width: 0;
    padding: 22px;
    border: 1px solid var(--line);
    border-radius: 18px;
    background: var(--paper);
  }

  h3 {
    margin: 0 0 14px;
    color: var(--blue);
    font-size: 1rem;
    font-weight: 600;
  }

  li {
    font-size: 0.9375rem;
    line-height: 1.8;
    overflow-wrap: anywhere;
  }
}

.architecture-section .architecture-judgment {
  margin-top: 24px;
}

@media (max-width: 900px) {
  .architecture-comparison {
    display: block;

    thead {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }

    tbody {
      display: grid;
      gap: 20px;
    }

    tbody tr {
      display: grid;
      min-width: 0;
      border: 1px solid var(--line);
      border-radius: 16px;
      overflow: hidden;
    }

    tbody th {
      background: var(--surface);
    }

    td:last-child {
      border-bottom: 0;
    }
  }

  .comparison-label {
    display: block;
    margin-bottom: 8px;
    color: var(--blue);
    font-size: 0.8125rem;
    font-weight: 600;
  }
}

@media (max-width: 640px) {
  .architecture-tradeoffs {
    grid-template-columns: 1fr;
  }
}
</style>
