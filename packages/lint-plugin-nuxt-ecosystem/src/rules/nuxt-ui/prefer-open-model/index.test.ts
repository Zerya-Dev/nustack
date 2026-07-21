import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import vueParser from 'vue-eslint-parser'
import plugin from '../../../index.js'

describe('prefer-open-model', () => {
  it('requires named open model', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parser: vueParser } })
    tester.run('prefer-open-model', plugin.rules?.['prefer-open-model'] as never, {
      valid: [{ filename: 'component.vue', code: '<template><UModal v-model:open="open" /></template>' }],
      invalid: [{ filename: 'component.vue', code: '<template><UModal v-model="open" /></template>', errors: [{ messageId: 'preferOpen' }] }],
    })
  })
})
