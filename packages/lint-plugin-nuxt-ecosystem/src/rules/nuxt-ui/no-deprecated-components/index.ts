import type { Rule } from '@oxlint/plugins'

interface DeprecatedComponent {
  /** Canonical (proper-cased) name, for the message. */
  name: string
  replacement: string
}

/**
 * Nuxt UI v4 component renames. `vue-eslint-parser` lowercases element names, so the
 * lookup is keyed by the lowercased tag. Each entry verified 2026-06-30 against
 * ui.nuxt.com (v4 migration guide + the live component pages).
 */
const DEPRECATED_COMPONENTS: Record<string, DeprecatedComponent> = {
  ubuttongroup: { name: 'UButtonGroup', replacement: 'UFieldGroup' },
  upagemarquee: { name: 'UPageMarquee', replacement: 'UMarquee' },
  upageaccordion: { name: 'UPageAccordion', replacement: 'UAccordion' },
}

export const noDeprecatedComponents: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow Nuxt UI components renamed in v4 in favour of their current names.',
    },
    schema: [],
    messages: {
      deprecated: '`<{{ name }}>` was renamed in Nuxt UI v4 — use `<{{ replacement }}>` instead.',
    },
  },
  create(context: any) {
    const services = context.sourceCode.parserServices
    if (typeof services?.defineTemplateBodyVisitor !== 'function')
      return {}

    return services.defineTemplateBodyVisitor({
      VElement(node: any) {
        const deprecated = DEPRECATED_COMPONENTS[node.name]
        if (deprecated) {
          context.report({
            loc: node.startTag.loc,
            messageId: 'deprecated',
            data: { name: deprecated.name, replacement: deprecated.replacement },
          })
        }
      },
    })
  },
}
