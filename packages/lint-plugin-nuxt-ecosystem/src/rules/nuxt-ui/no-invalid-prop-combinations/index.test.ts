import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import vueParser from 'vue-eslint-parser'
import plugin from '../../../index.js'

describe('no-invalid-prop-combinations', () => {
  it('checks documented component constraints', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parser: vueParser } })
    tester.run('no-invalid-prop-combinations', plugin.rules?.['no-invalid-prop-combinations'] as never, {
      valid: [
        { filename: 'component.vue', code: '<template><UFileUpload variant="button" :multiple="false" /></template>' },
        { filename: 'component.vue', code: '<template><UFileUpload variant="area" layout="list" position="inside" /></template>' },
        { filename: 'component.vue', code: '<template><UFileUpload :variant="variant" :position="position" /></template>' },
        { filename: 'component.vue', code: '<template><UAccordion type="multiple" /></template>' },
        { filename: 'component.vue', code: '<template><UAccordion type="multiple" collapsible data-raw /></template>' },
      ],
      invalid: [
        { filename: 'component.vue', code: '<template><UFileUpload variant="button" multiple /></template>', errors: [{ messageId: 'fileButtonMultiple' }] },
        { filename: 'component.vue', code: '<template><UFileUpload variant="button" layout="list" /></template>', errors: [{ messageId: 'fileLayoutArea' }] },
        { filename: 'component.vue', code: '<template><UFileUpload position="inside" /></template>', errors: [{ messageId: 'filePositionList' }] },
        { filename: 'component.vue', code: '<template><UAccordion type="multiple" collapsible /></template>', errors: [{ messageId: 'accordionCollapsible' }] },
      ],
    })
  })
})
