<script setup lang="ts">
import { playgroundCopy } from '~/data/playground';
import { motionCopy } from '~/data/motion';
const { t, email, locale } = usePortfolio();
const copy = computed(() => playgroundCopy[locale.value]);
const motion = computed(() => motionCopy[locale.value]);
</script>
<template>
  <section
    id="contact"
    class="section contact-section shell contact-editorial"
    aria-labelledby="contact-heading"
    data-scene="contact"
  >
    <div class="contact-backdrop" aria-hidden="true">
      <span class="contact-word">HELLO.</span><i class="contact-arc"></i
      ><b class="contact-accent"></b>
    </div>
    <div class="contact-copy">
      <p class="eyebrow">{{ t.contact.eyebrow }}</p>
      <h2 id="contact-heading" v-reveal class="reveal-heading">
        {{ t.contact.title[0] }}<br /><span class="serif blue">{{
          t.contact.title[1]
        }}</span>
      </h2>
      <p class="contact-summary">{{ motion.contactSummary }}</p>
      <div class="contact-links">
        <span class="eyebrow">{{ t.contact.hello }}</span>
        <a class="contact-email" :href="'mailto:' + email"
          ><UiIcon name="mail" /><span>{{ email }}</span></a
        >
        <ResumeProfiles />
      </div>
      <div class="contact-conditions">
        <p v-for="paragraph in t.contact.interests" :key="paragraph">
          {{ paragraph }}
        </p>
        <p class="hiring-note">
          <UiIcon name="mail" /><span
            >{{ t.contact.preference.before
            }}<strong>{{ t.contact.preference.employment }}</strong
            >{{ t.contact.preference.middle
            }}<strong>{{ t.contact.preference.decline }}</strong
            >{{ t.contact.preference.after }}</span
          >
        </p>
      </div>
    </div>
    <div class="person-card-position">
      <figure class="person-card">
        <div class="portrait-frame portrait-perspective">
          <div class="portrait-flip">
            <div class="portrait-face portrait-front">
              <img
                src="/images/ben-hung.jpg"
                :alt="t.contact.portrait"
                width="989"
                height="1055"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div class="portrait-face portrait-back" aria-hidden="true">
              <span>BH.</span><small>BEN HUNG</small>
            </div>
          </div>
        </div>
        <figcaption>
          <span class="person-name">Ben Hung<span class="blue">.</span></span>
          <span class="person-role">{{ motion.role }}</span>
          <span class="person-note">{{ copy.portraitCaption }}</span>
        </figcaption>
      </figure>
    </div>
  </section>
</template>
