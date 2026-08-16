import type { Context, Rule, Visitor } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, hasNonEmptyAttribute } from '../../../utils/template.js'
import { createNuxtUiMatcher } from '../components.js'

export const requireFormFieldName: Rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require a validation target on Nuxt UI form fields used inside a form.',
      url: docsUrl('nuxt-ui/require-form-field-name'),
    },
    schema: [],
    messages: {
      missingName: 'Add `name` or `error-pattern` to this `<UFormField>` so `<UForm>` can route validation errors to it.',
    },
  },
  create(context: Context): Visitor {
    const matcher = createNuxtUiMatcher(context)

    return defineTemplateVisitor(context, {
      VElement(node: VueAST.VElement) {
        if (matcher.is(node, 'FormField')
          && matcher.hasAncestor(node, 'Form')
          && !hasNonEmptyAttribute(node, 'name')
          && !hasNonEmptyAttribute(node, 'error-pattern')) {
          context.report({ loc: node.startTag.loc, messageId: 'missingName' })
        }
      },
    })
  },
}
