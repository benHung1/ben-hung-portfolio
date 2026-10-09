<script setup lang="ts">
defineProps<{ word: string }>();
</script>
<template>
  <div class="inner-page-art" aria-hidden="true">
    <span class="inner-word">{{ word }}.</span><i class="inner-orbit"></i
    ><b></b>
  </div>
</template>
