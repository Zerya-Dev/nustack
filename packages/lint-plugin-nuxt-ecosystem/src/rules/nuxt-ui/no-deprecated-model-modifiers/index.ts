import type { Rule } from '@oxlint/plugins'

/** Renamed `v-model` modifiers: old → new. Verified 2026-06-30 against ui.nuxt.com (v4). */
const DEPRECATED_MODIFIERS: Record<string, string> = {
  nullify: 'nullable',
}

/** Components whose `v-model` carried the renamed modifier (lowercased for the parser). */
const TARGET_COMPONENTS = ['uinput', 'uinputnumber', 'utextarea']

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
    schema: [{
      type: 'object',
      properties: {
        /** Extra `old` → `new` modifier renames, merged onto the built-in table. */
        modifiers: { type: 'object', additionalProperties: { type: 'string' } },
        /** Components to check, lowercased. Replaces the built-in list when provided. */
        components: { type: 'array', items: { type: 'string' } },
      },
      additionalProperties: false,
    }],
    messages: {
      preferNullable: 'The `v-model.{{ old }}` modifier was renamed in Nuxt UI v4 — use `v-model.{{ replacement }}` instead.',
    },
  },
  create(context: any) {
    const services = context.sourceCode.parserServices
    if (typeof services?.defineTemplateBodyVisitor !== 'function')
      return {}

    const options = context.options[0] ?? {}
    const modifiers: Record<string, string> = { ...DEPRECATED_MODIFIERS, ...options.modifiers }
    const targets = new Set<string>(options.components ?? TARGET_COMPONENTS)

    return services.defineTemplateBodyVisitor({
      VElement(node: any) {
        if (!targets.has(node.name))
          return

        const model = vModel(node)
        for (const modifier of model?.key.modifiers ?? []) {
          const replacement = modifiers[modifier.name]
          if (replacement) {
            context.report({
              loc: modifier.loc ?? model.key.loc,
              messageId: 'preferNullable',
              data: { old: modifier.name, replacement },
            })
          }
        }
      },
    })
  },
}
