import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, getStaticAttribute, hasRawOptOut } from '../utils.js'

const PALETTE = '(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white)'
const PALETTE_CLASS = new RegExp(`^(?:text|bg|border|ring|divide|outline|decoration|placeholder)-${PALETTE}(?:-\\d+)?(?:/\\d+)?$`)

export const preferSemanticColors: Rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer Nuxt UI semantic color utilities over hard-coded Tailwind palette classes.',
      url: docsUrl('nuxt-ui/prefer-semantic-colors'),
    },
    schema: [],
    messages: {
      semantic: 'Prefer a Nuxt UI semantic color token (for example `text-muted`, `bg-elevated`, or `border-default`) over `{{ className }}`.',
    },
  },
  create(context: any) {
    return defineTemplateVisitor(context, {
      VElement(node: any) {
        if (hasRawOptOut(node))
          return
        const classes = getStaticAttribute(node, 'class')
        if (!classes)
          return
        for (const className of classes.split(/\s+/)) {
          const utility = className.slice(className.lastIndexOf(':') + 1).replace(/^!/, '')
          if (PALETTE_CLASS.test(utility)) {
            context.report({ loc: node.startTag.loc, messageId: 'semantic', data: { className } })
            break
          }
        }
      },
    })
  },
}
