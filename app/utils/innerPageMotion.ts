import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
export function createInnerPageMotion(
  host: HTMLElement,
  kind: 'work' | 'case',
  reduced = false,
  entrance = true,
) {
  gsap.registerPlugin(ScrollTrigger);
  let disposed = false,
    timer: ReturnType<typeof setTimeout> | undefined;
  const media = gsap.matchMedia();
  const cardContexts = new Map<HTMLElement, gsap.Context>();
  const all = (selector: string) => [
    ...host.querySelectorAll<HTMLElement>(selector),
  ];
  const own: gsap.core.Timeline[] = [];
  const count = () => {
    document.documentElement.dataset.innerTriggers = String(
      ScrollTrigger.getAll().filter((t) => t.vars.id?.startsWith('inner-'))
        .length,
    );
  };
  let staticMode = reduced;
  function cards() {
    if (disposed || staticMode || kind !== 'work') return;
    for (const [el, ctx] of cardContexts)
      if (!host.contains(el)) {
        ctx.revert();
        cardContexts.delete(el);
      }
    all('.project-card').forEach((el, index) => {
      if (cardContexts.has(el)) return;
      const ctx = gsap.context(() => {
        gsap
          .timeline({
            scrollTrigger: {
              id: `inner-card-${el.dataset.project}`,
              trigger: el,
              start: 'top 94%',
              once: true,
            },
            onComplete: count,
          })
          .fromTo(
            el.querySelector('.project-cover-link'),
            { clipPath: 'inset(0 0 24% 0 round 22px)', y: 26 },
            {
              clipPath: 'inset(0 0 0% 0 round 22px)',
              y: 0,
              duration: 0.65,
              delay: (index % 2) * 0.07,
              ease: 'power2.out',
              clearProps: 'clipPath,transform',
            },
            0,
          )
          .fromTo(
            el.querySelector('.project-card-info'),
            { opacity: 0.35, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.45,
              clearProps: 'opacity,transform',
            },
            0.08,
          );
      }, el);
      cardContexts.set(el, ctx);
    });
    count();
  }
  function refresh() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (disposed) return;
      cards();
      own.forEach((t) => t.scrollTrigger?.refresh());
      count();
    }, 180);
  }
  media.add(
    {
      reduce: '(prefers-reduced-motion: reduce)',
      small: '(max-width: 767px)',
      large: '(min-width: 768px)',
    },
    (context) => {
      staticMode = Boolean(context.conditions!.reduce || reduced);
      host.dataset.innerMotion = staticMode ? 'static' : 'gsap';
      host.dataset.entrance = 'ready';
      if (staticMode) {
        count();
        return;
      }
      const small = Boolean(context.conditions!.small);
      const art = host.querySelector('.inner-page-art');
      const timeline = gsap.timeline({
        defaults: { ease: 'none', duration: 1 },
        scrollTrigger: {
          id: `inner-${kind}-background`,
          trigger: host,
          start: 'clamp(top top)',
          end: 'clamp(bottom bottom)',
          scrub: 0.65,
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          host.dataset.innerProgress = timeline.progress().toFixed(4);
        },
      });
      timeline
        .fromTo(
          art?.querySelector('.inner-word') || [],
          { xPercent: 12, y: 0 },
          { xPercent: small ? -16 : -34, y: small ? 60 : 170 },
          0,
        )
        .fromTo(
          art?.querySelector('.inner-orbit') || [],
          { rotation: -20, xPercent: -10 },
          { rotation: 65, xPercent: 35 },
          0,
        );
      own.push(timeline);
      if (entrance) {
        host.dataset.entrance = 'playing';
        gsap
          .timeline({
            onComplete: () => {
              host.dataset.entrance = 'ready';
            },
          })
          .fromTo(
            all('.inner-title-line'),
            { yPercent: 105, rotation: 3 },
            {
              yPercent: 0,
              rotation: 0,
              duration: 0.65,
              stagger: 0.085,
              ease: 'power3.out',
              clearProps: 'transform',
            },
          )
          .fromTo(
            all('.inner-lead'),
            { y: 20, opacity: 0.25 },
            {
              y: 0,
              opacity: 1,
              duration: 0.45,
              stagger: 0.07,
              clearProps: 'transform,opacity',
            },
            0.16,
          );
      }
      if (kind === 'case') {
        const cover = host.querySelector<HTMLElement>('.case-cover-window')!;
        own.push(
          gsap
            .timeline({
              scrollTrigger: {
                id: 'inner-case-cover',
                trigger: cover,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.65,
              },
            })
            .fromTo(
              cover.querySelector('.case-cover-motion'),
              { scale: 1.045, yPercent: -2 },
              { scale: 1, yPercent: 2, ease: 'none' },
            ),
        );
        if (entrance)
          gsap.fromTo(
            cover,
            { clipPath: 'inset(0 0 15% 0 round 28px)' },
            {
              clipPath: 'inset(0 0 0% 0 round 28px)',
              duration: 0.8,
              delay: 0.24,
              clearProps: 'clipPath',
            },
          );
        all('.case-story > section').forEach((section, index) => {
          own.push(
            gsap
              .timeline({
                scrollTrigger: {
                  id: `inner-case-line-${index}`,
                  trigger: section,
                  start: 'top 92%',
                  end: 'top 50%',
                  scrub: 0.6,
                },
              })
              .fromTo(
                section,
                { '--chapter-progress': 0 },
                { '--chapter-progress': 1, ease: 'none' },
              ),
          );
          gsap.fromTo(
            section.querySelector('h2'),
            { x: -12, opacity: 0.4 },
            {
              x: 0,
              opacity: 1,
              duration: 0.5,
              clearProps: 'transform,opacity',
              scrollTrigger: {
                id: `inner-case-heading-${index}`,
                trigger: section,
                start: 'top 90%',
                once: true,
              },
            },
          );
        });
      }
      cards();
      count();
      return () => {
        cardContexts.forEach((ctx) => ctx.revert());
        cardContexts.clear();
        own.length = 0;
      };
    },
    host,
  );
  const resize = new ResizeObserver(refresh);
  resize.observe(host);
  host.addEventListener('load', refresh, true);
  void document.fonts?.ready.then(refresh);
  return {
    refresh,
    destroy() {
      disposed = true;
      clearTimeout(timer);
      resize.disconnect();
      host.removeEventListener('load', refresh, true);
      cardContexts.forEach((ctx) => ctx.revert());
      cardContexts.clear();
      media.revert();
      count();
    },
  };
}
