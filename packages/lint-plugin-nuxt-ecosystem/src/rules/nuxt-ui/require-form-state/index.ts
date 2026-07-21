import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, hasAttribute } from '../utils.js'

export const requireFormState: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require `state` on Nuxt UI forms so validation and field binding have a reactive source of truth.',
      url: docsUrl('nuxt-ui/require-form-state'),
    },
    schema: [],
    messages: {
      missingState: 'Nuxt UI `<UForm>` requires a `state` prop; pass the reactive form state explicitly.',
    },
  },
  create(context: any) {
    return defineTemplateVisitor(context, {
      VElement(node: any) {
        // Nested forms explicitly inherit the parent form's state in Nuxt UI.
        if (node.name === 'uform' && !hasAttribute(node, 'state') && !hasAttribute(node, 'nested'))
          context.report({ loc: node.startTag.loc, messageId: 'missingState' })
      },
    })
  },
}
