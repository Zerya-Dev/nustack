import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { nuxtUiPlugin } from '../../../index.js'

const rule = nuxtUiPlugin.rules['prefer-u-form-controls']

describe('prefer-u-form-controls', () => {
  it('reports raw form controls and type-specialized inputs in Vue templates', () => {
    tester.run('prefer-u-form-controls', rule, {
      valid: [
        { code: '<template><UInput /></template>' },
        { code: '<template><UInput type="text" /></template>' },
        { code: '<template><UInput :type="kind" /></template>' },
        { code: '<template><Input v-model="x" /></template>' },
        { code: '<template><Select v-model="x" /></template>' },
        { code: '<template><input type="hidden" name="csrf"></template>' },
        { code: '<template><UInput type="hidden" /></template>' },
      ],
      invalid: [
        { code: '<template><input></template>', errors: [{ messageId: 'preferUFormControl', data: { tag: 'input', replacement: 'UInput' } }] },
        { code: '<template><input type="number"></template>', errors: [{ messageId: 'preferUFormControl', data: { tag: 'input', replacement: 'UInputNumber' } }] },
        { code: '<template><select></select></template>', errors: [{ messageId: 'preferUFormControl' }] },
        { code: '<template><textarea></textarea></template>', errors: [{ messageId: 'preferUFormControl' }] },
        { code: '<template><input type="submit" value="Save"></template>', errors: [{ messageId: 'preferUFormControl', data: { tag: 'input', replacement: 'UButton' } }] },
        { code: '<template><input type="reset"></template>', errors: [{ messageId: 'preferUFormControl', data: { tag: 'input', replacement: 'UButton' } }] },
        { code: '<template><UInput type="number" /></template>', errors: [{ messageId: 'preferSpecificControl', data: { type: 'number', component: 'UInput', replacement: 'UInputNumber' } }] },
        { code: '<template><UInput type="file" /></template>', errors: [{ messageId: 'preferSpecificControl' }] },
        { code: '<template><UInput :type="\'number\'" /></template>', errors: [{ messageId: 'preferSpecificControl' }] },
        { code: '<template><UInput type="NUMBER" /></template>', errors: [{ messageId: 'preferSpecificControl' }] },
        { code: '<template><UInput v-bind="{ type: \'number\' }" /></template>', errors: [{ messageId: 'preferSpecificControl' }] },
        { code: '<template><progress /></template>', options: [{ controls: { progress: 'Progress' } }], errors: [{ messageId: 'preferUFormControl', data: { tag: 'progress', replacement: 'UProgress' } }] },
        { code: '<template><UInput type="email" /></template>', options: [{ types: { email: 'EmailInput' } }], errors: [{ messageId: 'preferSpecificControl', data: { type: 'email', component: 'UInput', replacement: 'UEmailInput' } }] },
      ],
    })
  })

  it('spells replacements with the configured prefix', () => {
    tester.run('prefer-u-form-controls', rule, {
      valid: [],
      invalid: [
        { code: '<template><input type="text"></template>', settings: { '@nustack/nuxt-ui': { enabled: true, prefix: 'Nu' } }, errors: [{ messageId: 'preferUFormControl', data: { tag: 'input', replacement: 'NuInput' } }] },
        { code: '<template><NuInput type="number" /></template>', settings: { '@nustack/nuxt-ui': { enabled: true, prefix: 'Nu' } }, errors: [{ messageId: 'preferSpecificControl', data: { type: 'number', component: 'NuInput', replacement: 'NuInputNumber' } }] },
      ],
    })
  })
})
