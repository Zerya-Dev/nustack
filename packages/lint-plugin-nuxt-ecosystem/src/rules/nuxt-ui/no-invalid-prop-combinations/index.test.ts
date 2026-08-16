import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { nuxtUiPlugin } from '../../../index.js'

describe('no-invalid-prop-combinations', () => {
  it('checks documented component constraints', () => {
    tester.run('no-invalid-prop-combinations', nuxtUiPlugin.rules['no-invalid-prop-combinations'], {
      valid: [
        { code: '<template><UFileUpload variant="button" :multiple="false" /></template>' },
        { code: '<template><UFileUpload variant="area" layout="list" position="inside" /></template>' },
        { code: '<template><UFileUpload :variant="variant" :position="position" /></template>' },
        { code: '<template><UAccordion type="multiple" /></template>' },
      ],
      invalid: [
        { code: '<template><UFileUpload variant="button" multiple /></template>', errors: [{ messageId: 'fileButtonMultiple' }] },
        { code: '<template><UFileUpload variant="button" layout="list" /></template>', errors: [{ messageId: 'fileLayoutArea' }] },
        { code: '<template><UFileUpload position="inside" /></template>', errors: [{ messageId: 'filePositionList' }] },
        { code: '<template><UAccordion type="multiple" collapsible /></template>', errors: [{ messageId: 'accordionCollapsible' }] },
      ],
    })
  })
})
