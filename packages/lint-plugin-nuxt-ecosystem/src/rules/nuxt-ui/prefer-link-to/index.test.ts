import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import vueParser from 'vue-eslint-parser'
import plugin from '../../../index.js'

describe('prefer-link-to', () => {
  it('prefers to on link-capable components', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parser: vueParser } })
    tester.run('prefer-link-to', plugin.rules?.['prefer-link-to'] as never, {
      valid: [{ filename: 'component.vue', code: '<template><ULink to="/docs">Docs</ULink></template>' }],
      invalid: [{ filename: 'component.vue', code: '<template><UButton href="/docs">Docs</UButton></template>', errors: [{ messageId: 'preferTo' }] }],
    })
  })
})
