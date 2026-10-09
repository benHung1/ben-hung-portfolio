import { createPagePreparation } from '~/utils/pagePreparation';
import { NavigationJournal } from '~/utils/navigationJournal';
export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter();
  const state = usePagePreparation();
  const { manualStatic } = useMotionPreference();
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const journal = new NavigationJournal(
    Number(router.options.history.state.position || 0),
    location.pathname + location.search + location.hash,
  );
  let disposed = false,
    mounted = false;
  const publish = () => {
    const html = document.documentElement;
    if (state.value.active) html.dataset.pageLoading = state.value.phase;
    else delete html.dataset.pageLoading;
    html.dataset.preparationRun = String(state.value.run);
    html.dataset.preparationProgress = String(state.value.progress);
  };
  const control = createPagePreparation(
    state.value,
    {
      now: () => performance.now(),
      frame: (callback) => requestAnimationFrame(callback),
      cancelFrame: (id) => cancelAnimationFrame(id),
      timeout: (callback, delay) => setTimeout(callback, delay),
      clearTimeout: (id) => clearTimeout(id),
    },
    () => media.matches || manualStatic.value,
    publish,
    (reason) => {
      const focusMain = Boolean(
        document.activeElement?.closest('.brand-intro'),
      );
      document.documentElement.dataset.preparationResult = reason;
      requestAnimationFrame(() => {
        if (disposed || state.value.active) return;
        document.dispatchEvent(new CustomEvent('portfolio:page-ready'));
        if (focusMain)
          document
            .querySelector<HTMLElement>('main')
            ?.focus({ preventScroll: true });
      });
    },
  );
  const ready = async () => {
    await nextTick();
    requestAnimationFrame(() => {
      if (disposed) return;
      const main = document.querySelector<HTMLElement>('main[data-page-path]');
      if (main?.dataset.pagePath === state.value.pathname)
        control.ready(main.dataset.pagePath);
    });
  };
  const removeBefore = router.beforeEach((to, from) => {
    if (!mounted) return;
    journal.save(from.fullPath, window.scrollX, window.scrollY);
    if (
      to.path !== from.path &&
      !(state.value.active && state.value.pathname === to.path)
    )
      control.start(to.path);
  });
  const removeAfter = router.afterEach((to, _from, failure) => {
    if (failure) {
      if (state.value.pathname === to.path)
        control.cancel('navigation-cancelled');
      return;
    }
    journal.arrive(
      Number(router.options.history.state.position || 0),
      to.fullPath,
    );
  });
  const removeError = router.onError(() => control.cancel('navigation-error'));
  const hooks = [
    nuxtApp.hook('app:mounted', () => {
      mounted = true;
      control.start(router.currentRoute.value.path, true);
      void ready();
    }),
    nuxtApp.hook('page:finish', ready),
    nuxtApp.hook('app:error', () => control.cancel('page-error')),
  ];
  const stopMotion = watch(manualStatic, () => {
    if (manualStatic.value) control.skip();
  });
  function destroy() {
    disposed = true;
    control.destroy();
    removeBefore();
    removeAfter();
    removeError();
    hooks.forEach((remove) => remove());
    stopMotion();
    delete document.documentElement.dataset.pageLoading;
  }
  if (import.meta.hot) import.meta.hot.dispose(destroy);
  nuxtApp.vueApp.onUnmount(destroy);
  return {
    provide: {
      pagePreparation: control,
      portfolioNavigation: {
        back() {
          if (journal.previous(router.options.history.state.back))
            router.back();
          else void router.push('/work');
        },
      },
    },
  };
});
