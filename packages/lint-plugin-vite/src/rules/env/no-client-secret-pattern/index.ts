import type { Rule } from '@oxlint/plugins'

const SECRET_WORDS = new Set(['SECRET', 'TOKEN', 'PASSWORD', 'PRIVATE'])
const PUBLIC_KEY_QUALIFIERS = new Set(['PUBLIC', 'PUBLISHABLE', 'SITE'])

function envWords(name: string): string[] {
  return name
    .replace(/^VITE_/, '')
    .split(/[^A-Z0-9]+/i)
    .map(word => word.toUpperCase())
    .filter(Boolean)
}

function isClientSecretName(name: string): boolean {
  if (!name.startsWith('VITE_'))
    return false

  const parts = envWords(name)

  if (parts.some(part => SECRET_WORDS.has(part)))
    return true

  if (!parts.includes('KEY'))
    return false

  if (parts.some(part => PUBLIC_KEY_QUALIFIERS.has(part)))
    return false

  // Common public client SDK naming (`VITE_API_KEY`) is noisy as a hard error.
  if (parts.length === 2 && parts[0] === 'API' && parts[1] === 'KEY')
    return false

  return true
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
