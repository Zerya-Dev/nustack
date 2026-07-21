import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../utils/docs-url.js'

export const preferUseClipboard: Rule = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Prefer `useClipboard()` over `navigator.clipboard`.', url: docsUrl('prefer-use-clipboard') },
    schema: [],
    messages: {
      preferUseClipboard: 'Prefer `useClipboard()` from VueUse over direct `navigator.clipboard` access.',
    },
  },
  createOnce(context: any) {
    return {
      MemberExpression(node: any) {
        if (
          node.object?.type === 'Identifier'
          && node.object.name === 'navigator'
          && !node.computed
          && node.property?.type === 'Identifier'
          && node.property.name === 'clipboard'
        ) {
          context.report({ node, messageId: 'preferUseClipboard' })
        }
      },
    }
  },
}
