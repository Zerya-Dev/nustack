import type { Context, ESTree, Rule, Visitor } from '@oxlint/plugins'
import { staticKeyName } from '../../utils/ast.js'
import { docsUrl } from '../../utils/docs-url.js'
import { nuxtModuleEntry } from '../../utils/nuxt-modules.js'

interface DeprecatedModule {
  replacement: string
  reason: string
  docs: string
}

const DEPRECATED_MODULES: Record<string, DeprecatedModule> = {
  '@nuxtjs/mdc': {
    replacement: '`@comark/nuxt`',
    reason: 'MDC has been superseded by Comark, it is faster, AI-friendly and framework-agnostic. Your existing markdown files stay compatible; only the JS API changes (`parseMarkdown()` → `parse()`, `<MDCRenderer>` → `<ComarkRenderer>`, `<MDC>` → `<Comark>`).',
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

export const noDeprecatedModules: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow deprecated Nuxt modules in favour of their maintained successors.',
      url: docsUrl('no-deprecated-modules'),
    },
    schema: [],
    messages: {
      deprecated: '`{{ name }}` is deprecated, use {{ replacement }} instead. {{ reason }} Migration guide: {{ docs }}.',
    },
  },
  createOnce(context: Context): Visitor {
    return {
      Property(node: ESTree.ObjectProperty): void {
        if (staticKeyName(node.key) !== 'modules' || node.value.type !== 'ArrayExpression')
          return

        for (const element of node.value.elements) {
          const entry = nuxtModuleEntry(element)
          if (!entry)
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
