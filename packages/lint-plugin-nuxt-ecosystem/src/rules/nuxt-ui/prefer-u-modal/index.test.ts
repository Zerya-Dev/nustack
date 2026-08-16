import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { nuxtUiPlugin } from '../../../index.js'

describe('prefer-u-modal', () => {
  it('prefers UModal', () => {
    tester.run('prefer-u-modal', nuxtUiPlugin.rules['prefer-u-modal'], {
      valid: [{ code: '<template><UModal title="Confirm" /></template>' }],
      invalid: [{ code: '<template><dialog>Confirm</dialog></template>', errors: [{ messageId: 'preferUModal' }] }],
    })
  })
})
