import type { Context, Rule, Visitor } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'
import type { ComponentMatcher } from '../../../utils/component-matcher.js'
import { elementAncestor, isNativeElement } from '../../../utils/component-matcher.js'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, documentRoot, findElement, getStaticAttribute, hasDirective, hasLabelContent, hasNonEmptyAttribute, hasSlot, isStaticallyHidden } from '../../../utils/template.js'
import { createNuxtUiMatcher } from '../components.js'

const FORM_CONTROLS = new Set([
  'Checkbox',
  'CheckboxGroup',
  'ColorPicker',
  'FileUpload',
  'Input',
  'InputDate',
  'InputMenu',
  'InputNumber',
  'InputTags',
  'InputTime',
  'Listbox',
  'PinInput',
  'RadioGroup',
  'Select',
  'SelectMenu',
  'Slider',
  'Switch',
  'Textarea',
])

const LABEL_CONTROLS = new Set(['Checkbox', 'FileUpload', 'Switch'])
const LEGEND_CONTROLS = new Set(['CheckboxGroup', 'RadioGroup'])

function alternativeChains(node: VueAST.VElement): VueAST.VElement[][] {
  const chains: VueAST.VElement[][] = []
  let chain: VueAST.VElement[] | null = null

  for (const child of node.children) {
    if (child.type !== 'VElement' || isStaticallyHidden(child))
      continue
    if (chain && (hasDirective(child, 'else-if') || hasDirective(child, 'else'))) {
      chain.push(child)
      continue
    }
    chain = [child]
    chains.push(chain)
  }

  return chains
}

function concurrentControls(node: VueAST.VElement, matcher: ComponentMatcher): number {
  if (matcher.isOneOf(node, FORM_CONTROLS))
    return 1
  return alternativeChains(node).reduce(
    (total, chain) => total + Math.max(...chain.map(branch => concurrentControls(branch, matcher))),
    0,
  )
}

function hasLabelingAncestor(node: VueAST.VElement, matcher: ComponentMatcher): boolean {
  let parent = elementAncestor(node)
  while (parent) {
    if (isNativeElement(parent, 'label'))
      return true
    if (matcher.is(parent, 'FormField')) {
      return (hasNonEmptyAttribute(parent, 'label') || hasSlot(parent, 'label'))
        && concurrentControls(parent, matcher) === 1
    }
    parent = elementAncestor(parent)
  }
  return false
}

function hasLabelForId(node: VueAST.VElement): boolean {
  const id = getStaticAttribute(node, 'id')
  if (!id)
    return false
  return findElement(documentRoot(node), candidate => isNativeElement(candidate, 'label')
    && getStaticAttribute(candidate, 'for') === id
    && hasLabelContent(candidate)) !== null
}

function hasAccessibleLabel(node: VueAST.VElement, control: string, matcher: ComponentMatcher): boolean {
  if (LABEL_CONTROLS.has(control) && (hasNonEmptyAttribute(node, 'label') || hasSlot(node, 'label')))
    return true
  if (LEGEND_CONTROLS.has(control) && (hasNonEmptyAttribute(node, 'legend') || hasSlot(node, 'legend')))
    return true

  return hasNonEmptyAttribute(node, 'aria-label')
    || hasNonEmptyAttribute(node, 'aria-labelledby')
    || hasLabelingAncestor(node, matcher)
    || hasLabelForId(node)
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
      missingLabel: 'Add `label`, `legend`, `aria-label`, `aria-labelledby`, a native `<label>`, or wrap `<{{ component }}>` in a `<UFormField>` with `label` or a `#label` slot.',
    },
  },
  create(context: Context): Visitor {
    const matcher = createNuxtUiMatcher(context)

    return defineTemplateVisitor(context, {
      VElement(node: VueAST.VElement) {
        const control = matcher.matchOf(node, FORM_CONTROLS)
        if (!control || hasAccessibleLabel(node, control, matcher))
          return
        context.report({
          loc: node.startTag.loc,
          messageId: 'missingLabel',
          data: { component: matcher.prefixed(control) },
        })
      },
    })
  },
}
