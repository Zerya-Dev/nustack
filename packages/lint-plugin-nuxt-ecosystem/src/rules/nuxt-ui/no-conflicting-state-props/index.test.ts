import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { nuxtUiPlugin } from '../../../index.js'

describe('no-conflicting-state-props', () => {
  it('separates controlled and uncontrolled state', () => {
    tester.run('no-conflicting-state-props', nuxtUiPlugin.rules['no-conflicting-state-props'], {
      valid: [
        { code: '<template><UModal v-model:open="open" /></template>' },
        { code: '<template><UInput default-value="Draft" /></template>' },
        { code: '<template><UserCard default-value="a" model-value="b" /></template>' },
        { code: '<template><UModal v-bind="props" /></template>' },
        { code: '<template><UModal default-open :open="undefined" /></template>' },
        { code: '<template><UModal default-open :open="null" /></template>' },
        { code: '<template><UInput default-value="Draft" :model-value="undefined" /></template>' },
        { code: '<template><UModal :default-open="undefined" open /></template>' },
      ],
      invalid: [
        { code: '<template><UModal v-model:open="open" default-open /></template>', errors: [{ messageId: 'conflicting' }] },
        { code: '<template><UInput v-model="value" default-value="Draft" /></template>', errors: [{ messageId: 'conflicting' }] },
        { code: '<template><UInput v-bind="{ defaultValue: \'Draft\', modelValue: value }" /></template>', errors: [{ messageId: 'conflicting' }] },
        { code: '<template><UModal default-open v-model:[`open`]="open" /></template>', errors: [{ messageId: 'conflicting' }] },
      ],
    })
  })
})
