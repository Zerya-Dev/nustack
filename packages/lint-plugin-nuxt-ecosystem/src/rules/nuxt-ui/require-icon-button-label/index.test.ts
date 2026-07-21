import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import vueParser from 'vue-eslint-parser'
import plugin from '../../../index.js'

describe('require-icon-button-label', () => {
  it('labels icon-only buttons', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parser: vueParser } })
    tester.run('require-icon-button-label', plugin.rules?.['require-icon-button-label'] as never, {
      valid: [
        { filename: 'component.vue', code: '<template><UButton icon="i-lucide-search" aria-label="Search" /></template>' },
        { filename: 'component.vue', code: '<template><UButton icon="i-lucide-save">Save</UButton></template>' },
      ],
      invalid: [{ filename: 'component.vue', code: '<template><UButton icon="i-lucide-search" /></template>', errors: [{ messageId: 'missingLabel' }] }],
    })
  })
})
