export default defineNuxtConfig({
  // `@nustackjs/lint` installs `@nuxt/eslint` itself (in composable mode), so it is
  // not listed here.
  modules: ['@nustackjs/lint', '@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  compatibilityDate: 'latest',
})
