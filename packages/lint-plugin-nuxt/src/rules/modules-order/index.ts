import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../utils/docs-url.js'

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
    reason: 'With @nuxt/content v3 the wrong order causes silent failures — SEO appears to work but Content frontmatter is not processed correctly.',
    docs: 'https://nuxtseo.com/docs/nuxt-seo/guides/using-the-modules',
  },
]

function staticKeyName(key: any): string | null {
  if (key.type === 'Identifier')
    return key.name
  if (key.type === 'Literal' && typeof key.value === 'string')
    return key.value
  return null
}

/** A `modules` entry is either `'mod'` or `['mod', { ...options }]`. */
function moduleName(element: any): string | null {
  if (!element)
    return null
  if (element.type === 'Literal' && typeof element.value === 'string')
    return element.value
  if (element.type === 'ArrayExpression' && element.elements.length > 0) {
    const first = element.elements[0]
    if (first?.type === 'Literal' && typeof first.value === 'string')
      return first.value
  }
  return null
}

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
  createOnce(context: any) {
    return {
      Property(node: any) {
        if (staticKeyName(node.key) !== 'modules' || node.value.type !== 'ArrayExpression')
          return

        // First index + node for each statically resolvable module specifier.
        const index = new Map<string, number>()
        const reportNode = new Map<string, any>()
        node.value.elements.forEach((element: any, position: number) => {
          const name = moduleName(element)
          if (name === null || index.has(name))
            return
          index.set(name, position)
          reportNode.set(name, element)
        })

        for (const constraint of ORDER_CONSTRAINTS) {
          const beforeIndex = index.get(constraint.before)
          const afterIndex = index.get(constraint.after)
          if (beforeIndex === undefined || afterIndex === undefined)
            continue
          if (beforeIndex < afterIndex)
            continue

          context.report({
            node: reportNode.get(constraint.after),
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
