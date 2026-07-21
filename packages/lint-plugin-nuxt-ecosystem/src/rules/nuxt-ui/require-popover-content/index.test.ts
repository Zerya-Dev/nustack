import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import vueParser from 'vue-eslint-parser'
import plugin from '../../../index.js'

describe('require-popover-content', () => {
  it('requires the content slot', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parser: vueParser } })
    tester.run('require-popover-content', plugin.rules?.['require-popover-content'] as never, {
      valid: [{ filename: 'component.vue', code: '<template><UPopover><UButton /><template #content>Details</template></UPopover></template>' }],
      invalid: [{ filename: 'component.vue', code: '<template><UPopover :content="{ side: \'right\' }"><UButton /></UPopover></template>', errors: [{ messageId: 'missingContent' }] }],
    })
  })
})
