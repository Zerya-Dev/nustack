import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../utils/docs-url.js'

export const noNamespaceImport: Rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow namespace imports from @vueuse/core.',
      url: docsUrl('no-namespace-import'),
    },
    schema: [],
    messages: {
      noNamespace: 'Use named imports from @vueuse/core instead of a namespace import.',
    },
  },

  createOnce(context: any) {
    return {
      ImportDeclaration(node: any) {
        if (node.source.value !== '@vueuse/core')
          return

        for (const specifier of node.specifiers) {
          if (specifier.type !== 'ImportNamespaceSpecifier')
            continue

          context.report({ node: specifier, messageId: 'noNamespace' })
        }
      },
    }
  },
}
