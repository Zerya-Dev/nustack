import type { Rule } from '@oxlint/plugins'
import { isMemberCall, isStaticMemberOf } from '../helpers.js'

const methods = ['getItem', 'setItem', 'removeItem', 'clear'] as const

export const preferUseStorage: Rule = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Prefer VueUse storage composables over raw Web Storage APIs.' },
    schema: [],
    messages: {
      preferUseStorage: 'Prefer `useStorage()`, `useLocalStorage()`, or `useSessionStorage()` over raw Web Storage access.',
    },
  },
  createOnce(context: any) {
    return {
      CallExpression(node: any) {
        if (isMemberCall(node, 'localStorage', methods) || isMemberCall(node, 'sessionStorage', methods))
          context.report({ node, messageId: 'preferUseStorage' })
      },
      MemberExpression(node: any) {
        if (isStaticMemberOf(node, 'window', ['localStorage', 'sessionStorage']))
          context.report({ node, messageId: 'preferUseStorage' })
      },
    }
  },
}
