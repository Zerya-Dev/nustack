import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, getStaticAttribute, hasRawOptOut } from '../utils.js'

export const preferUIcon: Rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer Nuxt UI `<UIcon>` over raw Iconify class markup.',
      url: docsUrl('nuxt-ui/prefer-u-icon'),
    },
    schema: [],
    messages: {
      preferIcon: 'Use `<UIcon name="{{ icon }}" />` instead of a raw icon class.',
    },
  },
  create(context: any) {
    return defineTemplateVisitor(context, {
      VElement(node: any) {
        if (hasRawOptOut(node) || (node.name !== 'i' && node.name !== 'span'))
          return
        const classes = getStaticAttribute(node, 'class')
        const icon = classes?.split(/\s+/).find((value: string) => /^i-[\w-]+$/.test(value))
        if (icon)
          context.report({ loc: node.startTag.loc, messageId: 'preferIcon', data: { icon } })
      },
    })
  },
}
