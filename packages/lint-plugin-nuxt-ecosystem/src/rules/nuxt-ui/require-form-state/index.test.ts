import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import vueParser from 'vue-eslint-parser'
import plugin from '../../../index.js'

describe('require-form-state', () => {
  it('requires state', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parser: vueParser } })
    tester.run('require-form-state', plugin.rules?.['require-form-state'] as never, {
      valid: [
        { filename: 'component.vue', code: '<template><UForm :state="state" /></template>' },
        { filename: 'component.vue', code: '<template><UForm nested :schema="nestedSchema" /></template>' },
      ],
      invalid: [{ filename: 'component.vue', code: '<template><UForm :schema="schema" /></template>', errors: [{ messageId: 'missingState' }] }],
    })
  })
})
