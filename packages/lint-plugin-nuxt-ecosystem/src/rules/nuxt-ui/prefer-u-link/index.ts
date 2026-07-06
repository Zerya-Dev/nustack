import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../../utils/docs-url.js'

function hasEscapeHatch(node: any): boolean {
  return node.startTag.attributes.some(
    (attribute: any) => !attribute.directive && attribute.key.name === 'data-raw',
  )
}

export const preferULink: Rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer `<ULink>` over raw `<a>` when Nuxt UI is available.',
      url: docsUrl('nuxt-ui/prefer-u-link'),
    },
    schema: [],
    messages: {
      preferULink: 'NuStack standardizes on Nuxt UI components for consistent styling and a11y. Use `<ULink>` instead of a raw `<a>` (add `data-raw` to opt out).',
    },
  },
  create(context: any) {
    const services = context.sourceCode.parserServices
    if (typeof services?.defineTemplateBodyVisitor !== 'function')
      return {}

    return services.defineTemplateBodyVisitor({
      VElement(node: any) {
        if (node.name === 'a' && !hasEscapeHatch(node))
          context.report({ loc: node.startTag.loc, messageId: 'preferULink' })
      },
    })
  },
}
