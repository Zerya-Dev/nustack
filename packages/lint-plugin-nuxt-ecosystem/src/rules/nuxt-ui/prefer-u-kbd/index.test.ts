import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { nuxtUiPlugin } from '../../../index.js'

describe('prefer-u-kbd', () => {
  it('prefers UKbd', () => {
    tester.run('prefer-u-kbd', nuxtUiPlugin.rules['prefer-u-kbd'], {
      valid: [{ code: '<template><UKbd value="K" /></template>' }],
      invalid: [{ code: '<template><kbd>K</kbd></template>', errors: [{ messageId: 'preferUKbd' }] }],
    })
  })
})
