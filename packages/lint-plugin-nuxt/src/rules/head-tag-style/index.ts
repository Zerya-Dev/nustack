import type { Context, ESTree, Rule, Visitor } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'
import { docsUrl } from '../../utils/docs-url.js'

interface Options {
  variant?: 'useHead' | 'components'
}

const HEAD_COMPONENTS = new Set([
  'Base',
  'Body',
  'Head',
  'Html',
  'Link',
  'Meta',
  'NoScript',
  'Style',
  'Title',
])

interface TemplateBodyVisitorServices {
  defineTemplateBodyVisitor: (visitor: { VElement: (node: VueAST.VElement) => void }) => Visitor
}

function hasTemplateBodyVisitor(
  services: Readonly<Record<string, unknown>>,
): services is Readonly<Record<string, unknown>> & TemplateBodyVisitorServices {
  return typeof services.defineTemplateBodyVisitor === 'function'
}

export const headTagStyle: Rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce a consistent Nuxt head-tag style using either `useHead` or template components.',
      url: docsUrl('head-tag-style'),
    },
    schema: [{
      type: 'object',
      properties: {
        variant: { enum: ['useHead', 'components'] },
      },
      additionalProperties: false,
    }],
    messages: {
      preferComponents: 'Use Nuxt head components instead of `useHead()`.',
      preferUseHead: 'Use `useHead()` instead of the `<{{ name }}>` head component.',
    },
  },
  create(context: Context): Visitor {
    const variant = (context.options?.[0] as Options | undefined)?.variant ?? 'useHead'

    if (variant === 'components') {
      return {
        CallExpression(node: ESTree.CallExpression): void {
          if (node.callee.type === 'Identifier' && node.callee.name === 'useHead')
            context.report({ node: node.callee, messageId: 'preferComponents' })
        },
      }
    }

    const services = context.sourceCode.parserServices
    if (!hasTemplateBodyVisitor(services))
      return {}

    return services.defineTemplateBodyVisitor({
      VElement(node: VueAST.VElement): void {
        const name = node.rawName
        if (HEAD_COMPONENTS.has(name)) {
          context.report({
            loc: node.startTag.loc,
            messageId: 'preferUseHead',
            data: { name },
          })
        }
      },
    })
  },
}
