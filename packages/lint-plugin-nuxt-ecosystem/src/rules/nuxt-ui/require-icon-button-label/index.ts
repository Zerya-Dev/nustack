import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, getAttribute, hasAttribute, hasMeaningfulText, hasNonEmptyAttribute } from '../utils.js'

function canBeLoading(node: any): boolean {
  const attribute = getAttribute(node, 'loading')
  if (!attribute)
    return false
  if (!attribute.directive)
    return true
  const expression = attribute.value?.expression
  return expression?.type !== 'Literal' || expression.value !== false
}

export const requireIconButtonLabel: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require an accessible label for icon-, avatar-, and loading-only Nuxt UI buttons.',
      url: docsUrl('nuxt-ui/require-icon-button-label'),
    },
    schema: [],
    messages: {
      missingLabel: 'Icon-, avatar-, or loading-only `<UButton>` needs `label`, `aria-label`, or an accessible `title`.',
    },
  },
  create(context: any) {
    return defineTemplateVisitor(context, {
      VElement(node: any) {
        if (node.name !== 'ubutton'
          || (!hasAttribute(node, 'icon') && !hasAttribute(node, 'avatar') && !canBeLoading(node))) {
          return
        }
        if (hasNonEmptyAttribute(node, 'label') || hasNonEmptyAttribute(node, 'aria-label')
          || hasNonEmptyAttribute(node, 'title') || hasMeaningfulText(node)) {
          return
        }
        context.report({ loc: node.startTag.loc, messageId: 'missingLabel' })
      },
    })
  },
}
