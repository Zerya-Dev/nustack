import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { nuxtImagePlugin } from '../../../index.js'

describe('no-assets-src', () => {
  it('reports build-time assets aliases in src', () => {
    tester.run('no-assets-src', nuxtImagePlugin.rules['no-assets-src'], {
      valid: [
        '<template><NuxtImg src="/hero.png" alt="" /></template>',
        '<template><NuxtImg src="https://cdn.example.com/assets/hero.png" alt="" /></template>',
        '<template><NuxtImg :src="hero" alt="" /></template>',
        '<template><NuxtImg src="/assets/hero.png" alt="" /></template>',
        '<template><img src="~/assets/hero.png" alt=""></template>',
        '<template><UAvatar src="~/assets/hero.png" /></template>',
        '<template><UColorModeImage light="/l.png" dark="/d.png" alt="" /></template>',
      ],
      invalid: [
        {
          code: '<template><NuxtImg src="~/assets/hero.png" alt="" /></template>',
          errors: [{ messageId: 'assetsSrc', data: { component: 'NuxtImg', attribute: 'src', src: '~/assets/hero.png' } }],
        },
        { code: '<template><NuxtImg src="@/assets/hero.png" alt="" /></template>', errors: [{ messageId: 'assetsSrc' }] },
        { code: '<template><NuxtImg src="~~/assets/hero.png" alt="" /></template>', errors: [{ messageId: 'assetsSrc' }] },
        { code: '<template><NuxtImg src="~assets/hero.png" alt="" /></template>', errors: [{ messageId: 'assetsSrc' }] },
        { code: '<template><NuxtPicture src="~/assets/hero.png" alt="" /></template>', errors: [{ messageId: 'assetsSrc' }] },
        { code: '<template><NuxtImg :src="\'~/assets/hero.png\'" alt="" /></template>', errors: [{ messageId: 'assetsSrc' }] },
        {
          code: '<template><ProseImg src="~/assets/hero.png" alt="" /></template>',
          settings: { '@nustack/nuxt-ui': { enabled: true, prefix: 'U' } },
          errors: [{ messageId: 'assetsSrc', data: { component: 'ProseImg', attribute: 'src', src: '~/assets/hero.png' } }],
        },
        {
          code: '<template><UColorModeImage light="~/assets/l.png" dark="~/assets/d.png" alt="" /></template>',
          settings: { '@nustack/nuxt-ui': { enabled: true, prefix: 'U' } },
          errors: [
            { messageId: 'assetsSrc', data: { component: 'UColorModeImage', attribute: 'light', src: '~/assets/l.png' } },
            { messageId: 'assetsSrc', data: { component: 'UColorModeImage', attribute: 'dark', src: '~/assets/d.png' } },
          ],
        },
      ],
    })
  })
})
