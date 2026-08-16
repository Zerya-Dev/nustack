import type { Context, Rule, Visitor } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor } from '../../../utils/template.js'
import { createNuxtUiMatcher } from '../components.js'

function hasStaticTreeRole(node: any): boolean {
  return node.startTag.attributes.some(
    (attribute: any) =>
      !attribute.directive && attribute.key.name === 'role' && attribute.value?.value === 'tree',
  )
}

export const preferUTree: Rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer UTree over hand-written elements with an explicit tree role.',
      url: docsUrl('nuxt-ui/prefer-u-tree'),
    },
    schema: [],
    messages: {
      preferUTree:
        'Use `<UTree>` instead of a custom `role="tree"`; custom trees must implement the complete tree keyboard and focus model.',
    },
  },
  create(context: Context): Visitor {
    const matcher = createNuxtUiMatcher(context)

    return defineTemplateVisitor(context, {
      VElement(node: VueAST.VElement) {
        if (matcher.is(node, 'Tree') || !hasStaticTreeRole(node))
          return

        context.report({
          loc: node.startTag.loc,
          messageId: 'preferUTree',
        })
      },
    })
  },
}
