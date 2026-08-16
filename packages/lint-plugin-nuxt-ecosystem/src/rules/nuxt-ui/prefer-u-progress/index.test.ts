import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { nuxtUiPlugin } from '../../../index.js'

describe('prefer-u-progress', () => {
  it('prefers UProgress', () => {
    tester.run('prefer-u-progress', nuxtUiPlugin.rules['prefer-u-progress'], {
      valid: [{ code: '<template><UProgress :model-value="50" /></template>' }],
      invalid: [{ code: '<template><progress value="50" max="100" /></template>', errors: [{ messageId: 'preferUProgress' }] }],
    })
  })
})
