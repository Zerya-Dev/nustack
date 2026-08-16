import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { nuxtUiPlugin } from '../../../index.js'

describe('prefer-u-icon', () => {
  it('prefers UIcon for Iconify classes', () => {
    tester.run('prefer-u-icon', nuxtUiPlugin.rules['prefer-u-icon'], {
      valid: [{ code: '<template><UIcon name="i-lucide-search" /></template>' }],
      invalid: [
        { code: '<template><i class="i-lucide-search" /></template>', errors: [{ messageId: 'preferIcon', data: { component: 'UIcon', icon: 'i-lucide-search' } }] },
        { code: '<template><i class="i-lucide-search" /></template>', settings: { '@nustack/nuxt-ui': { enabled: true, prefix: 'Nu' } }, errors: [{ messageId: 'preferIcon', data: { component: 'NuIcon', icon: 'i-lucide-search' } }] },
      ],
    })
  })
})
