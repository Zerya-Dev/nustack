import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import vueParser from 'vue-eslint-parser'
import plugin from '../../../index.js'

describe('prefer-u-kbd', () => {
  it('prefers UKbd', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parser: vueParser } })
    tester.run('prefer-u-kbd', plugin.rules?.['prefer-u-kbd'] as never, {
      valid: [{ filename: 'component.vue', code: '<template><UKbd value="K" /></template>' }],
      invalid: [{ filename: 'component.vue', code: '<template><kbd>K</kbd></template>', errors: [{ messageId: 'preferUKbd' }] }],
    })
  })
})
