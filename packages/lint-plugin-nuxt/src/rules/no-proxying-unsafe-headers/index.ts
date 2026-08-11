import type { Context, ESTree, Rule, Visitor } from '@oxlint/plugins'
import { staticString } from '../../utils/ast.js'
import { docsUrl } from '../../utils/docs-url.js'

const UNSAFE_HEADERS = new Set([
  'host',
  'accept',
  'content-length',
  'content-md5',
  'content-type',
  'x-forwarded-host',
  'x-forwarded-port',
  'x-forwarded-proto',
  'cf-connecting-ip',
  'cf-ray',
])

export const noProxyingUnsafeHeaders: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow proxying unsafe request headers with `useRequestHeaders()`.',
      url: docsUrl('no-proxying-unsafe-headers'),
    },
    schema: [],
    messages: {
      unsafeHeader: '`{{ header }}` is not safe to proxy. Only forward the client headers that the target API needs.',
    },
  },
  createOnce(context: Context): Visitor {
    return {
      CallExpression(node: ESTree.CallExpression): void {
        if (
          node.callee?.type !== 'Identifier'
          || node.callee.name !== 'useRequestHeaders'
          || node.arguments[0]?.type !== 'ArrayExpression'
        ) {
          return
        }

        for (const element of node.arguments[0].elements) {
          if (!element)
            continue
          const header = staticString(element, { fallbackToRaw: true })
          if (header !== undefined && UNSAFE_HEADERS.has(header.toLowerCase())) {
            context.report({
              node: element,
              messageId: 'unsafeHeader',
              data: { header },
            })
          }
        }
      },
    }
  },
}
