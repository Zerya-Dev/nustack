import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { nuxtUiPlugin } from '../../../index.js'

describe('require-avatar-alt', () => {
  it('requires alt for image avatars', () => {
    tester.run('require-avatar-alt', nuxtUiPlugin.rules['require-avatar-alt'], {
      valid: [
        { code: '<template><UAvatar src="/avatar.png" alt="Ada" /></template>' },
        { code: '<template><UAvatar src="/mark.svg" aria-hidden="true" /></template>' },
        { code: '<template><UAvatar :src="null" /></template>' },
        { code: '<template><UAvatar src="/decor.svg" alt="" /></template>' },
        { code: '<template><UAvatar v-bind="{ src: \'/ada.png\', alt: \'Ada\' }" /></template>' },
      ],
      invalid: [
        { code: '<template><UAvatar src="/avatar.png" /></template>', errors: [{ messageId: 'missingAlt' }] },
        { code: '<template><UAvatar src="/avatar.png" :aria-hidden="false" /></template>', errors: [{ messageId: 'missingAlt' }] },
        { code: '<template><UAvatar src="/avatar.png" :aria-hidden="hidden" /></template>', errors: [{ messageId: 'missingAlt' }] },
        { code: '<template><UAvatar v-bind="{ src: \'/avatar.png\' }" /></template>', errors: [{ messageId: 'missingAlt' }] },
        { code: '<template><UAvatar src="/avatar.png" :alt="undefined" /></template>', errors: [{ messageId: 'missingAlt' }] },
      ],
    })
  })
})
