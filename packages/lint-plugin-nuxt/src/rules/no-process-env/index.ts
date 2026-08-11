import type { Context, ESTree, Rule, Visitor } from '@oxlint/plugins'
import { docsUrl } from '../../utils/docs-url.js'

export const noProcessEnv: Rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow `process.env` in app code; use `useRuntimeConfig()`.',
      url: docsUrl('no-process-env'),
    },
    schema: [],
    messages: {
      noProcessEnv: 'Use `runtimeConfig` and `useRuntimeConfig()` instead of `process.env`.',
    },
  },
  createOnce(context: Context): Visitor {
    return {
      MemberExpression(node: ESTree.MemberExpression): void {
        if (
          node.object?.type === 'Identifier'
          && node.object.name === 'process'
          && !node.computed
          && node.property?.type === 'Identifier'
          && node.property.name === 'env'
        ) {
          context.report({ node, messageId: 'noProcessEnv' })
        }
      },
    }
  },
}
