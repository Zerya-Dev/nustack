import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../utils/docs-url.js'
import { isMemberCall } from '../helpers.js'

export const preferUseEventListener: Rule = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Prefer `useEventListener()` over raw DOM event listener APIs.', url: docsUrl('prefer-use-event-listener') },
    schema: [],
    messages: {
      preferUseEventListener: 'Prefer `useEventListener()` from VueUse so listeners are cleaned up with the component scope.',
    },
  },
  createOnce(context: any) {
    return {
      CallExpression(node: any) {
        if (
          isMemberCall(node, 'window', ['addEventListener', 'removeEventListener'])
          || isMemberCall(node, 'document', ['addEventListener', 'removeEventListener'])
          || isMemberCall(node, 'globalThis', ['addEventListener', 'removeEventListener'])
        ) {
          context.report({ node, messageId: 'preferUseEventListener' })
        }
      },
    }
  },
}
