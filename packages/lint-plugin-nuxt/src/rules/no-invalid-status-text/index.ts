// FIXME: This rule should be removed after migration to oxlint, because `statusText` property is deprecated and oxlint detects it properly

import type { Context, ESTree, Rule, Visitor } from '@oxlint/plugins'
import { staticPropertyName, staticString, unwrapExpression } from '../../utils/ast.js'
import { docsUrl } from '../../utils/docs-url.js'
import { createImportedCallMatcher } from '../../utils/imports.js'

const CREATE_ERROR_IMPORT_SOURCES = new Set(['#app', '#imports', 'h3', 'nuxt/app'])
const INVALID_STATUS_TEXT_CHARACTER_RE = /[^\t\u0020-\u007E]/u
export const noInvalidStatusText: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow non-HTTP-compliant characters in `createError()` status text.',
      url: docsUrl('no-invalid-status-text'),
    },
    schema: [],
    messages: {
      invalidStatusText: '`statusText` may contain only horizontal tabs, spaces, and visible ASCII characters. Use `message` for detailed, multi-line, or non-ASCII content.',
    },
  },
  create(context: Context): Visitor {
    const sourceCode = context.sourceCode
    const { collectImports, importedCallName } = createImportedCallMatcher(sourceCode, {
      importSources: CREATE_ERROR_IMPORT_SOURCES,
      names: new Set(['createError']),
    })

    return {
      Program: collectImports,
      CallExpression(node: ESTree.CallExpression): void {
        if (importedCallName(node) !== 'createError')
          return

        const argument = node.arguments[0]
        if (!argument || argument.type === 'SpreadElement')
          return
        const details = unwrapExpression(argument)
        if (details?.type !== 'ObjectExpression')
          return

        for (const property of details.properties) {
          if (property.type !== 'Property' || property.kind !== 'init' || staticPropertyName(property) !== 'statusText')
            continue

          const value = staticString(property.value, { unwrap: true })
          if (value !== undefined && INVALID_STATUS_TEXT_CHARACTER_RE.test(value)) {
            context.report({
              node: property.value,
              messageId: 'invalidStatusText',
            })
          }
        }
      },
    }
  },
}
