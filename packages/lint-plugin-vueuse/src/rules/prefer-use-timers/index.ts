import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../utils/docs-url.js'
import { isIdentifierCall, isMemberCall } from '../helpers.js'

const timerCalls = ['setTimeout', 'setInterval', 'clearTimeout', 'clearInterval'] as const

export const preferUseTimers: Rule = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Prefer VueUse timer composables over raw timer APIs.', url: docsUrl('prefer-use-timers') },
    schema: [],
    messages: {
      preferUseTimers: 'Prefer VueUse timer composables like `useTimeoutFn()` or `useIntervalFn()` so timers follow component lifecycle cleanup.',
    },
  },
  createOnce(context: any) {
    return {
      CallExpression(node: any) {
        if (isIdentifierCall(node, timerCalls) || isMemberCall(node, 'window', timerCalls) || isMemberCall(node, 'globalThis', timerCalls))
          context.report({ node, messageId: 'preferUseTimers' })
      },
    }
  },
}
