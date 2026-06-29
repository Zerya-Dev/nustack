import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import plugin from '../../index.js'

const rule = plugin.rules?.['no-deprecated-modules']

describe('no-deprecated-modules', () => {
  it('reports deprecated Nuxt modules', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module' } })

    tester.run('no-deprecated-modules', rule as never, {
      valid: [
        { code: 'export default defineNuxtConfig({ modules: ["@comark/nuxt", "@nuxt/content"] })' },
        { code: 'export default defineNuxtConfig({ modules: ["@nuxt/ui"] })' },
        // The key has to be `modules`; lookalike keys are ignored.
        { code: 'export default defineNuxtConfig({ buildModules: ["@nuxtjs/axios"] })' },
      ],
      invalid: [
        {
          code: 'export default defineNuxtConfig({ modules: ["@nuxtjs/mdc"] })',
          errors: [{ messageId: 'deprecated' }],
        },
        {
          code: 'export default defineNuxtConfig({ modules: ["@nuxtjs/axios"] })',
          errors: [{ messageId: 'deprecated' }],
        },
        {
          code: 'export default defineNuxtConfig({ modules: [["@nuxt/http", {}]] })',
          errors: [{ messageId: 'deprecated' }],
        },
        {
          code: 'export default defineNuxtConfig({ modules: ["@nuxtjs/axios", "@nuxt/http"] })',
          errors: [{ messageId: 'deprecated' }, { messageId: 'deprecated' }],
        },
      ],
    })
  })
})
