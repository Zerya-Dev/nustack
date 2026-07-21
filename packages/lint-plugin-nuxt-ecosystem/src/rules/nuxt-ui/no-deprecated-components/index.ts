import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor } from '../utils.js'

interface DeprecatedComponent {
  /** Canonical (proper-cased) name, for the message. */
  name: string
  replacement: string
}

/** Verified 2026-07-21 against the ui.nuxt.com v4 migration guide; re-verify on the next major. */
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
      url: docsUrl('nuxt-ui/no-deprecated-components'),
    },
    schema: [{
      type: 'object',
      properties: {
        /** Extra `OldName` → `NewName` renames, merged onto the built-in v4 table. */
        components: { type: 'object', additionalProperties: { type: 'string' } },
      },
      additionalProperties: false,
    }],
    messages: {
      deprecated: '`<{{ name }}>` was renamed in Nuxt UI v4, use `<{{ replacement }}>` instead.',
    },
  },
  create(context: any) {
    // User entries are written proper-cased (`{ UOld: 'UNew' }`) but matched lowercased.
    const table: Record<string, DeprecatedComponent> = { ...DEPRECATED_COMPONENTS }
    const extra = context.options[0]?.components ?? {}
    for (const [name, replacement] of Object.entries(extra) as [string, string][])
      table[name.toLowerCase()] = { name, replacement }

    return defineTemplateVisitor(context, {
      VElement(node: any) {
        const deprecated = table[node.name]
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
