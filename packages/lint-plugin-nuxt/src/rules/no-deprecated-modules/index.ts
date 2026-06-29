import type { Rule } from '@oxlint/plugins'

interface DeprecatedModule {
  replacement: string
  reason: string
  docs: string
}

const DEPRECATED_MODULES: Record<string, DeprecatedModule> = {
  '@nuxtjs/mdc': {
    replacement: '`@comark/nuxt`',
    reason: 'MDC has been superseded by Comark — it is faster, AI-friendly and framework-agnostic. Your existing markdown files stay compatible; only the JS API changes (`parseMarkdown()` → `parse()`, `<MDCRenderer>` → `<ComarkRenderer>`, `<MDC>` → `<Comark>`).',
    docs: 'https://comark.dev/kb/migration-from-mdc',
  },
  '@nuxtjs/axios': {
    replacement: 'the built-in `$fetch` / `useFetch`',
    reason: 'Nuxt ships `$fetch` (ofetch) plus the `useFetch`/`useAsyncData` composables, which handle SSR payload dedupe and cancellation, so a dedicated Axios module is unmaintained and unnecessary on Nuxt 3+.',
    docs: 'https://nuxt.com/docs/getting-started/data-fetching',
  },
  '@nuxt/http': {
    replacement: 'the built-in `$fetch` / `useFetch`',
    reason: 'Built for Nuxt 2; on Nuxt 3+ it is replaced by the built-in `$fetch` (ofetch) and the `useFetch`/`useAsyncData` composables.',
    docs: 'https://nuxt.com/docs/getting-started/data-fetching',
  },
}

function staticKeyName(key: any): string | null {
  if (key.type === 'Identifier')
    return key.name
  if (key.type === 'Literal' && typeof key.value === 'string')
    return key.value
  return null
}

/** A `modules` entry is either `'mod'` or `['mod', { ...options }]`. */
function moduleEntry(element: any): { name: string, node: any } | null {
  if (!element)
    return null
  if (element.type === 'Literal' && typeof element.value === 'string')
    return { name: element.value, node: element }
  if (element.type === 'ArrayExpression' && element.elements.length > 0) {
    const first = element.elements[0]
    if (first?.type === 'Literal' && typeof first.value === 'string')
      return { name: first.value, node: first }
  }
  return null
}

export const noDeprecatedModules: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow deprecated Nuxt modules in favour of their maintained successors.',
    },
    schema: [],
    messages: {
      deprecated: '`{{ name }}` is deprecated — use {{ replacement }} instead. {{ reason }} Migration guide: {{ docs }}.',
    },
  },
  createOnce(context: any) {
    return {
      Property(node: any) {
        if (staticKeyName(node.key) !== 'modules' || node.value.type !== 'ArrayExpression')
          return

        for (const element of node.value.elements) {
          const entry = moduleEntry(element)
          if (entry === null)
            continue
          const deprecated = DEPRECATED_MODULES[entry.name]
          if (!deprecated)
            continue

          context.report({
            node: entry.node,
            messageId: 'deprecated',
            data: {
              name: entry.name,
              replacement: deprecated.replacement,
              reason: deprecated.reason,
              docs: deprecated.docs,
            },
          })
        }
      },
    }
  },
}
