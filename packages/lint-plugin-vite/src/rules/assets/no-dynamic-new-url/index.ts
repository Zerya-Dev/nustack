import type { Rule } from '@oxlint/plugins'

function isImportMetaUrl(node: any): boolean {
  return node?.type === 'MemberExpression'
    && !node.computed
    && node.property?.type === 'Identifier'
    && node.property.name === 'url'
    && node.object?.type === 'MetaProperty'
    && node.object.meta?.name === 'import'
    && node.object.property?.name === 'meta'
}

export const noDynamicNewUrl: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow dynamic template literals in `new URL(..., import.meta.url)`.',
    },
    schema: [],
    messages: {
      noDynamicNewUrl: 'Vite resolves `new URL(..., import.meta.url)` paths statically at build time. A template literal with an interpolated expression can\'t be analyzed and won\'t be bundled.',
    },
  },
  createOnce(context: any) {
    return {
      NewExpression(node: any) {
        if (node.callee?.type !== 'Identifier' || node.callee.name !== 'URL')
          return

        const [pathArg, baseArg] = node.arguments
        if (pathArg?.type !== 'TemplateLiteral' || pathArg.expressions.length === 0)
          return
        if (!isImportMetaUrl(baseArg))
          return

        context.report({ node: pathArg, messageId: 'noDynamicNewUrl' })
      },
    }
  },
}
