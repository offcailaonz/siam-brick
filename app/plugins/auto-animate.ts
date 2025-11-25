export default defineNuxtPlugin(async (nuxtApp) => {
  if (process.server) {
    nuxtApp.vueApp.directive('auto-animate', {
      getSSRProps: () => ({})
    });
    return;
  }

  const { autoAnimatePlugin } = await import('@formkit/auto-animate/vue');
  nuxtApp.vueApp.use(autoAnimatePlugin);
});
