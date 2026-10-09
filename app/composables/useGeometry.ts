export function useGeometry() {
  const scene = ref<HTMLElement>();
  let media: MediaQueryList | undefined;
  const reset = () => {
    scene.value?.style.setProperty('--rx', '0deg');
    scene.value?.style.setProperty('--ry', '0deg');
    scene.value?.style.setProperty('--spread', '0px');
  };
  function move(event: PointerEvent) {
    if (!media?.matches || !scene.value) return;
    const rect = scene.value.getBoundingClientRect();
    scene.value.style.setProperty(
      '--rx',
      `${((event.clientY - rect.top) / rect.height - 0.5) * -14}deg`,
    );
    scene.value.style.setProperty(
      '--ry',
      `${((event.clientX - rect.left) / rect.width - 0.5) * 18}deg`,
    );
    scene.value.style.setProperty('--spread', '12px');
  }
  onMounted(() => {
    media = window.matchMedia(
      '(prefers-reduced-motion: no-preference) and (hover: hover) and (min-width: 768px)',
    );
    media.addEventListener('change', reset);
  });
  onBeforeUnmount(() => media?.removeEventListener('change', reset));
  return { scene, move, reset };
}
