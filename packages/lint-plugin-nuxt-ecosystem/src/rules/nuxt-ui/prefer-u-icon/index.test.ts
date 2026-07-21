import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import vueParser from 'vue-eslint-parser'
import plugin from '../../../index.js'

describe('prefer-u-icon', () => {
  it('prefers UIcon for Iconify classes', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parser: vueParser } })
    tester.run('prefer-u-icon', plugin.rules?.['prefer-u-icon'] as never, {
      valid: [{ filename: 'component.vue', code: '<template><UIcon name="i-lucide-search" /></template>' }],
      invalid: [{ filename: 'component.vue', code: '<template><i class="i-lucide-search" /></template>', errors: [{ messageId: 'preferIcon' }] }],
    })
  })
})
