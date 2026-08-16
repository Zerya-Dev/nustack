import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { nuxtImagePlugin } from '../../../index.js'

describe('prefer-nuxt-img', () => {
  it('reports raw images outside picture markup', () => {
    tester.run('prefer-nuxt-img', nuxtImagePlugin.rules['prefer-nuxt-img'], {
      valid: [
        '<template><NuxtImg src="/hero.png" alt="" /></template>',
        '<template><picture><source srcset="/hero.avif"><img src="/hero.png" alt=""></picture></template>',
        '<template><NuxtPicture src="/hero.png" alt=""><img src="/hero.png" alt=""></NuxtPicture></template>',
        '<template><Img src="/hero.png" /></template>',
        '<template><svg><image href="/hero.png" /></svg></template>',
      ],
      invalid: [
        { code: '<template><img src="/hero.png" alt=""></template>', errors: [{ messageId: 'preferNuxtImg' }] },
        {
          code: '<template><div><img src="/hero.png" alt=""></div></template>',
          errors: [{ messageId: 'preferNuxtImg' }],
        },
      ],
    })
  })
})
