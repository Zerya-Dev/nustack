import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { nuxtImagePlugin } from '../../../index.js'

const settings = (prefix = 'U') => ({ '@nustack/nuxt-ui': { enabled: true, prefix } })

function sfc(script: string, template: string): string {
  return `<script setup lang="ts">${script}</script><template>${template}</template>`
}

describe('require-image-alt', () => {
  it('requires alt on the @nuxt/image components', () => {
    tester.run('require-image-alt', nuxtImagePlugin.rules['require-image-alt'], {
      valid: [
        '<template><NuxtImg src="/ada.png" alt="Ada" /></template>',
        '<template><nuxt-img src="/ada.png" alt="Ada" /></template>',
        '<template><NuxtPicture src="/ada.png" alt="Ada" /></template>',
        '<template><NuxtImg src="/pattern.png" alt="" /></template>',
        '<template><NuxtImg src="/pattern.png" aria-hidden="true" /></template>',
        '<template><NuxtImg v-bind="props" /></template>',
        sfc('const NuxtImg = defineComponent({})', '<NuxtImg src="/ada.png" />'),
        sfc('import NuxtImg from \'./MyImg.vue\'', '<NuxtImg src="/ada.png" />'),
        '<template><img src="/ada.png"></template>',
        '<template><UColorModeImage light="/l.png" dark="/d.png" alt="Logo" /></template>',
        '<template><ProseImg src="/ada.png" alt="Ada" /></template>',
        '<template><UColorModeImage light="/l.png" dark="/d.png" /></template>',
        '<template><ProseImg src="/ada.png" /></template>',
        { code: '<template><UColorModeImage light="/l.png" dark="/d.png" /></template>', settings: settings('Nu') },
      ],
      invalid: [
        {
          code: '<template><NuxtImg src="/ada.png" /></template>',
          errors: [{ messageId: 'missingAlt', data: { component: 'NuxtImg' } }],
        },
        {
          code: '<template><NuxtPicture src="/ada.png" width="10" height="10" /></template>',
          errors: [{ messageId: 'missingAlt' }],
        },
        { code: '<template><LazyNuxtImg src="/ada.png" /></template>', errors: [{ messageId: 'missingAlt' }] },
        { code: '<template><nuxt-picture src="/ada.png" /></template>', errors: [{ messageId: 'missingAlt' }] },
        {
          code: sfc('import { NuxtImg as Img } from \'@nuxt/image/components/NuxtImg.vue\'', '<Img src="/ada.png" />'),
          errors: [{ messageId: 'missingAlt' }],
        },
        {
          code: sfc('import { NuxtImg as Img } from \'#components\'', '<Img src="/ada.png" />'),
          errors: [{ messageId: 'missingAlt' }],
        },
        { code: '<template><NuxtImg src="/ada.png" :alt="undefined" /></template>', errors: [{ messageId: 'missingAlt' }] },
        { code: '<template><NuxtImg src="/ada.png" aria-hidden="false" /></template>', errors: [{ messageId: 'missingAlt' }] },
        { code: '<template><NuxtImg src="/ada.png" :aria-hidden="false" /></template>', errors: [{ messageId: 'missingAlt' }] },
        {
          code: '<template><UColorModeImage light="/l.png" dark="/d.png" /></template>',
          settings: settings(),
          errors: [{ messageId: 'missingAlt', data: { component: 'UColorModeImage' } }],
        },
        {
          code: '<template><ProseImg src="/ada.png" /></template>',
          settings: settings(),
          errors: [{ messageId: 'missingAlt', data: { component: 'ProseImg' } }],
        },
        {
          code: '<template><NuColorModeImage light="/l.png" dark="/d.png" /></template>',
          settings: settings('Nu'),
          errors: [{ messageId: 'missingAlt', data: { component: 'NuColorModeImage' } }],
        },
      ],
    })
  })
})
