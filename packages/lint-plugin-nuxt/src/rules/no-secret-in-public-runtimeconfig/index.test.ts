import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import plugin from '../../index.js'

const rule = plugin.rules?.['no-secret-in-public-runtimeconfig']

describe('no-secret-in-public-runtimeconfig', () => {
  it('reports secret-looking keys under runtimeConfig.public', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module' } })

    tester.run('no-secret-in-public-runtimeconfig', rule as never, {
      valid: [
        { code: 'export default defineNuxtConfig({ runtimeConfig: { apiSecret: "x", public: { apiBase: "/api" } } })' },
        { code: 'export default defineNuxtConfig({ appConfig: { publicToken: "label" } })' },
        { code: 'export default defineNuxtConfig({ runtimeConfig: { public: { stripePublishableKey: "pk_live_x" } } })' },
        { code: 'export default defineNuxtConfig({ runtimeConfig: { public: { vapidPublicKey: "x" } } })' },
        { code: 'export default defineNuxtConfig({ runtimeConfig: { public: { turnstileSiteKey: "x" } } })' },
        { code: 'export default defineNuxtConfig({ runtimeConfig: { public: { apiKey: "x" } } })' },
      ],
      invalid: [
        {
          code: 'export default defineNuxtConfig({ runtimeConfig: { public: { apiToken: "x" } } })',
          errors: [{ messageId: 'secretInPublic' }],
        },
        {
          code: 'export default defineNuxtConfig({ runtimeConfig: { public: { auth: { clientSecret: "x" } } } })',
          errors: [{ messageId: 'secretInPublic' }],
        },
        {
          code: 'export default defineNuxtConfig({ runtimeConfig: { public: { privateKey: "x" } } })',
          errors: [{ messageId: 'secretInPublic' }],
        },
      ],
    })
  })
})
