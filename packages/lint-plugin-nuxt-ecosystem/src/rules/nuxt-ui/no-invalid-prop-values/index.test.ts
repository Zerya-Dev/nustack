import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import vueParser from 'vue-eslint-parser'
import plugin from '../../../index.js'

describe('no-invalid-prop-values', () => {
  it('checks static component values', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parser: vueParser } })
    tester.run('no-invalid-prop-values', plugin.rules?.['no-invalid-prop-values'] as never, {
      valid: [
        { filename: 'component.vue', code: '<template><UButton color="primary" variant="outline" size="md" /></template>' },
        { filename: 'component.vue', code: '<template><UCheckboxGroup variant="table" orientation="horizontal" /></template>' },
        { filename: 'component.vue', code: '<template><UFileUpload variant="area" layout="list" position="inside" /></template>' },
        { filename: 'component.vue', code: '<template><UPinInput variant="subtle" size="xl" /></template>' },
        { filename: 'component.vue', code: '<template><UButton :color="color" /></template>' },
        { filename: 'component.vue', code: '<template><UButton variant="brand" /></template>', options: [{ values: { UButton: { variant: ['brand'] } } }] },
      ],
      invalid: [
        { filename: 'component.vue', code: '<template><UButton color="brand" /></template>', errors: [{ messageId: 'invalid' }] },
        { filename: 'component.vue', code: '<template><USlider size="2xl" /></template>', errors: [{ messageId: 'invalid' }] },
      ],
    })
  })
})
