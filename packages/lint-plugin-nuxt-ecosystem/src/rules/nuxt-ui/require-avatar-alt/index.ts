import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, hasAttribute } from '../utils.js'

export const requireAvatarAlt: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require alternative text for Nuxt UI avatars that render an image.',
      url: docsUrl('nuxt-ui/require-avatar-alt'),
    },
    schema: [],
    messages: {
      missingAlt: 'Add `alt` to `<UAvatar>` (or explicitly mark a decorative avatar with `aria-hidden`).',
    },
  },
  create(context: any) {
    return defineTemplateVisitor(context, {
      VElement(node: any) {
        if (node.name !== 'uavatar' || !hasAttribute(node, 'src'))
          return
        if (!hasAttribute(node, 'alt') && !hasAttribute(node, 'aria-hidden'))
          context.report({ loc: node.startTag.loc, messageId: 'missingAlt' })
      },
    })
  },
}
