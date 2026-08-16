import type { Context, Rule, Visitor } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'
import { isNativeElement } from '../../utils/component-matcher.js'
import { docsUrl } from '../../utils/docs-url.js'
import { defineTemplateVisitor } from '../../utils/template.js'
import { nuxtUiPrefix } from './components.js'

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
        // `meta` is static, so the description shows the default prefix; the report resolves it.
        description: `Prefer \`<U${component}>\` over \`<${nativeTag}>\` when Nuxt UI is available.`,
        url: docsUrl(`nuxt-ui/${ruleName}`),
      },
      schema: [],
      messages: {
        [messageId]: 'Use `<{{ component }}>` instead of `<{{ tag }}>`.',
      },
    },
    create(context: Context): Visitor {
      const prefix = nuxtUiPrefix(context)

      return defineTemplateVisitor(context, {
        VElement(node: VueAST.VElement) {
          if (!isNativeElement(node, nativeTag))
            return

          context.report({
            loc: node.startTag.loc,
            messageId,
            data: { component: `${prefix}${component}`, tag: nativeTag },
          })
        },
      })
    },
  }
}
