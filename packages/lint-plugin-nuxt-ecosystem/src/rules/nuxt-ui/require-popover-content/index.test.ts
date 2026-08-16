import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { nuxtUiPlugin } from '../../../index.js'

describe('require-popover-content', () => {
  it('requires the content slot', () => {
    tester.run('require-popover-content', nuxtUiPlugin.rules['require-popover-content'], {
      valid: [{ code: '<template><UPopover><UButton /><template #content>Details</template></UPopover></template>' }],
      invalid: [{ code: '<template><UPopover :content="{ side: \'right\' }"><UButton /></UPopover></template>', errors: [{ messageId: 'missingContent' }] }],
    })
  })
})
