import type { Context, Rule, Visitor } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, getStaticAttribute } from '../../../utils/template.js'
import { createImageMatcher } from '../components.js'

const ASSETS_ALIAS = /^(?:~~?|@@?)\/?assets\//

export const noAssetsSrc: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow `~/assets` paths in `@nuxt/image` sources, which resolve only at build time.',
      url: docsUrl('nuxt-image/no-assets-src'),
    },
    schema: [],
    messages: {
      assetsSrc: '`<{{ component }}>` resolves `{{ attribute }}` as a URL at runtime, so `{{ src }}` never reaches the image provider. Move the file to `public/`.',
    },
  },
  create(context: Context): Visitor {
    const matcher = createImageMatcher(context)

    return defineTemplateVisitor(context, {
      VElement(node: VueAST.VElement) {
        const image = matcher.match(node)
        if (image === null)
          return

        for (const attribute of image.sources) {
          const src = getStaticAttribute(node, attribute)
          if (src === null || !ASSETS_ALIAS.test(src))
            continue

          context.report({
            loc: node.startTag.loc,
            messageId: 'assetsSrc',
            data: { component: image.name, attribute, src },
          })
        }
      },
    })
  },
}
