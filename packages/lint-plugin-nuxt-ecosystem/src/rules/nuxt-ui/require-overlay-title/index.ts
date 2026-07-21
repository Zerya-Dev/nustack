import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, hasNonEmptyAttribute, hasSlot } from '../utils.js'

const OVERLAYS = new Set(['umodal', 'udrawer', 'uslideover'])

export const requireOverlayTitle: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require an accessible title on Nuxt UI modal, drawer, and slideover components.',
      url: docsUrl('nuxt-ui/require-overlay-title'),
    },
    schema: [],
    messages: {
      missingTitle: 'Add a `title`, `#title`, `aria-label`, or `aria-labelledby` to this Nuxt UI overlay.',
    },
  },
  create(context: any) {
    return defineTemplateVisitor(context, {
      VElement(node: any) {
        if (OVERLAYS.has(node.name)
          && !hasNonEmptyAttribute(node, 'title')
          && !hasNonEmptyAttribute(node, 'aria-label')
          && !hasNonEmptyAttribute(node, 'aria-labelledby')
          && !hasSlot(node, 'title')) {
          context.report({ loc: node.startTag.loc, messageId: 'missingTitle' })
        }
      },
    })
  },
}
