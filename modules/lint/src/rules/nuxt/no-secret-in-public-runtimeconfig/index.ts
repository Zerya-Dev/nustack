import type { TSESTree } from '@typescript-eslint/utils'
import type { Rule } from 'eslint'
import { createRule } from '../../utils'

// Keys under `runtimeConfig.public` are shipped to the browser. Any of these
// substrings signals a value that almost certainly should stay server-only.
const SECRET_RE = /secret|token|key|password/i

function staticKeyName(key: TSESTree.Node): string | null {
  if (key.type === 'Identifier')
    return key.name
  if (key.type === 'Literal' && typeof key.value === 'string')
    return key.value
  return null
}

function findProperty(obj: TSESTree.ObjectExpression, name: string): TSESTree.Property | undefined {
  return obj.properties.find(
    (p): p is TSESTree.Property =>
      p.type === 'Property' && staticKeyName(p.key) === name,
  )
}

/**
 * Flags secret-looking keys under `runtimeConfig.public` in nuxt.config. The
 * public runtime config is serialized into the client bundle, so a `*secret`,
 * `*token`, `*key` or `*password` there is a leak. Scoped to nuxt.config by the
 * nuxt concern.
 */
export const rule: Rule.RuleModule = createRule<'secretInPublic', []>({
  name: 'nuxt/no-secret-in-public-runtimeconfig',
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow secret-looking keys under `runtimeConfig.public`',
    },
    schema: [],
    messages: {
      secretInPublic: '`{{ key }}` is under `runtimeConfig.public`, which is serialized into the client bundle and exposed to the browser. Move it to the private `runtimeConfig` so it stays server-only.',
    },
  },
  defaultOptions: [],
  create(context) {
    function scan(obj: TSESTree.ObjectExpression): void {
      for (const prop of obj.properties) {
        if (prop.type !== 'Property')
          continue
        const name = staticKeyName(prop.key)
        if (name && SECRET_RE.test(name)) {
          context.report({
            node: prop.key as any,
            messageId: 'secretInPublic',
            data: { key: name },
          })
        }
        // Descend into nested groups, e.g. `public: { auth: { token } }`.
        if (prop.value.type === 'ObjectExpression')
          scan(prop.value)
      }
    }

    return {
      Property(node: TSESTree.Property) {
        if (staticKeyName(node.key) !== 'runtimeConfig' || node.value.type !== 'ObjectExpression')
          return
        const publicProp = findProperty(node.value, 'public')
        if (publicProp?.value.type === 'ObjectExpression')
          scan(publicProp.value)
      },
    }
  },
})
