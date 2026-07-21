import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import vueParser from 'vue-eslint-parser'
import plugin from '../../../index.js'

describe('no-invalid-icon-name', () => {
  it('checks static Iconify names', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parser: vueParser } })
    tester.run('no-invalid-icon-name', plugin.rules?.['no-invalid-icon-name'] as never, {
      valid: [
        { filename: 'component.vue', code: '<template><UIcon name="i-lucide-search" /></template>' },
        { filename: 'component.vue', code: '<template><UIcon :name="IconSearch" /></template>' },
        { filename: 'component.vue', code: '<template><UButton icon="brand-logo" /></template>', options: [{ names: ['brand-logo'] }] },
      ],
      invalid: [{ filename: 'component.vue', code: '<template><UButton icon="search" /></template>', errors: [{ messageId: 'invalidName' }] }],
    })
  })
})
