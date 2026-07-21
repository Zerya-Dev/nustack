import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import vueParser from 'vue-eslint-parser'
import plugin from '../../../index.js'

describe('prefer-u-separator', () => {
  it('prefers USeparator', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parser: vueParser } })
    tester.run('prefer-u-separator', plugin.rules?.['prefer-u-separator'] as never, {
      valid: [{ filename: 'component.vue', code: '<template><USeparator /></template>' }],
      invalid: [{ filename: 'component.vue', code: '<template><hr></template>', errors: [{ messageId: 'preferUSeparator' }] }],
    })
  })
})
