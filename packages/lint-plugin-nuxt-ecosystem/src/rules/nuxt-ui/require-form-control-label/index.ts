import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../../utils/docs-url.js'
import { componentName, defineTemplateVisitor, hasNonEmptyAttribute, hasRawOptOut, hasSlot } from '../utils.js'

const FORM_CONTROLS = new Set([
  'ucheckbox',
  'ucheckboxgroup',
  'ucolorpicker',
  'ufileupload',
  'uinput',
  'uinputdate',
  'uinputmenu',
  'uinputnumber',
  'uinputrating',
  'uinputtags',
  'uinputtime',
  'ulistbox',
  'upininput',
  'uradiogroup',
  'uselect',
  'uselectmenu',
  'uslider',
  'uswitch',
  'utextarea',
])

function hasLabeledFormFieldAncestor(node: any): boolean {
  let parent = node.parent
  while (parent) {
    if (parent.type === 'VElement' && parent.name === 'uformfield') {
      return hasNonEmptyAttribute(parent, 'label')
        || hasSlot(parent, 'label')
    }
    parent = parent.parent
  }
  return false
}

function hasAccessibleLabel(node: any): boolean {
  return hasNonEmptyAttribute(node, 'label')
    || hasNonEmptyAttribute(node, 'legend')
    || hasNonEmptyAttribute(node, 'aria-label')
    || hasNonEmptyAttribute(node, 'aria-labelledby')
    || hasSlot(node, 'label')
    || hasSlot(node, 'legend')
    || hasLabeledFormFieldAncestor(node)
}

export const requireFormControlLabel: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require an accessible label for Nuxt UI form controls.',
      url: docsUrl('nuxt-ui/require-form-control-label'),
    },
    schema: [],
    messages: {
      missingLabel: 'Add `label`, `legend`, `aria-label`, `aria-labelledby`, or wrap `<{{ component }}>` in a `<UFormField>` with `label` or a `#label` slot.',
    },
  },
  create(context: any) {
    return defineTemplateVisitor(context, {
      VElement(node: any) {
        if (!FORM_CONTROLS.has(node.name) || hasRawOptOut(node) || hasAccessibleLabel(node))
          return
        context.report({
          loc: node.startTag.loc,
          messageId: 'missingLabel',
          data: { component: componentName(node.name) },
        })
      },
    })
  },
}
