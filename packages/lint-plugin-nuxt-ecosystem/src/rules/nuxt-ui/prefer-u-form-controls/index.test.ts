import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import vueParser from 'vue-eslint-parser'
import plugin from '../../../index.js'

const rule = plugin.rules?.['prefer-u-form-controls']

describe('prefer-u-form-controls', () => {
  it('reports raw form controls and type-specialized inputs in Vue templates', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parser: vueParser } })

    tester.run('prefer-u-form-controls', rule as never, {
      valid: [
        { filename: 'component.vue', code: '<template><UInput /></template>' },
        { filename: 'component.vue', code: '<template><UInput type="text" /></template>' },
        { filename: 'component.vue', code: '<template><UInput :type="kind" /></template>' },
        { filename: 'component.vue', code: '<template><input data-raw></template>' },
        { filename: 'component.vue', code: '<template><UInput type="number" data-raw /></template>' },
      ],
      invalid: [
        { filename: 'component.vue', code: '<template><input></template>', errors: [{ messageId: 'preferUFormControl' }] },
        { filename: 'component.vue', code: '<template><input type="number"></template>', errors: [{ messageId: 'preferUFormControl' }] },
        { filename: 'component.vue', code: '<template><select></select></template>', errors: [{ messageId: 'preferUFormControl' }] },
        { filename: 'component.vue', code: '<template><textarea></textarea></template>', errors: [{ messageId: 'preferUFormControl' }] },
        { filename: 'component.vue', code: '<template><UInput type="number" /></template>', errors: [{ messageId: 'preferSpecificControl' }] },
        { filename: 'component.vue', code: '<template><UInput type="file" /></template>', errors: [{ messageId: 'preferSpecificControl' }] },
      ],
    })
  })
})
