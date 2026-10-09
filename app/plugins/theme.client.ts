export default defineNuxtPlugin(() => {
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const sync = () => {
    let preference: string | null = null;
    try {
      preference = localStorage.getItem('bh-theme');
    } catch {
      /* Storage may be blocked. */
    }
    const theme =
      preference === 'dark' || preference === 'light'
        ? preference
        : media.matches
          ? 'dark'
          : 'light';
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#171a1e' : '#f6f4ed');
  };
  const storage = (event: StorageEvent) => {
    if (event.key === 'bh-theme') sync();
  };
  media.addEventListener('change', sync);
  window.addEventListener('storage', storage);
  sync();
  if (import.meta.hot)
    import.meta.hot.dispose(() => {
      media.removeEventListener('change', sync);
      window.removeEventListener('storage', storage);
    });
});
