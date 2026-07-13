export default defineNuxtConfig({
  // `@nustackjs/lint` installs `@nuxt/eslint` itself (in composable mode), so it is
  // not listed here.
  modules: ['@nustackjs/lint', '@nuxt/ui', '@nuxt/content'],
  css: ['~/assets/css/main.css'],
  content: { experimental: { sqliteConnector: 'sqlite3' } },
  devtools: { enabled: true },
  compatibilityDate: 'latest',
})
