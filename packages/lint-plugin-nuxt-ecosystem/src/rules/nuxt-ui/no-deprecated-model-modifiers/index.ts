import type { Rule } from '@oxlint/plugins'

/** Components whose `v-model` carried the renamed modifier (lowercased for the parser). */
const TARGET_COMPONENTS = new Set(['uinput', 'uinputnumber', 'utextarea'])

/** Returns the `v-model` directive on a start tag, or `null`. */
function vModel(node: any): any {
  return node.startTag.attributes.find(
    (attribute: any) => attribute.directive && attribute.key.name?.name === 'model',
  ) ?? null
}

export const noDeprecatedModelModifiers: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow the `v-model.nullify` modifier renamed to `.nullable` in Nuxt UI v4.',
    },
    schema: [],
    messages: {
      preferNullable: 'The `v-model.nullify` modifier was renamed in Nuxt UI v4 — use `v-model.nullable` instead.',
    },
  },
  create(context: any) {
    const services = context.sourceCode.parserServices
    if (typeof services?.defineTemplateBodyVisitor !== 'function')
      return {}

    return services.defineTemplateBodyVisitor({
      VElement(node: any) {
        if (!TARGET_COMPONENTS.has(node.name))
          return

        const model = vModel(node)
        const nullify = model?.key.modifiers?.find((modifier: any) => modifier.name === 'nullify')
        if (nullify)
          context.report({ loc: nullify.loc ?? model.key.loc, messageId: 'preferNullable' })
      },
    })
  },
}
