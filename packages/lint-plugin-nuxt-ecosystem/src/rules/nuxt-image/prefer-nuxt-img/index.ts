import type { Context, Rule, Visitor } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'
import { elementAncestor, isNativeElement } from '../../../utils/component-matcher.js'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor } from '../../../utils/template.js'
import { createNuxtImageMatcher } from '../components.js'

export const preferNuxtImg: Rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer `<NuxtImg>` over a raw `<img>` when `@nuxt/image` is available.',
      url: docsUrl('nuxt-image/prefer-nuxt-img'),
    },
    schema: [],
    messages: {
      preferNuxtImg: 'Use `<NuxtImg>` instead of `<img>`, so the image goes through the configured provider.',
    },
  },
  create(context: Context): Visitor {
    const matcher = createNuxtImageMatcher(context)

    return defineTemplateVisitor(context, {
      VElement(node: VueAST.VElement) {
        if (!isNativeElement(node, 'img'))
          return

        // A `<picture>` needs a native `<img>` child, and `<NuxtPicture>` builds that markup itself.
        const parent = elementAncestor(node)
        if (parent && (isNativeElement(parent, 'picture') || matcher.is(parent, 'NuxtPicture')))
          return

        context.report({ loc: node.startTag.loc, messageId: 'preferNuxtImg' })
      },
    })
  },
}
