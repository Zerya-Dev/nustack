import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../utils/docs-url.js'

interface Options {
  additionalNames?: string[]
  ignoreNames?: string[]
}

const defaultCollidingNames = [
  'useCookie',
  'useFetch',
  'useHead',
  'useImage',
  'useRequestEvent',
  'useRoute',
  'useRouter',
  'useRuntimeConfig',
  'useSeoMeta',
  'useState',
  'useStorage',
]

export const noNuxtAutoImportCollision: Rule = {
  meta: {
    type: 'problem',
    docs: { description: 'Require aliases for VueUse imports that collide with common Nuxt auto-imports.', url: docsUrl('no-nuxt-auto-import-collision') },
    schema: [
      {
        type: 'object',
        additionalProperties: false,
        properties: {
          additionalNames: {
            type: 'array',
            items: { type: 'string' },
          },
          ignoreNames: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
    ],
    messages: {
      noCollision: '`{{name}}` from @vueuse/core can collide with Nuxt auto-imports. Import it with an alias, for example `{{name}} as vueuse{{name}}`.',
    },
  },
  createOnce(context: any) {
    return {
      ImportDeclaration(node: any) {
        if (node.source.value !== '@vueuse/core')
          return

        const options = (context.options?.[0] ?? {}) as Options
        const collidingNames = new Set([...defaultCollidingNames, ...(options.additionalNames ?? [])])

        for (const name of options.ignoreNames ?? [])
          collidingNames.delete(name)

        for (const specifier of node.specifiers) {
          if (specifier.type !== 'ImportSpecifier')
            continue

          const imported = specifier.imported?.name ?? specifier.imported?.value
          const local = specifier.local?.name

          if (typeof imported === 'string' && collidingNames.has(imported) && local === imported) {
            context.report({
              node: specifier,
              messageId: 'noCollision',
              data: { name: imported },
            })
          }
        }
      },
    }
  },
}
