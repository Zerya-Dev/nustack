import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import vueParser from 'vue-eslint-parser'
import plugin from '../../../index.js'

describe('require-form-field-name', () => {
  it('requires a validation target inside UForm', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parser: vueParser } })
    tester.run('require-form-field-name', plugin.rules?.['require-form-field-name'] as never, {
      valid: [
        { filename: 'component.vue', code: '<template><UForm :state="state"><UFormField name="email" /></UForm></template>' },
        { filename: 'component.vue', code: '<template><UFormField label="Display only" /></template>' },
      ],
      invalid: [{ filename: 'component.vue', code: '<template><UForm :state="state"><UFormField label="Email" /></UForm></template>', errors: [{ messageId: 'missingName' }] }],
    })
  })
})
