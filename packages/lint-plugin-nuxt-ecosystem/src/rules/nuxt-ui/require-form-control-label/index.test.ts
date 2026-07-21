import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import vueParser from 'vue-eslint-parser'
import plugin from '../../../index.js'

describe('require-form-control-label', () => {
  it('requires accessible labels on form controls', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parser: vueParser } })
    tester.run('require-form-control-label', plugin.rules?.['require-form-control-label'] as never, {
      valid: [
        { filename: 'component.vue', code: '<template><UInput aria-label="Search" /></template>' },
        { filename: 'component.vue', code: '<template><UCheckboxGroup legend="Theme" /></template>' },
        { filename: 'component.vue', code: '<template><UFormField label="Email"><UInput /></UFormField></template>' },
        { filename: 'component.vue', code: '<template><UInput data-raw /></template>' },
      ],
      invalid: [
        { filename: 'component.vue', code: '<template><UInput placeholder="Search" /></template>', errors: [{ messageId: 'missingLabel' }] },
        { filename: 'component.vue', code: '<template><URadioGroup :items="items" /></template>', errors: [{ messageId: 'missingLabel' }] },
      ],
    })
  })
})
