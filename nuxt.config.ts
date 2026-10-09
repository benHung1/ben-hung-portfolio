import { env } from 'node:process';

export default defineNuxtConfig({
  compatibilityDate: '2026-10-09',
  buildDir: env.PORTFOLIO_BUILD_DIR || '.nuxt-local',
  nitro: {
    // Serve the portfolio through one SSR function. Later Vercel compatibility
    // creates per-route junction aliases, which require extra Windows privileges.
    compatibilityDate: { vercel: '2025-07-14' },
    // Vercel selects its SSR preset and output structure automatically.
    // Keep an optional output override for isolated local production previews.
    output: env.PORTFOLIO_OUTPUT_DIR
      ? { dir: env.PORTFOLIO_OUTPUT_DIR }
      : undefined,
  },
  sourcemap: { server: false, client: false },
  devtools: { enabled: false },
  vite: {
    optimizeDeps: { include: ['gsap', 'gsap/ScrollTrigger'] },
  },
  css: [
    '~/assets/styles/main.scss',
    '~/assets/styles/refinements.scss',
    '~/assets/styles/round3.scss',
    '~/assets/styles/round4.scss',
    '~/assets/styles/scroll-scenes.scss',
    '~/assets/styles/weather-profiles.scss',
    '~/assets/styles/page-rhythm.scss',
  ],
  app: {
    pageTransition: false,
    head: {
      script: [
        {
          key: 'page-preparation-init',
          tagPosition: 'head',
          innerHTML:
            "(()=>{const h=document.documentElement;h.dataset.pageLoading='preparing';setTimeout(()=>{if(h.dataset.preparationRun)return;delete h.dataset.pageLoading;document.querySelector('.site-content')?.removeAttribute('inert')},5000)})()",
        },
        {
          key: 'theme-init',
          tagPosition: 'head',
          innerHTML:
            "(()=>{let p;try{p=localStorage.getItem('bh-theme')}catch(e){}document.documentElement.dataset.theme=p==='light'||p==='dark'?p:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'})()",
        },
      ],
      htmlAttrs: { lang: 'zh-Hant' },
      title: 'Ben Hung — Frontend Engineer',
      meta: [
        {
          name: 'description',
          content:
            '洪鈺堂 Ben Hung，具備使用者端網站、企業管理後台、架構共用化與團隊帶領經驗的前端工程師。',
        },
        { name: 'theme-color', content: '#F6F4ED' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'zh_TW' },
        { property: 'og:site_name', content: 'Ben Hung · Portfolio' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },
  // Locale cookies are rendered per request, never shared in a prerender cache.
  routeRules: {
    '/**': {
      headers: { 'Cache-Control': 'private, no-cache', Vary: 'Cookie' },
    },
  },
  typescript: { strict: true },
});
