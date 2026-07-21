import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import vueParser from 'vue-eslint-parser'
import plugin from '../../../index.js'

describe('prefer-u-progress', () => {
  it('prefers UProgress', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parser: vueParser } })
    tester.run('prefer-u-progress', plugin.rules?.['prefer-u-progress'] as never, {
      valid: [{ filename: 'component.vue', code: '<template><UProgress :model-value="50" /></template>' }],
      invalid: [{ filename: 'component.vue', code: '<template><progress value="50" max="100" /></template>', errors: [{ messageId: 'preferUProgress' }] }],
    })
  })
})
