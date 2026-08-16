import type { Context, Rule, Visitor } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, getStaticAttribute } from '../../../utils/template.js'
import { nuxtUiPrefix } from '../components.js'

export const preferUIcon: Rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer Nuxt UI `<UIcon>` over raw Iconify class markup.',
      url: docsUrl('nuxt-ui/prefer-u-icon'),
    },
    schema: [],
    messages: {
      preferIcon: 'Use `<{{ component }} name="{{ icon }}" />` instead of a raw icon class.',
    },
  },
  create(context: Context): Visitor {
    const component = `${nuxtUiPrefix(context)}Icon`
    return defineTemplateVisitor(context, {
      VElement(node: VueAST.VElement) {
        if (node.name !== 'i' && node.name !== 'span')
          return
        const classes = getStaticAttribute(node, 'class')
        const icon = classes?.split(/\s+/).find((value: string) => /^i-[\w-]+$/.test(value))
        if (icon)
          context.report({ loc: node.startTag.loc, messageId: 'preferIcon', data: { component, icon } })
      },
    })
  },
}
