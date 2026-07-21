import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, hasNonEmptyAttribute, hasSlot } from '../utils.js'

export const requireTooltipContent: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require content on Nuxt UI tooltips so they communicate a useful hint.',
      url: docsUrl('nuxt-ui/require-tooltip-content'),
    },
    schema: [],
    messages: {
      missingContent: 'Add a non-empty `text` prop or `#content` slot to `<UTooltip>`.',
    },
  },
  create(context: any) {
    return defineTemplateVisitor(context, {
      VElement(node: any) {
        if (node.name === 'utooltip' && !hasNonEmptyAttribute(node, 'text') && !hasSlot(node, 'content'))
          context.report({ loc: node.startTag.loc, messageId: 'missingContent' })
      },
    })
  },
}
