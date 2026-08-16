import type { Context, Rule, Visitor } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, hasNonEmptyAttribute, hasSlot } from '../../../utils/template.js'
import { createNuxtUiMatcher } from '../components.js'

const OVERLAYS = new Set(['Modal', 'Drawer', 'Slideover'])

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
  create(context: Context): Visitor {
    const matcher = createNuxtUiMatcher(context)

    return defineTemplateVisitor(context, {
      VElement(node: VueAST.VElement) {
        if (matcher.isOneOf(node, OVERLAYS)
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
