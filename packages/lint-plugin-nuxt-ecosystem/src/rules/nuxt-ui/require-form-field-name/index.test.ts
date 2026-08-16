import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { nuxtUiPlugin } from '../../../index.js'

describe('require-form-field-name', () => {
  it('requires a validation target inside UForm', () => {
    tester.run('require-form-field-name', nuxtUiPlugin.rules['require-form-field-name'], {
      valid: [
        { code: '<template><UForm :state="state"><UFormField name="email" /></UForm></template>' },
        { code: '<template><UFormField label="Display only" /></template>' },
      ],
      invalid: [
        { code: '<template><UForm :state="state"><UFormField label="Email" /></UForm></template>', errors: [{ messageId: 'missingName' }] },
        { code: '<template><UForm :state="state"><UFormField name="" /></UForm></template>', errors: [{ messageId: 'missingName' }] },
        { code: '<template><UForm :state="state"><UFormField :name="undefined" /></UForm></template>', errors: [{ messageId: 'missingName' }] },
      ],
    })
  })
})
