import type { Rule } from '@oxlint/plugins'

const SECRET_WORDS = new Set(['secret', 'token', 'password', 'private'])
const PUBLIC_KEY_QUALIFIERS = new Set(['public', 'publishable', 'site'])

function words(name: string): string[] {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[^a-z0-9]+/i)
    .map(word => word.toLowerCase())
    .filter(Boolean)
}

function isSecretLike(name: string): boolean {
  const parts = words(name)

  if (parts.some(part => SECRET_WORDS.has(part)))
    return true

  if (!parts.includes('key'))
    return false

  if (parts.some(part => PUBLIC_KEY_QUALIFIERS.has(part)))
    return false

  // Common client SDK naming (`apiKey`) is intentionally public in Nuxt public runtime config.
  if (parts.length === 2 && parts[0] === 'api' && parts[1] === 'key')
    return false

  return true
}

function staticKeyName(key: any): string | null {
  if (key.type === 'Identifier')
    return key.name
  if (key.type === 'Literal' && typeof key.value === 'string')
    return key.value
  return null
}

function findProperty(obj: any, name: string): any {
  return obj.properties.find(
    (property: any) => property.type === 'Property' && staticKeyName(property.key) === name,
  )
}

export const noSecretInPublicRuntimeConfig: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow secret-looking keys under `runtimeConfig.public`.',
    },
    schema: [],
    messages: {
      secretInPublic: '`{{ key }}` is under `runtimeConfig.public`, which is serialized into the client bundle and exposed to the browser. Move it to private `runtimeConfig` so it stays server-only.',
    },
  },
  createOnce(context: any) {
    function scan(obj: any): void {
      for (const property of obj.properties) {
        if (property.type !== 'Property')
          continue
        const name = staticKeyName(property.key)
        if (name && isSecretLike(name)) {
          context.report({
            node: property.key,
            messageId: 'secretInPublic',
            data: { key: name },
          })
        }
        if (property.value.type === 'ObjectExpression')
          scan(property.value)
      }
    }

    return {
      Property(node: any) {
        if (staticKeyName(node.key) !== 'runtimeConfig' || node.value.type !== 'ObjectExpression')
          return
        const publicProperty = findProperty(node.value, 'public')
        if (publicProperty?.value.type === 'ObjectExpression')
          scan(publicProperty.value)
      },
    }
  },
}
