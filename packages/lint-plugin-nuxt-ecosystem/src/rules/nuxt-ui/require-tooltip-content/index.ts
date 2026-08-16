import type { Context, Rule, Visitor } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, hasNonEmptyAttribute, hasSlot } from '../../../utils/template.js'
import { createNuxtUiMatcher } from '../components.js'

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
  create(context: Context): Visitor {
    const matcher = createNuxtUiMatcher(context)

    return defineTemplateVisitor(context, {
      VElement(node: VueAST.VElement) {
        if (matcher.is(node, 'Tooltip') && !hasNonEmptyAttribute(node, 'text') && !hasSlot(node, 'content'))
          context.report({ loc: node.startTag.loc, messageId: 'missingContent' })
      },
    })
  },
}
