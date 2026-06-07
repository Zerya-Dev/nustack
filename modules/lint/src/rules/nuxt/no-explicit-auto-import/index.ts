import type { TSESTree } from '@typescript-eslint/utils'
import type { Rule } from 'eslint'
import { createRule } from '../../utils'

interface Options {
  /** Identifiers Nuxt auto-imports (from the generated context). */
  imports?: string[]
  /** Globally registered component names (from the generated context). */
  components?: string[]
}

/** Sources whose named exports Nuxt re-exposes as auto-imports. */
const AUTO_IMPORT_SOURCES = new Set(['vue', 'vue-router', '#imports', '#app'])
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

    function removeSpecifier(fixer: Rule.RuleFixer, spec: TSESTree.Node): Rule.Fix {
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
        const isAutoSource = AUTO_IMPORT_SOURCES.has(source)
        const isComposablePath = COMPOSABLE_PATH_RE.test(source)
        const isComponentPath = COMPONENT_PATH_RE.test(source)
        if (!isAutoSource && !isComposablePath && !isComponentPath)
          return

        const flagged: { node: TSESTree.Node, name: string }[] = []

        for (const spec of node.specifiers) {
          if (spec.type === 'ImportSpecifier') {
            if (spec.importKind === 'type')
              continue
            const name = spec.imported.type === 'Identifier'
              ? spec.imported.name
              : String(spec.imported.value)
            if ((isAutoSource || isComposablePath) && importSet.has(name))
              flagged.push({ node: spec, name })
          } else if (spec.type === 'ImportDefaultSpecifier') {
            // `import MyComp from '~/components/MyComp.vue'`
            if (isComponentPath && componentSet.has(spec.local.name))
              flagged.push({ node: spec, name: spec.local.name })
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
