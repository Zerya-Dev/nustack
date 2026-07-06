import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../utils/docs-url.js'

interface Options {
  imports?: string[]
  components?: string[]
}

const NUXT_AUTO_IMPORT_SOURCES = new Set(['#imports', '#app'])
const VUE_ROUTER_AUTO_IMPORTS = new Set([
  'onBeforeRouteLeave',
  'onBeforeRouteUpdate',
  'useRoute',
  'useRouter',
])
const COMPONENT_PATH_RE = /(?:^|\/)components\//
const COMPOSABLE_PATH_RE = /(?:^|\/)(?:composables|utils)\//

export const noExplicitAutoImport: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow explicit imports of Nuxt auto-imported identifiers and components.',
      url: docsUrl('no-explicit-auto-import'),
    },
    fixable: 'code',
    schema: [{
      type: 'object',
      properties: {
        imports: { type: 'array', items: { type: 'string' } },
        components: { type: 'array', items: { type: 'string' } },
      },
      additionalProperties: false,
    }],
    messages: {
      noExplicitAutoImport: '`{{ name }}` is auto-imported by Nuxt. NuStack standardizes on the auto-import for consistency; remove this explicit import.',
    },
  },
  create(context: any) {
    const options = (context.options?.[0] ?? {}) as Options
    const importSet = new Set(options.imports ?? [])
    const componentSet = new Set(options.components ?? [])
    const sourceCode = context.sourceCode

    function removeSpecifier(fixer: any, specifier: any) {
      const after = sourceCode.getTokenAfter(specifier)
      const before = sourceCode.getTokenBefore(specifier)
      if (after?.value === ',') {
        const tokenAfterComma = sourceCode.getTokenAfter(after)
        return fixer.removeRange([specifier.range[0], tokenAfterComma?.range[0] ?? after.range[1]])
      }
      if (before?.value === ',')
        return fixer.removeRange([before.range[0], specifier.range[1]])
      return fixer.remove(specifier)
    }

    return {
      ImportDeclaration(node: any) {
        if (node.importKind === 'type')
          return

        const source = String(node.source.value)
        const isNuxtAutoImportSource = NUXT_AUTO_IMPORT_SOURCES.has(source)
        const isVueSource = source === 'vue'
        const isVueRouterSource = source === 'vue-router'
        const isComposablePath = COMPOSABLE_PATH_RE.test(source)
        const isComponentPath = COMPONENT_PATH_RE.test(source)
        if (!isNuxtAutoImportSource && !isVueSource && !isVueRouterSource && !isComposablePath && !isComponentPath)
          return

        const flagged: { node: any, name: string }[] = []
        for (const specifier of node.specifiers) {
          if (specifier.type === 'ImportDefaultSpecifier' || specifier.type === 'ImportNamespaceSpecifier') {
            if (isNuxtAutoImportSource)
              flagged.push({ node: specifier, name: specifier.local.name })
            else if (specifier.type === 'ImportDefaultSpecifier' && isComponentPath && componentSet.has(specifier.local.name))
              flagged.push({ node: specifier, name: specifier.local.name })
            continue
          }

          if (specifier.type === 'ImportSpecifier') {
            if (specifier.importKind === 'type')
              continue
            const name = specifier.imported.type === 'Identifier'
              ? specifier.imported.name
              : String(specifier.imported.value)
            if (
              isNuxtAutoImportSource
              || ((isVueSource || isComposablePath) && importSet.has(name))
              || (isVueRouterSource && (importSet.has(name) || VUE_ROUTER_AUTO_IMPORTS.has(name)))
            ) {
              flagged.push({ node: specifier, name })
            }
          }
        }

        if (flagged.length === 0)
          return

        if (flagged.length === node.specifiers.length) {
          context.report({
            node,
            messageId: 'noExplicitAutoImport',
            data: { name: flagged.map(f => f.name).join(', ') },
            fix: (fixer: any) => fixer.remove(node),
          })
          return
        }

        for (const { node: specifier, name } of flagged) {
          context.report({
            node: specifier,
            messageId: 'noExplicitAutoImport',
            data: { name },
            fix: (fixer: any) => removeSpecifier(fixer, specifier),
          })
        }
      },
    }
  },
}
