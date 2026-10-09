export type CursorMode =
  'idle' | 'link' | 'view' | 'external' | 'drag' | 'native';

export function cursorMode(
  target: Element | null,
  selecting = false,
): CursorMode {
  if (
    !target ||
    selecting ||
    target.closest(
      'input, textarea, select, [contenteditable="true"], [data-cursor-native], dialog[open]',
    )
  )
    return 'native';
  if (target.closest('.physics-ready .skill-object'))
    return target.closest('[data-drag-ready="false"]') ? 'link' : 'drag';
  if (target.closest('[data-cursor="view"]')) return 'view';
  if (
    target.closest(
      'a[href^="https://"][target="_blank"], a[href^="http://"][target="_blank"]',
    )
  )
    return 'external';
  if (target.closest('a, button, [role="button"], summary')) return 'link';
  if (
    target.closest(
      'p, h1, h2, h3, h4, figcaption, .timeline-period, [data-selectable]',
    )
  )
    return 'native';
  return 'idle';
}

/** One application-level controller. It sleeps once the ring reaches the pointer. */
export function createBrandCursor(
  layer: HTMLElement,
  dot: HTMLElement,
  ring: HTMLElement,
) {
  const root = document.documentElement;
  const fine = matchMedia(
    '(hover: hover) and (pointer: fine) and (min-width: 768px)',
  );
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const removers: Array<() => void> = [];
  let frame = 0,
    x = 0,
    y = 0,
    rx = 0,
    ry = 0;
  let visible = false,
    disposed = false,
    hasPosition = false;
  let target: Element | null = null;

  function hide() {
    visible = false;
    hasPosition = false;
    layer.dataset.visible = 'false';
    layer.dataset.pressed = 'false';
    delete root.dataset.brandCursor;
    cancelAnimationFrame(frame);
    frame = 0;
  }
  function destroy() {
    hide();
    disposed = true;
    removers.splice(0).forEach((remove) => remove());
  }
  function guard(fn: () => void) {
    if (disposed) return;
    try {
      fn();
    } catch {
      destroy();
    }
  }
  function ringPosition() {
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
  }
  function tick() {
    frame = 0;
    guard(() => {
      if (!visible) return;
      const blend = reduced.matches ? 1 : 0.26;
      rx += (x - rx) * blend;
      ry += (y - ry) * blend;
      const settled = Math.abs(x - rx) + Math.abs(y - ry) < 0.15;
      if (settled) {
        rx = x;
        ry = y;
      }
      ringPosition();
      if (!settled) frame = requestAnimationFrame(tick);
    });
  }
  function paint() {
    if (!fine.matches || document.hidden || !layer.isConnected) {
      hide();
      return;
    }
    const mode = cursorMode(target, Boolean(window.getSelection()?.toString()));
    if (mode === 'native') {
      hide();
      return;
    }
    // Do not hide the native arrow unless the overlay's CSS has loaded correctly.
    const style = getComputedStyle(layer);
    if (
      style.position !== 'fixed' ||
      style.pointerEvents !== 'none' ||
      style.display === 'none'
    ) {
      hide();
      return;
    }
    if (!hasPosition || reduced.matches) {
      rx = x;
      ry = y;
    }
    hasPosition = visible = true;
    dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    ringPosition();
    layer.dataset.mode = mode;
    layer.dataset.visible = 'true';
    root.dataset.brandCursor = 'active';
    if (!frame && !reduced.matches) frame = requestAnimationFrame(tick);
  }
  function move(event: Event) {
    const e = event as PointerEvent;
    if (e.pointerType !== 'mouse') {
      hide();
      return;
    }
    guard(() => {
      x = e.clientX;
      y = e.clientY;
      target = e.target instanceof Element ? e.target : null;
      paint();
    });
  }
  function listen(
    object: EventTarget,
    name: string,
    fn: EventListener,
    options?: AddEventListenerOptions,
  ) {
    object.addEventListener(name, fn, options);
    removers.push(() => object.removeEventListener(name, fn, options));
  }
  try {
    listen(document, 'pointermove', move, { passive: true });
    listen(document, 'pointerover', move, { passive: true });
    listen(document, 'pointerout', (event) => {
      if (!(event as PointerEvent).relatedTarget) hide();
    });
    listen(
      document,
      'pointerdown',
      (event) => {
        move(event);
        if (visible) layer.dataset.pressed = 'true';
      },
      { passive: true },
    );
    listen(document, 'pointerup', () => {
      layer.dataset.pressed = 'false';
    });
    listen(document, 'pointercancel', hide);
    listen(document, 'selectionchange', () => {
      if (window.getSelection()?.toString()) hide();
    });
    listen(document, 'visibilitychange', hide);
    listen(window, 'blur', hide);
    listen(
      window,
      'scroll',
      () =>
        guard(() => {
          if (!visible) return;
          target = document.elementFromPoint(x, y);
          paint();
        }),
      { passive: true },
    );
    listen(fine, 'change', hide);
    listen(reduced, 'change', () =>
      guard(() => {
        if (visible) paint();
      }),
    );
  } catch {
    destroy();
  }
  return { destroy, reset: hide };
}
