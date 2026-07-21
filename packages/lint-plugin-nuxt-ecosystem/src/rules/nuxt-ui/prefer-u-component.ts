import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../utils/docs-url.js'
import { defineTemplateVisitor, hasRawOptOut } from './utils.js'

interface Options {
  nativeTag: string
  component: string
  ruleName: string
  messageId: string
}

export function preferUComponent(options: Options): Rule {
  const { nativeTag, component, ruleName, messageId } = options

  return {
    meta: {
      type: 'suggestion',
      docs: {
        description: `Prefer \`<${component}>\` over \`<${nativeTag}>\` when Nuxt UI is available.`,
        url: docsUrl(`nuxt-ui/${ruleName}`),
      },
      schema: [],
      messages: {
        [messageId]: `Use \`<${component}>\` instead of \`<${nativeTag}>\`; add \`data-raw\` to allow the native element.`,
      },
    },
    create(context: any) {
      return defineTemplateVisitor(context, {
        VElement(node: any) {
          if (node.name === nativeTag && !hasRawOptOut(node))
            context.report({ loc: node.startTag.loc, messageId })
        },
      })
    },
  }
}
