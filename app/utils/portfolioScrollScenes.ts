import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { WeatherApi } from './weatherCanvas';

/** Owns six scroll scenes and the weather parameter timeline. Pointer/physics layers stay independent. */
export function createPortfolioScrollScenes(
  host: HTMLElement,
  options: { weather?: WeatherApi; manualStatic?: boolean } = {},
) {
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  let timelines: gsap.core.Timeline[] = [];
  let disposed = false;
  let refreshTimer: ReturnType<typeof setTimeout> | undefined;
  let resize: ResizeObserver | undefined;
  const q = <T extends Element = HTMLElement>(selector: string) =>
    host.querySelector<T>(selector)!;
  const all = (selector: string) => [
    ...host.querySelectorAll<HTMLElement>(selector),
  ];
  const shell = q('.playground-scroll-shell');
  function publishOwnedCount() {
    document.documentElement.dataset.portfolioTriggers = String(
      ScrollTrigger.getAll().filter((trigger) =>
        trigger.vars.id?.startsWith('portfolio-'),
      ).length,
    );
  }
  function dragReady(ready: boolean) {
    const value = String(ready);
    if (shell.dataset.dragReady === value) return;
    shell.dataset.dragReady = value;
    if (!ready) shell.dispatchEvent(new Event('scene-drag-lock'));
  }
  function refresh() {
    if (disposed) return;
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => {
      if (disposed) return;
      // Refresh only our triggers; never kill or reconfigure unrelated animation owners.
      timelines.forEach((timeline) => {
        const trigger = timeline.scrollTrigger;
        trigger?.refresh();
        // Also synchronize a direct /#section load after browser scroll restoration.
        if (trigger) {
          timeline.progress(trigger.progress, false);
          const name = String(trigger.vars.id).replace('portfolio-', '');
          q(`[data-scene="${name}"]`).dataset.scrollProgress = timeline
            .progress()
            .toFixed(4);
          if (name === 'weather')
            options.weather?.setProgress(timeline.progress());
        }
      });
      publishOwnedCount();
      options.weather?.refresh();
    }, 180);
  }
  function visibility() {
    if (!document.hidden) refresh();
    else
      timelines.forEach((tl) => {
        const trigger = tl.scrollTrigger;
        trigger?.getTween()?.pause();
        if (trigger) tl.progress(trigger.progress);
      });
  }
  function destroy() {
    if (disposed) return;
    disposed = true;
    clearTimeout(refreshTimer);
    resize?.disconnect();
    host.removeEventListener('load', refresh, true);
    document.removeEventListener('visibilitychange', visibility);
    media.revert();
    publishOwnedCount();
    timelines = [];
    dragReady(true);
    host.dataset.scrollMotion = 'static';
    host.dataset.scrollTriggerCount = '0';
    all('[data-scene]').forEach((el) => {
      delete el.dataset.scrollProgress;
      delete el.dataset.scrollStart;
      delete el.dataset.scrollEnd;
    });
  }
  try {
    media.add(
      {
        mobile: '(max-width: 767px)',
        desktop: '(min-width: 768px)',
        reduced: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        timelines = [];
        const { mobile } = context.conditions!;
        const reduced = Boolean(
          context.conditions!.reduced || options.manualStatic,
        );
        const small = Boolean(mobile);
        options.weather?.setReduced(reduced);
        host.dataset.scrollMotion = reduced ? 'static' : 'gsap';
        host.dataset.scrollTriggerCount = '0';
        if (reduced) {
          dragReady(true);
          publishOwnedCount();
          return;
        }
        function scene(
          name: string,
          trigger: HTMLElement,
          start: string,
          end: string | (() => number),
          extra?: (progress: number) => void,
        ) {
          const node = q(`[data-scene="${name}"]`);
          const tl = gsap.timeline({
            defaults: { duration: 1, ease: 'none' },
            scrollTrigger: {
              id: `portfolio-${name}`,
              trigger,
              start,
              end,
              scrub: small ? 0.55 : 0.75,
              invalidateOnRefresh: true,
              onRefresh: (self) => {
                node.dataset.scrollStart = self.start.toFixed(2);
                node.dataset.scrollEnd = self.end.toFixed(2);
              },
            },
            onUpdate: () => {
              node.dataset.scrollProgress = tl.progress().toFixed(4);
              extra?.(tl.progress());
            },
          });
          node.dataset.scrollProgress = '0';
          timelines.push(tl);
          return tl;
        }
        const weatherProgress = { value: 0 };
        scene(
          'weather',
          host,
          'clamp(top top)',
          'clamp(bottom bottom)',
          (progress) => options.weather?.setProgress(progress),
        ).fromTo(weatherProgress, { value: 0 }, { value: 1 }, 0);
        const heroElement = q<HTMLElement>('.hero');
        const hero = scene(
          'hero',
          heroElement,
          'clamp(top top)',
          () =>
            heroElement.getBoundingClientRect().top +
            window.scrollY +
            Math.max(
              220,
              heroElement.offsetHeight -
                window.innerHeight * (small ? 0.65 : 0.55),
            ),
        );
        hero
          .fromTo(
            q('.hero-title-scroll'),
            { y: 0 },
            { y: small ? -24 : -85 },
            0,
          )
          .fromTo(
            q('.geometry-scroll-layer'),
            { y: 0, x: 0, rotation: 0 },
            { y: small ? 42 : 100, x: small ? -12 : -45, rotation: 12 },
            0,
          )
          .fromTo(
            q('.hero-outline-back'),
            { rotation: -20, scale: 0.85, xPercent: -8 },
            { rotation: 42, scale: 1.4, xPercent: 23 },
            0,
          )
          .fromTo(
            q('.hero-outline-front'),
            { rotation: -8, scale: 1, xPercent: 0 },
            { rotation: -42, scale: 1.22, xPercent: -12 },
            0,
          )
          .fromTo(
            q('.hero-color-block'),
            { y: -30, rotation: -18, scale: 0.8 },
            { y: small ? 80 : 190, rotation: 55, scale: 1.2 },
            0,
          );
        all('.geometry-scroll-frame').forEach((el, i) =>
          hero.fromTo(
            el,
            { x: 0, y: 0, z: 0, rotationZ: 0 },
            {
              x: (i - 1.5) * (small ? 20 : 42),
              y: i * 6,
              z: i * (small ? 30 : 58),
              rotationZ: (i - 1.5) * 13,
            },
            0,
          ),
        );

        scene(
          'reveal',
          q('.selected-work'),
          'clamp(top 95%)',
          'clamp(top 20%)',
        ).fromTo(
          q('.work-wash'),
          { scaleX: 0.12, scaleY: 0.42, borderRadius: '180px' },
          { scaleX: 1, scaleY: 1, borderRadius: small ? '24px' : '36px' },
          0,
        );

        scene(
          'work',
          q('.selected-work'),
          'clamp(top 90%)',
          'clamp(bottom 80%)',
        )
          .fromTo(
            q('.work-word'),
            { xPercent: small ? 12 : 28 },
            { xPercent: small ? -22 : -34 },
            0,
          )
          .fromTo(
            q('.work-outline'),
            { xPercent: -35, rotation: -24 },
            { xPercent: small ? 5 : 32, rotation: 32 },
            0,
          )
          .fromTo(
            q('.work-accent'),
            { y: -50, rotation: 0 },
            { y: small ? 140 : 310, rotation: 70 },
            0,
          );

        const about = scene(
          'about',
          q('.about-section'),
          'clamp(top 80%)',
          'clamp(bottom 65%)',
        );
        about
          .fromTo(
            q('.timeline-track'),
            { '--timeline-progress': 0 },
            { '--timeline-progress': 1 },
            0,
          )
          .fromTo(
            q('.about-route-draw'),
            { strokeDashoffset: 1000 },
            { strokeDashoffset: 0 },
            0,
          )
          .fromTo(
            q('.about-scroll-art'),
            { y: small ? 25 : 70 },
            { y: small ? -20 : -70 },
            0,
          );
        all('.timeline-node').forEach((el, i) =>
          about.fromTo(
            el,
            { scale: 0.7, opacity: 0.25 },
            { scale: 1, opacity: 1, duration: 0.12 },
            0.06 + i * 0.3,
          ),
        );

        let skillTimeline: gsap.core.Timeline;
        dragReady(false);
        skillTimeline = scene(
          'skills',
          q('.skills-section'),
          'clamp(top 60%)',
          'clamp(bottom 85%)',
          () => dragReady(skillTimeline.progress() >= 0.57),
        );
        skillTimeline
          .fromTo(
            shell,
            {
              scale: small ? 0.95 : 0.91,
              rotation: small ? -1.5 : -3,
              y: small ? 16 : 36,
            },
            { scale: 1, rotation: 0, y: 0, duration: 0.55 },
            0,
          )
          .fromTo(
            q('.toolbox-word'),
            { x: small ? -25 : -70 },
            { x: small ? 48 : 130 },
            0,
          )
          .fromTo(
            q('.inplay-word'),
            { x: small ? 30 : 90 },
            { x: small ? -52 : -160 },
            0,
          );

        scene(
          'contact',
          q('.contact-editorial'),
          small ? 'clamp(top 60%)' : 'clamp(top 65%)',
          'clamp(bottom bottom)',
        )
          .fromTo(
            q('.contact-word'),
            { x: small ? 80 : 190 },
            { x: small ? -25 : -70 },
            0,
          )
          .fromTo(
            q('.contact-arc'),
            { rotation: -65, scale: 0.8 },
            { rotation: -15, scale: 1 },
            0,
          )
          .fromTo(
            q('.contact-accent'),
            { x: small ? 35 : 120, y: 70, rotation: -30 },
            { x: 0, y: 0, rotation: 15 },
            0,
          )
          .fromTo(
            q('.person-card-position'),
            { y: small ? 12 : 30, rotation: small ? -2 : -4 },
            { y: 0, rotation: 0 },
            0,
          )
          .fromTo(
            q('.portrait-flip'),
            { rotationY: 180 },
            { rotationY: 0, duration: small ? 0.36 : 0.45 },
            small ? 0.12 : 0.2,
          );

        host.dataset.scrollTriggerCount = String(timelines.length);
        refresh();
        return () => {
          dragReady(true);
          timelines = [];
        };
      },
      host,
    );
    resize = new ResizeObserver(refresh);
    [host, ...all('section'), q('.timeline-track')].forEach((el) =>
      resize!.observe(el),
    );
    host.addEventListener('load', refresh, true);
    document.addEventListener('visibilitychange', visibility);
    void document.fonts?.ready.then(refresh);
    refresh();
  } catch {
    destroy();
  }
  return { refresh, destroy };
}
