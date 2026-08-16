import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { nuxtUiPlugin } from '../../../index.js'

const rule = nuxtUiPlugin.rules['prefer-u-button']

describe('prefer-u-button', () => {
  it('reports raw buttons in Vue templates', () => {
    tester.run('prefer-u-button', rule, {
      valid: [
        { code: '<template><UButton>Save</UButton></template>' },
      ],
      invalid: [
        {
          code: '<template><button>Save</button></template>',
          errors: [{ messageId: 'preferUButton' }],
        },
      ],
    })
  })
})
