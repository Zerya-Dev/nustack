import type { Context, ESTree, Rule, Visitor } from '@oxlint/plugins'
import { staticKeyName } from '../../utils/ast.js'
import { docsUrl } from '../../utils/docs-url.js'
import { isSecretLikeName } from '../../utils/secret-name.js'

function findProperty(obj: ESTree.ObjectExpression, name: string): ESTree.ObjectProperty | undefined {
  return obj.properties.find(
    (property: ESTree.ObjectPropertyKind): property is ESTree.ObjectProperty =>
      property.type === 'Property' && staticKeyName(property.key) === name,
  )
}

export const noSecretInPublicRuntimeConfig: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow secret-looking keys under `runtimeConfig.public`.',
      url: docsUrl('no-secret-in-public-runtimeconfig'),
    },
    schema: [],
    messages: {
      secretInPublic: '`{{ key }}` is under `runtimeConfig.public`, which is serialized into the client bundle and exposed to the browser. Move it to private `runtimeConfig` so it stays server-only.',
    },
  },
  createOnce(context: Context): Visitor {
    function scan(obj: ESTree.ObjectExpression): void {
      for (const property of obj.properties) {
        if (property.type !== 'Property')
          continue
        const name = staticKeyName(property.key)
        if (name && isSecretLikeName(name)) {
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
      Property(node: ESTree.ObjectProperty): void {
        if (staticKeyName(node.key) !== 'runtimeConfig' || node.value.type !== 'ObjectExpression')
          return
        const publicProperty = findProperty(node.value, 'public')
        if (publicProperty?.value.type === 'ObjectExpression')
          scan(publicProperty.value)
      },
    }
  },
}
