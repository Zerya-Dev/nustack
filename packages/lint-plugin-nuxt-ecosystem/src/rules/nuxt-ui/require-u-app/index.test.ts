import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import vueParser from 'vue-eslint-parser'
import plugin from '../../../index.js'

describe('require-u-app', () => {
  it('requires UApp only in the Nuxt application root', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parser: vueParser } })
    tester.run('require-u-app', plugin.rules?.['require-u-app'] as never, {
      valid: [
        { filename: '/project/app.vue', code: '<template><UApp><NuxtPage /></UApp></template>' },
        { filename: '/project/components/App.vue', code: '<template><div /></template>' },
      ],
      invalid: [{ filename: '/project/app.vue', code: '<template><NuxtPage /></template>', errors: [{ messageId: 'missingApp' }] }],
    })
  })
})
