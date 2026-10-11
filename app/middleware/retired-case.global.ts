// Also handle client-side links/history to the retired case without rendering a 404.
export default defineNuxtRouteMiddleware((to) => {
  if (to.path.replace(/\/$/, '') === '/work/recruit-communications') {
    return navigateTo('/work', { replace: true, redirectCode: 301 });
  }
});
