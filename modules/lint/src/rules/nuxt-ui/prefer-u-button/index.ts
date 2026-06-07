import type { Rule } from 'eslint'
import { createRule } from '../../utils'

function hasEscapeHatch(node: any): boolean {
  return node.startTag.attributes.some(
    (a: any) => !a.directive && a.key.name === 'data-raw',
  )
}

/**
 * When `@nuxt/ui` is present, prefer `<UButton>` over a raw `<button>` so styling
 * and a11y stay consistent. Opt out per-element with `data-raw`.
 */
export const rule: Rule.RuleModule = createRule<'preferUButton', []>({
  name: 'nuxt-ui/prefer-u-button',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer `<UButton>` over raw `<button>` when Nuxt UI is available',
    },
    schema: [],
    messages: {
      preferUButton: 'NuStack standardizes on Nuxt UI components for consistent styling and a11y. Use `<UButton>` instead of a raw `<button>` (add `data-raw` to opt out).',
    },
  },
  defaultOptions: [],
  create(context) {
    const services = (context.sourceCode as any).parserServices
    if (typeof services?.defineTemplateBodyVisitor !== 'function')
      return {}

    return services.defineTemplateBodyVisitor({
      VElement(node: any) {
        if (node.name === 'button' && !hasEscapeHatch(node)) {
          context.report({ loc: node.startTag.loc, messageId: 'preferUButton' })
        }
      },
    })
  },
})
