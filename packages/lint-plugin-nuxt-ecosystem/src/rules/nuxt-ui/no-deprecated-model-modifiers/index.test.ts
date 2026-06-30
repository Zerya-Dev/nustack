import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import vueParser from 'vue-eslint-parser'
import plugin from '../../../index.js'

const rule = plugin.rules?.['no-deprecated-model-modifiers']

describe('no-deprecated-model-modifiers', () => {
  it('reports the renamed v-model.nullify modifier', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parser: vueParser } })

    tester.run('no-deprecated-model-modifiers', rule as never, {
      valid: [
        { filename: 'component.vue', code: '<template><UInput v-model.nullable="value" /></template>' },
        { filename: 'component.vue', code: '<template><UInput v-model="value" /></template>' },
        { filename: 'component.vue', code: '<template><input v-model.nullify="value"></template>' },
      ],
      invalid: [
        { filename: 'component.vue', code: '<template><UInput v-model.nullify="value" /></template>', errors: [{ messageId: 'preferNullable' }] },
        { filename: 'component.vue', code: '<template><UInputNumber v-model.nullify="value" /></template>', errors: [{ messageId: 'preferNullable' }] },
        { filename: 'component.vue', code: '<template><UTextarea v-model.nullify="value" /></template>', errors: [{ messageId: 'preferNullable' }] },
        // Extended via options: extra modifier rename and a custom target component.
        { filename: 'component.vue', code: '<template><UInput v-model.coerce="value" /></template>', options: [{ modifiers: { coerce: 'transform' } }], errors: [{ messageId: 'preferNullable' }] },
        { filename: 'component.vue', code: '<template><UCustom v-model.nullify="value" /></template>', options: [{ components: ['ucustom'] }], errors: [{ messageId: 'preferNullable' }] },
      ],
    })
  })
})
