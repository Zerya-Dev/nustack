import type { Context, Rule, Visitor } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, getAttributeValue, getStaticBoolean } from '../../../utils/template.js'
import { createImageMatcher } from '../components.js'

export const requireImageAlt: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require alternative text on `@nuxt/image` components.',
      url: docsUrl('nuxt-image/require-image-alt'),
    },
    schema: [],
    messages: {
      missingAlt: 'Add `alt` to `<{{ component }}>` (or mark a decorative image with `aria-hidden`).',
    },
  },
  create(context: Context): Visitor {
    const matcher = createImageMatcher(context)

    return defineTemplateVisitor(context, {
      VElement(node: VueAST.VElement) {
        const image = matcher.match(node)
        if (image === null)
          return
        const alt = getAttributeValue(node, 'alt')
        const hasUsableAlt = alt.present && (!alt.known || alt.definite)
        if (!hasUsableAlt && getStaticBoolean(node, 'aria-hidden') !== true) {
          context.report({
            loc: node.startTag.loc,
            messageId: 'missingAlt',
            data: { component: image.name },
          })
        }
      },
    })
  },
}
