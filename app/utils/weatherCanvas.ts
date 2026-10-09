export interface WeatherApi {
  setProgress(value: number): void;
  refresh(): void;
  setReduced(value: boolean): void;
}
/** Pure scroll-driven parameters; particle positions use an independent clock. */
export function weatherAt(progress: number) {
  const p = Math.max(0, Math.min(1, progress));
  const t = Math.max(0, Math.min(1, (p - 0.2) / 0.65));
  const snow = t * t * (3 - 2 * t);
  return {
    snow,
    rain: 1 - snow,
    wind: 85 - 108 * snow,
    rainSpeed: 610 - 230 * snow,
    snowSpeed: 46 - 18 * snow,
    density: 0.58 + 0.3 * snow,
  };
}
export function createWeatherCanvas(
  canvas: HTMLCanvasElement,
  host: HTMLElement,
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D unavailable');
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  let reduced = false,
    disposed = false,
    raf = 0,
    last = 0,
    frames = 0,
    progress = 0;
  let width = 0,
    height = 0,
    small = false,
    color = '#294bff';
  let masks: { x: number; top: number; width: number; height: number }[] = [];
  let particles: {
    x: number;
    y: number;
    depth: number;
    phase: number;
    kind: number;
  }[] = [];
  const maskSelector =
    '.hero-topline,.hero-title-scroll,.hero-copy,.capabilities,.section-top,.section-heading,.project-index-row,.about-copy,.experience-timeline,.skills-heading,.playground-panel,.skill-reading,.contact-copy > *,.person-card-position';
  function refreshMasks() {
    masks = [
      ...host.querySelectorAll<HTMLElement>(maskSelector),
      ...document.querySelectorAll<HTMLElement>('.site-header'),
    ]
      .map((el) => {
        const r = el.getBoundingClientRect();
        return {
          x: r.left - 10,
          top: r.top + window.scrollY - 10,
          width: r.width + 20,
          height: r.height + 20,
        };
      })
      .filter((r) => r.width > 20 && r.height > 20);
  }
  function theme() {
    const styles = getComputedStyle(canvas);
    color = styles.getPropertyValue('--weather-color').trim() || '#294bff';
  }
  function refresh() {
    if (disposed) return;
    const w = window.innerWidth,
      h = window.innerHeight;
    small = w < 768;
    if (w !== width || h !== height) {
      width = w;
      height = h;
      const ratio = Math.min(devicePixelRatio || 1, small ? 1 : 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx!.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = Array.from({ length: small ? 34 : 88 }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        depth: 0.5 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        kind: index / (small ? 34 : 88),
      }));
      canvas.dataset.particleCapacity = String(particles.length);
      canvas.dataset.pixelRatio = String(ratio);
    }
    refreshMasks();
    theme();
  }
  function stop(state: string) {
    cancelAnimationFrame(raf);
    raf = 0;
    last = 0;
    canvas.dataset.weatherState = state;
  }
  function tick(time: number) {
    raf = 0;
    if (disposed || reduced || media.matches || document.hidden) return;
    if (small && last && time - last < 32) {
      raf = requestAnimationFrame(tick);
      return;
    }
    const dt = Math.min(last ? (time - last) / 1000 : 1 / 60, 0.05);
    last = time;
    const weather = weatherAt(progress);
    ctx!.clearRect(0, 0, width, height);
    ctx!.strokeStyle = color;
    ctx!.fillStyle = color;
    ctx!.lineCap = 'round';
    for (const particle of particles) {
      const snowMix = Math.max(
        0,
        Math.min(1, (weather.snow - particle.kind * 0.8) / 0.2),
      );
      const speed =
        weather.rainSpeed * (1 - snowMix) + weather.snowSpeed * snowMix;
      particle.y += speed * particle.depth * dt;
      particle.x +=
        (weather.wind + Math.sin(time / 1700 + particle.phase) * 18 * snowMix) *
        particle.depth *
        dt;
      if (particle.y > height + 40) {
        particle.y = -40;
        particle.x = Math.random() * width;
      }
      if (particle.x > width + 40) particle.x = -40;
      if (particle.x < -40) particle.x = width + 40;
      if (particle.kind > weather.density) continue;
      const alpha = 0.25 + particle.depth * 0.35;
      if (snowMix < 1) {
        ctx!.globalAlpha = alpha * (1 - snowMix);
        ctx!.lineWidth = small ? 0.8 : 1;
        const length = 14 + particle.depth * 22;
        ctx!.beginPath();
        ctx!.moveTo(particle.x, particle.y);
        ctx!.lineTo(
          particle.x + (weather.wind / speed) * length,
          particle.y + length,
        );
        ctx!.stroke();
      }
      if (snowMix > 0) {
        ctx!.globalAlpha = alpha * snowMix;
        ctx!.beginPath();
        ctx!.arc(
          particle.x,
          particle.y,
          1 + particle.depth * (small ? 1.2 : 2),
          0,
          Math.PI * 2,
        );
        ctx!.fill();
      }
    }
    // Clear a union of protected areas, rather than painting particles over copy/images.
    ctx!.globalAlpha = 1;
    const y = window.scrollY;
    for (const mask of masks)
      ctx!.clearRect(mask.x, mask.top - y, mask.width, mask.height);
    for (const el of host.querySelectorAll<HTMLElement>(
      '.project-preview,.hero-title-scroll,.person-card-position',
    )) {
      const r = el.getBoundingClientRect();
      if (r.width && r.bottom > 0 && r.top < height)
        ctx!.clearRect(r.left - 12, r.top - 12, r.width + 24, r.height + 24);
    }
    frames++;
    if (frames % 12 === 0) {
      canvas.dataset.weatherFrame = String(frames);
      canvas.dataset.particleSample = particles[0]?.y.toFixed(2);
    }
    raf = requestAnimationFrame(tick);
  }
  function resume() {
    if (disposed) return;
    if (reduced || media.matches) {
      stop('reduced');
      ctx!.clearRect(0, 0, width, height);
      return;
    }
    if (document.hidden) {
      stop('hidden');
      return;
    }
    if (!raf) {
      canvas.dataset.weatherState = 'running';
      raf = requestAnimationFrame(tick);
    }
  }
  const themeObserver = new MutationObserver(theme);
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  window.addEventListener('resize', refresh, { passive: true });
  document.addEventListener('visibilitychange', resume);
  media.addEventListener('change', resume);
  refresh();
  resume();
  return {
    refresh,
    setProgress(value: number) {
      progress = Math.max(0, Math.min(1, value));
      const state = weatherAt(progress);
      canvas.dataset.weatherProgress = progress.toFixed(4);
      canvas.dataset.snowMix = state.snow.toFixed(4);
      canvas.dataset.weatherKind =
        state.snow < 0.05 ? 'rain' : state.snow > 0.95 ? 'snow' : 'mixed';
    },
    setReduced(value: boolean) {
      reduced = value;
      resume();
    },
    destroy() {
      disposed = true;
      stop('disposed');
      themeObserver.disconnect();
      media.removeEventListener('change', resume);
      window.removeEventListener('resize', refresh);
      document.removeEventListener('visibilitychange', resume);
      ctx!.clearRect(0, 0, width, height);
      particles = [];
      masks = [];
    },
  };
}
