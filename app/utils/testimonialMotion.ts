import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function createTestimonialMotion(
  root: HTMLElement,
  manualStatic = false,
) {
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  let timeline: gsap.core.Timeline | undefined;
  let resize: ResizeObserver | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let disposed = false;
  const q = (selector: string) => root.querySelector<HTMLElement>(selector)!;
  const publish = (count: number) => {
    document.documentElement.dataset.testimonialTriggers = String(count);
  };
  function refresh() {
    clearTimeout(timer);
    if (disposed) return;
    timer = setTimeout(() => {
      if (disposed) return;
      timeline?.scrollTrigger?.refresh();
    }, 160);
  }
  function destroy() {
    if (disposed) return;
    disposed = true;
    clearTimeout(timer);
    resize?.disconnect();
    media.revert();
    publish(0);
    delete root.dataset.spreadProgress;
  }
  try {
    media.add(
      {
        small: '(max-width: 767px)',
        reduced: '(prefers-reduced-motion: reduce)',
        large: '(min-width: 768px)',
      },
      (context) => {
        if (context.conditions!.reduced || manualStatic) {
          publish(0);
          return;
        }
        const small = context.conditions!.small;
        timeline = gsap.timeline({
          defaults: { ease: 'none', duration: 1 },
          scrollTrigger: {
            id: 'testimonials-spread',
            trigger: q('.testimonial-spread'),
            start: 'clamp(top 95%)',
            end: 'clamp(top 55%)',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
          onUpdate: () => {
            root.dataset.spreadProgress = timeline!.progress().toFixed(4);
          },
        });
        timeline
          .fromTo(
            q('.testimonial-card-enter'),
            { y: small ? 22 : 46, rotation: small ? -1.2 : -3 },
            { y: 0, rotation: 0, duration: 0.7 },
            0,
          )
          .fromTo(
            q('.peek-0'),
            { x: -120, y: 35, rotation: -11 },
            { x: 0, y: 0, rotation: -4 },
            0,
          )
          .fromTo(
            q('.peek-1'),
            { x: -190, y: -25, rotation: 9 },
            { x: 0, y: 0, rotation: 4 },
            0,
          )
          .fromTo(
            q('.testimonials-quote-art'),
            { x: small ? -10 : -35, y: 30, rotation: -9 },
            { x: small ? 8 : 24, y: -25, rotation: 4 },
            0,
          );
        publish(1);
        return () => {
          timeline = undefined;
          publish(0);
        };
      },
      root,
    );
    resize = new ResizeObserver(refresh);
    resize.observe(root);
    void document.fonts?.ready.then(refresh);
    refresh();
  } catch {
    destroy();
  }
  return { destroy, refresh };
}
