import type { Rule } from '@oxlint/plugins'
import { isSecretLikeName } from '../../../utils/secret-name.js'

function propertyKeyName(node: any): string | undefined {
  if (node?.computed)
    return node.key?.type === 'Literal' ? node.key.value : undefined
  if (node?.key?.type === 'Identifier')
    return node.key.name
  return node?.key?.type === 'Literal' ? node.key.value : undefined
}

function processEnvName(node: any): string | undefined {
  if (node?.type !== 'MemberExpression' || node.object?.type !== 'MemberExpression')
    return undefined

  const envObject = node.object
  if (envObject.object?.type !== 'Identifier' || envObject.object.name !== 'process')
    return undefined
  if (envObject.computed || envObject.property?.type !== 'Identifier' || envObject.property.name !== 'env')
    return undefined

  if (node.computed)
    return node.property?.type === 'Literal' ? node.property.value : undefined
  return node.property?.type === 'Identifier' ? node.property.name : undefined
}

function secretEnvNameInValue(node: any): string | undefined {
  const target = node?.type === 'CallExpression' && node.arguments.length === 1
    ? node.arguments[0]
    : node
  const name = processEnvName(target)
  return typeof name === 'string' && isSecretLikeName(name) ? name : undefined
}

export const noSecretDefine: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow secret-looking values in Vite `define` config.',
    },
    schema: [],
    messages: {
      noSecretDefineKey: '`{{ name }}` looks like a secret. Vite `define` inlines its value into every bundle (client and server) — keep secrets out of `define`.',
      noSecretDefineValue: 'This reads `process.env.{{ name }}`, a secret-looking variable, into Vite `define`, which inlines it into every bundle. Keep secrets out of `define`.',
    },
  },
  createOnce(context: any) {
    return {
      Property(node: any) {
        if (propertyKeyName(node) !== 'define' || node.value?.type !== 'ObjectExpression')
          return

        for (const prop of node.value.properties) {
          if (prop.type !== 'Property')
            continue

          const name = propertyKeyName(prop)
          if (typeof name === 'string' && isSecretLikeName(name)) {
            context.report({ node: prop.key, messageId: 'noSecretDefineKey', data: { name } })
            continue
          }

          const envName = secretEnvNameInValue(prop.value)
          if (envName)
            context.report({ node: prop.value, messageId: 'noSecretDefineValue', data: { name: envName } })
        }
      },
    }
  },
}
