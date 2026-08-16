import type { Context, Rule, Visitor } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, hasAttribute } from '../../../utils/template.js'
import { createNuxtUiMatcher } from '../components.js'

const LINK_COMPONENTS = new Set(['Link', 'Button'])

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
  create(context: Context): Visitor {
    const matcher = createNuxtUiMatcher(context)

    return defineTemplateVisitor(context, {
      VElement(node: VueAST.VElement) {
        const component = matcher.matchOf(node, LINK_COMPONENTS)
        if (component && hasAttribute(node, 'href') && !hasAttribute(node, 'to'))
          context.report({ loc: node.startTag.loc, messageId: 'preferTo', data: { component: matcher.prefixed(component) } })
      },
    })
  },
}
