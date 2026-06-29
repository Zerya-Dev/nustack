import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import plugin from '../../index.js'

const rule = plugin.rules?.['modules-order']

describe('modules-order', () => {
  it('enforces interdependent Nuxt module ordering', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module' } })

    tester.run('modules-order', rule as never, {
      valid: [
        // Correct order: ui before content.
        { code: 'export default defineNuxtConfig({ modules: ["@nuxt/ui", "@nuxt/content"] })' },
        // Correct order: i18n before seo before content.
        { code: 'export default defineNuxtConfig({ modules: ["@nuxtjs/i18n", "@nuxtjs/seo", "@nuxt/content"] })' },
        // Array form with options is still resolvable.
        { code: 'export default defineNuxtConfig({ modules: [["@nuxt/ui", {}], ["@nuxt/content", {}]] })' },
        // Only one of the pair present — nothing to order.
        { code: 'export default defineNuxtConfig({ modules: ["@nuxt/content"] })' },
        // i18n before site-config.
        { code: 'export default defineNuxtConfig({ modules: ["@nuxtjs/i18n", "nuxt-site-config"] })' },
        // Unrelated modules in any order.
        { code: 'export default defineNuxtConfig({ modules: ["@nuxt/image", "@vueuse/nuxt"] })' },
        // Dynamic entries are skipped, not crashed on.
        { code: 'export default defineNuxtConfig({ modules: [myModule, "@nuxt/content"] })' },
      ],
      invalid: [
        {
          code: 'export default defineNuxtConfig({ modules: ["@nuxt/content", "@nuxt/ui"] })',
          errors: [{ messageId: 'wrongOrder' }],
        },
        {
          code: 'export default defineNuxtConfig({ modules: ["@nuxtjs/seo", "@nuxtjs/i18n"] })',
          errors: [{ messageId: 'wrongOrder' }],
        },
        {
          code: 'export default defineNuxtConfig({ modules: ["@nuxt/content", "@nuxtjs/seo"] })',
          errors: [{ messageId: 'wrongOrder' }],
        },
        {
          // ui after content AND seo after i18n missing — two distinct violations.
          code: 'export default defineNuxtConfig({ modules: ["@nuxt/content", "@nuxt/ui", "@nuxtjs/seo", "@nuxtjs/i18n"] })',
          errors: [{ messageId: 'wrongOrder' }, { messageId: 'wrongOrder' }, { messageId: 'wrongOrder' }],
        },
      ],
    })
  })
})
