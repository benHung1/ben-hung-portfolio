<script setup lang="ts">
import type { TestimonialView } from '~/types/testimonials';
const props = defineProps<{ avatar: TestimonialView['avatar'] }>();
const failed = ref(false);
watch(
  () => props.avatar.src,
  () => {
    failed.value = false;
  },
);
</script>
<template>
  <span class="testimonial-avatar" aria-hidden="true">
    <img
      v-if="!failed"
      :src="avatar.src"
      alt=""
      width="72"
      height="72"
      decoding="async"
      @error="failed = true"
    />
    <svg v-else viewBox="0 0 72 72" fill="none" class="avatar-fallback">
      <circle cx="36" cy="26" r="10" stroke="currentColor" stroke-width="2" />
      <path
        d="M16 60c0-24 40-24 40 0"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
  </span>
</template>
