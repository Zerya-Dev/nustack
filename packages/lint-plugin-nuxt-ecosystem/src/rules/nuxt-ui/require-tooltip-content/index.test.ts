import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import vueParser from 'vue-eslint-parser'
import plugin from '../../../index.js'

describe('require-tooltip-content', () => {
  it('requires text or content slot', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parser: vueParser } })
    tester.run('require-tooltip-content', plugin.rules?.['require-tooltip-content'] as never, {
      valid: [
        { filename: 'component.vue', code: '<template><UTooltip text="Settings"><UButton /></UTooltip></template>' },
        { filename: 'component.vue', code: '<template><UTooltip><template #content>Settings</template></UTooltip></template>' },
      ],
      invalid: [{ filename: 'component.vue', code: '<template><UTooltip><UButton /></UTooltip></template>', errors: [{ messageId: 'missingContent' }] }],
    })
  })
})
