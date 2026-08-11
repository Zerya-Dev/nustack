import type { Context, ESTree, Rule, Visitor } from '@oxlint/plugins'
import { docsUrl } from '../../utils/docs-url.js'

const DATA_COMPOSABLES = new Map([
  ['useLazyFetch', 'useFetch'],
  ['useLazyAsyncData', 'useAsyncData'],
])

export const preferLazyDataOption: Rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer regular Nuxt data composables with `lazy: true` over dedicated lazy composables.',
      url: docsUrl('prefer-lazy-data-option'),
    },
    schema: [],
    messages: {
      preferLazyOption: 'Use `{{ preferred }}()` with `lazy: true` instead of `{{ actual }}()`.',
    },
  },
  create(context: Context): Visitor {
    return {
      CallExpression(node: ESTree.CallExpression): void {
        if (node.callee.type !== 'Identifier')
          return

        const actual = node.callee.name
        const preferred = DATA_COMPOSABLES.get(actual)
        if (preferred) {
          context.report({
            node: node.callee,
            messageId: 'preferLazyOption',
            data: { actual, preferred },
          })
        }
      },
    }
  },
}
