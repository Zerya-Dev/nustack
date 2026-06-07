import type { TSESTree } from '@typescript-eslint/utils'
import type { Rule } from 'eslint'
import { createRule } from '../../utils'

/**
 * `process.env` is not reliably available in the browser bundle. App code
 * should read configuration through `useRuntimeConfig()` instead. Scoped by the
 * nuxt concern to app code (server/ and nuxt.config are excluded). Not auto-fixed:
 * the right replacement depends on whether the value is public or private.
 */
export const rule: Rule.RuleModule = createRule<'noProcessEnv', []>({
  name: 'nuxt/no-process-env',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow `process.env` in app code; use `useRuntimeConfig()`',
    },
    schema: [],
    messages: {
      noProcessEnv: 'NuStack standardizes app config access on `useRuntimeConfig()` for consistency across server/client. Expose the value via `runtimeConfig` and read it with `useRuntimeConfig()` instead of `process.env`.',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      MemberExpression(node: TSESTree.MemberExpression) {
        if (
          node.object.type === 'Identifier'
          && node.object.name === 'process'
          && !node.computed
          && node.property.type === 'Identifier'
          && node.property.name === 'env'
        ) {
          context.report({ node: node as any, messageId: 'noProcessEnv' })
        }
      },
    }
  },
})
