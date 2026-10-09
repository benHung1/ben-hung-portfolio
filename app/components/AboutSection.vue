<script setup lang="ts">
const { t } = usePortfolio();
</script>
<template>
  <section
    id="about"
    class="section about-section shell"
    aria-labelledby="about-heading"
    data-scene="about"
  >
    <div class="about-scroll-art" aria-hidden="true">
      <svg viewBox="0 0 1200 1000" preserveAspectRatio="none" focusable="false">
        <path
          class="about-route-track"
          d="M-80 110 C280 -80 690 40 670 290 S10 490 95 690 S480 850 710 750 S1100 800 1270 1010"
        />
        <path
          class="about-route-draw"
          pathLength="1000"
          d="M-80 110 C280 -80 690 40 670 290 S10 490 95 690 S480 850 710 750 S1100 800 1270 1010"
        />
      </svg>
    </div>
    <div class="about-copy">
      <p class="eyebrow">{{ t.about.eyebrow }}</p>
      <h2 id="about-heading" v-reveal class="reveal-heading">
        {{ t.about.title[0] }}<br /><span class="serif blue">{{
          t.about.title[1]
        }}</span>
      </h2>
      <p class="about-intro" v-reveal>{{ t.about.intro }}</p>
      <p
        v-for="(p, index) in t.about.paragraphs"
        :key="index"
        v-reveal
        :style="{ '--reveal-delay': index * 80 + 'ms' }"
      >
        {{ p }}
      </p>
      <div class="about-signature">
        Ben Hung<span>{{ t.name }} / {{ t.hero.eyebrow }}</span>
      </div>
    </div>
    <ExperienceTimeline />
  </section>
</template>
