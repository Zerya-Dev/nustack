import type { Rule } from '@oxlint/plugins'

export const noProcessEnv: Rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow `process.env` in app code; use `useRuntimeConfig()`.',
    },
    schema: [],
    messages: {
      noProcessEnv: 'NuStack standardizes app config access on `useRuntimeConfig()` for consistency across server/client. Expose the value via `runtimeConfig` and read it with `useRuntimeConfig()` instead of `process.env`.',
    },
  },
  createOnce(context: any) {
    return {
      MemberExpression(node: any) {
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
