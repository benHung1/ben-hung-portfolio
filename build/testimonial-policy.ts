import type {
  TestimonialRecord,
  TestimonialView,
} from '../app/types/testimonials';

/** Production must never serialize unapproved quotations or review metadata. */
export function prepareTestimonials(
  records: TestimonialRecord[],
  dev: boolean,
  requested: boolean,
) {
  const preview = dev && requested;
  const entries: TestimonialView[] = records
    .filter((entry) => preview || entry.approvedForPublic)
    .sort((a, b) => a.order - b.order)
    .map(({ source, approvedForPublic, ...entry }) => ({
      ...entry,
      ...(preview ? { review: { source, approvedForPublic } } : {}),
    }));
  return { preview, entries };
}
