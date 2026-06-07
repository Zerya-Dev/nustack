import { describe, js } from '../../rule-tester'
import { rule as noSecret } from './index'

describe('nuxt/no-secret-in-public-runtimeconfig', () => {
  js.run('nuxt/no-secret-in-public-runtimeconfig', noSecret, {
    valid: [
      // secret lives in the private runtimeConfig, not public
      `export default defineNuxtConfig({ runtimeConfig: { apiSecret: 'x', public: { baseUrl: 'y' } } })`,
      `export default defineNuxtConfig({ runtimeConfig: { public: { siteName: 'nustack' } } })`,
    ],
    invalid: [
      {
        code: `export default defineNuxtConfig({ runtimeConfig: { public: { apiToken: 'x' } } })`,
        errors: [{ messageId: 'secretInPublic' }],
      },
      {
        // nested group under public
        code: `export default defineNuxtConfig({ runtimeConfig: { public: { auth: { password: 'x' } } } })`,
        errors: [{ messageId: 'secretInPublic' }],
      },
    ],
  })
})
