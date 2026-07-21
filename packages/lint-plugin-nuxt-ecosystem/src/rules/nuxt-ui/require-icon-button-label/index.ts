import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, hasAttribute, hasMeaningfulText, hasNonEmptyAttribute } from '../utils.js'

export const requireIconButtonLabel: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require an accessible label for icon-only Nuxt UI buttons.',
      url: docsUrl('nuxt-ui/require-icon-button-label'),
    },
    schema: [],
    messages: {
      missingLabel: 'Icon-only `<UButton>` needs `label`, `aria-label`, or an accessible `title`.',
    },
  },
  create(context: any) {
    return defineTemplateVisitor(context, {
      VElement(node: any) {
        if (node.name !== 'ubutton' || (!hasAttribute(node, 'icon') && !hasAttribute(node, 'avatar')))
          return
        if (hasNonEmptyAttribute(node, 'label') || hasNonEmptyAttribute(node, 'aria-label')
          || hasNonEmptyAttribute(node, 'title') || hasMeaningfulText(node)) {
          return
        }
        context.report({ loc: node.startTag.loc, messageId: 'missingLabel' })
      },
    })
  },
}
