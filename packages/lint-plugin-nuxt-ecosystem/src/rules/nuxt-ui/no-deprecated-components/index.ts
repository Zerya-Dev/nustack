import type { Context, Rule, Visitor } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'
import { normalizeComponentKey } from '../../../utils/component-matcher.js'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor } from '../../../utils/template.js'
import { createNuxtUiMatcher, nuxtUiPrefix } from '../components.js'

// Verified against the Nuxt UI v4 migration guides; re-verify on the next major.
const DEPRECATED_COMPONENTS: Record<string, string> = {
  ButtonGroup: 'FieldGroup',
  PageMarquee: 'Marquee',
  PageAccordion: 'Accordion',
  FormGroup: 'FormField',
  Dropdown: 'DropdownMenu',
  Divider: 'Separator',
  Range: 'Slider',
  Toggle: 'Switch',
}

/** Renames that were not tag-only, so an autofix would silently change behaviour. */
const MANUAL_MIGRATION = new Set(['pageaccordion'])

const LAZY_SPELLING = /^lazy-?/i

function toKebabCase(name: string): string {
  return name.replace(/[A-Z]/g, (letter, index) => (index === 0 ? '' : '-') + letter.toLowerCase())
}

/**
 * The replacement tag in the spelling the reported one used. `null` when the tag does not spell
 * the component out (an import alias, `<component :is>`), which a tag rename cannot follow.
 */
function renamedTag(raw: string, from: string, to: string): string | null {
  const lazy = LAZY_SPELLING.exec(raw)?.[0] ?? ''
  const bare = raw.slice(lazy.length)
  if (normalizeComponentKey(bare) !== normalizeComponentKey(from))
    return null
  return bare.includes('-') ? lazy + toKebabCase(to) : lazy + to
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
      properties: { components: { type: 'object', additionalProperties: { type: 'string' } } },
      additionalProperties: false,
    }],
    fixable: 'code',
    messages: {
      deprecated: '`<{{ name }}>` was renamed in Nuxt UI v4, use `<{{ replacement }}>` instead.',
    },
  },
  create(context: Context): Visitor {
    const matcher = createNuxtUiMatcher(context)
    const options = context.options[0] as { components?: Record<string, string> } | undefined
    const prefix = nuxtUiPrefix(context)
    const extra = options?.components ?? {}
    const unprefixed = (name: string) => (name.startsWith(prefix) ? name.slice(prefix.length) : name)
    const table = new Map<string, { name: string, replacement: string }>()
    for (const [name, replacement] of Object.entries({ ...DEPRECATED_COMPONENTS, ...extra })) {
      const canonicalKey = normalizeComponentKey(name)
      table.set(canonicalKey, { name, replacement })

      // Keep accepting the old prefixed option spelling without making canonical names such as
      // `UserCard` ambiguous when the configured prefix is `U`.
      const prefixedKey = matcher.keyOfName(name)
      if (prefixedKey && prefixedKey !== canonicalKey)
        table.set(prefixedKey, { name: unprefixed(name), replacement: unprefixed(replacement) })
    }

    return defineTemplateVisitor(context, {
      VElement(node: VueAST.VElement) {
        const key = matcher.keyOf(node)
        const deprecated = key === null ? undefined : table.get(key)
        if (!deprecated)
          return

        const name = matcher.prefixed(deprecated.name)
        const replacement = matcher.prefixed(deprecated.replacement)
        const renamed = MANUAL_MIGRATION.has(key!)
          ? null
          : renamedTag(matcher.rawName(node), name, replacement)

        context.report({
          loc: node.startTag.loc,
          messageId: 'deprecated',
          data: { name, replacement },
          fix: renamed === null
            ? undefined
            : (fixer: any) => {
                const raw = matcher.rawName(node)
                // `<` and `</` precede the name in the start and end tag respectively.
                const start = node.startTag.range[0] + 1
                const fixes = [fixer.replaceTextRange([start, start + raw.length], renamed)]
                if (node.endTag) {
                  const end = node.endTag.range[0] + 2
                  fixes.push(fixer.replaceTextRange([end, end + raw.length], renamed))
                }
                return fixes
              },
        })
      },
    })
  },
}
