import type { TSESLint, TSESTree } from '@typescript-eslint/utils'
import type { Rule } from 'eslint'
import { createRule } from '../../utils'

interface Options {
  /** Identifiers Nuxt auto-imports (from the generated context). */
  imports?: string[]
  /** Globally registered component names (from the generated context). */
  components?: string[]
}

/** Sources that are themselves Nuxt auto-import entrypoints. */
const NUXT_AUTO_IMPORT_SOURCES = new Set(['#imports', '#app'])
/** Route composables Nuxt exposes globally in app code. */
const VUE_ROUTER_AUTO_IMPORTS = new Set([
  'onBeforeRouteLeave',
  'onBeforeRouteUpdate',
  'useRoute',
  'useRouter',
])
const COMPONENT_PATH_RE = /(?:^|\/)components\//
const COMPOSABLE_PATH_RE = /(?:^|\/)(?:composables|utils)\//

/**
 * Flags explicit imports of identifiers/components that Nuxt already makes
 * globally available, and removes them — the symbol stays in scope. Uses the
 * project's real auto-import + component lists (passed as options by the nuxt
 * concern), so it never false-positives on non-auto-imported names.
 */
export const rule: Rule.RuleModule = createRule<'noExplicitAutoImport', [Options]>({
  name: 'nuxt/no-explicit-auto-import',
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow explicit imports of Nuxt auto-imported identifiers and components',
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
      noExplicitAutoImport: '`{{ name }}` is auto-imported by Nuxt. NuStack standardizes on the auto-import for consistency — remove this explicit import (the symbol stays in scope).',
    },
  },
  defaultOptions: [{}],
  create(context) {
    const { imports = [], components = [] } = context.options[0] ?? {}
    const importSet = new Set(imports)
    const componentSet = new Set(components)
    const sourceCode = context.sourceCode

    function removeSpecifier(fixer: TSESLint.RuleFixer, spec: TSESTree.Node): TSESLint.RuleFix {
      const after = sourceCode.getTokenAfter(spec as any)
      const before = sourceCode.getTokenBefore(spec as any)
      if (after?.value === ',')
        return fixer.removeRange([spec.range[0], after.range[1]])
      if (before?.value === ',')
        return fixer.removeRange([before.range[0], spec.range[1]])
      return fixer.remove(spec as any)
    }

    return {
      ImportDeclaration(node: TSESTree.ImportDeclaration) {
        // Never touch type-only imports — they don't exist at runtime, so the
        // auto-import doesn't cover them.
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

        const flagged: { node: TSESTree.Node, name: string }[] = []

        for (const spec of node.specifiers) {
          if (spec.type === 'ImportDefaultSpecifier' || spec.type === 'ImportNamespaceSpecifier') {
            if (isNuxtAutoImportSource)
              flagged.push({ node: spec, name: spec.local.name })
            else if (spec.type === 'ImportDefaultSpecifier' && isComponentPath && componentSet.has(spec.local.name))
              flagged.push({ node: spec, name: spec.local.name })
            continue
          }

          if (spec.type === 'ImportSpecifier') {
            if (spec.importKind === 'type')
              continue
            const name = spec.imported.type === 'Identifier'
              ? spec.imported.name
              : String(spec.imported.value)
            if (
              isNuxtAutoImportSource
              || ((isVueSource || isComposablePath) && importSet.has(name))
              || (isVueRouterSource && (importSet.has(name) || VUE_ROUTER_AUTO_IMPORTS.has(name)))
            ) {
              flagged.push({ node: spec, name })
            }
          }
        }

        if (flagged.length === 0)
          return

        // Whole declaration is redundant → drop it entirely.
        if (flagged.length === node.specifiers.length) {
          context.report({
            node: node as any,
            messageId: 'noExplicitAutoImport',
            data: { name: flagged.map(f => f.name).join(', ') },
            fix: fixer => fixer.remove(node as any),
          })
          return
        }

        // Mixed import → strip only the redundant specifiers.
        for (const { node: specNode, name } of flagged) {
          context.report({
            node: specNode as any,
            messageId: 'noExplicitAutoImport',
            data: { name },
            fix: fixer => removeSpecifier(fixer, specNode),
          })
        }
      },
    }
  },
})
