import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../../utils/docs-url.js'
import { componentName, defineTemplateVisitor, hasAttribute, hasRawOptOut } from '../utils.js'

const LINK_COMPONENTS = new Set(['ulink', 'ubutton'])

export const preferLinkTo: Rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer Nuxt UI/NuxtLink `to` on link-capable components over `href`.',
      url: docsUrl('nuxt-ui/prefer-link-to'),
    },
    schema: [],
    messages: {
      preferTo: 'Use `to` instead of `href` on `<{{ component }}>` so Nuxt routing and link props stay consistent.',
    },
  },
  create(context: any) {
    return defineTemplateVisitor(context, {
      VElement(node: any) {
        if (LINK_COMPONENTS.has(node.name) && !hasRawOptOut(node) && hasAttribute(node, 'href') && !hasAttribute(node, 'to'))
          context.report({ loc: node.startTag.loc, messageId: 'preferTo', data: { component: componentName(node.name) } })
      },
    })
  },
}
