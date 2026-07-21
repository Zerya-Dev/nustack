import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import vueParser from 'vue-eslint-parser'
import plugin from '../../../index.js'

describe('prefer-semantic-colors', () => {
  it('prefers semantic tokens', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parser: vueParser } })
    tester.run('prefer-semantic-colors', plugin.rules?.['prefer-semantic-colors'] as never, {
      valid: [{ filename: 'component.vue', code: '<template><div class="text-muted bg-elevated" /></template>' }],
      invalid: [
        { filename: 'component.vue', code: '<template><div class="text-gray-500" /></template>', errors: [{ messageId: 'semantic' }] },
        { filename: 'component.vue', code: '<template><div class="dark:ring-zinc-800/50" /></template>', errors: [{ messageId: 'semantic' }] },
      ],
    })
  })
})
