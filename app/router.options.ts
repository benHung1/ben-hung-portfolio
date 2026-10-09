import type { RouterConfig } from '@nuxt/schema';
export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    if (to.path === from.path && !to.hash && !from.hash)
      return savedPosition || false;
    const samePage = to.path === from.path;
    const position = () => {
      if (savedPosition)
        return { ...savedPosition, behavior: 'instant' as const };
      if (to.hash) {
        const el = document.getElementById(
          decodeURIComponent(to.hash.slice(1)),
        );
        if (el)
          return {
            el,
            top: parseFloat(getComputedStyle(el).scrollMarginTop) || 24,
            behavior:
              samePage &&
              !matchMedia('(prefers-reduced-motion: reduce)').matches &&
              document.documentElement.dataset.userMotion !== 'reduce'
                ? ('smooth' as const)
                : ('instant' as const),
          };
      }
      return samePage && !from.hash
        ? false
        : { top: 0, left: 0, behavior: 'instant' as const };
    };
    if (samePage) return position();
    return new Promise((resolve) => {
      const app = useNuxtApp();
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        remove();
        requestAnimationFrame(() => resolve(position()));
      };
      const remove = app.hook('page:finish', finish);
      const timer = setTimeout(finish, 1500);
      if (!from.name) void nextTick(finish);
    });
  },
};
