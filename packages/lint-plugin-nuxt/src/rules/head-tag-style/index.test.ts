import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import vueParser from 'vue-eslint-parser'
import plugin from '../../index.js'

const rule = plugin.rules?.['head-tag-style']
const languageOptions = { ecmaVersion: 'latest' as const, sourceType: 'module' as const, parser: vueParser }

describe('head-tag-style', () => {
  it('defaults to useHead and reports Nuxt head components', () => {
    const tester = new RuleTester({ languageOptions })

    tester.run('head-tag-style', rule as never, {
      valid: [
        {
          filename: 'component.vue',
          code: '<script setup lang="ts">useHead({ title: \'Hello\' })</script><template><div /></template>',
        },
        {
          filename: 'component.vue',
          code: '<template><div><title /><base /><noscript /><style /><meta /><link /><body /><html /><head /></div></template>',
        },
        { filename: 'component.vue', code: '<template><HeadlessDialog /></template>' },
      ],
      invalid: [
        {
          filename: 'component.vue',
          code: '<template><Html><Head><Title /><Base /><NoScript /><Style /><Meta /><Link /><Body /></Head></Html></template>',
          errors: Array.from({ length: 9 }, () => ({ messageId: 'preferUseHead' })),
        },
        {
          filename: 'component.vue',
          code: '<template><Meta /></template>',
          options: [{ variant: 'useHead' }],
          errors: [{ messageId: 'preferUseHead', data: { name: 'Meta' } }],
        },
      ],
    })
  })

  it('can require head components instead of useHead', () => {
    const tester = new RuleTester({ languageOptions })
    const options = [{ variant: 'components' }]

    tester.run('head-tag-style', rule as never, {
      valid: [
        {
          filename: 'component.vue',
          code: '<template><Head><Title>Hello</Title><Meta name="description" content="Hello" /></Head></template>',
          options,
        },
        {
          filename: 'component.vue',
          code: '<script setup lang="ts">useSeoMeta({ title: \'Hello\' }); api.useHead({})</script><template><div /></template>',
          options,
        },
      ],
      invalid: [
        {
          filename: 'component.vue',
          code: '<script setup lang="ts">useHead({ title: \'Hello\' })</script><template><Head><Title>Hello</Title></Head></template>',
          options,
          errors: [{ messageId: 'preferComponents' }],
        },
        {
          filename: 'composable.ts',
          code: 'useHead({ meta: [] })',
          options,
          errors: [{ messageId: 'preferComponents' }],
        },
      ],
    })
  })
})
