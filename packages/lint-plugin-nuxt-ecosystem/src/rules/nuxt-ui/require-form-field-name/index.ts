import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, hasAncestor, hasAttribute } from '../utils.js'

export const requireFormFieldName: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require a validation target on Nuxt UI form fields used inside a form.',
      url: docsUrl('nuxt-ui/require-form-field-name'),
    },
    schema: [],
    messages: {
      missingName: 'Add `name` or `error-pattern` to this `<UFormField>` so `<UForm>` can route validation errors to it.',
    },
  },
  create(context: any) {
    return defineTemplateVisitor(context, {
      VElement(node: any) {
        if (node.name === 'uformfield'
          && hasAncestor(node, 'uform')
          && !hasAttribute(node, 'name')
          && !hasAttribute(node, 'error-pattern')) {
          context.report({ loc: node.startTag.loc, messageId: 'missingName' })
        }
      },
    })
  },
}
