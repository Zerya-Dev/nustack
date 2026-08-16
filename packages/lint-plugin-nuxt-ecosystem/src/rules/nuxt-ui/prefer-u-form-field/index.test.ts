import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { nuxtUiPlugin } from '../../../index.js'

const rule = nuxtUiPlugin.rules['prefer-u-form-field']

describe('prefer-u-form-field', () => {
  it('reports identifiable hand-written label/control pairs', () => {
    tester.run('prefer-u-form-field', rule, {
      valid: [
        { code: '<template><UFormField label="Email"><UInput /></UFormField></template>' },
        { code: '<template><label>Decorative text</label></template>' },
        { code: '<template><label for="panel">Panel</label><section id="panel" /></template>' },
        { code: '<template><label for="missing">External control</label></template>' },
        { code: '<template><Label><Input /></Label></template>' },
      ],
      invalid: [
        { code: '<template><label>Email <UInput /></label></template>', errors: [{ messageId: 'preferUFormField' }] },
        { code: '<template><label><span>Name</span><input></label></template>', errors: [{ messageId: 'preferUFormField' }] },
        { code: '<template><label for="country">Country</label><USelect id="country" /></template>', errors: [{ messageId: 'preferUFormField' }] },
      ],
    })
  })
})
