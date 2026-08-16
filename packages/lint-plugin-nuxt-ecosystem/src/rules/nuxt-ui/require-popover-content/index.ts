import type { Context, Rule, Visitor } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, hasSlot } from '../../../utils/template.js'
import { createNuxtUiMatcher } from '../components.js'

export const requirePopoverContent: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require a content slot on Nuxt UI popovers.',
      url: docsUrl('nuxt-ui/require-popover-content'),
    },
    schema: [],
    messages: {
      missingContent: 'Add a `#content` slot to `<UPopover>`; the `content` prop only configures positioning.',
    },
  },
  create(context: Context): Visitor {
    const matcher = createNuxtUiMatcher(context)

    return defineTemplateVisitor(context, {
      VElement(node: VueAST.VElement) {
        if (matcher.is(node, 'Popover') && !hasSlot(node, 'content'))
          context.report({ loc: node.startTag.loc, messageId: 'missingContent' })
      },
    })
  },
}
