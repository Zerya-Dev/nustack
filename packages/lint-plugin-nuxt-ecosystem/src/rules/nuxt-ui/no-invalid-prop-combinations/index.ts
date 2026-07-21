import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, getStaticAttribute, hasAttribute, hasRawOptOut } from '../utils.js'

interface StaticValue {
  present: boolean
  dynamic: boolean
  value: string | null
}

function staticValue(node: any, name: string): StaticValue {
  const attribute = node.startTag.attributes.find((candidate: any) => {
    if (!candidate.directive)
      return candidate.key.name === name
    if (candidate.key.name?.name !== 'bind')
      return false
    const argument = candidate.key.argument
    return argument?.type === 'VIdentifier' && argument.name === name
  })
  if (!attribute)
    return { present: false, dynamic: false, value: null }
  if (attribute.directive)
    return { present: true, dynamic: true, value: null }
  return { present: true, dynamic: false, value: attribute.value?.value ?? null }
}

function staticBoolean(node: any, name: string): boolean | null {
  const attribute = staticValue(node, name)
  if (!attribute.present || attribute.dynamic)
    return null
  if (attribute.value === null || attribute.value === '')
    return true
  if (attribute.value === 'true')
    return true
  if (attribute.value === 'false')
    return false
  return null
}

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
  create(context: any) {
    return defineTemplateVisitor(context, {
      VElement(node: any) {
        if (hasRawOptOut(node))
          return

        if (node.name === 'ufileupload') {
          const variant = staticValue(node, 'variant')
          const multiple = staticBoolean(node, 'multiple')
          const layout = staticValue(node, 'layout')
          const position = staticValue(node, 'position')

          if (!variant.dynamic && variant.value === 'button' && multiple === true) {
            context.report({ loc: node.startTag.loc, messageId: 'fileButtonMultiple' })
          }

          if (!layout.dynamic && layout.present && !variant.dynamic && variant.value === 'button') {
            context.report({ loc: node.startTag.loc, messageId: 'fileLayoutArea' })
          }

          if (position.present && !position.dynamic && !variant.dynamic && !layout.dynamic) {
            const effectiveVariant = variant.present ? variant.value : 'area'
            const effectiveLayout = layout.present ? layout.value : 'grid'
            if (effectiveVariant !== 'area' || effectiveLayout !== 'list')
              context.report({ loc: node.startTag.loc, messageId: 'filePositionList' })
          }
        }

        if (node.name === 'uaccordion') {
          const type = getStaticAttribute(node, 'type')
          if (type === 'multiple' && hasAttribute(node, 'collapsible'))
            context.report({ loc: node.startTag.loc, messageId: 'accordionCollapsible' })
        }
      },
    })
  },
}
