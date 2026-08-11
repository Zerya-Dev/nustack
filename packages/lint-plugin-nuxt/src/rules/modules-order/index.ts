import type { Context, ESTree, Rule, Visitor } from '@oxlint/plugins'
import { staticKeyName } from '../../utils/ast.js'
import { docsUrl } from '../../utils/docs-url.js'
import { nuxtModuleEntry } from '../../utils/nuxt-modules.js'

/**
 * Ordering constraints between Nuxt ecosystem modules. Each entry means "`before`
 * must be registered earlier in the `modules` array than `after`". Constraints are
 * acyclic, so they compose: i18n → seo → content, and ui → content.
 */
interface OrderConstraint {
  before: string
  after: string
  reason: string
  docs: string
}

const ORDER_CONSTRAINTS: OrderConstraint[] = [
  {
    before: '@nuxt/ui',
    after: '@nuxt/content',
    reason: 'Nuxt UI registers the prose components that Content renders; with the wrong order those components are not available and prose silently falls back.',
    docs: 'https://ui.nuxt.com/docs/getting-started/integrations/content',
  },
  {
    before: '@nuxtjs/i18n',
    after: '@nuxtjs/seo',
    reason: 'Nuxt Site Config (bundled in Nuxt SEO) reads `baseUrl` and the current locale from your i18n config, so i18n must be registered first.',
    docs: 'https://nuxtseo.com/docs/site-config/guides/i18n',
  },
  {
    before: '@nuxtjs/i18n',
    after: 'nuxt-site-config',
    reason: 'Nuxt Site Config reads `baseUrl` and the current locale from your i18n config, so i18n must be registered first.',
    docs: 'https://nuxtseo.com/docs/site-config/guides/i18n',
  },
  {
    before: '@nuxtjs/seo',
    after: '@nuxt/content',
    reason: 'With @nuxt/content v3 the wrong order causes silent failures, SEO appears to work but Content frontmatter is not processed correctly.',
    docs: 'https://nuxtseo.com/docs/nuxt-seo/guides/using-the-modules',
  },
]

export const modulesOrder: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce a correct registration order for interdependent Nuxt modules.',
      url: docsUrl('modules-order'),
    },
    schema: [],
    messages: {
      wrongOrder: 'Register `{{ before }}` before `{{ after }}` in `modules`. {{ reason }} See {{ docs }}.',
    },
  },
  createOnce(context: Context): Visitor {
    return {
      Property(node: ESTree.ObjectProperty): void {
        if (staticKeyName(node.key) !== 'modules' || node.value.type !== 'ArrayExpression')
          return

        // First index + node for each statically resolvable module specifier.
        const index = new Map<string, number>()
        const reportNode = new Map<string, ESTree.Node>()
        node.value.elements.forEach((element: ESTree.ArrayExpressionElement, position: number) => {
          if (!element)
            return
          const entry = nuxtModuleEntry(element)
          if (!entry || index.has(entry.name))
            return
          index.set(entry.name, position)
          reportNode.set(entry.name, element)
        })

        for (const constraint of ORDER_CONSTRAINTS) {
          const beforeIndex = index.get(constraint.before)
          const afterIndex = index.get(constraint.after)
          if (beforeIndex === undefined || afterIndex === undefined)
            continue
          if (beforeIndex < afterIndex)
            continue
          const target = reportNode.get(constraint.after)
          if (!target)
            continue

          context.report({
            node: target,
            messageId: 'wrongOrder',
            data: {
              before: constraint.before,
              after: constraint.after,
              reason: constraint.reason,
              docs: constraint.docs,
            },
          })
        }
      },
    }
  },
}
