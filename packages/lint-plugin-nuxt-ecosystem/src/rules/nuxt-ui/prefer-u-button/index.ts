import type { Rule } from '@oxlint/plugins'

function hasEscapeHatch(node: any): boolean {
  return node.startTag.attributes.some(
    (attribute: any) => !attribute.directive && attribute.key.name === 'data-raw',
  )
}

export const preferUButton: Rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer `<UButton>` over raw `<button>` when Nuxt UI is available.',
    },
    schema: [],
    messages: {
      preferUButton: 'NuStack standardizes on Nuxt UI components for consistent styling and a11y. Use `<UButton>` instead of a raw `<button>` (add `data-raw` to opt out).',
    },
  },
  create(context: any) {
    const services = context.sourceCode.parserServices
    if (typeof services?.defineTemplateBodyVisitor !== 'function')
      return {}

    return services.defineTemplateBodyVisitor({
      VElement(node: any) {
        if (node.name === 'button' && !hasEscapeHatch(node))
          context.report({ loc: node.startTag.loc, messageId: 'preferUButton' })
      },
    })
  },
}
