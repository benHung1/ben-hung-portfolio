<script setup lang="ts">
defineProps<{
  name:
    | 'left'
    | 'right'
    | 'external'
    | 'mail'
    | 'sun'
    | 'moon'
    | 'globe'
    | 'menu'
    | 'close'
    | 'shuffle'
    | 'reset';
  // Interface icons share the same stroke and viewBox.
}>();
const paths = {
  reset: ['M3 10a9 9 0 1 1 2 8M3 3v7h7'],
  left: ['M19 12H5m7-7-7 7 7 7'],
  right: ['M5 12h14m-7-7 7 7-7 7'],
  external: [
    'M14 3h7v7m0-7L10 14',
    'M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5',
  ],
  mail: [
    'M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z',
    'm3 6 9 7 9-7',
  ],
  sun: [
    'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z',
    'M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5',
  ],
  moon: ['M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z'],
  globe: [
    'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z',
    'M2 12h20M12 2c5 5 5 15 0 20-5-5-5-15 0-20Z',
  ],
  menu: ['M4 7h16M4 17h16'],
  close: ['m6 6 12 12M18 6 6 18'],
  shuffle: [
    'M3 6h3c5 0 7 12 12 12h3m-4-4 4 4-4 4',
    'M3 18h3c1.5 0 2.5-1 3.5-2.5M14.5 8.5C15.5 7 16.5 6 18 6h3m-4-4 4 4-4 4',
  ],
};
</script>
<template>
  <svg
    class="ui-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path v-for="(d, i) in paths[name]" :key="i" :d="d" />
  </svg>
</template>
