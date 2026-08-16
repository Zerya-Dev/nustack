import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { nuxtUiPlugin } from '../../../index.js'

describe('require-tooltip-content', () => {
  it('requires text or content slot', () => {
    tester.run('require-tooltip-content', nuxtUiPlugin.rules['require-tooltip-content'], {
      valid: [
        { code: '<template><UTooltip text="Settings"><UButton /></UTooltip></template>' },
        { code: '<template><UTooltip><template #content>Settings</template></UTooltip></template>' },
      ],
      invalid: [{ code: '<template><UTooltip><UButton /></UTooltip></template>', errors: [{ messageId: 'missingContent' }] }],
    })
  })
})
