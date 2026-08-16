import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { nuxtUiPlugin } from '../../../index.js'

describe('require-overlay-title', () => {
  it('requires an accessible title', () => {
    tester.run('require-overlay-title', nuxtUiPlugin.rules['require-overlay-title'], {
      valid: [
        { code: '<template><UModal title="Settings" /></template>' },
        { code: '<template><UDrawer aria-label="Navigation" /></template>' },
        { code: '<template><USlideover><template #title>Help</template></USlideover></template>' },
      ],
      invalid: [{ code: '<template><UModal /></template>', errors: [{ messageId: 'missingTitle' }] }],
    })
  })
})
