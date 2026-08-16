import type { Context, Rule, Visitor } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, getAttributeValue, getStaticBoolean } from '../../../utils/template.js'
import { createNuxtUiMatcher } from '../components.js'

export const requireNestedFormProp: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require the nested prop when a UForm is rendered inside another UForm.',
      url: docsUrl('nuxt-ui/require-nested-form-prop'),
    },
    schema: [],
    messages: {
      requireNested: 'Add `nested` to this inner `<UForm>` so it attaches to the parent form instead of creating an independent nested form.',
    },
  },
  create(context: Context): Visitor {
    const matcher = createNuxtUiMatcher(context)

    return defineTemplateVisitor(context, {
      VElement(node: VueAST.VElement) {
        if (!matcher.is(node, 'Form') || !matcher.hasAncestor(node, 'Form'))
          return

        const nested = getAttributeValue(node, 'nested')
        if (!nested.present
          || (nested.known && getStaticBoolean(node, 'nested') !== true && nested.value !== 'nested')) {
          context.report({ loc: node.startTag.loc, messageId: 'requireNested' })
        }
      },
    })
  },
}
