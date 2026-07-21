import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import vueParser from 'vue-eslint-parser'
import plugin from '../../../index.js'

describe('prefer-u-modal', () => {
  it('prefers UModal', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parser: vueParser } })
    tester.run('prefer-u-modal', plugin.rules?.['prefer-u-modal'] as never, {
      valid: [{ filename: 'component.vue', code: '<template><UModal title="Confirm" /></template>' }],
      invalid: [{ filename: 'component.vue', code: '<template><dialog>Confirm</dialog></template>', errors: [{ messageId: 'preferUModal' }] }],
    })
  })
})
