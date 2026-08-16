import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { nuxtUiPlugin } from '../../../index.js'

describe('require-nested-form-prop', () => {
  it('requires explicit nested form behavior', () => {
    tester.run('require-nested-form-prop', nuxtUiPlugin.rules['require-nested-form-prop'], {
      valid: [
        { code: '<template><UForm :state="state"><UForm nested :schema="child" /></UForm></template>' },
        { code: '<template><UForm :state="state"><UForm nested="" :schema="child" /></UForm></template>' },
        { code: '<template><UForm :state="state"><UForm nested="nested" :schema="child" /></UForm></template>' },
        { code: '<template><UForm :state="state"><UForm :nested="isNested" :schema="child" /></UForm></template>' },
        { code: '<template><UForm :state="state" /></template>' },
      ],
      invalid: [
        { code: '<template><UForm :state="state"><UForm :schema="child" /></UForm></template>', errors: [{ messageId: 'requireNested' }] },
        { code: '<template><UForm :state="state"><UForm :nested="false" /></UForm></template>', errors: [{ messageId: 'requireNested' }] },
        { code: '<template><UForm :state="state"><UForm :nested="undefined" /></UForm></template>', errors: [{ messageId: 'requireNested' }] },
      ],
    })
  })
})
