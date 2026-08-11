import type { Context, ESTree, Rule, Visitor } from '@oxlint/plugins'
import { staticString } from '../../utils/ast.js'
import { docsUrl } from '../../utils/docs-url.js'
import { createImportedCallMatcher } from '../../utils/imports.js'

const ASYNC_DATA_COMPOSABLES = new Set([
  'useAsyncData',
  'useLazyAsyncData',
])
const NUXT_IMPORT_SOURCES = new Set(['#app', '#imports', 'nuxt/app'])
function isEmptyString(node: ESTree.Argument): boolean {
  return staticString(node, { unwrap: true }) === ''
}

export const noEmptyAsyncDataKey: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow empty explicit keys in Nuxt async-data composables.',
      url: docsUrl('no-empty-async-data-key'),
    },
    schema: [],
    messages: {
      emptyKey: '`{{ name }}` key must be a non-empty string. Pass a non-empty string as the first argument to `{{ name }}()`.',
    },
  },
  create(context: Context): Visitor {
    const sourceCode = context.sourceCode
    const { collectImports, importedCallName } = createImportedCallMatcher(sourceCode, {
      importSources: NUXT_IMPORT_SOURCES,
      names: ASYNC_DATA_COMPOSABLES,
    })

    return {
      Program: collectImports,
      CallExpression(node: ESTree.CallExpression): void {
        const name = importedCallName(node)
        const key = node.arguments[0]
        if (!name || !key || key.type === 'SpreadElement' || !isEmptyString(key))
          return

        context.report({
          node: key,
          messageId: 'emptyKey',
          data: { name },
        })
      },
    }
  },
}
