import type { createInnerPageMotion } from '~/utils/innerPageMotion';
export function useInnerPageMotion(
  page: Ref<HTMLElement | undefined>,
  kind: 'work' | 'case',
) {
  const preparation = usePagePreparation();
  const { manualStatic } = useMotionPreference();
  const { locale } = usePortfolio();
  const route = useRoute();
  let motion: ReturnType<typeof createInnerPageMotion> | undefined;
  let disposed = false,
    entered = false,
    loading = false;
  async function start() {
    if (disposed || loading || preparation.value.active || !page.value) return;
    loading = true;
    try {
      const { createInnerPageMotion } = await import('~/utils/innerPageMotion');
      if (disposed || preparation.value.active || !page.value) return;
      motion?.destroy();
      motion = createInnerPageMotion(
        page.value,
        kind,
        manualStatic.value,
        !entered,
      );
      entered = true;
    } catch {
      motion?.destroy();
      if (page.value) page.value.dataset.innerMotion = 'static';
    } finally {
      loading = false;
    }
  }
  onMounted(start);
  watch(
    () => preparation.value.active,
    (active) => {
      if (!active) void start();
    },
  );
  watch(manualStatic, start);
  watch([locale, () => route.query.category], async () => {
    await nextTick();
    motion?.refresh();
  });
  onBeforeUnmount(() => {
    disposed = true;
    motion?.destroy();
  });
}
