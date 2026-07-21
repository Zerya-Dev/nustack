import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../../utils/docs-url.js'
import { componentName, defineTemplateVisitor, hasAttribute, hasVModel } from '../utils.js'

export const noConflictingStateProps: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow mixing controlled Nuxt UI state with its uncontrolled default prop.',
      url: docsUrl('nuxt-ui/no-conflicting-state-props'),
    },
    schema: [],
    messages: {
      conflicting: '`<{{ component }}>` cannot use controlled `{{ controlled }}` together with `{{ uncontrolled }}`; choose one state model.',
    },
  },
  create(context: any) {
    return defineTemplateVisitor(context, {
      VElement(node: any) {
        if (!node.name.startsWith('u'))
          return

        if (hasAttribute(node, 'default-open') && (hasAttribute(node, 'open') || hasVModel(node, 'open'))) {
          context.report({
            loc: node.startTag.loc,
            messageId: 'conflicting',
            data: { component: componentName(node.name), controlled: 'open / v-model:open', uncontrolled: 'default-open' },
          })
        }

        if (hasAttribute(node, 'default-value') && (hasAttribute(node, 'model-value') || hasVModel(node, null))) {
          context.report({
            loc: node.startTag.loc,
            messageId: 'conflicting',
            data: { component: componentName(node.name), controlled: 'model-value / v-model', uncontrolled: 'default-value' },
          })
        }
      },
    })
  },
}
