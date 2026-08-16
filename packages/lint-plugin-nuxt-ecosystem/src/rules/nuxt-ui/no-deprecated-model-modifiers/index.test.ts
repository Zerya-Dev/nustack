import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { nuxtUiPlugin } from '../../../index.js'

const rule = nuxtUiPlugin.rules['no-deprecated-model-modifiers']

describe('no-deprecated-model-modifiers', () => {
  it('reports the renamed v-model.nullify modifier', () => {
    tester.run('no-deprecated-model-modifiers', rule, {
      valid: [
        { code: '<template><UInput v-model.nullable="value" /></template>' },
        { code: '<template><UInput v-model="value" /></template>' },
        { code: '<template><input v-model.nullify="value"></template>' },
      ],
      invalid: [
        { code: '<template><UInput v-model.nullify="value" /></template>', output: '<template><UInput v-model.nullable="value" /></template>', errors: [{ messageId: 'preferNullable' }] },
        { code: '<template><UInputNumber v-model.nullify="value" /></template>', output: '<template><UInputNumber v-model.nullable="value" /></template>', errors: [{ messageId: 'preferNullable' }] },
        { code: '<template><UTextarea v-model.nullify="value" /></template>', output: '<template><UTextarea v-model.nullable="value" /></template>', errors: [{ messageId: 'preferNullable' }] },
        { code: '<template><UTextarea v-model="value" :model-modifiers="{ nullify: true }" /></template>', output: '<template><UTextarea v-model="value" :model-modifiers="{ nullable: true }" /></template>', errors: [{ messageId: 'preferNullable' }] },
        { code: '<template><UTextarea v-model="value" :modelModifiers="{ nullify }" /></template>', output: '<template><UTextarea v-model="value" :modelModifiers="{ nullable: nullify }" /></template>', errors: [{ messageId: 'preferNullable' }] },
        { code: '<template><UInput v-model.coerce="value" /></template>', options: [{ modifiers: { coerce: 'transform' } }], output: '<template><UInput v-model.transform="value" /></template>', errors: [{ messageId: 'preferNullable' }] },
        { code: '<template><UCustom v-model.nullify="value" /></template>', options: [{ components: ['Custom'] }], output: '<template><UCustom v-model.nullable="value" /></template>', errors: [{ messageId: 'preferNullable' }] },
      ],
    })
  })
})
