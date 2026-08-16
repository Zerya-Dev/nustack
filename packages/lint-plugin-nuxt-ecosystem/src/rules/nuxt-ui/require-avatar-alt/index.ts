import type { Context, Rule, Visitor } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, getStaticBoolean, hasDefiniteAttribute } from '../../../utils/template.js'
import { createNuxtUiMatcher } from '../components.js'

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
  create(context: Context): Visitor {
    const matcher = createNuxtUiMatcher(context)

    return defineTemplateVisitor(context, {
      VElement(node: VueAST.VElement) {
        if (!matcher.is(node, 'Avatar') || !hasDefiniteAttribute(node, 'src'))
          return
        if (hasDefiniteAttribute(node, 'alt'))
          return
        if (getStaticBoolean(node, 'aria-hidden') === true)
          return
        context.report({ loc: node.startTag.loc, messageId: 'missingAlt' })
      },
    })
  },
}
