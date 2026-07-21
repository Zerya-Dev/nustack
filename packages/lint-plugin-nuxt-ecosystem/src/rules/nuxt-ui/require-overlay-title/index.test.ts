import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import vueParser from 'vue-eslint-parser'
import plugin from '../../../index.js'

describe('require-overlay-title', () => {
  it('requires an accessible title', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parser: vueParser } })
    tester.run('require-overlay-title', plugin.rules?.['require-overlay-title'] as never, {
      valid: [
        { filename: 'component.vue', code: '<template><UModal title="Settings" /></template>' },
        { filename: 'component.vue', code: '<template><UDrawer aria-label="Navigation" /></template>' },
        { filename: 'component.vue', code: '<template><USlideover><template #title>Help</template></USlideover></template>' },
      ],
      invalid: [{ filename: 'component.vue', code: '<template><UModal /></template>', errors: [{ messageId: 'missingTitle' }] }],
    })
  })
})
