import type { Context, Rule, Visitor } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, getAttributeValue, getStaticAttribute, getStaticBoolean } from '../../../utils/template.js'
import { createNuxtUiMatcher } from '../components.js'

export const noInvalidPropCombinations: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow documented Nuxt UI prop combinations that cannot work together.',
      url: docsUrl('nuxt-ui/no-invalid-prop-combinations'),
    },
    schema: [],
    messages: {
      fileButtonMultiple: '`UFileUpload variant="button"` only supports a single file; remove `multiple` or use `variant="area"`.',
      fileLayoutArea: '`UFileUpload layout` is only supported with `variant="area"`.',
      filePositionList: '`UFileUpload position` requires `variant="area"` with `layout="list"`.',
      accordionCollapsible: '`UAccordion collapsible` is only meaningful with the default `type="single"`.',
    },
  },
  create(context: Context): Visitor {
    const matcher = createNuxtUiMatcher(context)

    return defineTemplateVisitor(context, {
      VElement(node: VueAST.VElement) {
        if (matcher.is(node, 'FileUpload')) {
          const variant = getAttributeValue(node, 'variant')
          const multiple = getStaticBoolean(node, 'multiple')
          const layout = getAttributeValue(node, 'layout')
          const position = getAttributeValue(node, 'position')

          if (variant.known && variant.value === 'button' && multiple === true) {
            context.report({ loc: node.startTag.loc, messageId: 'fileButtonMultiple' })
          }

          if (layout.known && layout.definite && variant.known && variant.value === 'button') {
            context.report({ loc: node.startTag.loc, messageId: 'fileLayoutArea' })
          }

          if (position.definite && position.known && variant.known && layout.known) {
            const effectiveVariant = variant.definite ? variant.value : 'area'
            const effectiveLayout = layout.definite ? layout.value : 'grid'
            if (effectiveVariant !== 'area' || effectiveLayout !== 'list')
              context.report({ loc: node.startTag.loc, messageId: 'filePositionList' })
          }
        }

        if (matcher.is(node, 'Accordion')) {
          const type = getStaticAttribute(node, 'type')
          if (type === 'multiple' && getStaticBoolean(node, 'collapsible') === true)
            context.report({ loc: node.startTag.loc, messageId: 'accordionCollapsible' })
        }
      },
    })
  },
}
