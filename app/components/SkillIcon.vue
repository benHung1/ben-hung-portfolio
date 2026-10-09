<script setup lang="ts">
defineProps<{ id: string; symbol: string }>();
</script>
<template>
  <svg
    viewBox="0 0 40 40"
    class="skill-icon"
    aria-hidden="true"
    focusable="false"
  >
    <template v-if="id === 'vue'">
      <path d="M2 6h9l9 16 9-16h9L20 37Z" fill="currentColor" />
      <path d="M11 6h6l3 5 3-5h6l-9 16Z" fill="var(--ink)" />
    </template>
    <path
      v-else-if="id === 'nuxt'"
      d="m3 32 13-23 8 14 5-9 10 18H3m13-1h15l-8-13"
      fill="none"
      stroke="currentColor"
      stroke-width="4"
      stroke-linejoin="round"
    />
    <g
      v-else-if="id === 'git'"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
    >
      <rect
        x="7"
        y="7"
        width="26"
        height="26"
        rx="3"
        transform="rotate(45 20 20)"
      />
      <path d="M14 6v13l12 9M14 19h12" />
      <circle cx="14" cy="19" r="3" fill="currentColor" />
      <circle cx="26" cy="28" r="3" fill="currentColor" />
    </g>
    <g
      v-else-if="id === 'pinia'"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
    >
      <path d="m14 11-3-7 9 4 6-6 1 9" />
      <rect x="9" y="11" width="23" height="26" rx="11" />
      <path d="m12 18 15 15m-17-6 17-13M12 32l17-14M15 12l17 16" />
    </g>
    <template v-else-if="id === 'html' || id === 'css'">
      <path d="m5 3 3 30 12 5 12-5 3-30Z" fill="currentColor" />
      <text
        x="20"
        y="29"
        text-anchor="middle"
        fill="#fff"
        font-size="25"
        font-family="Arial"
        font-weight="700"
      >
        {{ symbol }}
      </text>
    </template>
    <template v-else-if="id === 'wc'">
      <path
        d="m20 2 17 9v18l-17 9-17-9V11Z"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
      />
      <path
        d="m13 14-6 6 6 6m14-12 6 6-6 6m-5-15-5 18"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      />
    </template>
    <path
      v-else-if="id === 'tailwind'"
      d="M20 7C12 7 8 11 6 19c3-4 6-6 10-5 2 1 4 3 6 5 4 4 12 4 16-7-3 4-6 5-9 4-4-1-5-9-9-9ZM10 21C2 21 0 27 0 33c3-4 6-6 10-5 3 1 4 4 7 5 8 4 15 0 17-7-3 4-6 5-9 4-5-1-7-9-15-9Z"
      fill="currentColor"
    />
    <g
      v-else-if="id === 'websocket'"
      fill="none"
      stroke="currentColor"
      stroke-width="2.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M5 13h28l-6-6m8 20H7l6 6" />
      <circle cx="6" cy="27" r="3" />
      <circle cx="34" cy="13" r="3" />
    </g>
    <g
      v-else-if="id === 'gsap'"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
    >
      <path d="M4 31h32M6 25C15 25 12 8 21 8s6 16 13 16" />
      <circle cx="6" cy="25" r="3" fill="var(--paper)" />
      <circle cx="21" cy="8" r="3" fill="var(--paper)" />
      <circle cx="34" cy="24" r="3" fill="var(--paper)" />
    </g>
    <template v-else>
      <rect x="2" y="2" width="36" height="36" rx="5" fill="currentColor" />
      <text
        x="20"
        y="28"
        text-anchor="middle"
        :fill="id === 'js' ? '#20211f' : '#fff'"
        font-size="21"
        font-family="Arial"
        font-weight="700"
      >
        {{ symbol }}
      </text>
    </template>
  </svg>
</template>
