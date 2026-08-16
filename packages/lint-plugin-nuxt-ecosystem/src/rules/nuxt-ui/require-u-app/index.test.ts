import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { nuxtUiPlugin } from '../../../index.js'

describe('require-u-app', () => {
  it('requires UApp only in the Nuxt application root', () => {
    tester.run('require-u-app', nuxtUiPlugin.rules['require-u-app'], {
      valid: [
        { filename: 'app.vue', code: '<template><UApp><NuxtPage /></UApp></template>' },
        { filename: 'app/app.vue', code: '<template><UApp><NuxtLayout /></UApp></template>' },
        { filename: 'App.vue', code: '<template><div /></template>' },
        { filename: 'components/App.vue', code: '<template><div /></template>' },
      ],
      invalid: [
        { filename: 'app.vue', code: '<template><NuxtPage /></template>', errors: [{ messageId: 'missingApp' }] },
        { filename: 'app/app.vue', code: '<template><div><NuxtPage /></div></template>', errors: [{ messageId: 'missingApp' }] },
      ],
    })
  })
})
