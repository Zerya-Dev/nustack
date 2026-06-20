import type { Rule } from '@oxlint/plugins'
import { isStaticMemberOf } from '../helpers.js'

export const preferUseWindowSize: Rule = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Prefer `useWindowSize()` over direct window size reads.' },
    schema: [],
    messages: {
      preferUseWindowSize: 'Prefer `useWindowSize()` from VueUse over direct `window.innerWidth`/`window.innerHeight` reads.',
    },
  },
  createOnce(context: any) {
    return {
      MemberExpression(node: any) {
        if (isStaticMemberOf(node, 'window', ['innerWidth', 'innerHeight', 'outerWidth', 'outerHeight']))
          context.report({ node, messageId: 'preferUseWindowSize' })
      },
    }
  },
}
