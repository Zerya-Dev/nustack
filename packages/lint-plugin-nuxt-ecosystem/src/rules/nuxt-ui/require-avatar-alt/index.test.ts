import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import vueParser from 'vue-eslint-parser'
import plugin from '../../../index.js'

describe('require-avatar-alt', () => {
  it('requires alt for image avatars', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parser: vueParser } })
    tester.run('require-avatar-alt', plugin.rules?.['require-avatar-alt'] as never, {
      valid: [
        { filename: 'component.vue', code: '<template><UAvatar src="/avatar.png" alt="Ada" /></template>' },
        { filename: 'component.vue', code: '<template><UAvatar src="/mark.svg" aria-hidden="true" /></template>' },
      ],
      invalid: [{ filename: 'component.vue', code: '<template><UAvatar src="/avatar.png" /></template>', errors: [{ messageId: 'missingAlt' }] }],
    })
  })
})
