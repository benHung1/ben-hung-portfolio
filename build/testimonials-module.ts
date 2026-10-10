import { addTemplate, defineNuxtModule, extendPages } from '@nuxt/kit';
import { fileURLToPath } from 'node:url';
import { testimonialRecords } from '../content/testimonials';
import { prepareTestimonials } from './testimonial-policy';

export default defineNuxtModule({
  meta: { name: 'portfolio-testimonials' },
  setup(_options, nuxt) {
    const { preview, entries: reviewEntries } = prepareTestimonials(
      testimonialRecords,
      nuxt.options.dev,
      process.env.PORTFOLIO_TESTIMONIAL_PREVIEW === '1',
    );
    const { entries } = prepareTestimonials(testimonialRecords, false, false);
    const template = addTemplate({
      filename: 'testimonial-content.ts',
      write: true,
      getContents: () =>
        [
          "import type { TestimonialView } from '~/types/testimonials';",
          `export const testimonials: TestimonialView[] = ${JSON.stringify(entries)};`,
        ].join('\n'),
    });
    nuxt.options.alias['#testimonial-content'] = template.dst;
    const review = addTemplate({
      filename: 'testimonial-review.ts',
      write: true,
      getContents: () =>
        `import type { TestimonialView } from '~/types/testimonials';\nexport const reviewTestimonials: TestimonialView[] = ${JSON.stringify(preview ? reviewEntries : [])};`,
    });
    nuxt.options.alias['#testimonial-review'] = review.dst;
    if (preview) {
      extendPages((pages) => {
        pages.push({
          name: 'testimonial-development-review',
          path: '/dev/testimonials',
          file: fileURLToPath(
            new URL('../app/dev-pages/testimonials.vue', import.meta.url),
          ),
        });
      });
      (nuxt.options.app.head.meta ??= []).push({
        name: 'robots',
        content: 'noindex, nofollow',
      });
    }
  },
});
