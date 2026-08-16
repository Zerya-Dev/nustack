import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { nuxtUiPlugin } from '../../../index.js'

describe('prefer-u-separator', () => {
  it('prefers USeparator', () => {
    tester.run('prefer-u-separator', nuxtUiPlugin.rules['prefer-u-separator'], {
      valid: [{ code: '<template><USeparator /></template>' }],
      invalid: [{ code: '<template><hr></template>', errors: [{ messageId: 'preferUSeparator' }] }],
    })
  })
})
