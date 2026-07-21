import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import vueParser from 'vue-eslint-parser'
import plugin from '../../../index.js'

describe('no-conflicting-state-props', () => {
  it('separates controlled and uncontrolled state', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parser: vueParser } })
    tester.run('no-conflicting-state-props', plugin.rules?.['no-conflicting-state-props'] as never, {
      valid: [
        { filename: 'component.vue', code: '<template><UModal v-model:open="open" /></template>' },
        { filename: 'component.vue', code: '<template><UInput default-value="Draft" /></template>' },
      ],
      invalid: [
        { filename: 'component.vue', code: '<template><UModal v-model:open="open" default-open /></template>', errors: [{ messageId: 'conflicting' }] },
        { filename: 'component.vue', code: '<template><UInput v-model="value" default-value="Draft" /></template>', errors: [{ messageId: 'conflicting' }] },
      ],
    })
  })
})
