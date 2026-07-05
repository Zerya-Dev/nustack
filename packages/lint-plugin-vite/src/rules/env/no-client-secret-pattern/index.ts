import type { Rule } from '@oxlint/plugins'
import { isSecretLikeName } from '../../../utils/secret-name.js'

function isClientSecretName(name: string): boolean {
  return name.startsWith('VITE_') && isSecretLikeName(name.replace(/^VITE_/, ''))
}

function isImportMetaEnv(node: any): boolean {
  return node?.type === 'MemberExpression'
    && !node.computed
    && node.property?.type === 'Identifier'
    && node.property.name === 'env'
    && node.object?.type === 'MetaProperty'
    && node.object.meta?.name === 'import'
    && node.object.property?.name === 'meta'
}

export const noClientSecretPattern: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow secret-looking `VITE_*` env variables in client code.',
    },
    schema: [],
    messages: {
      noClientSecretPattern: '`{{ name }}` uses Vite client exposure (`VITE_*`) with a secret-looking name. Rename it and keep the value server-only.',
    },
  },
  createOnce(context: any) {
    return {
      MemberExpression(node: any) {
        if (!isImportMetaEnv(node.object))
          return
        const name = node.computed && node.property?.type === 'Literal'
          ? node.property.value
          : node.property?.name
        if (typeof name === 'string' && isClientSecretName(name)) {
          context.report({
            node: node.property,
            messageId: 'noClientSecretPattern',
            data: { name },
          })
        }
      },
    }
  },
}
