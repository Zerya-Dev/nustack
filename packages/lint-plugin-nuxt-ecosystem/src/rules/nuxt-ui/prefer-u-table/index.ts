import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../../utils/docs-url.js'

function hasEscapeHatch(node: any): boolean {
  return node.startTag.attributes.some(
    (attribute: any) => !attribute.directive && attribute.key.name === 'data-raw',
  )
}

export const preferUTable: Rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer `<UTable>` over raw `<table>` when Nuxt UI is available.',
      url: docsUrl('nuxt-ui/prefer-u-table'),
    },
    schema: [],
    messages: {
      preferUTable: 'NuStack standardizes on Nuxt UI components for consistent styling and a11y. Use `<UTable>` instead of a raw `<table>` (add `data-raw` to opt out).',
    },
  },
  create(context: any) {
    const services = context.sourceCode.parserServices
    if (typeof services?.defineTemplateBodyVisitor !== 'function')
      return {}

    return services.defineTemplateBodyVisitor({
      VElement(node: any) {
        if (node.name === 'table' && !hasEscapeHatch(node))
          context.report({ loc: node.startTag.loc, messageId: 'preferUTable' })
      },
    })
  },
}
