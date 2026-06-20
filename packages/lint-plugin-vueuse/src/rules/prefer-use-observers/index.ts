import type { Rule } from '@oxlint/plugins'

const observers = ['IntersectionObserver', 'MutationObserver', 'ResizeObserver', 'PerformanceObserver'] as const

export const preferUseObservers: Rule = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Prefer VueUse observer composables over raw Observer constructors.' },
    schema: [],
    messages: {
      preferUseObservers: 'Prefer VueUse observer composables like `useIntersectionObserver()`, `useMutationObserver()`, or `useResizeObserver()`.',
    },
  },
  createOnce(context: any) {
    return {
      NewExpression(node: any) {
        if (node.callee?.type === 'Identifier' && observers.includes(node.callee.name))
          context.report({ node, messageId: 'preferUseObservers' })
      },
    }
  },
}
