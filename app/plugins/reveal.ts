import type { ObjectDirective } from 'vue';
export default defineNuxtPlugin((nuxtApp) => {
  const observers = new WeakMap<Element, IntersectionObserver>();
  const pending = new WeakMap<Element, () => void>();
  const reveal: ObjectDirective<HTMLElement> = {
    getSSRProps: () => ({}),
    mounted(el) {
      const start = () => {
        document.removeEventListener('portfolio:page-ready', start);
        pending.delete(el);
        if (
          !('IntersectionObserver' in window) ||
          window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
          document.documentElement.dataset.userMotion === 'reduce'
        )
          return;
        const observer = new IntersectionObserver(
          (entries) => {
            if (!entries.some((entry) => entry.isIntersecting)) return;
            el.classList.add('has-entered');
            observer.disconnect();
          },
          { threshold: 0.08 },
        );
        observers.set(el, observer);
        observer.observe(el);
      };
      if (document.documentElement.dataset.pageLoading) {
        pending.set(el, start);
        document.addEventListener('portfolio:page-ready', start, {
          once: true,
        });
      } else start();
    },
    unmounted(el) {
      const start = pending.get(el);
      if (start) document.removeEventListener('portfolio:page-ready', start);
      pending.delete(el);
      observers.get(el)?.disconnect();
      observers.delete(el);
    },
  };
  nuxtApp.vueApp.directive('reveal', reveal);
});
