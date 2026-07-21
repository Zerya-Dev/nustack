import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../../utils/docs-url.js'
import { componentName, defineTemplateVisitor } from '../utils.js'

const OPEN_COMPONENTS = new Set(['umodal', 'udrawer', 'uslideover', 'upopover', 'utooltip'])

export const preferOpenModel: Rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Use the explicit `open` model for Nuxt UI overlays instead of the ambiguous default model.',
      url: docsUrl('nuxt-ui/prefer-open-model'),
    },
    schema: [],
    messages: {
      preferOpen: 'Use `v-model:open` for `<{{ component }}>`; Nuxt UI overlay state is named `open`.',
    },
  },
  create(context: any) {
    return defineTemplateVisitor(context, {
      VElement(node: any) {
        if (!OPEN_COMPONENTS.has(node.name))
          return
        for (const attribute of node.startTag.attributes) {
          if (attribute.directive
            && attribute.key.name?.name === 'model'
            && !attribute.key.argument) {
            context.report({
              loc: attribute.loc ?? node.startTag.loc,
              messageId: 'preferOpen',
              data: { component: componentName(node.name) },
            })
          }
        }
      },
    })
  },
}
