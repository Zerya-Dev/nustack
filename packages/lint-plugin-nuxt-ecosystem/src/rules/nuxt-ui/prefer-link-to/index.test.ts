import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { nuxtUiPlugin } from '../../../index.js'

describe('prefer-link-to', () => {
  it('prefers to on link-capable components', () => {
    tester.run('prefer-link-to', nuxtUiPlugin.rules['prefer-link-to'], {
      valid: [{ code: '<template><ULink to="/docs">Docs</ULink></template>' }],
      invalid: [{ code: '<template><UButton href="/docs">Docs</UButton></template>', errors: [{ messageId: 'preferTo' }] }],
    })
  })
})
